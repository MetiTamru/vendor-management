"use client";

import { type ReactNode, useState } from "react";

import {
	AlertTriangle,
	ArrowDownRight,
	ArrowUpRight,
	CalendarDays,
	CircleAlert,
	Download,
	FileText,
	Filter,
	Gauge,
	type LucideIcon,
	ShieldCheck,
} from "lucide-react";
import {
	Area,
	AreaChart,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
} from "recharts";

import { Button } from "@/components/ui/button";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
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
	CMS_EDGE_STATUS_PILL_CLASS,
	CMS_EDGE_TABLE_CLASS,
	CMS_EDGE_TABLE_CONTAINER,
	CmsEdgeSectionPanel,
	CmsEdgeTableScroll,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import {
	RQ_ALERTS,
	RQ_KPIS,
	RQ_MEASURE_DISTRIBUTION,
	RQ_OBLIGATIONS,
	RQ_OVERALL_SCORE,
	RQ_PROGRAM_COMPLIANCE,
	RQ_QUALITY_COMPOSITE,
	RQ_QUALITY_MEASURES,
	RQ_REPORTING_PERIODS,
	RQ_SUBMISSION_STATUS,
	RQ_TABS,
	RQ_TOTAL_MEASURES,
	type RqTab,
	rqAlertStatusPillClass,
	rqObligationPillClass,
	rqSeverityPillClass,
} from "@/features/admin/features/claim-encounter/executive-analytics/regulatory-quality-mock";
import { cn } from "@/lib/utils";

const PAGE_STACK = "space-y-4 pb-4";
const TABLE_HEAD =
	"h-9 bg-muted/30 px-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground";
const TABLE_CELL = "px-3 py-2.5 text-xs";

const KPI_ICONS: Record<string, LucideIcon> = {
	compliance: ShieldCheck,
	"on-track": CalendarDays,
	"at-risk": AlertTriangle,
	overdue: CircleAlert,
	submissions: FileText,
	quality: Gauge,
};

function PanelLink({ children }: { children: ReactNode }) {
	return (
		<Button
			variant="link"
			size="sm"
			className="h-7 px-0 text-xs font-medium text-primary"
		>
			{children}
		</Button>
	);
}

function DeltaHint({ delta, positive }: { delta: string; positive: boolean }) {
	const Icon = positive ? ArrowUpRight : ArrowDownRight;
	return (
		<span
			className={cn(
				"inline-flex items-center gap-0.5 text-[11px] font-medium",
				positive ? "text-emerald-700" : "text-red-600"
			)}
		>
			<Icon className="size-3" />
			{delta} vs prior period
		</span>
	);
}

function KpiCard({
	id,
	label,
	value,
	badge,
	badgeTone,
	delta,
	deltaPositive,
	iconTone,
}: {
	id: string;
	label: string;
	value: string;
	badge?: string;
	badgeTone?: "success";
	delta: string;
	deltaPositive: boolean;
	iconTone: string;
}) {
	const Icon = KPI_ICONS[id] ?? ShieldCheck;
	return (
		<div className="rounded-lg border border-border/70 bg-card p-3.5 shadow-sm">
			<div className="flex items-start gap-3">
				<div
					className={cn(
						"flex size-9 shrink-0 items-center justify-center rounded-full",
						iconTone
					)}
				>
					<Icon className="size-4" aria-hidden />
				</div>
				<div className="min-w-0 flex-1">
					<p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
						{label}
					</p>
					<div className="mt-1 flex flex-wrap items-baseline gap-2">
						<p className="text-xl font-bold tabular-nums leading-none text-foreground">
							{value}
						</p>
						{badge ? (
							<span
								className={cn(
									"text-[11px] font-semibold",
									badgeTone === "success"
										? "text-emerald-700"
										: "text-muted-foreground"
								)}
							>
								{badge}
							</span>
						) : null}
					</div>
					<div className="mt-1.5">
						<DeltaHint delta={delta} positive={deltaPositive} />
					</div>
				</div>
			</div>
		</div>
	);
}

