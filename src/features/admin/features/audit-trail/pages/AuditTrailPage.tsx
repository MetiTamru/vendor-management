"use client";

import { useMemo, useState } from "react";

import {
	ClipboardList,
	Download,
	Filter,
	RefreshCw,
	Search,
	ShieldCheck,
	Sparkles,
	UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { FILE_RUNS } from "@/features/admin/features/file-management/mock-data";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AuditRow = {
	id: string;
	when: string;
	actor: string;
	action: string;
	vendor: string;
	fileType: string;
	runId: string;
	fileRunId: string;
	category: "review" | "validation" | "exception" | "system";
};

function categoryTone(category: AuditRow["category"]) {
	if (category === "review") return "bg-primary/10 text-primary";
	if (category === "validation") return "bg-sky-500/10 text-sky-700";
	if (category === "exception") return "bg-amber-500/10 text-amber-700";
	return "bg-zinc-500/10 text-zinc-700";
}

export function AuditTrailPage() {
	const [search, setSearch] = useState("");
	const [actor, setActor] = useState("all");
	const [category, setCategory] = useState("all");
	const [registerSearch, setRegisterSearch] = useState("");
	const [registerCategory, setRegisterCategory] = useState("all");
	const [page, setPage] = useState(1);
	const pageSize = 10;

	const auditRows = useMemo<AuditRow[]>(() => {
		const rows: AuditRow[] = [];

		for (const run of FILE_RUNS) {
			rows.push({
				id: `${run.id}-received`,
				when: run.startedAt ?? run.expectedAt,
				actor: run.operator,
				action: `Run created for ${run.runId}`,
				vendor: run.vendor,
				fileType: run.fileType,
				runId: run.runId,
				fileRunId: run.id,
				category: "system",
			});

			rows.push({
				id: `${run.id}-review`,
				when: run.completedAt ?? run.expectedAt,
				actor: run.reviewed ? "Ops Reviewer" : "System",
				action: run.reviewed ? "Run marked reviewed" : "Awaiting review",
				vendor: run.vendor,
				fileType: run.fileType,
				runId: run.runId,
				fileRunId: run.id,
				category: "review",
			});

			for (const issue of run.issues) {
				rows.push({
					id: `${run.id}-${issue.id}`,
					when: run.startedAt ?? run.expectedAt,
					actor: "Validator",
					action: `${issue.code}: ${issue.message}`,
					vendor: run.vendor,
					fileType: run.fileType,
					runId: run.runId,
					fileRunId: run.id,
					category:
						issue.severity === "error"
							? "exception"
							: issue.severity === "warning"
								? "validation"
								: "system",
				});

				for (const history of issue.investigationHistory ?? []) {
					rows.push({
						id: `${run.id}-${issue.id}-${history.id}`,
						when: `${run.expectedAt.slice(0, 10)} ${history.at}`,
						actor: history.user,
						action: history.action,
						vendor: run.vendor,
						fileType: run.fileType,
						runId: run.runId,
						fileRunId: run.id,
						category: "review",
					});
				}
			}
		}

		return rows.sort((a, b) => b.when.localeCompare(a.when));
	}, []);

	const actors = useMemo(
		() => Array.from(new Set(auditRows.map((row) => row.actor))).sort(),
		[auditRows]
	);

	const filteredRows = useMemo(() => {
		const query = search.trim().toLowerCase();
		return auditRows.filter((row) => {
			if (actor !== "all" && row.actor !== actor) return false;
			if (category !== "all" && row.category !== category) return false;
			if (!query) return true;
			return [row.action, row.actor, row.vendor, row.runId, row.fileType]
				.join(" ")
				.toLowerCase()
				.includes(query);
		});
	}, [actor, auditRows, category, search]);

	const summary = useMemo(() => {
		const total = filteredRows.length;
		const reviews = filteredRows.filter(
			(row) => row.category === "review"
		).length;
		const exceptions = filteredRows.filter(
			(row) => row.category === "exception"
		).length;
		const actorsCount = new Set(filteredRows.map((row) => row.actor)).size;
		const reviewedRuns = FILE_RUNS.filter((run) => run.reviewed).length;
		return { total, reviews, exceptions, actorsCount, reviewedRuns };
	}, [filteredRows]);

	const actorStats = actors
		.map((name) => ({
			name,
			count: filteredRows.filter((row) => row.actor === name).length,
		}))
		.filter((item) => item.count > 0)
		.slice(0, 5);

	const recentHighlights = filteredRows.slice(0, 4);
	const registerRows = useMemo(() => {
		const query = registerSearch.trim().toLowerCase();
		return filteredRows.filter((row) => {
			if (registerCategory !== "all" && row.category !== registerCategory)
				return false;
			if (!query) return true;
			return [row.action, row.actor, row.vendor, row.runId]
				.join(" ")
				.toLowerCase()
				.includes(query);
		});
	}, [filteredRows, registerCategory, registerSearch]);
	const pageCount = Math.max(1, Math.ceil(registerRows.length / pageSize));
	const pageRows = registerRows.slice((page - 1) * pageSize, page * pageSize);

	function clearFilters() {
		setSearch("");
		setActor("all");
		setCategory("all");
		setRegisterSearch("");
		setRegisterCategory("all");
		setPage(1);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
						Audit Trail
					</h1>
					<p className="mt-0.5 max-w-xl text-sm text-muted-foreground">
						Trace review actions, validation events, and operational history.
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button asChild size="sm" className="h-9">
						<Link href="/admin/error-management">Open Error Management</Link>
					</Button>
					<Button variant="outline" size="sm" className="h-9">
						<RefreshCw className="mr-1.5 size-3.5" />
						Refresh
					</Button>
					<Button variant="outline" size="sm" className="h-9">
						<Download className="mr-1.5 size-3.5" />
						Export audit log
					</Button>
				</div>
			</div>

			<Card className="border border-primary/15 bg-gradient-to-r from-primary/[0.05] via-card to-sky-50/60 gap-0 py-0">
				<CardContent className="flex flex-col gap-1.5 px-3 py-2">
					<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
						<Filter className="size-3.5 text-primary" />
						Filters
					</div>
					<div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
						<div className="space-y-1 2xl:col-span-2">
							<label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
								Search
							</label>
							<div className="relative">
								<Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
								<Input
									value={search}
									onChange={(event) => setSearch(event.target.value)}
									placeholder="Actor, vendor, action..."
									className="h-9 pl-8"
								/>
							</div>
						</div>
						<div className="space-y-1">
							<label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
								Actor
							</label>
							<Select value={actor} onValueChange={setActor}>
								<SelectTrigger className="h-9">
									<SelectValue placeholder="Actor" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All actors</SelectItem>
									{actors.map((name) => (
										<SelectItem key={name} value={name}>
											{name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-1">
							<label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
								Category
							</label>
							<Select value={category} onValueChange={setCategory}>
								<SelectTrigger className="h-9">
									<SelectValue placeholder="Category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All categories</SelectItem>
									<SelectItem value="review">Review</SelectItem>
									<SelectItem value="validation">Validation</SelectItem>
									<SelectItem value="exception">Exception</SelectItem>
									<SelectItem value="system">System</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-end gap-2 2xl:col-span-2">
							<Button className="h-9 flex-1">Apply filters</Button>
							<Button variant="ghost" className="h-9" onClick={clearFilters}>
								Clear
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
				{[
					{
						label: "Audit events",
						value: summary.total,
						hint: "Current result set",
						icon: ClipboardList,
						tone: "text-primary bg-primary/10",
					},
					{
						label: "Reviews",
						value: summary.reviews,
						hint: "Human actions",
						icon: UserCheck,
						tone: "text-sky-700 bg-sky-500/10",
					},
					{
						label: "Exceptions",
						value: summary.exceptions,
						hint: "Critical findings",
						icon: ShieldCheck,
						tone: "text-amber-700 bg-amber-500/10",
					},
					{
						label: "Actors",
						value: summary.actorsCount,
						hint: "Unique contributors",
						icon: Sparkles,
						tone: "text-violet-700 bg-violet-500/10",
					},
					{
						label: "Reviewed runs",
						value: summary.reviewedRuns,
						hint: "Closed by ops",
						icon: ShieldCheck,
						tone: "text-emerald-700 bg-emerald-500/10",
					},
				].map((item) => {
					const Icon = item.icon;
					return (
						<div
							key={item.label}
							className="rounded-xl border border-border/50 bg-card/70 p-4"
						>
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0">
									<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
										{item.label}
									</p>
									<p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">
										{item.value}
									</p>
									<p className="mt-1 text-xs text-muted-foreground">
										{item.hint}
									</p>
								</div>
								<div
									className={cn(
										"flex size-10 shrink-0 items-center justify-center rounded-lg",
										item.tone
									)}
								>
									<Icon className="size-4" />
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<div className="grid gap-4 xl:grid-cols-12">
				<Card className="min-w-0 gap-2 bg-card/70 py-4 xl:col-span-4">
					<CardHeader className="px-4 pb-1 pt-0">
						<CardTitle className="text-base">Actor activity</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 px-4">
						{actorStats.map((item) => (
							<div
								key={item.name}
								className="rounded-lg border border-border/50 bg-background/50 p-3"
							>
								<div className="flex items-center justify-between gap-3">
									<p className="text-sm font-semibold">{item.name}</p>
									<span className="text-sm font-semibold tabular-nums text-primary">
										{item.count}
									</span>
								</div>
								<p className="mt-1 text-xs text-muted-foreground">
									Recorded audit actions in the current filtered set.
								</p>
							</div>
						))}
					</CardContent>
				</Card>

				<Card className="min-w-0 gap-2 bg-card/70 py-4 xl:col-span-8">
					<CardHeader className="px-4 pb-1 pt-0">
						<CardTitle className="text-base">Recent highlights</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 px-4">
						{recentHighlights.map((row) => (
							<Link
								key={row.id}
								href={`/admin/file-monitoring/${row.fileRunId}`}
								className="block rounded-lg border border-border/50 bg-background/50 p-3 transition-colors hover:border-primary/30 hover:bg-background"
							>
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<div className="flex flex-wrap items-center gap-2">
											<span
												className={cn(
													"rounded-full px-2 py-0.5 text-[11px] font-semibold",
													categoryTone(row.category)
												)}
											>
												{row.category}
											</span>
											<p className="truncate text-sm font-semibold">
												{row.action}
											</p>
										</div>
										<p className="mt-1 text-xs text-muted-foreground">
											{row.actor} · {row.vendor} · {row.fileType}
										</p>
									</div>
									<span className="shrink-0 text-[10px] text-muted-foreground">
										{row.when}
									</span>
								</div>
							</Link>
						))}
					</CardContent>
				</Card>
			</div>

			<Card className="bg-card/70">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
					<div>
						<CardTitle className="text-base">Audit register</CardTitle>
					</div>
					<p className="text-xs text-muted-foreground">
						Showing {registerRows.length} events
					</p>
				</CardHeader>
				<CardContent className="px-0 pb-0">
					<div className="border-t border-border/50 px-4 py-3 sm:px-6">
						<div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_180px]">
							<div className="relative">
								<Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
								<Input
									value={registerSearch}
									onChange={(event) => {
										setRegisterSearch(event.target.value);
										setPage(1);
									}}
									placeholder="Filter this register..."
									className="h-9 pl-8"
								/>
							</div>
							<Select
								value={registerCategory}
								onValueChange={(value) => {
									setRegisterCategory(value);
									setPage(1);
								}}
							>
								<SelectTrigger className="h-9">
									<SelectValue placeholder="Category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All categories</SelectItem>
									<SelectItem value="review">Review</SelectItem>
									<SelectItem value="validation">Validation</SelectItem>
									<SelectItem value="exception">Exception</SelectItem>
									<SelectItem value="system">System</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="border-t border-border/50">
						<Table>
							<TableHeader>
								<TableRow className="bg-primary/[0.04] hover:bg-primary/[0.04]">
									<TableHead className="pl-4 text-primary sm:pl-6">
										When
									</TableHead>
									<TableHead className="text-primary">Actor</TableHead>
									<TableHead className="text-primary">Category</TableHead>
									<TableHead className="text-primary">Action</TableHead>
									<TableHead className="text-primary">Vendor</TableHead>
									<TableHead className="text-primary">Run</TableHead>
									<TableHead className="pr-4 text-right text-primary sm:pr-6">
										Open
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{pageRows.map((row) => (
									<TableRow key={row.id} className="hover:bg-muted/30">
										<TableCell className="pl-4 font-mono text-xs text-muted-foreground sm:pl-6">
											{row.when}
										</TableCell>
										<TableCell>{row.actor}</TableCell>
										<TableCell>
											<span
												className={cn(
													"inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
													categoryTone(row.category)
												)}
											>
												{row.category}
											</span>
										</TableCell>
										<TableCell className="max-w-[360px] text-sm font-medium">
											{row.action}
										</TableCell>
										<TableCell>{row.vendor}</TableCell>
										<TableCell className="font-mono text-xs">
											{row.runId}
										</TableCell>
										<TableCell className="pr-4 text-right sm:pr-6">
											<Button variant="ghost" size="sm" asChild>
												<Link href={`/admin/file-monitoring/${row.fileRunId}`}>
													Open
												</Link>
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<div className="flex flex-wrap items-center justify-between gap-3 border-t border-primary/10 bg-primary/[0.03] px-4 py-3 text-sm text-muted-foreground sm:px-6">
						<span>
							Showing{" "}
							{registerRows.length === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
							{Math.min(page * pageSize, registerRows.length)} of{" "}
							{registerRows.length} events
						</span>
						<div className="flex items-center gap-1">
							<Button
								variant="outline"
								size="sm"
								className="h-8 px-2"
								disabled={page <= 1}
								onClick={() => setPage((current) => Math.max(1, current - 1))}
							>
								‹
							</Button>
							<span className="px-2 text-xs">
								Page {page} of {pageCount}
							</span>
							<Button
								variant="outline"
								size="sm"
								className="h-8 px-2"
								disabled={page >= pageCount}
								onClick={() =>
									setPage((current) => Math.min(pageCount, current + 1))
								}
							>
								›
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
