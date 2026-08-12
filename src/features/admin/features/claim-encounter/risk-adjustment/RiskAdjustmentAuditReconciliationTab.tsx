"use client";

import { useState } from "react";

import {
	AlertTriangle,
	ArrowDown,
	ArrowUp,
	CalendarDays,
	CheckCircle2,
	ChevronDown,
	Clock,
	FolderOpen,
	Minus,
	Search,
	Settings,
	Upload,
	X,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	CMS_EDGE_TABLE_CLASS,
	CMS_EDGE_TABLE_CONTAINER,
	CMS_EDGE_TABLE_LINK_CLASS,
	CmsEdgeTableScroll,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import {
	RA_STACK,
	RA_TABLE_CELL,
	RA_TABLE_HEAD,
	RaAllFilterSelect,
	RaCaptureBar,
	RaFilterLabel,
	RaFilterPanel,
	RaMetricCard,
	RaSectionTitle,
	RaStatusPill,
	RaTablePagination,
	RaViewAction,
} from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentShared";
import {
	RA_AUDIT_DETAIL,
	RA_AUDIT_KPIS,
	RA_AUDIT_ROWS,
	type RaAuditRow,
} from "@/features/admin/features/claim-encounter/risk-adjustment/mock-data";
import { cn } from "@/lib/utils";

function auditStatusTone(status: RaAuditRow["status"]) {
	if (status === "Open") return "warning";
	if (status === "In Review") return "info";
	if (status === "Pending Payer") return "purple";
	return "success";
}

function PriorityCell({ priority }: { priority: RaAuditRow["priority"] }) {
	const Icon =
		priority === "High" ? ArrowUp : priority === "Low" ? ArrowDown : Minus;
	const color =
		priority === "High"
			? "text-red-600"
			: priority === "Low"
				? "text-emerald-700"
				: "text-amber-700";

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 text-xs font-medium",
				color
			)}
		>
			<Icon className="size-3.5" />
			{priority}
		</span>
	);
}

function AuditFilters() {
	return (
		<RaFilterPanel>
			<div className="grid gap-2 md:grid-cols-2 xl:grid-cols-6">
				<div className="space-y-1 xl:col-span-2">
					<RaFilterLabel>Search</RaFilterLabel>
					<div className="relative">
						<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
						<Input
							className="h-8 pl-8 text-xs"
							placeholder="Search by case ID, payer, member..."
						/>
					</div>
				</div>
				<RaAllFilterSelect label="Case Type" />
				<RaAllFilterSelect label="Status" />
				<RaAllFilterSelect label="Payer / Requestor" />
				<RaAllFilterSelect label="Priority" />
			</div>
			<div className="mt-2 flex flex-wrap items-end gap-2">
				<div className="min-w-[200px] flex-1 space-y-1">
					<RaFilterLabel>Date Range</RaFilterLabel>
					<Button
						variant="outline"
						className="h-8 w-full justify-start gap-1.5 px-2 text-xs font-normal"
					>
						<CalendarDays className="size-3.5 text-muted-foreground" />
						01/01/2024 – 12/31/2025
					</Button>
				</div>
				<Button
					size="sm"
					className="h-8 text-xs"
					onClick={() => toast.message("Filters applied")}
				>
					Apply Filters
				</Button>
				<Button
					variant="link"
					size="sm"
					className="h-8 px-0 text-xs text-primary"
				>
					Reset
				</Button>
			</div>
		</RaFilterPanel>
	);
}

