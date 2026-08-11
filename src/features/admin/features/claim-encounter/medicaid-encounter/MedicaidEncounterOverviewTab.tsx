"use client";

import { type ReactNode } from "react";

import {
	ArrowUpRight,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Clock3,
	Download,
	FileText,
	FolderOpen,
	Percent,
	RefreshCw,
	Send,
	Upload,
	XCircle,
	type LucideIcon,
} from "lucide-react";
import {
	CartesianGrid,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
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
	CMS_EDGE_TABLE_CLASS,
	CMS_EDGE_TABLE_CONTAINER,
	CMS_EDGE_TABLE_LINK_CLASS,
	CMS_EDGE_STATUS_PILL_CLASS,
	CmsEdgePageFooter,
	CmsEdgeSectionPanel,
	CmsEdgeTableScroll,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import {
	MEDICAID_EXCEPTION_STATUS_STYLES,
	MEDICAID_OVERVIEW_ACCEPTANCE_TREND,
	MEDICAID_OVERVIEW_EXCEPTIONS,
	MEDICAID_OVERVIEW_KPIS,
	MEDICAID_OVERVIEW_QUICK_ACTIONS,
	MEDICAID_OVERVIEW_RECENT_RESPONSES,
	MEDICAID_OVERVIEW_RECENT_SUBMISSIONS,
	MEDICAID_OVERVIEW_REJECTION_DONUT,
	MEDICAID_SUBMISSION_STATUS_STYLES,
} from "@/features/admin/features/claim-encounter/medicaid-encounter/mock-data";
import { formatCount } from "@/features/admin/features/claim-encounter/mock-data";
import { cn } from "@/lib/utils";

/** Comfortable spacing for overview tables and panels (less cluttered than dense CMS EDGE tables) */
const OVERVIEW_TABLE_HEAD = "h-9 bg-muted/30 px-4 text-[11px] font-semibold text-foreground";
const OVERVIEW_TABLE_CELL = "px-4 py-2.5";
const OVERVIEW_PAGE_STACK = "space-y-5";
const OVERVIEW_SECTION_GAP = "gap-4";

function PanelLink({ children }: { children: ReactNode }) {
	return (
		<Button variant="link" size="sm" className="h-7 px-0 text-xs text-primary">
			{children}
		</Button>
	);
}

function StatusPill({ label, className }: { label: string; className: string }) {
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
		<div className="rounded-lg border border-border/70 bg-card p-3.5 shadow-sm">
			<div className="flex items-center gap-3">
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

function OverviewKpiRow() {
	const k = MEDICAID_OVERVIEW_KPIS;

	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
			<OverviewMetricCard
				label="Encounter Files Submitted"
				value={k.encounterFilesSubmitted}
				hint={
					<span className="inline-flex items-center gap-0.5 text-emerald-700">
						<ArrowUpRight className="size-3" />
						{k.encounterFilesDelta}% vs. Prior Period
					</span>
				}
				icon={FileText}
				tone="text-sky-700 bg-sky-500/10"
			/>
			<OverviewMetricCard
				label="Encounters Submitted"
				value={formatCount(k.encountersSubmitted)}
				hint={
					<span className="inline-flex items-center gap-0.5 text-emerald-700">
						<ArrowUpRight className="size-3" />
						{k.encountersDelta}% vs. Prior Period
					</span>
				}
				icon={Send}
				tone="text-sky-700 bg-sky-500/10"
			/>
			<OverviewMetricCard
				label="Accepted"
				value={formatCount(k.accepted)}
				hint={`${k.acceptanceRate.toFixed(2)}% Acceptance Rate`}
				icon={CheckCircle2}
				tone="text-emerald-700 bg-emerald-500/10"
				valueClassName="text-emerald-700"
			/>
			<OverviewMetricCard
				label="Rejected"
				value={formatCount(k.rejected)}
				hint={`${k.rejectionRate.toFixed(2)}% Rejection Rate`}
				icon={XCircle}
				tone="text-red-700 bg-red-500/10"
				valueClassName="text-red-600"
			/>
			<OverviewMetricCard
				label="Pending Responses"
				value={formatCount(k.pendingResponses)}
				hint={`${k.pendingRate.toFixed(2)}% Pending Rate`}
				icon={Clock3}
				tone="text-amber-700 bg-amber-500/10"
				valueClassName="text-amber-600"
			/>
			<OverviewMetricCard
				label="Acceptance Rate"
				value={`${k.acceptanceRate.toFixed(2)}%`}
				hint={
					<span className="inline-flex items-center gap-0.5 text-emerald-700">
						<ArrowUpRight className="size-3" />
						{k.acceptanceRateDelta}% vs. Prior Period
					</span>
				}
				icon={Percent}
				tone="text-violet-700 bg-violet-500/10"
				valueClassName="text-emerald-700"
			/>
		</div>
	);
}

function RecentSubmissionsPanel() {
	return (
		<CmsEdgeSectionPanel
			title="Recent Submissions"
			action={<PanelLink>View All</PanelLink>}
			footer={
				<div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border/50 px-5 py-3 text-xs text-muted-foreground">
					<span>Showing 1 to 5 of 128 entries</span>
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
						<Button variant="outline" size="icon" className="size-7 text-xs">
							3
						</Button>
						<span className="px-1">…</span>
						<Button variant="outline" size="icon" className="size-7 text-xs">
							26
						</Button>
						<Button variant="outline" size="icon" className="size-7">
							<ChevronRight className="size-3.5" />
						</Button>
					</div>
				</div>
			}
		>
			<CmsEdgeTableScroll className="border-t border-border/50">
				<Table
					containerClassName={CMS_EDGE_TABLE_CONTAINER}
					className={CMS_EDGE_TABLE_CLASS}
				>
					<TableHeader>
						<TableRow className="border-b border-border/50 hover:bg-transparent">
							<TableHead className={cn(OVERVIEW_TABLE_HEAD, "min-w-[140px]")}>Submission Batch</TableHead>
							<TableHead className={cn(OVERVIEW_TABLE_HEAD, "min-w-[200px]")}>File Name</TableHead>
							<TableHead className={OVERVIEW_TABLE_HEAD}>State</TableHead>
							<TableHead className={OVERVIEW_TABLE_HEAD}>Submitted Date</TableHead>
							<TableHead className={OVERVIEW_TABLE_HEAD}>Status</TableHead>
							<TableHead className={cn(OVERVIEW_TABLE_HEAD, "pr-5 text-right")}>
								Encounters
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{MEDICAID_OVERVIEW_RECENT_SUBMISSIONS.map((row) => (
							<TableRow key={row.id} className="border-b border-border/40 hover:bg-muted/20">
								<TableCell className={OVERVIEW_TABLE_CELL}>
									<Button variant="link" className={cn(CMS_EDGE_TABLE_LINK_CLASS, "whitespace-normal text-left")}>
										{row.batch}
									</Button>
								</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "font-mono text-[11px] leading-relaxed")}>
									{row.fileName}
								</TableCell>
								<TableCell className={OVERVIEW_TABLE_CELL}>{row.state}</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "tabular-nums")}>
									{row.submittedDate}
								</TableCell>
								<TableCell className={OVERVIEW_TABLE_CELL}>
									<StatusPill
										label={row.status}
										className={MEDICAID_SUBMISSION_STATUS_STYLES[row.status]}
									/>
								</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "pr-5 text-right tabular-nums")}>
									{formatCount(row.encounters)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CmsEdgeTableScroll>
		</CmsEdgeSectionPanel>
	);
}

