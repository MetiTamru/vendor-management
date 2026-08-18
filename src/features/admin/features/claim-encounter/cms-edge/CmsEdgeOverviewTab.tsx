"use client";

import { type ReactNode } from "react";

import {
	Archive,
	CalendarDays,
	CheckCircle2,
	Circle,
	Clock3,
	DollarSign,
	Download,
	FileText,
	FolderOpen,
	Hourglass,
	type LucideIcon,
	Mail,
	RefreshCw,
	Send,
	Shield,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	CMS_EDGE_STATUS_PILL_CLASS,
	CMS_EDGE_TABLE_CLASS,
	CMS_EDGE_TABLE_CONTAINER,
	CMS_EDGE_TABLE_HEAD_CLASS,
	CMS_EDGE_TABLE_LINK_CLASS,
	CmsEdgePageFooter,
	CmsEdgePairRow,
	CmsEdgeSectionPanel,
	CmsEdgeTableScroll,
	CmsEdgeTripleRow,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import {
	AUDIT_STATUS_STYLES,
	CMS_EDGE_OVERVIEW_AUDIT_SUMMARY,
	CMS_EDGE_OVERVIEW_CMS_RESPONSES,
	CMS_EDGE_OVERVIEW_DOCUMENT_COUNTS,
	CMS_EDGE_OVERVIEW_FM_ITEMS,
	CMS_EDGE_OVERVIEW_KPIS,
	CMS_EDGE_OVERVIEW_REPORTING_CYCLE,
	CMS_EDGE_OVERVIEW_SUBMISSION_HISTORY,
	CMS_EDGE_OVERVIEW_TIMELINE,
	CMS_EDGE_OVERVIEW_VALIDATION,
	OVERVIEW_RESPONSE_STATUS_STYLES,
	OVERVIEW_SUBMISSION_STATUS_STYLES,
	type TimelineStageState,
} from "@/features/admin/features/claim-encounter/cms-edge/feature/queries/useCmsEdgeQuery";
import { cn } from "@/lib/utils";

const OVERVIEW_PAGE_STACK = "space-y-7";
const OVERVIEW_SECTION_GAP = "gap-4";
const OVERVIEW_TABLE_CELL = "px-3 py-2.5";
const OVERVIEW_PANEL_BODY = "pb-5";

function PanelLink({ children }: { children: ReactNode }) {
	return (
		<Button variant="link" size="sm" className="h-7 px-0 text-xs text-primary">
			{children}
		</Button>
	);
}

function StatusPill({
	label,
	className,
}: {
	label: string;
	className: string;
}) {
	return (
		<span className={cn(CMS_EDGE_STATUS_PILL_CLASS, className)}>{label}</span>
	);
}

function OverviewMetricCard({
	label,
	value,
	hint,
	icon: Icon,
	tone = "text-primary bg-primary/10",
	valueClassName,
}: {
	label: string;
	value: ReactNode;
	hint?: ReactNode;
	icon: LucideIcon;
	tone?: string;
	valueClassName?: string;
}) {
	return (
		<div className="rounded-lg border border-border/70 bg-card p-2.5 shadow-sm">
			<div className="flex items-center gap-2.5">
				<div
					className={cn(
						"flex size-8 shrink-0 items-center justify-center rounded-md",
						tone
					)}
				>
					<Icon className="size-4" aria-hidden />
				</div>
				<div className="min-w-0 flex-1">
					<p className="truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
						{label}
					</p>
					<p
						className={cn(
							"mt-0.5 text-sm font-semibold leading-tight text-foreground",
							valueClassName
						)}
					>
						{value}
					</p>
					{hint != null && hint !== "" ? (
						<div className="mt-0.5 truncate text-[10px] text-muted-foreground">
							{hint}
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

function OverviewKpiRow() {
	const k = CMS_EDGE_OVERVIEW_KPIS;

	return (
		<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
			<OverviewMetricCard
				label="Reporting Period"
				value={k.reportingPeriod}
				hint={k.reportingPeriodRange}
				icon={CalendarDays}
				tone="text-sky-700 bg-sky-500/10"
			/>
			<OverviewMetricCard
				label="Submission Status"
				value={k.submissionStatus}
				icon={Send}
				tone="text-emerald-700 bg-emerald-500/10"
				valueClassName="text-emerald-700"
			/>
			<OverviewMetricCard
				label="Last CMS Response"
				value={
					<span className="text-xs font-semibold">{k.lastCmsResponse}</span>
				}
				icon={RefreshCw}
				tone="text-violet-700 bg-violet-500/10"
			/>
			<OverviewMetricCard
				label="Responses Received"
				value={k.responsesReceived}
				icon={Mail}
				tone="text-sky-700 bg-sky-500/10"
			/>
			<OverviewMetricCard
				label="FM Status"
				value={k.fmStatus}
				icon={DollarSign}
				tone="text-amber-700 bg-amber-500/10"
			/>
			<OverviewMetricCard
				label="Audit Status"
				value={k.auditStatus}
				icon={Shield}
				tone="text-red-700 bg-red-500/10"
			/>
		</div>
	);
}

function SubmissionHistoryPanel() {
	return (
		<CmsEdgeSectionPanel
			title="1. Submission History"
			action={<PanelLink>View All</PanelLink>}
			bodyClassName={OVERVIEW_PANEL_BODY}
		>
			<CmsEdgeTableScroll className="border-t border-border/50">
				<Table
					containerClassName={CMS_EDGE_TABLE_CONTAINER}
					className={CMS_EDGE_TABLE_CLASS}
				>
					<TableHeader>
						<TableRow className="border-b border-border/50 hover:bg-transparent">
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Submission Type
							</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Reporting Period
							</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Submitted Date
							</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Status
							</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								CMS Response
							</TableHead>
							<TableHead className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "pr-4")}>
								Submitted By
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{CMS_EDGE_OVERVIEW_SUBMISSION_HISTORY.map((row) => (
							<TableRow
								key={row.id}
								className="border-b border-border/40 hover:bg-muted/20"
							>
								<TableCell className={OVERVIEW_TABLE_CELL}>
									{row.submissionType}
								</TableCell>
								<TableCell className={OVERVIEW_TABLE_CELL}>
									{row.reportingPeriod}
								</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "tabular-nums")}>
									{row.submittedDate}
								</TableCell>
								<TableCell className={OVERVIEW_TABLE_CELL}>
									<StatusPill
										label={row.status}
										className={OVERVIEW_SUBMISSION_STATUS_STYLES[row.status]}
									/>
								</TableCell>
								<TableCell className={OVERVIEW_TABLE_CELL}>
									{row.cmsResponse}
								</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "pr-4")}>
									{row.submittedBy}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CmsEdgeTableScroll>
		</CmsEdgeSectionPanel>
	);
}

function CmsResponsesPanel() {
	return (
		<CmsEdgeSectionPanel
			title="2. CMS Responses (Latest)"
			action={<PanelLink>View All</PanelLink>}
			bodyClassName={OVERVIEW_PANEL_BODY}
		>
			<CmsEdgeTableScroll className="border-t border-border/50">
				<Table
					containerClassName={CMS_EDGE_TABLE_CONTAINER}
					className={CMS_EDGE_TABLE_CLASS}
				>
					<TableHeader>
						<TableRow className="border-b border-border/50 hover:bg-transparent">
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Response File
							</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Response Type
							</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Date Received
							</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Status
							</TableHead>
							<TableHead
								className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "pr-4 text-right")}
							>
								Action
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{CMS_EDGE_OVERVIEW_CMS_RESPONSES.map((row) => (
							<TableRow
								key={row.id}
								className="border-b border-border/40 hover:bg-muted/20"
							>
								<TableCell className={OVERVIEW_TABLE_CELL}>
									<Button variant="link" className={CMS_EDGE_TABLE_LINK_CLASS}>
										{row.responseFile}
									</Button>
								</TableCell>
								<TableCell className={OVERVIEW_TABLE_CELL}>
									{row.responseType}
								</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "tabular-nums")}>
									{row.dateReceived}
								</TableCell>
								<TableCell className={OVERVIEW_TABLE_CELL}>
									<StatusPill
										label={row.status}
										className={OVERVIEW_RESPONSE_STATUS_STYLES[row.status]}
									/>
								</TableCell>
								<TableCell
									className={cn(OVERVIEW_TABLE_CELL, "pr-4 text-right")}
								>
									<Button
										variant="ghost"
										size="icon"
										className="size-6 text-primary"
										onClick={() =>
											toast.success(`Download ${row.responseFile}`)
										}
									>
										<Download className="size-3" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CmsEdgeTableScroll>
		</CmsEdgeSectionPanel>
	);
}

function ValidationResultsPanel() {
	return (
		<CmsEdgeSectionPanel
			title="3. Validation Results (Latest Submission)"
			bodyClassName={OVERVIEW_PANEL_BODY}
		>
			<CmsEdgeTableScroll className="border-t border-border/50">
				<Table
					containerClassName={CMS_EDGE_TABLE_CONTAINER}
					className={CMS_EDGE_TABLE_CLASS}
				>
					<TableHeader>
						<TableRow className="border-b border-border/50 hover:bg-transparent">
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Record Type
							</TableHead>
							<TableHead
								className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "text-right")}
							>
								Accepted
							</TableHead>
							<TableHead
								className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "text-right")}
							>
								Rejected
							</TableHead>
							<TableHead
								className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "pr-4 text-right")}
							>
								Warnings
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{CMS_EDGE_OVERVIEW_VALIDATION.map((row) => (
							<TableRow
								key={row.recordType}
								className="border-b border-border/40 hover:bg-muted/20"
							>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "font-medium")}>
									{row.recordType}
								</TableCell>
								<TableCell
									className={cn(
										OVERVIEW_TABLE_CELL,
										"text-right tabular-nums font-semibold text-emerald-700"
									)}
								>
									{row.accepted.toLocaleString()}
								</TableCell>
								<TableCell
									className={cn(
										OVERVIEW_TABLE_CELL,
										"text-right tabular-nums font-semibold text-red-600"
									)}
								>
									{row.rejected.toLocaleString()}
								</TableCell>
								<TableCell
									className={cn(
										OVERVIEW_TABLE_CELL,
										"pr-4 text-right tabular-nums font-semibold text-amber-600"
									)}
								>
									{row.warnings.toLocaleString()}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CmsEdgeTableScroll>
		</CmsEdgeSectionPanel>
	);
}

