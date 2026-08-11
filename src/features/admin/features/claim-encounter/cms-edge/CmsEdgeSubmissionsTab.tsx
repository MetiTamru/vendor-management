"use client";

import { useMemo, useState, type ReactNode } from "react";

import {
	ArrowUpDown,
	CalendarDays,
	CheckCircle2,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Clock3,
	Download,
	ExternalLink,
	FileText,
	type LucideIcon,
	MoreVertical,
	Plus,
	Shield,
	StickyNote,
	XCircle,
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
	CMS_EDGE_SUBMISSION_DETAILS,
	CMS_EDGE_SUBMISSION_HISTORY,
	CMS_EDGE_SUBMISSION_KPIS,
	CMS_EDGE_SUBMISSION_NOTES,
	SUBMISSION_CMS_RESPONSE_STYLES,
	SUBMISSION_STATUS_STYLES,
} from "@/features/admin/features/claim-encounter/cms-edge/mock-data";
import {
	CMS_EDGE_PAGE_STACK,
	CMS_EDGE_TABLE_CELL_CLASS,
	CMS_EDGE_TABLE_CLASS,
	CMS_EDGE_TABLE_CONTAINER,
	CMS_EDGE_TABLE_HEAD_CLASS,
	CMS_EDGE_STATUS_PILL_CLASS,
	CmsEdgePageFooter,
	CmsEdgeSectionPanel,
	CmsEdgeSplitRow,
	CmsEdgeTableScroll,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import { formatCount } from "@/features/admin/features/claim-encounter/mock-data";
import { cn } from "@/lib/utils";

const DEFAULT_SELECTED_ID = "sub-h-2";

function StatusPill({ label, className }: { label: string; className: string }) {
	return (
		<span className={cn(CMS_EDGE_STATUS_PILL_CLASS, className)}>{label}</span>
	);
}

function SortableHead({ children }: { children: ReactNode }) {
	return (
		<span className="inline-flex items-center gap-1">
			{children}
			<ArrowUpDown className="size-3 text-muted-foreground/70" />
		</span>
	);
}

function SubmissionMetricCard({
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
							"mt-0.5 text-sm font-semibold tabular-nums leading-tight text-foreground",
							valueClassName
						)}
					>
						{value}
					</p>
					{hint != null && hint !== "" ? (
						<div className="mt-0.5 truncate text-[10px] text-muted-foreground">{hint}</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

function SubmissionsKpiRow() {
	const k = CMS_EDGE_SUBMISSION_KPIS;

	return (
		<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
			<SubmissionMetricCard
				label="Total Submissions"
				value={k.total}
				hint="This cycle"
				icon={FileText}
				tone="text-sky-700 bg-sky-500/10"
			/>
			<SubmissionMetricCard
				label="Accepted"
				value={k.accepted.count}
				hint={`${k.accepted.percent.toFixed(1)}%`}
				icon={CheckCircle2}
				tone="text-emerald-700 bg-emerald-500/10"
			/>
			<SubmissionMetricCard
				label="Pending"
				value={k.pending.count}
				hint={`${k.pending.percent.toFixed(1)}%`}
				icon={Clock3}
				tone="text-amber-700 bg-amber-500/10"
			/>
			<SubmissionMetricCard
				label="Rejected"
				value={k.rejected.count}
				hint={`${k.rejected.percent.toFixed(1)}%`}
				icon={XCircle}
				tone="text-red-700 bg-red-500/10"
			/>
			<SubmissionMetricCard
				label="Last Submission"
				value={k.lastSubmissionDate}
				hint={k.lastSubmissionTime}
				icon={CalendarDays}
				tone="text-violet-700 bg-violet-500/10"
			/>
			<SubmissionMetricCard
				label="Submission Status"
				value={k.overallStatus}
				icon={Shield}
				tone="text-sky-700 bg-sky-500/10"
				valueClassName="text-emerald-700"
			/>
		</div>
	);
}

function SubmissionHistoryPanel({
	selectedId,
	onSelect,
}: {
	selectedId: string;
	onSelect: (id: string) => void;
}) {
	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Submission History"
			bodyClassName="flex min-h-0 flex-1 flex-col"
			action={
				<div className="flex items-center gap-2">
					<Button size="sm" className="h-8" onClick={() => toast.message("New submission")}>
						<Plus className="mr-1.5 size-3.5" />
						New Submission
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="h-8"
						onClick={() => toast.success("Export queued")}
					>
						<Download className="mr-1.5 size-3.5" />
						Export
					</Button>
				</div>
			}
			footer={
				<div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border/50 px-4 py-3 text-xs text-muted-foreground">
					<span>Showing 1–10 of 12 submissions</span>
					<div className="flex items-center gap-1">
						<Button variant="outline" size="icon" className="size-7" disabled>
							<ChevronLeft className="size-3.5" />
						</Button>
						<Button variant="default" size="icon" className="size-7 text-xs">
							1
						</Button>
						<Button variant="outline" size="icon" className="size-7 text-xs">
							2
						</Button>
						<Button variant="outline" size="icon" className="size-7">
							<ChevronRight className="size-3.5" />
						</Button>
					</div>
				</div>
			}
		>
			<CmsEdgeTableScroll className="min-h-[340px] flex-1 border-t border-border/50">
				<Table
					containerClassName={CMS_EDGE_TABLE_CONTAINER}
					className={cn(CMS_EDGE_TABLE_CLASS, "min-w-[980px]")}
				>
					<TableHeader>
						<TableRow className="border-b border-border/50 hover:bg-transparent">
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>Submission Type</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>Reporting Period</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>File Name</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
								<SortableHead>Submitted Date / Time</SortableHead>
							</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>Status</TableHead>
							<TableHead className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "text-right")}>
								Records
							</TableHead>
							<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>Submitted By</TableHead>
							<TableHead className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "pr-4 text-right")}>
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{CMS_EDGE_SUBMISSION_HISTORY.map((row) => (
							<TableRow
								key={row.id}
								className={cn(
									"cursor-pointer border-b border-border/40 hover:bg-muted/20",
									selectedId === row.id && "bg-sky-50/80 hover:bg-sky-50/80"
								)}
								onClick={() => onSelect(row.id)}
							>
								<TableCell className={CMS_EDGE_TABLE_CELL_CLASS}>
									<span className="inline-flex items-center gap-1.5 font-medium">
										<FileText className="size-3.5 shrink-0 text-primary" />
										{row.submissionType}
									</span>
								</TableCell>
								<TableCell className={CMS_EDGE_TABLE_CELL_CLASS}>
									{row.reportingPeriod}
								</TableCell>
								<TableCell className={CMS_EDGE_TABLE_CELL_CLASS}>
									<span className="font-mono text-[11px]">{row.fileName}</span>
								</TableCell>
								<TableCell className={cn(CMS_EDGE_TABLE_CELL_CLASS, "tabular-nums")}>
									{row.submittedDateTime}
								</TableCell>
								<TableCell className={CMS_EDGE_TABLE_CELL_CLASS}>
									<StatusPill
										label={row.status}
										className={SUBMISSION_STATUS_STYLES[row.status]}
									/>
								</TableCell>
								<TableCell className={cn(CMS_EDGE_TABLE_CELL_CLASS, "text-right tabular-nums")}>
									{formatCount(row.records)}
								</TableCell>
								<TableCell className={CMS_EDGE_TABLE_CELL_CLASS}>{row.submittedBy}</TableCell>
								<TableCell className={cn(CMS_EDGE_TABLE_CELL_CLASS, "pr-4 text-right")}>
									<Button
										variant="ghost"
										size="icon"
										className="size-7 text-muted-foreground"
										onClick={(e) => {
											e.stopPropagation();
											toast.message(`Actions for ${row.submissionType}`);
										}}
									>
										<MoreVertical className="size-3.5" />
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

function buildDetailsFromRow(row: (typeof CMS_EDGE_SUBMISSION_HISTORY)[number]) {
	return {
		submissionType: row.submissionType,
		reportingPeriod: row.reportingPeriod,
		fileName: row.fileName,
		submittedDateTime: `${row.submittedDateTime} ET`,
		submittedBy: row.submittedBy,
		status: row.status,
		totalRecords: row.records,
		acceptedRecords: Math.round(row.records * 0.997),
		acceptedPercent: 99.7,
		rejectedRecords: Math.round(row.records * 0.003),
		rejectedPercent: 0.3,
		warnings: 0,
		cmsResponses: [
			{ label: "Acceptance Report", status: "Received" as const },
			{ label: "Validation Report", status: "Received" as const },
		],
	};
}

function SubmissionDetailsPanel({ selectedId }: { selectedId: string }) {
	const row = CMS_EDGE_SUBMISSION_HISTORY.find((r) => r.id === selectedId);
	const details = useMemo(() => {
		if (!row) return CMS_EDGE_SUBMISSION_DETAILS[DEFAULT_SELECTED_ID];
		return CMS_EDGE_SUBMISSION_DETAILS[selectedId] ?? buildDetailsFromRow(row);
	}, [selectedId, row]);

	if (!details) return null;

	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Submission Details"
			bodyClassName="flex min-h-0 flex-1 flex-col"
			action={
				<StatusPill
					label={details.status}
					className={SUBMISSION_STATUS_STYLES[details.status]}
				/>
			}
			footer={
				<div className="mt-auto flex flex-col gap-2 border-t border-border/50 px-4 py-3">
					<Button
						variant="outline"
						size="sm"
						className="h-9 w-full border-primary/30 text-primary"
						onClick={() => toast.success("Download queued")}
					>
						<Download className="mr-1.5 size-3.5" />
						Download Files
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="h-9 w-full border-primary/30 text-primary"
						onClick={() => toast.message("Opening documents")}
					>
						View in Documents
						<ExternalLink className="ml-1.5 size-3.5" />
					</Button>
				</div>
			}
		>
			<p className="border-t border-border/50 px-4 py-2 text-xs font-medium text-muted-foreground">
				{details.submissionType}
			</p>
			<div className="flex-1 space-y-4 px-4 pb-3 text-xs">
				<section>
					<p className="mb-2 text-[11px] font-semibold text-foreground">Basic Information</p>
					<dl className="space-y-2">
						{[
							["Reporting Period", details.reportingPeriod],
							["Submission Type", details.submissionType],
							["File Name", details.fileName],
							["Submitted Date / Time", details.submittedDateTime],
							["Submitted By", details.submittedBy],
						].map(([label, value]) => (
							<div key={label} className="flex justify-between gap-3">
								<dt className="text-muted-foreground">{label}</dt>
								<dd className="text-right font-medium">{value}</dd>
							</div>
						))}
					</dl>
				</section>

				<section className="border-t border-border/40 pt-3">
					<p className="mb-2 text-[11px] font-semibold text-foreground">Record Summary</p>
					<dl className="space-y-2">
						<div className="flex justify-between gap-3">
							<dt className="text-muted-foreground">Total Records</dt>
							<dd className="font-semibold tabular-nums">
								{formatCount(details.totalRecords)}
							</dd>
						</div>
						<div className="flex justify-between gap-3">
							<dt className="text-muted-foreground">Accepted</dt>
							<dd className="font-semibold tabular-nums text-emerald-700">
								{formatCount(details.acceptedRecords)} ({details.acceptedPercent.toFixed(1)}%)
							</dd>
						</div>
						<div className="flex justify-between gap-3">
							<dt className="text-muted-foreground">Rejected</dt>
							<dd className="font-semibold tabular-nums text-red-600">
								{formatCount(details.rejectedRecords)} ({details.rejectedPercent.toFixed(1)}%)
							</dd>
						</div>
						<div className="flex justify-between gap-3">
							<dt className="text-muted-foreground">Warnings</dt>
							<dd className="font-semibold tabular-nums">{details.warnings}</dd>
						</div>
					</dl>
				</section>

				<section className="border-t border-border/40 pt-3">
					<p className="mb-2 text-[11px] font-semibold text-foreground">CMS Response</p>
					<ul className="space-y-2">
						{details.cmsResponses.map((item) => (
							<li key={item.label} className="flex items-center justify-between gap-2">
								<span className="text-muted-foreground">{item.label}</span>
								<span className="inline-flex items-center gap-1.5">
									<StatusPill
										label={item.status}
										className={SUBMISSION_CMS_RESPONSE_STYLES[item.status]}
									/>
									{item.status === "Received" ? (
										<Button
											variant="ghost"
											size="icon"
											className="size-6 text-primary"
											onClick={() => toast.success(`Download ${item.label}`)}
										>
											<Download className="size-3" />
										</Button>
									) : null}
								</span>
							</li>
						))}
					</ul>
				</section>
			</div>
		</CmsEdgeSectionPanel>
	);
}

function SubmissionNotesPanel() {
	const [open, setOpen] = useState(true);

	return (
		<section className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
			<div className="flex items-center justify-between gap-3 border-b border-border/50 px-4 py-3">
				<h3 className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
					<StickyNote className="size-4 text-primary" />
					Submission Notes
				</h3>
				<Button
					variant="ghost"
					size="icon"
					className="size-7 text-muted-foreground"
					onClick={() => setOpen((v) => !v)}
				>
					<ChevronDown
						className={cn("size-4 transition-transform", open && "rotate-180")}
					/>
				</Button>
			</div>
			{open ? (
				<CmsEdgeTableScroll className="max-h-[220px]">
					<Table containerClassName={CMS_EDGE_TABLE_CONTAINER} className={CMS_EDGE_TABLE_CLASS}>
						<TableHeader>
							<TableRow className="border-b border-border/50 hover:bg-transparent">
								<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>Date / Time</TableHead>
								<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>Source</TableHead>
								<TableHead className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "pr-4")}>Note</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{CMS_EDGE_SUBMISSION_NOTES.map((note) => (
								<TableRow
									key={note.id}
									className="border-b border-border/40 hover:bg-muted/20"
								>
									<TableCell className={cn(CMS_EDGE_TABLE_CELL_CLASS, "tabular-nums whitespace-nowrap")}>
										{note.dateTime}
									</TableCell>
									<TableCell className={cn(CMS_EDGE_TABLE_CELL_CLASS, "whitespace-nowrap font-medium")}>
										{note.source}
									</TableCell>
									<TableCell className={cn(CMS_EDGE_TABLE_CELL_CLASS, "pr-4 text-muted-foreground")}>
										{note.note}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CmsEdgeTableScroll>
			) : null}
		</section>
	);
}

export function CmsEdgeSubmissionsTab() {
	const [selectedId, setSelectedId] = useState(DEFAULT_SELECTED_ID);

	return (
		<div className={CMS_EDGE_PAGE_STACK}>
			<SubmissionsKpiRow />

			<CmsEdgeSplitRow
				wideMain
				main={
					<SubmissionHistoryPanel selectedId={selectedId} onSelect={setSelectedId} />
				}
				side={<SubmissionDetailsPanel selectedId={selectedId} />}
			/>

			<SubmissionNotesPanel />

			<CmsEdgePageFooter />
		</div>
	);
}