function AcceptanceTrendPanel() {
	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Acceptance Rate Trend (by Month)"
			bodyClassName="flex min-h-0 flex-1 flex-col"
		>
			<div className="min-h-[240px] flex-1 border-t border-border/50 px-4 py-4">
				<ResponsiveContainer width="100%" height="100%" minHeight={200}>
					<LineChart
						data={MEDICAID_OVERVIEW_ACCEPTANCE_TREND}
						margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
					>
						<CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
						<XAxis dataKey="month" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={40} />
						<YAxis tick={{ fontSize: 11 }} width={36} domain={[90, 100]} tickFormatter={(v) => `${v}%`} />
						<Tooltip formatter={(v: number) => `${v.toFixed(2)}%`} />
						<Line
							type="monotone"
							dataKey="rate"
							name="Acceptance Rate"
							stroke="#22c55e"
							strokeWidth={2}
							dot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</CmsEdgeSectionPanel>
	);
}

function TopRejectionDonutPanel() {
	const total = MEDICAID_OVERVIEW_KPIS.rejected;
	const pieData = MEDICAID_OVERVIEW_REJECTION_DONUT.map((item) => ({
		name: item.name,
		value: item.count,
		color: item.color,
	}));

	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Top Rejection Reasons"
			bodyClassName="flex min-h-0 flex-1 flex-col"
		>
			<div className="flex min-h-[240px] flex-1 gap-4 border-t border-border/50 px-5 py-4">
				<div className="relative mx-auto w-full max-w-[140px] shrink-0">
					<ResponsiveContainer width="100%" height={168}>
						<PieChart>
							<Pie
								data={pieData}
								dataKey="value"
								nameKey="name"
								innerRadius="58%"
								outerRadius="88%"
								paddingAngle={2}
								stroke="none"
								isAnimationActive={false}
							>
								{pieData.map((entry) => (
									<Cell key={entry.name} fill={entry.color} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
					<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
						<p className="text-xs font-bold tabular-nums leading-tight">
							{(total / 1000).toFixed(1)}K
						</p>
						<p className="text-[9px] text-muted-foreground">Total Rejections</p>
					</div>
				</div>
				<ul className="flex min-w-0 flex-1 flex-col justify-center gap-3 py-1 text-xs leading-relaxed">
					{MEDICAID_OVERVIEW_REJECTION_DONUT.map((item) => (
						<li key={item.name} className="flex items-start justify-between gap-4">
							<span className="flex min-w-0 items-start gap-2 font-medium">
								<span
									className="mt-1.5 size-2 shrink-0 rounded-full"
									style={{ backgroundColor: item.color }}
								/>
								<span className="line-clamp-2">{item.name}</span>
							</span>
							<span className="shrink-0 pt-0.5 tabular-nums text-muted-foreground">
								{(item.count / 1000).toFixed(1)}K
								<span className="ml-1.5">({item.pct}%)</span>
							</span>
						</li>
					))}
				</ul>
			</div>
		</CmsEdgeSectionPanel>
	);
}

function RecentResponseFilesPanel() {
	return (
		<CmsEdgeSectionPanel title="Recent Response Files">
			<CmsEdgeTableScroll className="border-t border-border/50">
				<Table containerClassName={CMS_EDGE_TABLE_CONTAINER} className={CMS_EDGE_TABLE_CLASS}>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className={OVERVIEW_TABLE_HEAD}>Response File</TableHead>
							<TableHead className={OVERVIEW_TABLE_HEAD}>State</TableHead>
							<TableHead className={OVERVIEW_TABLE_HEAD}>Received Date</TableHead>
							<TableHead className={cn(OVERVIEW_TABLE_HEAD, "text-right")}>Accepted</TableHead>
							<TableHead className={cn(OVERVIEW_TABLE_HEAD, "text-right")}>Rejected</TableHead>
							<TableHead className={cn(OVERVIEW_TABLE_HEAD, "pr-5")}>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{MEDICAID_OVERVIEW_RECENT_RESPONSES.map((row) => (
							<TableRow key={row.id} className="border-b border-border/40 hover:bg-muted/20">
								<TableCell className={OVERVIEW_TABLE_CELL}>
									<Button variant="link" className={CMS_EDGE_TABLE_LINK_CLASS}>
										{row.file}
									</Button>
								</TableCell>
								<TableCell className={OVERVIEW_TABLE_CELL}>{row.state}</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "tabular-nums")}>
									{row.receivedDate}
								</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "text-right tabular-nums text-emerald-700")}>
									{formatCount(row.accepted)}
								</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "text-right tabular-nums text-red-600")}>
									{formatCount(row.rejected)}
								</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "pr-5")}>
									<StatusPill
										label={row.status}
										className="border-emerald-200 bg-emerald-50 text-emerald-700"
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CmsEdgeTableScroll>
		</CmsEdgeSectionPanel>
	);
}

