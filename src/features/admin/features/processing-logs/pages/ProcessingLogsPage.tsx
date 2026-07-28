"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import {
	AlertTriangle,
	ArrowLeft,
	CheckCircle2,
	Download,
	Info,
	RefreshCw,
	Search,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	FILE_RUNS,
	displayRunStatus,
	getFileRun,
	type FileRun,
	type LogEntry,
} from "@/features/admin/features/file-management/mock-data";
import { vendorIdForRun } from "@/features/admin/features/vendors/vendor-integration-mock";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ViewerLog = LogEntry & {
	timestamp: string;
	component: string;
	details: string;
};

function pad2(n: number) {
	return String(n).padStart(2, "0");
}

function buildTimestamp(datePart: string, h: number, m: number, s: number) {
	return `${datePart} ${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

function seedLogsForRun(run: FileRun): ViewerLog[] {
	const datePart = (run.startedAt ?? run.expectedAt).slice(0, 10);
	const start = run.startedAt ?? run.expectedAt;
	const timeBits = start.includes(" ")
		? start.split(" ")[1]!.split(":").map(Number)
		: [6, 0, 0];
	let h = timeBits[0] ?? 6;
	let m = timeBits[1] ?? 0;
	let s = timeBits[2] ?? 0;

	const next = (addSec = 1) => {
		s += addSec;
		while (s >= 60) {
			s -= 60;
			m += 1;
		}
		while (m >= 60) {
			m -= 60;
			h += 1;
		}
		return buildTimestamp(datePart, h, m, s);
	};

	const logs: ViewerLog[] = [];
	const push = (
		level: LogEntry["level"],
		component: string,
		message: string,
		details: string,
		addSec = 1
	) => {
		const timestamp = next(addSec);
		logs.push({
			id: `${run.id}-v-${logs.length + 1}`,
			at: timestamp.slice(-8),
			timestamp,
			level,
			component,
			message,
			details,
		});
	};

	push(
		"info",
		"FileReceiver",
		"File received successfully",
		run.fileName
			? `File size: ${run.fileSizeKb ?? 12400} KB · ${run.fileName}`
			: "No file object present",
		0
	);
	push("info", "FileReceiver", "Checksum verification started", run.checksum ?? "pending");
	push(
		"info",
		"FileReceiver",
		"Checksum verified",
		run.checksum ?? "sha256:verified"
	);
	push("info", "Parser", "Parsing control segments", `Protocol: ${run.protocol}`);
	push("info", "Parser", "Parsing ISA / header segment", `Run ${run.runId}`);
	push(
		"info",
		"Parser",
		"Header parse complete",
		`Records detected: ${(run.records ?? 0).toLocaleString()}`
	);
	push("info", "Validator", "File validation started", `Profile: ${run.scheduleId}`);
	push(
		"info",
		"Validator",
		"Schema validation started",
		`File type: ${run.fileType}`
	);

	for (const step of run.pipeline) {
		const level =
			step.status === "failed"
				? "error"
				: step.status === "running"
					? "warn"
					: "info";
		push(
			level,
			"Processor",
			`Pipeline step: ${step.label}`,
			step.detail ??
				`Status: ${step.status}${step.at ? ` · ${step.at}` : ""}`,
			2
		);
	}

	for (const issue of run.issues) {
		const component = "Validator";
		if (issue.severity === "error") {
			push(
				"warn",
				component,
				`Reference check: ${issue.message}`,
				`ID: ${issue.memberId ?? "—"} | Line: ${issue.line ?? "—"}`,
				1
			);
			push(
				"error",
				component,
				`Validation failed: ${issue.code}`,
				`${issue.message} | Line: ${issue.line ?? "—"}`,
				0
			);
			push(
				"info",
				"Processor",
				"Row quarantined",
				`Code ${issue.code} · Field ${issue.field ?? "—"}`,
				1
			);
		} else if (issue.severity === "warning") {
			push(
				"warn",
				component,
				`Validation warning: ${issue.code}`,
				`${issue.message} | Line: ${issue.line ?? "—"}`,
				1
			);
		} else {
			push(
				"info",
				component,
				`Validation note: ${issue.code}`,
				issue.message,
				1
			);
		}
	}

	// Pad to a rich stream so pagination matches the mockup feel
	const fillers: Array<[LogEntry["level"], string, string, string]> = [
		["info", "Processor", "Business rules evaluation started", "Rule set v3.2"],
		["info", "Processor", "Cross-reference lookup", "Subscriber reference file loaded"],
		["debug", "Parser", "Segment buffer flushed", "Buffer size 64 KB"],
		["info", "FileReceiver", "Watch folder poll complete", "No additional objects"],
		["info", "Processor", "Quarantine store write", `Path /quarantine/${run.id}`],
		["warn", "Validator", "Soft validation threshold approaching", "Warning budget 80%"],
		["info", "Processor", "Partial commit checkpoint", "Batch size 500"],
		["debug", "Parser", "Character encoding detected", "UTF-8"],
		["info", "Validator", "Companion guide checks", "Section 2.2 rules applied"],
		["info", "Processor", "Downstream handoff prepared", run.destinationPath ?? "staging"],
	];

	let i = 0;
	while (logs.length < 48) {
		const [level, component, message, details] = fillers[i % fillers.length]!;
		push(level, component, `${message} (#${logs.length + 1})`, details, 1);
		i += 1;
	}

	push(
		run.errorCount > 0 ? "error" : "info",
		"Processor",
		run.errorCount > 0
			? "File processing completed with errors"
			: "File processing completed successfully",
		`Errors: ${run.errorCount} | Warnings: ${run.warningCount} | Loaded: ${(run.recordsLoaded ?? 0).toLocaleString()}`,
		3
	);

	return logs;
}