const FM_ICONS = {
	request: FileText,
	response: RefreshCw,
	reconcile: DollarSign,
	archive: Archive,
} as const;

function FinancialManagementPanel() {
	return (
		<CmsEdgeSectionPanel
			title="4. Financial Management (FM)"
			bodyClassName={OVERVIEW_PANEL_BODY}
		>
			<ul className="divide-y divide-border/40 border-t border-border/50 px-3 pt-1">
				{CMS_EDGE_OVERVIEW_FM_ITEMS.map((item) => {
					const Icon = FM_ICONS[item.icon];
					return (
						<li
							key={item.label}
							className="flex items-center gap-2 py-2.5 text-[11px]"
						>
							<Icon className="size-3.5 shrink-0 text-muted-foreground" />
							<span className="min-w-0 flex-1 font-medium">{item.label}</span>
							<span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold tabular-nums">
								{item.count}
							</span>
							<StatusPill label={item.status} className={item.statusStyle} />
						</li>
					);
				})}
			</ul>
		</CmsEdgeSectionPanel>
	);
}

function AuditSummaryPanel() {
	return (
		<CmsEdgeSectionPanel title="5. Audit" bodyClassName={OVERVIEW_PANEL_BODY}>
			<CmsEdgeTableScroll className="border-t border-border/50">
				<Table
					containerClassName={CMS_EDGE_TABLE_CONTAINER}
					className={CMS_EDGE_TABLE_CLASS}
				>
					<TableHeader>
						<TableRow className="border-b border-border/50 hover:bg-transparent">
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Audit Type
							</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Status
							</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Due Date
							</TableHead>
							<TableHead className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "pr-4")}>
								Owner
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{CMS_EDGE_OVERVIEW_AUDIT_SUMMARY.map((row) => (
							<TableRow
								key={row.auditType}
								className="border-b border-border/40 hover:bg-muted/20"
							>
								<TableCell className={OVERVIEW_TABLE_CELL}>
									{row.auditType}
								</TableCell>
								<TableCell className={OVERVIEW_TABLE_CELL}>
									<StatusPill
										label={row.status}
										className={AUDIT_STATUS_STYLES[row.status]}
									/>
								</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "tabular-nums")}>
									{row.dueDate}
								</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "pr-4")}>
									{row.owner}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CmsEdgeTableScroll>
		</CmsEdgeSectionPanel>
	);
}