function MiniSparkline({
	data,
	positive,
	id,
}: {
	data: readonly number[];
	positive: boolean;
	id: string;
}) {
	const chartData = data.map((value, index) => ({ index, value }));
	const color = positive ? "#16a34a" : "#dc2626";
	const config = { value: { label: "Trend", color } } satisfies ChartConfig;

	return (
		<ChartContainer config={config} className="aspect-auto h-8 w-16">
			<AreaChart
				data={chartData}
				margin={{ top: 2, right: 0, left: 0, bottom: 0 }}
			>
				<defs>
					<linearGradient id={`rq-spark-${id}`} x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="5%"
							stopColor="var(--color-value)"
							stopOpacity={0.35}
						/>
						<stop
							offset="95%"
							stopColor="var(--color-value)"
							stopOpacity={0.05}
						/>
					</linearGradient>
				</defs>
				<Area
					type="monotone"
					dataKey="value"
					stroke="var(--color-value)"
					strokeWidth={1.5}
					fill={`url(#rq-spark-${id})`}
					dot={false}
					isAnimationActive={false}
				/>
			</AreaChart>
		</ChartContainer>
	);
}

function QualityGauge() {
	const { score, maxScore, label, delta, deltaPositive } = RQ_QUALITY_COMPOSITE;
	const filled = Math.round((score / maxScore) * 100);
	const gaugeData = [
		{ name: "score", value: filled, fill: "#22c55e" },
		{ name: "rest", value: 100 - filled, fill: "#e5e7eb" },
	];

	return (
		<div className="flex flex-col items-center justify-center px-2 py-2">
			<p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
				Quality Composite Score
			</p>
			<div className="relative mt-1 h-[70px] w-full max-w-[140px]">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={gaugeData}
							dataKey="value"
							startAngle={180}
							endAngle={0}
							innerRadius="62%"
							outerRadius="100%"
							cy="100%"
							stroke="none"
							isAnimationActive={false}
						>
							{gaugeData.map((entry) => (
								<Cell key={entry.name} fill={entry.fill} />
							))}
						</Pie>
					</PieChart>
				</ResponsiveContainer>
			</div>
			<div className="-mt-1 text-center">
				<p className="text-lg font-bold tabular-nums leading-none text-foreground">
					{score}/{maxScore}
				</p>
				<p className="mt-0.5 text-[11px] font-semibold text-emerald-700">
					{label}
				</p>
				<div className="mt-1">
					<DeltaHint delta={delta} positive={deltaPositive} />
				</div>
			</div>
		</div>
	);
}