const LOG_CACHE = new Map<string, ViewerLog[]>();

function logsForRun(run: FileRun): ViewerLog[] {
	const cached = LOG_CACHE.get(run.id);
	if (cached) return cached;
	const built = seedLogsForRun(run);
	LOG_CACHE.set(run.id, built);
	return built;
}

function LevelBadge({ level }: { level: LogEntry["level"] }) {
	const label =
		level === "warn" ? "WARN" : level === "debug" ? "DEBUG" : level.toUpperCase();
	const styles: Record<LogEntry["level"], string> = {
		error: "bg-red-600 text-white",
		warn: "bg-amber-500 text-white",
		info: "bg-sky-600 text-white",
		debug: "bg-zinc-500 text-white",
	};
	return (
		<span
			className={cn(
				"inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide",
				styles[level]
			)}
		>
			{label}
		</span>
	);
}

function ComponentChip({ name }: { name: string }) {
	const tone =
		name === "Validator"
			? "bg-violet-100 text-violet-800 border-violet-200"
			: name === "FileReceiver"
				? "bg-emerald-100 text-emerald-800 border-emerald-200"
				: name === "Parser"
					? "bg-sky-100 text-sky-800 border-sky-200"
					: name === "Processor"
						? "bg-orange-100 text-orange-800 border-orange-200"
						: "bg-primary/10 text-primary border-primary/20";
	return (
		<span
			className={cn(
				"inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold",
				tone
			)}
		>
			{name}
		</span>
	);
}

function rowTone(level: LogEntry["level"]) {
	if (level === "error") return "bg-red-50/80 hover:bg-red-50";
	if (level === "warn") return "bg-amber-50/70 hover:bg-amber-50";
	if (level === "info") return "hover:bg-sky-50/60";
	return "hover:bg-muted/40";
}

function RunStatus({ status }: { status: FileRun["status"] }) {
	const label = displayRunStatus(status);
	if (label === "Success") {
		return (
			<span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
				<CheckCircle2 className="size-4 text-emerald-600" />
				Success
			</span>
		);
	}
	if (label === "Failed") {
		return (
			<span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700">
				<XCircle className="size-4 text-red-600" />
				Failed
			</span>
		);
	}
	if (label === "Warning") {
		return (
			<span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700">
				<AlertTriangle className="size-4 text-amber-500" />
				Warning
			</span>
		);
	}
	return (
		<span className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700">
			<Info className="size-4 text-sky-600" />
			{label}
		</span>
	);
}

function MetaItem({ label, value }: { label: string; value: ReactNode }) {
	return (
		<div className="min-w-0">
			<p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
				{label}
			</p>
			<div className="mt-1 truncate text-sm font-medium">{value}</div>
		</div>
	);
}