function ReportingCyclePanel() {
	return (
		<CmsEdgeSectionPanel
			title="6. Reporting Cycle Status"
			bodyClassName={OVERVIEW_PANEL_BODY}
		>
			<CmsEdgeTableScroll className="border-t border-border/50">
				<Table
					containerClassName={CMS_EDGE_TABLE_CONTAINER}
					className={cn(CMS_EDGE_TABLE_CLASS, "min-w-[640px]")}
				>
					<TableHeader>
						<TableRow className="border-b border-border/50 hover:bg-transparent">
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Quarter
							</TableHead>
							<TableHead
								className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "text-right")}
							>
								Required Files
							</TableHead>
							<TableHead
								className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "text-right")}
							>
								Submitted
							</TableHead>
							<TableHead
								className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "text-right")}
							>
								Outstanding
							</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								Last Activity
							</TableHead>
							<TableHead className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "pr-4")}>
								Owner
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{CMS_EDGE_OVERVIEW_REPORTING_CYCLE.map((row) => (
							<TableRow
								key={row.quarter}
								className="border-b border-border/40 hover:bg-muted/20"
							>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "font-medium")}>
									{row.quarter}
								</TableCell>
								<TableCell
									className={cn(OVERVIEW_TABLE_CELL, "text-right tabular-nums")}
								>
									{row.requiredFiles}
								</TableCell>
								<TableCell
									className={cn(OVERVIEW_TABLE_CELL, "text-right tabular-nums")}
								>
									{row.submitted}
								</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "text-right")}>
									{row.outstanding > 0 ? (
										<span className="inline-flex size-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold tabular-nums text-red-700">
											{row.outstanding}
										</span>
									) : (
										<span className="tabular-nums text-muted-foreground">
											0
										</span>
									)}
								</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "tabular-nums")}>
									{row.lastActivity}
								</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "pr-4")}>
									{row.owner}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CmsEdgeTableScroll>
		</CmsEdgeSectionPanel>
	);
}