function ExceptionsSummaryPanel() {
	return (
		<CmsEdgeSectionPanel
			title="Exceptions Summary"
			action={<PanelLink>View All</PanelLink>}
		>
			<CmsEdgeTableScroll className="border-t border-border/50">
				<Table containerClassName={CMS_EDGE_TABLE_CONTAINER} className={CMS_EDGE_TABLE_CLASS}>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className={cn(OVERVIEW_TABLE_HEAD, "w-[100px]")}>Error Code</TableHead>
							<TableHead className={OVERVIEW_TABLE_HEAD}>Description</TableHead>
							<TableHead className={cn(OVERVIEW_TABLE_HEAD, "w-[72px] text-right")}>Count</TableHead>
							<TableHead className={cn(OVERVIEW_TABLE_HEAD, "w-[100px] pr-5")}>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{MEDICAID_OVERVIEW_EXCEPTIONS.map((row) => (
							<TableRow key={row.id} className="border-b border-border/40 hover:bg-muted/20">
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "font-mono font-medium")}>
									{row.code}
								</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "pr-6 text-muted-foreground leading-relaxed")}>
									{row.description}
								</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "text-right tabular-nums")}>
									{formatCount(row.count)}
								</TableCell>
								<TableCell className={cn(OVERVIEW_TABLE_CELL, "pr-5")}>
									<StatusPill
										label={row.status}
										className={MEDICAID_EXCEPTION_STATUS_STYLES[row.status]}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CmsEdgeTableScroll>
		</CmsEdgeSectionPanel>
	);
}