export function ProcessingLogsPage() {
	const searchParams = useSearchParams();
	const runFilter = searchParams.get("run");
	const run =
		(runFilter ? getFileRun(runFilter) : undefined) ??
		FILE_RUNS.find((r) => r.status === "failed") ??
		FILE_RUNS[0]!;

	const vendorId = vendorIdForRun(run);
	const selectHref = vendorId
		? `/admin/file-monitoring/select?vendor=${vendorId}`
		: "/admin/file-monitoring/select";
	const runHref = `/admin/file-monitoring/${run.id}`;

	const [level, setLevel] = useState("all");
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const [refreshing, setRefreshing] = useState(false);
	const pageSize = 12;

	const allLogs = useMemo(() => logsForRun(run), [run]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return allLogs.filter((log) => {
			if (level !== "all" && log.level !== level) return false;
			if (!q) return true;
			return [log.message, log.component, log.details, log.timestamp]
				.join(" ")
				.toLowerCase()
				.includes(q);
		});
	}, [allLogs, level, query]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
	const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

	const pageButtons = useMemo(() => {
		if (pageCount <= 7) {
			return Array.from({ length: pageCount }, (_, i) => i + 1);
		}
		const set = new Set(
			[1, 2, 3, 4, 5, page, pageCount, pageCount - 1].filter(
				(p) => p >= 1 && p <= pageCount
			)
		);
		return Array.from(set).sort((a, b) => a - b);
	}, [page, pageCount]);

	async function handleRefresh() {
		setRefreshing(true);
		await new Promise((r) => setTimeout(r, 400));
		setRefreshing(false);
		toast.success("Log stream refreshed");
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="min-w-0 flex-1">
					<nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-primary">
						<Link href="/admin/file-monitoring" className="hover:underline">
							File Monitoring
						</Link>
						<span className="text-muted-foreground">&gt;</span>
						<Link href={selectHref} className="hover:underline">
							File Runs
						</Link>
						<span className="text-muted-foreground">&gt;</span>
						<Link href={runHref} className="hover:underline">
							File Run Details
						</Link>
						<span className="text-muted-foreground">&gt;</span>
						<span className="text-foreground">Processing Log</span>
					</nav>
					<div className="mt-2">
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							Processing Log Viewer
						</h1>
						<p className="mt-0.5 max-w-xl text-sm text-muted-foreground">
							Event trail for {run.runId} · {run.vendor}
						</p>
					</div>
				</div>
				<Button
					variant="outline"
					size="sm"
					className="h-9 border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
					asChild
				>
					<Link href={runHref} className="inline-flex items-center gap-1.5">
						<ArrowLeft className="size-3.5 shrink-0" />
						<span>Back to File Run Details</span>
					</Link>
				</Button>
			</div>

			{/* Metadata summary bar */}
			<div className="grid gap-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/[0.06] via-card to-sky-50/80 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
				<MetaItem
					label="File Name"
					value={
						<span className="font-mono text-xs text-primary">
							{run.fileName ?? "—"}
						</span>
					}
				/>
				<MetaItem label="File Type" value={run.fileType} />
				<MetaItem
					label="Run GUID"
					value={
						<span className="font-mono text-xs">{run.correlationId}</span>
					}
				/>
				<MetaItem
					label="Run Date/Time"
					value={run.startedAt ?? run.expectedAt}
				/>
				<MetaItem label="Status" value={<RunStatus status={run.status} />} />
				<MetaItem
					label="Duration"
					value={
						<span className="font-semibold tabular-nums text-primary">
							{run.duration ?? "—"}
						</span>
					}
				/>
			</div>

			{/* Level summary chips */}
			<div className="flex flex-wrap gap-2">
				{[
					{
						key: "all",
						label: "All",
						count: allLogs.length,
						className: "bg-primary text-primary-foreground border-primary",
					},
					{
						key: "error",
						label: "ERROR",
						count: allLogs.filter((l) => l.level === "error").length,
						className: "bg-red-600 text-white border-red-600",
					},
					{
						key: "warn",
						label: "WARN",
						count: allLogs.filter((l) => l.level === "warn").length,
						className: "bg-amber-500 text-white border-amber-500",
					},
					{
						key: "info",
						label: "INFO",
						count: allLogs.filter((l) => l.level === "info").length,
						className: "bg-sky-600 text-white border-sky-600",
					},
					{
						key: "debug",
						label: "DEBUG",
						count: allLogs.filter((l) => l.level === "debug").length,
						className: "bg-zinc-500 text-white border-zinc-500",
					},
				].map((chip) => (
					<button
						key={chip.key}
						type="button"
						onClick={() => {
							setLevel(chip.key);
							setPage(1);
						}}
						className={cn(
							"inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-opacity",
							level === chip.key ? chip.className : "border-border bg-card text-muted-foreground hover:border-primary/40",
							level === chip.key && "ring-2 ring-offset-1 ring-primary/30"
						)}
					>
						{chip.label}
						<span
							className={cn(
								"rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
								level === chip.key
									? "bg-white/20"
									: "bg-muted text-foreground"
							)}
						>
							{chip.count}
						</span>
					</button>
				))}
			</div>

			{/* Toolbar */}
			<div className="flex flex-wrap items-center gap-2 rounded-xl border border-sky-200/70 bg-sky-50/50 p-3">
				<Select
					value={level}
					onValueChange={(v) => {
						setLevel(v);
						setPage(1);
					}}
				>
					<SelectTrigger className="h-9 w-[120px] border-sky-200 bg-card">
						<SelectValue placeholder="All" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All</SelectItem>
						<SelectItem value="info">INFO</SelectItem>
						<SelectItem value="warn">WARN</SelectItem>
						<SelectItem value="error">ERROR</SelectItem>
						<SelectItem value="debug">DEBUG</SelectItem>
					</SelectContent>
				</Select>

				<div className="relative min-w-[200px] flex-1">
					<Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-sky-700" />
					<Input
						value={query}
						onChange={(e) => {
							setQuery(e.target.value);
							setPage(1);
						}}
						placeholder="Search in logs..."
						className="h-9 border-sky-200 bg-card pl-8"
					/>
				</div>

				<div className="ml-auto flex flex-wrap gap-2">
					<Button
						variant="outline"
						size="sm"
						className="h-9 border-primary/30 bg-card text-primary hover:bg-primary/5"
						onClick={() => toast.message("Log download started.")}
					>
						<span className="inline-flex items-center gap-1.5">
							<Download className="size-3.5 shrink-0" />
							<span>Download Log</span>
						</span>
					</Button>
					<Button
						size="sm"
						className="h-9"
						onClick={handleRefresh}
						disabled={refreshing}
					>
						<span className="inline-flex items-center gap-1.5">
							<RefreshCw
								className={cn("size-3.5 shrink-0", refreshing && "animate-spin")}
							/>
							<span>Refresh</span>
						</span>
					</Button>
				</div>
			</div>

			{/* Log table */}
			<div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow className="border-b-primary/20 bg-primary/[0.04] hover:bg-primary/[0.04]">
								<TableHead className="pl-4 font-semibold text-primary sm:pl-6">
									Timestamp
								</TableHead>
								<TableHead className="font-semibold text-primary">Level</TableHead>
								<TableHead className="font-semibold text-primary">
									Component
								</TableHead>
								<TableHead className="font-semibold text-primary">
									Message
								</TableHead>
								<TableHead className="pr-4 font-semibold text-primary sm:pr-6">
									Details
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{pageRows.map((row) => (
								<TableRow
									key={row.id}
									className={cn(
										"border-l-4",
										rowTone(row.level),
										row.level === "error" && "border-l-red-500",
										row.level === "warn" && "border-l-amber-400",
										row.level === "info" && "border-l-sky-400",
										row.level === "debug" && "border-l-zinc-300"
									)}
								>
									<TableCell className="pl-4 font-mono text-xs tabular-nums text-muted-foreground sm:pl-6">
										{row.timestamp}
									</TableCell>
									<TableCell>
										<LevelBadge level={row.level} />
									</TableCell>
									<TableCell>
										<ComponentChip name={row.component} />
									</TableCell>
									<TableCell className="max-w-[360px] text-sm font-medium">
										{row.message}
									</TableCell>
									<TableCell className="max-w-[280px] pr-4 text-sm text-muted-foreground sm:pr-6">
										{row.details}
									</TableCell>
								</TableRow>
							))}
							{pageRows.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={5}
										className="h-24 text-center text-muted-foreground"
									>
										No log entries match the current filters.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-3 border-t border-primary/10 bg-primary/[0.03] px-4 py-3 text-sm text-muted-foreground sm:px-6">
					<span>
						Showing{" "}
						{filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
						{Math.min(page * pageSize, filtered.length)} of {filtered.length}{" "}
						log entries
					</span>
					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="sm"
							className="h-8 px-2"
							disabled={page <= 1}
							onClick={() => setPage((p) => Math.max(1, p - 1))}
						>
							‹
						</Button>
						{pageButtons.map((p, idx) => {
							const prev = pageButtons[idx - 1];
							const showEllipsis = prev != null && p - prev > 1;
							return (
								<span key={p} className="contents">
									{showEllipsis ? (
										<span className="px-1 text-muted-foreground">…</span>
									) : null}
									<Button
										variant={p === page ? "default" : "outline"}
										size="sm"
										className="size-8 p-0"
										onClick={() => setPage(p)}
									>
										{p}
									</Button>
								</span>
							);
						})}
						<Button
							variant="outline"
							size="sm"
							className="h-8 px-2"
							disabled={page >= pageCount}
							onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
						>
							›
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