function TimelineStageIcon({ state }: { state: TimelineStageState }) {
	if (state === "done") {
		return (
			<div className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
				<CheckCircle2 className="size-4" />
			</div>
		);
	}
	if (state === "current") {
		return (
			<div className="flex size-8 items-center justify-center rounded-full bg-sky-100 text-sky-700">
				<Clock3 className="size-4" />
			</div>
		);
	}
	if (state === "pending") {
		return (
			<div className="flex size-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
				<Hourglass className="size-4" />
			</div>
		);
	}
	return (
		<div className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
			<Circle className="size-4" />
		</div>
	);
}

function SubmissionTimelinePanel() {
	return (
		<CmsEdgeSectionPanel
			title="7. EDGE Submission Timeline (Q2 2027)"
			bodyClassName={OVERVIEW_PANEL_BODY}
		>
			<div className="border-t border-border/50 px-4 py-5">
				<div className="flex items-start justify-between gap-1">
					{CMS_EDGE_OVERVIEW_TIMELINE.map((stage, index) => (
						<div
							key={stage.label}
							className="relative flex min-w-0 flex-1 flex-col items-center"
						>
							{index > 0 ? (
								<div
									className="absolute top-4 right-1/2 h-px w-full -translate-y-1/2 border-t border-dashed border-border"
									aria-hidden
								/>
							) : null}
							<div className="relative z-10">
								<TimelineStageIcon state={stage.state} />
							</div>
							<p className="mt-2 line-clamp-2 text-center text-[10px] font-medium leading-tight">
								{stage.label}
							</p>
							<p className="mt-0.5 text-center text-[9px] tabular-nums text-muted-foreground">
								{stage.date}
							</p>
						</div>
					))}
				</div>
			</div>
		</CmsEdgeSectionPanel>
	);
}

function DocumentsSummaryPanel() {
	return (
		<CmsEdgeSectionPanel
			title="8. Documents"
			bodyClassName={OVERVIEW_PANEL_BODY}
		>
			<ul className="divide-y divide-border/40 border-t border-border/50 px-3 pt-1">
				{CMS_EDGE_OVERVIEW_DOCUMENT_COUNTS.map((item) => (
					<li
						key={item.label}
						className="flex items-center gap-2 py-2.5 text-[11px]"
					>
						<FolderOpen className="size-3.5 shrink-0 text-muted-foreground" />
						<span className="min-w-0 flex-1 font-medium">{item.label}</span>
						<span className="shrink-0 font-semibold tabular-nums text-foreground">
							{item.count}
						</span>
					</li>
				))}
			</ul>
		</CmsEdgeSectionPanel>
	);
}

export function CmsEdgeOverviewTab() {
	return (
		<div className={OVERVIEW_PAGE_STACK}>
			<OverviewKpiRow />

			<CmsEdgePairRow
				left={<SubmissionHistoryPanel />}
				right={<CmsResponsesPanel />}
			/>

			<CmsEdgeTripleRow
				left={<ValidationResultsPanel />}
				center={<FinancialManagementPanel />}
				right={<AuditSummaryPanel />}
			/>

			<div
				className={cn(
					"grid grid-cols-1 items-stretch lg:grid-cols-[minmax(0,2fr)_minmax(0,1.15fr)_minmax(0,0.85fr)]",
					OVERVIEW_SECTION_GAP
				)}
			>
				<ReportingCyclePanel />
				<SubmissionTimelinePanel />
				<DocumentsSummaryPanel />
			</div>

			<CmsEdgePageFooter />
		</div>
	);
}