const QUICK_ACTION_ICONS: Record<string, LucideIcon> = {
	"qa-1": Upload,
	"qa-2": RefreshCw,
	"qa-3": Download,
	"qa-4": Send,
};

function QuickActionsPanel() {
	return (
		<CmsEdgeSectionPanel title="Quick Actions">
			<div className="grid grid-cols-1 gap-3 border-t border-border/50 p-4 sm:grid-cols-2">
				{MEDICAID_OVERVIEW_QUICK_ACTIONS.map((action) => {
					const Icon = QUICK_ACTION_ICONS[action.id] ?? FolderOpen;
					return (
						<button
							key={action.id}
							type="button"
							className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-3.5 text-left transition-colors hover:bg-muted/30"
							onClick={() => toast.message(action.title)}
						>
							<div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
								<Icon className="size-4" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="text-xs font-semibold text-foreground">{action.title}</p>
								<p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
									{action.description}
								</p>
							</div>
						</button>
					);
				})}
			</div>
		</CmsEdgeSectionPanel>
	);
}

export function MedicaidEncounterOverviewTab() {
	return (
		<div className={OVERVIEW_PAGE_STACK}>
			<OverviewKpiRow />

			<div className={cn("grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]", OVERVIEW_SECTION_GAP)}>
				{/* Left column — tables */}
				<div className={cn("flex min-w-0 flex-col", OVERVIEW_SECTION_GAP)}>
					<RecentSubmissionsPanel />
					<RecentResponseFilesPanel />
					<ExceptionsSummaryPanel />
				</div>

				{/* Right column — charts & actions */}
				<div className={cn("flex min-w-0 flex-col", OVERVIEW_SECTION_GAP)}>
					<AcceptanceTrendPanel />
					<TopRejectionDonutPanel />
					<QuickActionsPanel />
				</div>
			</div>

			<CmsEdgePageFooter />
		</div>
	);
}