function KpiRow() {
	const k = RA_AUDIT_KPIS;

	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
			<RaMetricCard
				label="Total Cases"
				value={k.total}
				icon={FolderOpen}
				iconClass="bg-sky-500"
			/>
			<div className="rounded-lg border border-border/70 bg-card p-3 shadow-sm">
				<div className="flex items-center gap-2.5">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
						<Clock className="size-4" />
					</div>
					<div>
						<p className="text-[11px] text-muted-foreground">Open</p>
						<p className="text-lg font-semibold tabular-nums">
							{k.open}{" "}
							<span className="text-sm font-normal text-muted-foreground">
								({k.openPct}%)
							</span>
						</p>
					</div>
				</div>
			</div>
			<div className="rounded-lg border border-border/70 bg-card p-3 shadow-sm">
				<div className="flex items-center gap-2.5">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
						<CheckCircle2 className="size-4" />
					</div>
					<div>
						<p className="text-[11px] text-muted-foreground">Closed</p>
						<p className="text-lg font-semibold tabular-nums">
							{k.closed}{" "}
							<span className="text-sm font-normal text-muted-foreground">
								({k.closedPct}%)
							</span>
						</p>
					</div>
				</div>
			</div>
			<div className="rounded-lg border border-border/70 bg-card p-3 shadow-sm">
				<div className="flex items-center gap-2.5">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white">
						<Clock className="size-4" />
					</div>
					<div>
						<p className="text-[11px] text-muted-foreground">Pending Payer</p>
						<p className="text-lg font-semibold tabular-nums">
							{k.pendingPayer}{" "}
							<span className="text-sm font-normal text-muted-foreground">
								({k.pendingPayerPct}%)
							</span>
						</p>
					</div>
				</div>
			</div>
			<div className="rounded-lg border border-border/70 bg-card p-3 shadow-sm">
				<div className="flex items-center gap-2.5">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
						<AlertTriangle className="size-4" />
					</div>
					<div>
						<p className="text-[11px] text-muted-foreground">Overdue</p>
						<p className="text-lg font-semibold tabular-nums">
							{k.overdue}{" "}
							<span className="text-sm font-normal text-muted-foreground">
								({k.overduePct}%)
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function AuditDetailPanel({ onClose }: { onClose: () => void }) {
	const d = RA_AUDIT_DETAIL;

	return (
		<div className="flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
			<div className="border-b border-border/50 px-3 py-2">
				<div className="flex items-start justify-between gap-2">
					<div>
						<h3 className="text-sm font-semibold text-foreground">
							Case Details
						</h3>
						<p className="mt-1 font-mono text-xs font-medium">{d.caseId}</p>
						<div className="mt-1 flex flex-wrap items-center gap-2">
							<RaStatusPill label={d.status} tone="warning" />
							<span className="text-[11px] text-muted-foreground">
								{d.caseType} | Payer: {d.payer}
							</span>
						</div>
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="size-7"
						onClick={onClose}
					>
						<X className="size-4" />
					</Button>
				</div>
			</div>

			<Tabs defaultValue="summary" className="flex min-h-0 flex-1 flex-col">
				<div className="border-b border-border/50 px-3">
					<TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">
						{[
							"Summary",
							"Requests",
							"Documentation",
							"Communication",
							"History",
						].map((tab) => (
							<TabsTrigger
								key={tab}
								value={tab.toLowerCase()}
								className="rounded-none border-b-2 border-transparent px-2.5 py-2 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary"
							>
								{tab}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				<TabsContent
					value="summary"
					className="mt-0 flex-1 overflow-y-auto p-3"
				>
					<div className="space-y-3">
						<div className="rounded-lg border border-border/50 bg-muted/10 p-3">
							<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Case Information
							</p>
							<dl className="mt-2 space-y-1.5 text-xs">
								{[
									["Case Type", d.caseType],
									["Payer / Requestor", d.payer],
									["Date Requested", d.dateRequested],
									["Request Method", d.requestMethod],
									["Due Date", `${d.dueDate} (${d.dueDaysRemaining} days)`],
									["Priority", d.priority],
									["Program", d.program],
									["Assigned To", d.assignedTo],
									["Measurement Year", d.measurementYear],
									["Last Updated", d.lastUpdated],
								].map(([label, value]) => (
									<div key={label} className="flex justify-between gap-2">
										<dt className="text-muted-foreground">{label}</dt>
										<dd className="font-medium">{value}</dd>
									</div>
								))}
							</dl>
						</div>

						<div className="rounded-lg border border-border/50 bg-muted/10 p-3">
							<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Scope
							</p>
							<div className="mt-2 grid grid-cols-2 gap-2 text-xs">
								<div>
									<p className="text-muted-foreground">Members</p>
									<p className="font-semibold tabular-nums">
										{d.scope.members}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">Records Requested</p>
									<p className="font-semibold tabular-nums">
										{d.scope.recordsRequested}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">HCCs</p>
									<p className="font-semibold tabular-nums">{d.scope.hccs}</p>
								</div>
								<div>
									<p className="text-muted-foreground">Time Period</p>
									<p className="font-semibold">{d.scope.timePeriod}</p>
								</div>
							</div>
						</div>

						<div className="rounded-lg border border-border/50 bg-muted/10 p-3">
							<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Status & Progress
							</p>
							<dl className="mt-2 space-y-1.5 text-xs">
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">Overall Status</dt>
									<dd>
										<RaStatusPill label={d.status} tone="warning" />
									</dd>
								</div>
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">Current Stage</dt>
									<dd className="font-medium">{d.currentStage}</dd>
								</div>
								<div className="space-y-1 pt-1">
									<dt className="text-muted-foreground">Progress</dt>
									<dd>
										<RaCaptureBar pct={d.progressPct} />
									</dd>
								</div>
								<div className="flex justify-between gap-2">
									<dt className="text-muted-foreground">Days Open</dt>
									<dd className="font-medium tabular-nums">{d.daysOpen}</dd>
								</div>
							</dl>
						</div>

						<div className="rounded-lg border border-border/50 bg-muted/10 p-3">
							<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Next Steps
							</p>
							<ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
								{d.nextSteps.map((step) => (
									<li key={step}>{step}</li>
								))}
							</ul>
						</div>
					</div>
				</TabsContent>

				{["requests", "documentation", "communication", "history"].map(
					(tab) => (
						<TabsContent
							key={tab}
							value={tab}
							className="mt-0 p-6 text-center text-sm text-muted-foreground"
						>
							{tab.charAt(0).toUpperCase() + tab.slice(1)} content will appear
							here.
						</TabsContent>
					)
				)}
			</Tabs>

			<div className="flex flex-wrap gap-2 border-t border-border/50 p-3">
				<Button size="sm" className="h-8 text-xs">
					Add Note
				</Button>
				<Button variant="outline" size="sm" className="h-8 text-xs">
					<Upload className="mr-1.5 size-3.5" />
					Upload Document
				</Button>
				<Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
					More Actions
					<ChevronDown className="size-3" />
				</Button>
			</div>
		</div>
	);
}

export function RiskAdjustmentAuditReconciliationTab() {
	const [selectedId, setSelectedId] = useState(RA_AUDIT_ROWS[0]?.id ?? "");
	const showDetail = Boolean(selectedId);

	return (
		<div className={RA_STACK}>
			<AuditFilters />
			<KpiRow />

			<div
				className={cn(
					"grid gap-3",
					showDetail ? "xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]" : ""
				)}
			>
				<div className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
					<RaSectionTitle
						title="Audit & Reconciliation Cases"
						subtitle="Showing 1 to 10 of 128 cases"
						action={
							<div className="flex items-center gap-2">
								<Select defaultValue="my-view">
									<SelectTrigger className="h-7 w-[100px] text-xs">
										<SelectValue placeholder="View" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="my-view">My View</SelectItem>
									</SelectContent>
								</Select>
								<Select defaultValue="newest">
									<SelectTrigger className="h-7 w-[160px] text-xs">
										<SelectValue placeholder="Sort" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="newest">
											Date Requested (Newest)
										</SelectItem>
									</SelectContent>
								</Select>
								<Button variant="ghost" size="icon" className="size-7">
									<Settings className="size-3.5" />
								</Button>
							</div>
						}
					/>
					<CmsEdgeTableScroll>
						<Table
							containerClassName={CMS_EDGE_TABLE_CONTAINER}
							className={cn(CMS_EDGE_TABLE_CLASS, "min-w-[1100px]")}
						>
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className={RA_TABLE_HEAD}>Case ID</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Case Type</TableHead>
									<TableHead className={RA_TABLE_HEAD}>
										Payer / Requestor
									</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Program</TableHead>
									<TableHead className={RA_TABLE_HEAD}>
										Member / Group
									</TableHead>
									<TableHead className={RA_TABLE_HEAD}>
										Date Requested
									</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Due Date</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Status</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Priority</TableHead>
									<TableHead className={RA_TABLE_HEAD}>Assigned To</TableHead>
									<TableHead className={cn(RA_TABLE_HEAD, "pr-3 text-right")}>
										Action
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{RA_AUDIT_ROWS.map((row) => (
									<TableRow
										key={row.id}
										className={cn(
											"cursor-pointer border-b border-border/40 hover:bg-muted/20",
											selectedId === row.id && "bg-primary/5"
										)}
										onClick={() => setSelectedId(row.id)}
									>
										<TableCell className={RA_TABLE_CELL}>
											<Button
												variant="link"
												className={CMS_EDGE_TABLE_LINK_CLASS}
											>
												{row.caseId}
											</Button>
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>
											{row.caseType}
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>{row.payer}</TableCell>
										<TableCell className={RA_TABLE_CELL}>
											{row.program}
										</TableCell>
										<TableCell
											className={cn(RA_TABLE_CELL, "text-muted-foreground")}
										>
											{row.memberGroup}
										</TableCell>
										<TableCell className={cn(RA_TABLE_CELL, "tabular-nums")}>
											{row.dateRequested}
										</TableCell>
										<TableCell
											className={cn(
												RA_TABLE_CELL,
												"tabular-nums",
												row.dueDateOverdue && "font-medium text-red-600"
											)}
										>
											{row.dueDate}
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>
											<RaStatusPill
												label={row.status}
												tone={auditStatusTone(row.status)}
											/>
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>
											<PriorityCell priority={row.priority} />
										</TableCell>
										<TableCell className={RA_TABLE_CELL}>
											{row.assignedTo}
										</TableCell>
										<TableCell className={cn(RA_TABLE_CELL, "pr-3 text-right")}>
											<RaViewAction />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CmsEdgeTableScroll>
					<div className="border-t border-border/50 px-3 py-2">
						<RaTablePagination shown={10} total={128} />
						<div className="mt-2 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
							<span className="inline-flex items-center gap-1">
								<ArrowUp className="size-3 text-red-600" /> High Priority
							</span>
							<span className="inline-flex items-center gap-1">
								<Minus className="size-3 text-amber-700" /> Medium Priority
							</span>
							<span className="inline-flex items-center gap-1">
								<ArrowDown className="size-3 text-emerald-700" /> Low Priority
							</span>
							<span className="text-red-600">
								Red text indicates overdue due date
							</span>
						</div>
					</div>
				</div>

				{showDetail ? (
					<AuditDetailPanel onClose={() => setSelectedId("")} />
				) : null}
			</div>
		</div>
	);
}