function ProgramComplianceDonut() {
	const chartData = RQ_PROGRAM_COMPLIANCE.map((item) => ({
		name: item.name,
		value: item.score,
		fill: item.color,
	}));

	return (
		<div className="flex flex-col items-center gap-3 px-3 py-3 sm:flex-row sm:items-center">
			<div className="relative h-[140px] w-[140px] shrink-0">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={chartData}
							dataKey="value"
							nameKey="name"
							innerRadius="55%"
							outerRadius="88%"
							paddingAngle={2}
							stroke="none"
							isAnimationActive={false}
						>
							{chartData.map((entry) => (
								<Cell key={entry.name} fill={entry.fill} />
							))}
						</Pie>
					</PieChart>
				</ResponsiveContainer>
				<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
					<p className="text-lg font-bold tabular-nums leading-none">
						{RQ_OVERALL_SCORE}
					</p>
					<p className="mt-0.5 text-[10px] text-muted-foreground">
						Overall Score
					</p>
				</div>
			</div>
			<ul className="min-w-0 flex-1 space-y-1.5 text-xs">
				{RQ_PROGRAM_COMPLIANCE.map((item) => (
					<li
						key={item.name}
						className="flex items-center justify-between gap-2"
					>
						<span className="flex min-w-0 items-center gap-1.5 font-medium">
							<span
								className="size-2 shrink-0 rounded-full"
								style={{ backgroundColor: item.color }}
							/>
							<span className="truncate">{item.name}</span>
						</span>
						<span className="shrink-0 tabular-nums text-muted-foreground">
							{item.score}/100
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}

function MeasureDistributionDonut() {
	return (
		<div className="flex flex-col items-center gap-3 px-3 py-3 sm:flex-row sm:items-center">
			<div className="relative h-[140px] w-[140px] shrink-0">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={RQ_MEASURE_DISTRIBUTION}
							dataKey="value"
							nameKey="name"
							innerRadius="55%"
							outerRadius="88%"
							paddingAngle={2}
							stroke="none"
							isAnimationActive={false}
						>
							{RQ_MEASURE_DISTRIBUTION.map((entry) => (
								<Cell key={entry.name} fill={entry.color} />
							))}
						</Pie>
					</PieChart>
				</ResponsiveContainer>
				<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
					<p className="text-lg font-bold tabular-nums leading-none">
						{RQ_TOTAL_MEASURES}
					</p>
					<p className="mt-0.5 text-[10px] text-muted-foreground">
						Total Measures
					</p>
				</div>
			</div>
			<ul className="min-w-0 flex-1 space-y-1.5 text-xs">
				{RQ_MEASURE_DISTRIBUTION.map((item) => (
					<li
						key={item.name}
						className="flex items-center justify-between gap-2"
					>
						<span className="flex min-w-0 items-center gap-1.5 font-medium">
							<span
								className="size-2 shrink-0 rounded-full"
								style={{ backgroundColor: item.color }}
							/>
							<span className="truncate">{item.name}</span>
						</span>
						<span className="shrink-0 tabular-nums text-muted-foreground">
							{item.value} <span className="text-[10px]">({item.pct})</span>
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}

function RegulatoryOverviewContent() {
	return (
		<div className="space-y-4">
			{/* KPI row */}
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
				{RQ_KPIS.map((kpi) => (
					<KpiCard key={kpi.id} {...kpi} />
				))}
			</div>

			{/* Middle row */}
			<div className="grid gap-3 xl:grid-cols-3">
				<CmsEdgeSectionPanel
					title="Upcoming Compliance Obligations"
					action={<PanelLink>View Calendar</PanelLink>}
					bodyClassName="p-0"
					footer={
						<div className="border-t border-border/50 px-4 py-2.5">
							<PanelLink>View All Obligations →</PanelLink>
						</div>
					}
				>
					<CmsEdgeTableScroll>
						<Table
							className={CMS_EDGE_TABLE_CLASS}
							containerClassName={CMS_EDGE_TABLE_CONTAINER}
						>
							<TableHeader>
								<TableRow>
									<TableHead className={TABLE_HEAD}>Obligation</TableHead>
									<TableHead className={TABLE_HEAD}>Program</TableHead>
									<TableHead className={TABLE_HEAD}>Due Date</TableHead>
									<TableHead className={TABLE_HEAD}>Days Left</TableHead>
									<TableHead className={TABLE_HEAD}>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{RQ_OBLIGATIONS.map((row) => (
									<TableRow key={row.id}>
										<TableCell className={cn(TABLE_CELL, "font-medium")}>
											{row.obligation}
										</TableCell>
										<TableCell className={TABLE_CELL}>{row.program}</TableCell>
										<TableCell className={cn(TABLE_CELL, "tabular-nums")}>
											{row.dueDate}
										</TableCell>
										<TableCell
											className={cn(
												TABLE_CELL,
												"tabular-nums font-medium",
												row.daysLeft < 0 ? "text-red-600" : "text-foreground"
											)}
										>
											{row.daysLeft}
										</TableCell>
										<TableCell className={TABLE_CELL}>
											<span
												className={cn(
													CMS_EDGE_STATUS_PILL_CLASS,
													rqObligationPillClass(row.status)
												)}
											>
												{row.status}
											</span>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CmsEdgeTableScroll>
				</CmsEdgeSectionPanel>

				<CmsEdgeSectionPanel
					title="Regulatory Compliance by Program"
					bodyClassName="p-0"
					footer={
						<div className="border-t border-border/50 px-4 py-2.5">
							<PanelLink>View Program Details →</PanelLink>
						</div>
					}
				>
					<ProgramComplianceDonut />
				</CmsEdgeSectionPanel>

				<CmsEdgeSectionPanel
					title="Regulatory Submission Status"
					action={<PanelLink>View All</PanelLink>}
					bodyClassName="p-0"
					footer={
						<div className="border-t border-border/50 px-4 py-2.5">
							<PanelLink>View Submission Details →</PanelLink>
						</div>
					}
				>
					<CmsEdgeTableScroll>
						<Table
							className={CMS_EDGE_TABLE_CLASS}
							containerClassName={CMS_EDGE_TABLE_CONTAINER}
						>
							<TableHeader>
								<TableRow>
									<TableHead className={TABLE_HEAD}>Program</TableHead>
									<TableHead className={TABLE_HEAD}>Completed</TableHead>
									<TableHead className={TABLE_HEAD}>On Time</TableHead>
									<TableHead className={TABLE_HEAD}>Late</TableHead>
									<TableHead className={TABLE_HEAD}>Acceptance</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{RQ_SUBMISSION_STATUS.map((row) => (
									<TableRow key={row.program}>
										<TableCell className={cn(TABLE_CELL, "font-medium")}>
											{row.program}
										</TableCell>
										<TableCell className={cn(TABLE_CELL, "tabular-nums")}>
											{row.completed}
										</TableCell>
										<TableCell className={cn(TABLE_CELL, "tabular-nums")}>
											{row.onTime}
										</TableCell>
										<TableCell className={cn(TABLE_CELL, "tabular-nums")}>
											{row.late}
										</TableCell>
										<TableCell
											className={cn(TABLE_CELL, "tabular-nums font-medium")}
										>
											{row.acceptance}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CmsEdgeTableScroll>
				</CmsEdgeSectionPanel>
			</div>

			{/* Quality row */}
			<div className="grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
				<CmsEdgeSectionPanel
					title="Quality Performance Summary"
					action={<PanelLink>View All Measures</PanelLink>}
					bodyClassName="p-0"
					footer={
						<div className="border-t border-border/50 px-4 py-2.5">
							<PanelLink>View Quality Dashboard →</PanelLink>
						</div>
					}
				>
					<div className="grid gap-0 lg:grid-cols-[180px_minmax(0,1fr)]">
						<div className="border-b border-border/40 p-2 lg:border-b-0 lg:border-r">
							<QualityGauge />
						</div>
						<CmsEdgeTableScroll>
							<Table
								className={CMS_EDGE_TABLE_CLASS}
								containerClassName={CMS_EDGE_TABLE_CONTAINER}
							>
								<TableHeader>
									<TableRow>
										<TableHead className={TABLE_HEAD}>Measure</TableHead>
										<TableHead className={TABLE_HEAD}>Current</TableHead>
										<TableHead className={TABLE_HEAD}>Target</TableHead>
										<TableHead className={TABLE_HEAD}>vs Target</TableHead>
										<TableHead className={TABLE_HEAD}>Trend</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{RQ_QUALITY_MEASURES.map((row) => (
										<TableRow key={row.id}>
											<TableCell className={cn(TABLE_CELL, "font-medium")}>
												{row.measure}
											</TableCell>
											<TableCell className={cn(TABLE_CELL, "tabular-nums")}>
												{row.current}
											</TableCell>
											<TableCell className={cn(TABLE_CELL, "tabular-nums")}>
												{row.target}
											</TableCell>
											<TableCell
												className={cn(
													TABLE_CELL,
													"tabular-nums font-medium",
													row.vsPositive ? "text-emerald-700" : "text-red-600"
												)}
											>
												{row.vsTarget}
											</TableCell>
											<TableCell className={TABLE_CELL}>
												<MiniSparkline
													id={row.id}
													data={row.sparkline}
													positive={row.vsPositive}
												/>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CmsEdgeTableScroll>
					</div>
				</CmsEdgeSectionPanel>

				<CmsEdgeSectionPanel
					title="Quality Measure Performance Distribution"
					bodyClassName="p-0"
					footer={
						<div className="border-t border-border/50 px-4 py-2.5">
							<PanelLink>View All Measures →</PanelLink>
						</div>
					}
				>
					<MeasureDistributionDonut />
				</CmsEdgeSectionPanel>
			</div>

			{/* Alerts */}
			<CmsEdgeSectionPanel
				title="Regulatory & Quality Alerts"
				bodyClassName="p-0"
				footer={
					<div className="flex justify-end border-t border-border/50 px-4 py-2.5">
						<PanelLink>View All Alerts →</PanelLink>
					</div>
				}
			>
				<CmsEdgeTableScroll>
					<Table
						className={CMS_EDGE_TABLE_CLASS}
						containerClassName={CMS_EDGE_TABLE_CONTAINER}
					>
						<TableHeader>
							<TableRow>
								<TableHead className={cn(TABLE_HEAD, "min-w-[220px]")}>
									Alert
								</TableHead>
								<TableHead className={TABLE_HEAD}>Category</TableHead>
								<TableHead className={TABLE_HEAD}>Program</TableHead>
								<TableHead className={TABLE_HEAD}>Severity</TableHead>
								<TableHead className={TABLE_HEAD}>Detected On</TableHead>
								<TableHead className={TABLE_HEAD}>Impact</TableHead>
								<TableHead className={TABLE_HEAD}>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{RQ_ALERTS.map((row) => (
								<TableRow key={row.id}>
									<TableCell className={cn(TABLE_CELL, "font-medium")}>
										{row.alert}
									</TableCell>
									<TableCell className={TABLE_CELL}>{row.category}</TableCell>
									<TableCell className={TABLE_CELL}>{row.program}</TableCell>
									<TableCell className={TABLE_CELL}>
										<span
											className={cn(
												CMS_EDGE_STATUS_PILL_CLASS,
												rqSeverityPillClass(row.severity)
											)}
										>
											{row.severity}
										</span>
									</TableCell>
									<TableCell className={cn(TABLE_CELL, "tabular-nums")}>
										{row.detectedOn}
									</TableCell>
									<TableCell className={TABLE_CELL}>{row.impact}</TableCell>
									<TableCell className={TABLE_CELL}>
										<span
											className={cn(
												CMS_EDGE_STATUS_PILL_CLASS,
												rqAlertStatusPillClass(row.status)
											)}
										>
											{row.status}
										</span>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CmsEdgeTableScroll>
			</CmsEdgeSectionPanel>
		</div>
	);
}

function TabPlaceholder({ label }: { label: string }) {
	return (
		<div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-border/70 bg-card p-8 text-center shadow-sm">
			<p className="text-sm font-semibold text-foreground">{label}</p>
			<p className="mt-1 max-w-md text-xs text-muted-foreground">
				Filtered regulatory and quality metrics for this program will appear
				here. Use Regulatory Overview for the full enterprise summary.
			</p>
		</div>
	);
}

export function RegulatoryQualityPage() {
	const [tab, setTab] = useState<RqTab>("regulatory-overview");

	return (
		<div className={PAGE_STACK}>
			{/* Header */}
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="min-w-0 space-y-1">
					<h1 className="text-2xl font-bold tracking-tight text-foreground">
						Regulatory & Quality
					</h1>
					<p className="text-sm text-muted-foreground">
						Regulatory compliance status and quality performance overview
					</p>
				</div>
				<div className="flex flex-wrap items-end gap-2">
					<div className="flex flex-col gap-1">
						<span className="text-[11px] font-medium text-muted-foreground">
							Reporting Period
						</span>
						<Select defaultValue="apr-2025">
							<SelectTrigger className="h-9 w-[180px] bg-card text-xs shadow-sm">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{RQ_REPORTING_PERIODS.map((period) => (
									<SelectItem key={period.id} value={period.id}>
										{period.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<Button
						variant="outline"
						size="sm"
						className="h-9 gap-1.5 bg-card text-xs shadow-sm"
					>
						<Filter className="size-3.5" />
						Filters
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="h-9 gap-1.5 bg-card text-xs shadow-sm"
					>
						<Download className="size-3.5" />
						Export
					</Button>
				</div>
			</div>

			{/* In-page tabs */}
			<div className="overflow-x-auto border-b border-border/70">
				<nav className="inline-flex min-w-full gap-0">
					{RQ_TABS.map((item) => (
						<button
							key={item.id}
							type="button"
							onClick={() => setTab(item.id)}
							className={cn(
								"shrink-0 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors",
								tab === item.id
									? "border-primary bg-primary/10 text-primary"
									: "border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground"
							)}
						>
							{item.label}
						</button>
					))}
				</nav>
			</div>

			{tab === "regulatory-overview" ? (
				<RegulatoryOverviewContent />
			) : (
				<TabPlaceholder
					label={RQ_TABS.find((t) => t.id === tab)?.label ?? tab}
				/>
			)}
		</div>
	);
}
