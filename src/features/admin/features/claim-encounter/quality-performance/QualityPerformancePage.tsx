"use client";

import { type ReactNode } from "react";

import {
	ArrowDownRight,
	ArrowUpRight,
	BarChart3,
	Check,
	CheckCircle2,
	ClipboardList,
	Download,
	Eye,
	FileText,
	FolderOpen,
	Minus,
	Percent,
	Send,
	Stethoscope,
	Target,
	TrendingUp,
	Users,
	type LucideIcon,
} from "lucide-react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	ReferenceLine,
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
import { ClaimPageHeader } from "@/features/admin/features/claim-encounter/components/ClaimPageChrome";
import {
	CMS_EDGE_STATUS_PILL_CLASS,
	CMS_EDGE_TABLE_CLASS,
	CMS_EDGE_TABLE_CONTAINER,
	CMS_EDGE_TABLE_LINK_CLASS,
	CmsEdgePageFooter,
	CmsEdgeSectionPanel,
	CmsEdgeTableScroll,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import { formatCount } from "@/features/admin/features/claim-encounter/mock-data";
import {
	QUALITY_COMPLIANCE_GOAL,
	QUALITY_COMPLIANCE_TREND,
	QUALITY_DOCUMENTS,
	QUALITY_GAP_CLOSURE_ACTIVITY,
	QUALITY_GAP_STATUS,
	QUALITY_NCQA_SUBMISSION,
	QUALITY_OPEN_GAPS_BY_MEASURE,
	QUALITY_PERFORMANCE_KPIS,
	QUALITY_QUICK_ACTIONS,
	QUALITY_TOP_MEASURES,
	type GapTrend,
} from "@/features/admin/features/claim-encounter/quality-performance/mock-data";
import { cn } from "@/lib/utils";

const PAGE_STACK = "space-y-5";
const SECTION_GAP = "gap-4";
const TABLE_HEAD = "h-9 bg-muted/30 px-4 text-[11px] font-semibold text-foreground";
const TABLE_CELL = "px-4 py-2.5";

function PanelLink({ children }: { children: ReactNode }) {
	return (
		<Button variant="link" size="sm" className="h-7 px-0 text-xs text-primary">
			{children}
		</Button>
	);
}

function TrendHint({ delta, suffix = "MY 2024" }: { delta: number; suffix?: string }) {
	if (delta === 0) {
		return (
			<span className="inline-flex items-center gap-0.5 text-muted-foreground">
				<Minus className="size-3" />— vs {suffix}
			</span>
		);
	}

	const positive = delta > 0;
	const Icon = positive ? ArrowUpRight : ArrowDownRight;
	const tone = positive ? "text-emerald-700" : "text-red-600";
	const sign = positive ? "+" : "";

	return (
		<span className={cn("inline-flex items-center gap-0.5", tone)}>
			<Icon className="size-3" />
			{sign}
			{Math.abs(delta)}% vs {suffix}
		</span>
	);
}

function MetricCard({
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
				<div className={cn("flex size-8 shrink-0 items-center justify-center rounded-md", tone)}>
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
						<div className="mt-0.5 text-[10px] text-muted-foreground">{hint}</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

function KpiRow() {
	const k = QUALITY_PERFORMANCE_KPIS;

	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
			<MetricCard
				label="Total HEDIS Measures"
				value={k.totalMeasures}
				hint={
					<span className="inline-flex items-center gap-0.5 text-emerald-700">
						<ArrowUpRight className="size-3" />+ {k.totalMeasuresDelta} vs MY 2024
					</span>
				}
				icon={ClipboardList}
				tone="text-violet-700 bg-violet-500/10"
			/>
			<MetricCard
				label="Members in Measure"
				value={formatCount(k.membersInMeasure)}
				hint={<TrendHint delta={k.membersDelta} />}
				icon={Users}
				tone="text-sky-700 bg-sky-500/10"
			/>
			<MetricCard
				label="Open Gaps"
				value={formatCount(k.openGaps)}
				hint={<TrendHint delta={k.openGapsDelta} />}
				icon={Target}
				tone="text-amber-700 bg-amber-500/10"
				valueClassName="text-amber-600"
			/>
			<MetricCard
				label="Closed Gaps"
				value={formatCount(k.closedGaps)}
				hint={<TrendHint delta={k.closedGapsDelta} />}
				icon={CheckCircle2}
				tone="text-emerald-700 bg-emerald-500/10"
				valueClassName="text-emerald-700"
			/>
			<MetricCard
				label="Compliance Rate"
				value={`${k.complianceRate.toFixed(1)}%`}
				hint={<TrendHint delta={k.complianceDelta} />}
				icon={Percent}
				tone="text-emerald-700 bg-emerald-500/10"
				valueClassName="text-emerald-700"
			/>
			<MetricCard
				label="Measure Completion"
				value={`${k.measureCompletion.toFixed(1)}%`}
				hint={<TrendHint delta={k.measureCompletionDelta} />}
				icon={TrendingUp}
				tone="text-violet-700 bg-violet-500/10"
			/>
		</div>
	);
}

function ComplianceTrendPanel() {
	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="HEDIS Compliance Rate Trend"
			bodyClassName="flex min-h-0 flex-1 flex-col pb-4"
		>
			<div className="min-h-[240px] flex-1 border-t border-border/50 px-2 py-2">
				<ResponsiveContainer width="100%" height="100%" minHeight={200}>
					<LineChart data={QUALITY_COMPLIANCE_TREND} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
						<CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
						<XAxis dataKey="month" tick={{ fontSize: 10 }} />
						<YAxis tick={{ fontSize: 11 }} width={36} domain={[60, 95]} tickFormatter={(v) => `${v}%`} />
						<Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
						<ReferenceLine
							y={QUALITY_COMPLIANCE_GOAL}
							stroke="#94a3b8"
							strokeDasharray="4 4"
							label={{ value: "Goal 90%", position: "insideTopRight", fontSize: 10, fill: "#64748b" }}
						/>
						<Line
							type="monotone"
							dataKey="rate"
							name="Compliance Rate"
							stroke="#13446c"
							strokeWidth={2}
							dot={{ r: 4, fill: "#13446c" }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</CmsEdgeSectionPanel>
	);
}

function TopMeasuresPanel() {
	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Top 5 Measures by Compliance Rate"
			bodyClassName="flex min-h-0 flex-1 flex-col pb-4"
		>
			<div className="min-h-[240px] flex-1 border-t border-border/50 px-2 py-2">
				<ResponsiveContainer width="100%" height="100%" minHeight={200}>
					<BarChart
						data={QUALITY_TOP_MEASURES}
						layout="vertical"
						margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
					>
						<CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
						<XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
						<YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={120} />
						<Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
						<Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={14}>
							{QUALITY_TOP_MEASURES.map((entry) => (
								<Cell key={entry.name} fill={entry.color} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</CmsEdgeSectionPanel>
	);
}

function GapStatusPanel() {
	const total = QUALITY_GAP_STATUS.reduce((sum, item) => sum + item.value, 0);

	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Gap Status Summary"
			bodyClassName="flex min-h-0 flex-1 flex-col pb-4"
		>
			<div className="flex min-h-[240px] flex-1 flex-col gap-2 border-t border-border/50 px-3 py-3 sm:flex-row">
				<div className="relative mx-auto w-full max-w-[140px] flex-1">
					<ResponsiveContainer width="100%" height="100%" minHeight={120}>
						<PieChart>
							<Pie
								data={QUALITY_GAP_STATUS}
								dataKey="value"
								nameKey="name"
								innerRadius="58%"
								outerRadius="88%"
								paddingAngle={2}
								stroke="none"
								isAnimationActive={false}
							>
								{QUALITY_GAP_STATUS.map((entry) => (
									<Cell key={entry.name} fill={entry.color} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
					<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
						<p className="text-sm font-bold tabular-nums">{formatCount(total)}</p>
						<p className="text-[10px] text-muted-foreground">Total Open Gaps</p>
					</div>
				</div>
				<ul className="flex flex-1 flex-col justify-center gap-2 text-xs">
					{QUALITY_GAP_STATUS.map((item) => (
						<li key={item.name} className="flex items-center justify-between gap-2">
							<span className="flex min-w-0 items-center gap-1.5 font-medium">
								<span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
								<span className="truncate">{item.name}</span>
							</span>
							<span className="shrink-0 tabular-nums text-muted-foreground">
								{formatCount(item.value)}
								<span className="ml-1">({item.pct}%)</span>
							</span>
						</li>
					))}
				</ul>
			</div>
		</CmsEdgeSectionPanel>
	);
}

function GapTrendIcon({ trend }: { trend: GapTrend }) {
	if (trend === "Up") return <ArrowUpRight className="size-3.5 text-red-600" />;
	if (trend === "Down") return <ArrowDownRight className="size-3.5 text-emerald-700" />;
	return <Minus className="size-3.5 text-muted-foreground" />;
}

function OpenGapsByMeasurePanel() {
	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Open Gaps by Measure"
			action={<PanelLink>View All</PanelLink>}
			bodyClassName="flex min-h-0 flex-1 flex-col pb-4"
		>
			<CmsEdgeTableScroll className="min-h-0 flex-1 border-t border-border/50">
				<Table containerClassName={CMS_EDGE_TABLE_CONTAINER} className={cn(CMS_EDGE_TABLE_CLASS, "min-w-[880px]")}>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className={TABLE_HEAD}>Measure</TableHead>
							<TableHead className={TABLE_HEAD}>Description</TableHead>
							<TableHead className={cn(TABLE_HEAD, "text-right")}>Open Gaps</TableHead>
							<TableHead className={cn(TABLE_HEAD, "text-right")}>Gap Rate</TableHead>
							<TableHead className={cn(TABLE_HEAD, "text-right")}>Due Soon</TableHead>
							<TableHead className={cn(TABLE_HEAD, "text-right")}>Overdue</TableHead>
							<TableHead className={TABLE_HEAD}>Trend</TableHead>
							<TableHead className={cn(TABLE_HEAD, "pr-4 text-right")}>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{QUALITY_OPEN_GAPS_BY_MEASURE.map((row) => (
							<TableRow key={row.id} className="border-b border-border/40 hover:bg-muted/20">
								<TableCell className={cn(TABLE_CELL, "font-mono font-medium")}>{row.code}</TableCell>
								<TableCell className={cn(TABLE_CELL, "text-muted-foreground")}>{row.description}</TableCell>
								<TableCell className={cn(TABLE_CELL, "text-right tabular-nums")}>
									{formatCount(row.openGaps)}
								</TableCell>
								<TableCell className={cn(TABLE_CELL, "text-right tabular-nums")}>
									{row.gapRate.toFixed(1)}%
								</TableCell>
								<TableCell className={cn(TABLE_CELL, "text-right tabular-nums text-amber-600")}>
									{formatCount(row.dueSoon)}
								</TableCell>
								<TableCell className={cn(TABLE_CELL, "text-right tabular-nums text-red-600")}>
									{formatCount(row.overdue)}
								</TableCell>
								<TableCell className={TABLE_CELL}>
									<GapTrendIcon trend={row.trend} />
								</TableCell>
								<TableCell className={cn(TABLE_CELL, "pr-4 text-right")}>
									<Button
										variant="ghost"
										size="icon"
										className="size-7 text-primary"
										onClick={() => toast.message(`View ${row.code} gaps`)}
									>
										<Eye className="size-3.5" />
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

function GapClosureActivityPanel() {
	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Recent Gap Closure Activity"
			action={<PanelLink>View All</PanelLink>}
			bodyClassName="flex min-h-0 flex-1 flex-col pb-4"
		>
			<CmsEdgeTableScroll className="min-h-0 flex-1 border-t border-border/50">
				<Table containerClassName={CMS_EDGE_TABLE_CONTAINER} className={CMS_EDGE_TABLE_CLASS}>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className={TABLE_HEAD}>Member ID</TableHead>
							<TableHead className={TABLE_HEAD}>Measure</TableHead>
							<TableHead className={TABLE_HEAD}>Action Taken</TableHead>
							<TableHead className={TABLE_HEAD}>Closed On</TableHead>
							<TableHead className={cn(TABLE_HEAD, "pr-4")}>Closed By</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{QUALITY_GAP_CLOSURE_ACTIVITY.map((row) => (
							<TableRow key={row.id} className="border-b border-border/40 hover:bg-muted/20">
								<TableCell className={TABLE_CELL}>
									<Button variant="link" className={CMS_EDGE_TABLE_LINK_CLASS}>
										{row.memberId}
									</Button>
								</TableCell>
								<TableCell className={cn(TABLE_CELL, "font-mono font-medium")}>{row.measure}</TableCell>
								<TableCell className={TABLE_CELL}>{row.action}</TableCell>
								<TableCell className={cn(TABLE_CELL, "tabular-nums")}>{row.closedOn}</TableCell>
								<TableCell className={cn(TABLE_CELL, "pr-4 text-muted-foreground")}>{row.closedBy}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CmsEdgeTableScroll>
		</CmsEdgeSectionPanel>
	);
}

function NcqaSubmissionPanel() {
	const submission = QUALITY_NCQA_SUBMISSION;

	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="NCQA Submission Status"
			bodyClassName="flex min-h-0 flex-1 flex-col"
		>
			<div className="space-y-4 border-t border-border/50 px-4 py-4">
				<div className="flex flex-wrap items-center gap-2">
					{submission.steps.map((step, index) => (
						<div key={step.id} className="flex items-center gap-2">
							<div
								className={cn(
									"flex size-7 items-center justify-center rounded-full border text-[10px] font-semibold",
									step.state === "complete" && "border-emerald-300 bg-emerald-50 text-emerald-700",
									step.state === "active" && "border-violet-300 bg-violet-50 text-violet-800",
									step.state === "pending" && "border-border bg-muted/30 text-muted-foreground"
								)}
							>
								{step.state === "complete" ? <Check className="size-3.5" /> : index + 1}
							</div>
							<span
								className={cn(
									"text-[11px] font-medium",
									step.state === "active" ? "text-violet-800" : "text-muted-foreground"
								)}
							>
								{step.label}
							</span>
							{index < submission.steps.length - 1 ? (
								<div className="mx-1 hidden h-px w-6 bg-border sm:block" />
							) : null}
						</div>
					))}
				</div>

				<div className="rounded-lg border border-border/60 bg-muted/20 p-3">
					<p className="text-sm font-semibold text-foreground">{submission.title}</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Submission Window: {submission.window}
					</p>
					<span className={cn(CMS_EDGE_STATUS_PILL_CLASS, "mt-2 inline-flex", submission.statusStyle)}>
						{submission.status}
					</span>
				</div>

				<div className="space-y-2">
					<p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
						Documents
					</p>
					<ul className="space-y-2">
						{QUALITY_DOCUMENTS.map((doc) => (
							<li
								key={doc.id}
								className="flex items-center justify-between gap-2 rounded-md border border-border/50 bg-card px-3 py-2"
							>
								<div className="min-w-0">
									<p className="truncate text-xs font-medium text-primary">{doc.name}</p>
									<p className="text-[10px] text-muted-foreground">{doc.size}</p>
								</div>
								<Button
									variant="ghost"
									size="icon"
									className="size-7 shrink-0 text-primary"
									onClick={() => toast.success(`Download ${doc.name}`)}
								>
									<Download className="size-3.5" />
								</Button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</CmsEdgeSectionPanel>
	);
}

const QUICK_ACTION_ICONS: Record<string, LucideIcon> = {
	"qa-1": ClipboardList,
	"qa-2": Target,
	"qa-3": Send,
	"qa-4": Stethoscope,
	"qa-5": FileText,
	"qa-6": BarChart3,
};

function QuickActionsPanel() {
	return (
		<CmsEdgeSectionPanel title="Quick Actions">
			<div className="grid grid-cols-1 gap-3 border-t border-border/50 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
				{QUALITY_QUICK_ACTIONS.map((action) => {
					const Icon = QUICK_ACTION_ICONS[action.id] ?? FolderOpen;
					return (
						<button
							key={action.id}
							type="button"
							className="flex flex-col items-center gap-2 rounded-lg border border-border/70 bg-card p-4 text-center transition-colors hover:bg-muted/30"
							onClick={() => toast.message(action.title)}
						>
							<div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
								<Icon className="size-4" />
							</div>
							<div>
								<p className="text-xs font-semibold text-foreground">{action.title}</p>
								<p className="mt-1 text-[10px] leading-snug text-muted-foreground">
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

export function QualityPerformancePage() {
	return (
		<div className="space-y-4 pb-4">
			<ClaimPageHeader
				title="Quality Performance"
				description="Track HEDIS measure performance, gap closure, and NCQA submission readiness."
				actions={
					<Button size="sm" className="h-9" onClick={() => toast.success("Export queued")}>
						<Download className="mr-1.5 size-3.5" />
						Export
					</Button>
				}
			/>

			<div className={PAGE_STACK}>
				<KpiRow />

				<div className={cn("grid grid-cols-1 items-stretch lg:grid-cols-3", SECTION_GAP)}>
					<ComplianceTrendPanel />
					<TopMeasuresPanel />
					<GapStatusPanel />
				</div>

				<div className={cn("grid grid-cols-1 items-stretch lg:grid-cols-3", SECTION_GAP)}>
					<OpenGapsByMeasurePanel />
					<GapClosureActivityPanel />
					<NcqaSubmissionPanel />
				</div>

				<QuickActionsPanel />
				<CmsEdgePageFooter />
			</div>
		</div>
	);
}
