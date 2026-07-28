"use client";

import { useMemo, useState, type ReactNode } from "react";

import {
	AlertTriangle,
	ArrowDownLeft,
	ArrowLeft,
	ArrowRight,
	ArrowUpRight,
	CheckCircle2,
	ClipboardCopy,
	Copy,
	FileText,
	Info,
	MessageSquarePlus,
	MinusCircle,
	ScrollText,
	User,
	XCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { vendorIdForRun } from "@/features/admin/features/vendors/vendor-integration-mock";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import {
	displayRunStatus,
	getValidationIssue,
} from "../mock-data";

function SummaryItem({
	label,
	value,
	icon,
}: {
	label: string;
	value: ReactNode;
	icon?: ReactNode;
}) {
	return (
		<div className="min-w-0">
			<p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
				{label}
			</p>
			<div className="mt-1 flex items-center gap-1.5 text-sm font-medium">
				{icon}
				<span className="truncate">{value}</span>
			</div>
		</div>
	);
}

export function ValidationInvestigationPage() {
	const params = useParams<{ runId: string; issueId: string }>();
	const { run, issue } = useMemo(
		() => getValidationIssue(params.runId, params.issueId),
		[params.runId, params.issueId]
	);
	const [notes, setNotes] = useState("");
	const [status, setStatus] = useState<"open" | "in_progress" | "resolved">(
		() => issue?.status ?? "open"
	);
	const [activeStep, setActiveStep] = useState(1);

	const vendorId = run ? vendorIdForRun(run) : null;
	const selectHref = vendorId
		? `/admin/file-monitoring/select?vendor=${vendorId}`
		: "/admin/file-monitoring/select";
	const siblingIssues = run?.issues ?? [];
	const issueIndex = siblingIssues.findIndex((i) => i.id === issue?.id);
	const prevIssue = issueIndex > 0 ? siblingIssues[issueIndex - 1] : null;
	const nextIssue =
		issueIndex >= 0 && issueIndex < siblingIssues.length - 1
			? siblingIssues[issueIndex + 1]
			: null;

	if (!run || !issue) {
		return (
			<div className="space-y-4">
				<Link
					href={`/admin/file-monitoring/${params.runId}`}
					className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="size-3.5" />
					Back to File Run Details
				</Link>
				<div className="rounded-xl border border-border/50 bg-card/70 p-10 text-center">
					<p className="text-lg font-semibold">Investigation not found</p>
					<Button asChild className="mt-5">
						<Link href={`/admin/file-monitoring/${params.runId}`}>
							Return to run details
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	const steps = [
		{ n: 1, title: "Error Summary", body: issue.message },
		{
			n: 2,
			title: "Received Value",
			body: `Field: ${issue.field ?? "—"} [${issue.receivedValue ?? "—"}]`,
			highlight: issue.receivedValue,
		},
		{ n: 3, title: "Expected Value", body: issue.expectedValue ?? "—" },
		{ n: 4, title: "Validation Rule", body: issue.validationRule ?? "—" },
		{
			n: 5,
			title: "Recommended Resolution",
			body: issue.recommendedResolution ?? "—",
			bullets: issue.resolutionSteps,
		},
		{
			n: 6,
			title: "Related Information",
			body: issue.relatedInformation ?? "—",
			mono: true,
		},
	];

	function copyGuid() {
		void navigator.clipboard.writeText(run.correlationId);
		toast.success("Run GUID copied");
	}

	function copyIssueRef() {
		void navigator.clipboard.writeText(
			`${issue.code} · line ${issue.line ?? "—"} · ${issue.memberId ?? "n/a"}`
		);
		toast.success("Error reference copied");
	}

	return (
		<div className="space-y-6">
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
						<Link
							href={`/admin/file-monitoring/${run.id}`}
							className="hover:underline"
						>
							File Run Details
						</Link>
						<span className="text-muted-foreground">&gt;</span>
						<span className="text-foreground">Investigation Details</span>
					</nav>
					<div className="mt-2 flex items-start gap-3">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
							4
						</div>
						<div>
							<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
								Validation Error Investigation
							</h1>
							<p className="mt-1 text-sm text-muted-foreground">
								Deep-dive workspace for {issue.code}
								{issue.field ? ` · ${issue.field}` : ""} — resolve the error,
								capture notes, then review the full processing log trail.
							</p>
						</div>
					</div>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button variant="outline" size="sm" className="h-9" asChild>
						<Link href={`/admin/file-monitoring/${run.id}`}>
							<ArrowLeft className="mr-1.5 size-3.5" />
							Back to Run
						</Link>
					</Button>
					<Button size="sm" className="h-9" asChild>
						<Link href={`/admin/processing-logs?run=${run.id}`}>
							<ScrollText className="mr-1.5 size-3.5" />
							View Processing Logs
							<ArrowRight className="ml-1.5 size-3.5" />
						</Link>
					</Button>
				</div>
			</div>

			{/* Summary bar */}
			<div className="grid gap-4 rounded-xl border border-border/50 bg-card p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-9">
				<SummaryItem
					label="File Type"
					value={run.fileType}
					icon={<FileText className="size-3.5 text-primary" />}
				/>
				<SummaryItem
					label="File Name"
					value={
						<span className="font-mono text-xs">{run.fileName ?? "—"}</span>
					}
				/>
				<SummaryItem
					label="Run GUID"
					value={
						<button
							type="button"
							onClick={copyGuid}
							className="inline-flex max-w-full items-center gap-1 font-mono text-xs hover:text-primary"
						>
							<span className="truncate">{run.correlationId}</span>
							<Copy className="size-3 shrink-0" />
						</button>
					}
				/>
				<SummaryItem
					label="Member ID"
					value={
						<span className="font-mono text-xs">{issue.memberId ?? "—"}</span>
					}
				/>
				<SummaryItem label="Line Number" value={issue.line ?? "—"} />
				<SummaryItem label="Field Name" value={issue.field ?? "—"} />
				<SummaryItem
					label="Error Code"
					value={
						<span className="font-mono text-xs font-semibold">{issue.code}</span>
					}
				/>
				<SummaryItem
					label="Severity"
					value={
						issue.severity === "error" ? (
							<span className="inline-flex items-center gap-1 text-red-700">
								<XCircle className="size-3.5" />
								Error
							</span>
						) : (
							<span className="inline-flex items-center gap-1 text-amber-700">
								<AlertTriangle className="size-3.5" />
								Warning
							</span>
						)
					}
				/>
				<SummaryItem
					label="Status"
					value={
						<span className="inline-flex items-center gap-1 capitalize text-red-700">
							<MinusCircle className="size-3.5" />
							{status.replace(/_/g, " ")}
						</span>
					}
				/>
			</div>

			{/* Sibling navigator + quick actions */}
			<div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/50 bg-card px-4 py-3">
				<div className="flex flex-wrap gap-2">
					{prevIssue ? (
						<Button variant="outline" size="sm" className="h-8" asChild>
							<Link
								href={`/admin/file-monitoring/${run.id}/investigate/${prevIssue.id}`}
								className="inline-flex items-center gap-1.5"
							>
								<ArrowLeft className="size-3.5 shrink-0" />
								<span>Previous error</span>
							</Link>
						</Button>
					) : (
						<Button variant="outline" size="sm" className="h-8" disabled>
							<span className="inline-flex items-center gap-1.5">
								<ArrowLeft className="size-3.5 shrink-0" />
								<span>Previous error</span>
							</span>
						</Button>
					)}
					{nextIssue ? (
						<Button variant="outline" size="sm" className="h-8" asChild>
							<Link
								href={`/admin/file-monitoring/${run.id}/investigate/${nextIssue.id}`}
								className="inline-flex items-center gap-1.5"
							>
								<span>Next error</span>
								<ArrowRight className="size-3.5 shrink-0" />
							</Link>
						</Button>
					) : (
						<Button variant="outline" size="sm" className="h-8" disabled>
							<span className="inline-flex items-center gap-1.5">
								<span>Next error</span>
								<ArrowRight className="size-3.5 shrink-0" />
							</span>
						</Button>
					)}
				</div>
				<div className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						size="sm"
						className="h-8"
						onClick={copyIssueRef}
					>
						<span className="inline-flex items-center gap-1.5">
							<ClipboardCopy className="size-3.5 shrink-0" />
							<span>Copy error ref</span>
						</span>
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="h-8"
						onClick={() => {
							setStatus("in_progress");
							toast.success("Marked investigation in progress.");
						}}
					>
						Start work
					</Button>
					<Button
						size="sm"
						className="h-8"
						onClick={() => {
							setStatus("resolved");
							toast.success("Error marked resolved.");
						}}
					>
						<span className="inline-flex items-center gap-1.5">
							<CheckCircle2 className="size-3.5 shrink-0" />
							<span>Mark resolved</span>
						</span>
					</Button>
				</div>
			</div>

			<div className="grid gap-4 xl:grid-cols-12">
				{/* Left: Investigation workspace */}
				<div className="space-y-4 xl:col-span-5">
					<Card className="border-border/50 bg-card">
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Investigation Workspace</CardTitle>
							<CardDescription>
								Follow the numbered steps to resolve this error
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{steps.map((step) => (
								<button
									key={step.n}
									type="button"
									onClick={() => setActiveStep(step.n)}
									className={cn(
										"flex w-full gap-3 rounded-xl border p-3 text-left transition-colors",
										activeStep === step.n
											? "border-primary bg-primary/[0.04] ring-1 ring-primary/20"
											: "border-border/50 hover:border-primary/30"
									)}
								>
									<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
										{step.n}
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-sm font-semibold">{step.title}</p>
										{step.bullets?.length ? (
											<ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
												{step.bullets.map((b) => (
													<li key={b}>{b}</li>
												))}
											</ul>
										) : step.highlight ? (
											<p className="mt-1.5 text-sm text-muted-foreground">
												Field: {issue.field}{" "}
												<span className="rounded bg-red-100 px-1.5 py-0.5 font-mono text-red-800 dark:bg-red-950 dark:text-red-200">
													[{step.highlight}]
												</span>
											</p>
										) : (
											<p
												className={cn(
													"mt-1.5 text-sm leading-relaxed text-muted-foreground",
													step.mono && "font-mono text-xs"
												)}
											>
												{step.body}
											</p>
										)}
									</div>
								</button>
							))}

							<div className="border-t border-border/50 pt-4">
								<p className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold">
									<MessageSquarePlus className="size-4 text-primary" />
									Resolution Notes
								</p>
								<Textarea
									value={notes}
									onChange={(e) => setNotes(e.target.value.slice(0, 2000))}
									placeholder="Add notes about your investigation, findings, and actions taken…"
									className="min-h-28"
								/>
								<div className="mt-2 flex items-center justify-between gap-3">
									<span className="text-xs text-muted-foreground">
										{notes.length} / 2000
									</span>
									<Button
										size="sm"
										onClick={() => {
											setStatus((s) => (s === "open" ? "in_progress" : s));
											toast.success("Investigation notes saved.");
										}}
									>
										Save notes
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Middle: Data context */}
				<div className="space-y-4 xl:col-span-4">
					<Card className="gap-2 border-border/50 bg-card py-4">
						<CardHeader className="px-4 pb-1 pt-0">
							<CardTitle className="text-base">
								{issue.contextTitle ?? "Member Context"}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 px-4 text-sm">
							{(
								issue.contextFields ?? [
									{
										label: "Subscriber Name",
										value: issue.memberContext?.subscriberName ?? "—",
									},
									{
										label: "Date of Birth",
										value: issue.memberContext?.dateOfBirth ?? "—",
									},
									{
										label: "Gender",
										value: issue.memberContext?.gender ?? "—",
									},
									{
										label: "Member ID",
										value:
											issue.memberContext?.memberId ?? issue.memberId ?? "—",
									},
									{
										label: "Group Number",
										value: issue.memberContext?.groupNumber ?? "—",
									},
									{
										label: "Coverage Start",
										value: issue.memberContext?.coverageStart ?? "—",
									},
									{
										label: "Coverage End",
										value: issue.memberContext?.coverageEnd ?? "—",
									},
								]
							).map((row) => (
								<div
									key={row.label}
									className="flex items-start justify-between gap-3 border-b border-border/40 pb-2 last:border-0"
								>
									<span className="text-muted-foreground">{row.label}</span>
									<span className="max-w-[60%] text-right font-medium break-words">
										{row.value || "—"}
									</span>
								</div>
							))}
						</CardContent>
					</Card>

					<Card className="gap-2 border-border/50 bg-card py-4">
						<CardHeader className="px-4 pb-1 pt-0">
							<CardTitle className="text-base">
								Record Context (Line {issue.line ?? "—"})
							</CardTitle>
						</CardHeader>
						<CardContent className="px-4">
							<pre className="overflow-x-auto rounded-lg border border-border/50 bg-muted/30 p-3 font-mono text-[11px] leading-6">
								{(
									issue.recordSnippet ?? ["No raw record snippet available."]
								).map((line) => {
									const highlight =
										!!issue.receivedValue &&
										line.includes(String(issue.receivedValue));
									return (
										<div
											key={line}
											className={cn(
												"rounded px-1",
												highlight &&
													"bg-red-100 text-red-900 dark:bg-red-950/50 dark:text-red-100"
											)}
										>
											{line}
										</div>
									);
								})}
							</pre>
						</CardContent>
					</Card>

					<Card className="gap-2 border-border/50 bg-card py-4">
						<CardHeader className="px-4 pb-1 pt-0">
							<CardTitle className="text-base">Investigation History</CardTitle>
						</CardHeader>
						<CardContent className="px-0 pb-0">
							<div className="overflow-x-auto border-t border-border/50">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="pl-4">Time</TableHead>
											<TableHead>User</TableHead>
											<TableHead>Action</TableHead>
											<TableHead className="pr-4">Notes</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{(issue.investigationHistory ?? []).map((entry) => (
											<TableRow key={entry.id}>
												<TableCell className="pl-4 font-mono text-xs tabular-nums text-muted-foreground">
													{entry.at}
												</TableCell>
												<TableCell>
													<span className="inline-flex items-center gap-1.5 text-xs">
														<User className="size-3 text-muted-foreground" />
														{entry.user}
													</span>
												</TableCell>
												<TableCell className="text-sm">{entry.action}</TableCell>
												<TableCell className="pr-4 text-xs text-muted-foreground">
													{entry.notes ?? "—"}
												</TableCell>
											</TableRow>
										))}
										{(issue.investigationHistory ?? []).length === 0 && (
											<TableRow>
												<TableCell
													colSpan={4}
													className="h-16 text-center text-muted-foreground"
												>
													No investigation history yet.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right: Processing details + CTA to logs */}
				<div className="space-y-4 xl:col-span-3">
					<Card className="border-border/50 bg-card">
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Processing Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm">
							<div className="flex justify-between gap-3">
								<span className="text-muted-foreground">Vendor</span>
								<span className="font-medium">{run.vendor}</span>
							</div>
							<div className="flex justify-between gap-3">
								<span className="text-muted-foreground">Direction</span>
								<span className="inline-flex items-center gap-1 font-medium">
									{run.direction === "inbound" ? (
										<>
											<ArrowDownLeft className="size-3.5 text-sky-600" />
											Incoming
										</>
									) : (
										<>
											<ArrowUpRight className="size-3.5 text-violet-600" />
											Outgoing
										</>
									)}
								</span>
							</div>
							<div className="flex justify-between gap-3">
								<span className="text-muted-foreground">Run Date/Time</span>
								<span className="font-medium">
									{run.startedAt ?? run.expectedAt}
								</span>
							</div>
							<div className="flex justify-between gap-3">
								<span className="text-muted-foreground">Records</span>
								<span className="font-medium tabular-nums">
									{(run.records ?? 0).toLocaleString()} /{" "}
									{(run.recordsLoaded ?? 0).toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between gap-3">
								<span className="text-muted-foreground">Errors / Warnings</span>
								<span className="font-medium tabular-nums">
									<span className="text-red-700">{run.errorCount}</span>
									{" / "}
									<span className="text-amber-700">{run.warningCount}</span>
								</span>
							</div>
							<div className="flex justify-between gap-3">
								<span className="text-muted-foreground">Duration</span>
								<span className="font-medium">{run.duration ?? "—"}</span>
							</div>
							<div className="flex justify-between gap-3">
								<span className="text-muted-foreground">Status</span>
								<span className="inline-flex items-center gap-1.5 font-medium text-red-700">
									<span className="size-2 rounded-full bg-red-500" />
									{displayRunStatus(run.status)}
								</span>
							</div>
						</CardContent>
					</Card>

					<Card className="border-border/50 bg-card">
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Pipeline</CardTitle>
						</CardHeader>
						<CardContent>
							<ol className="space-y-0">
								{run.pipeline.map((step, index) => {
									const isLast = index === run.pipeline.length - 1;
									return (
										<li
											key={step.id}
											className="relative flex gap-3 pb-3 last:pb-0"
										>
											{!isLast && (
												<span className="absolute top-5 left-[7px] h-[calc(100%-8px)] w-px bg-border" />
											)}
											<div className="relative z-10 mt-0.5 bg-card">
												{step.status === "failed" ? (
													<XCircle className="size-4 text-red-600" />
												) : step.status === "completed" ? (
													<CheckCircle2 className="size-4 text-emerald-600" />
												) : (
													<Info className="size-4 text-sky-600" />
												)}
											</div>
											<div className="min-w-0 flex-1">
												<p className="text-sm font-medium">{step.label}</p>
												<p className="font-mono text-[11px] text-muted-foreground">
													{step.at ?? "—"}
													{step.detail ? ` · ${step.detail}` : ""}
												</p>
											</div>
										</li>
									);
								})}
							</ol>
						</CardContent>
					</Card>

					<Card className="border-primary/20 bg-primary/[0.03]">
						<CardHeader className="pb-2">
							<CardTitle className="text-base">Continue to Step 5</CardTitle>
							<CardDescription>
								Review the full event trail for this run in Processing logs
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<ol className="space-y-0">
								{run.logs.slice(0, 4).map((log, index) => {
									const isLast = index === Math.min(3, run.logs.length - 1);
									return (
										<li
											key={log.id}
											className="relative flex gap-3 pb-3 last:pb-0"
										>
											{!isLast && (
												<span className="absolute top-5 left-[7px] h-[calc(100%-8px)] w-px bg-border" />
											)}
											<div className="relative z-10 mt-0.5 bg-[inherit]">
												{log.level === "error" ? (
													<XCircle className="size-4 text-red-600" />
												) : log.level === "warn" ? (
													<AlertTriangle className="size-4 text-amber-600" />
												) : (
													<Info className="size-4 text-sky-600" />
												)}
											</div>
											<div className="min-w-0 flex-1">
												<p className="font-mono text-[11px] tabular-nums text-muted-foreground">
													{log.at}
												</p>
												<p className="mt-0.5 text-sm leading-snug">{log.message}</p>
											</div>
										</li>
									);
								})}
							</ol>
							<Button className="w-full" asChild>
								<Link href={`/admin/processing-logs?run=${run.id}`}>
									Open full processing logs
									<ArrowRight className="ml-1.5 size-3.5" />
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
