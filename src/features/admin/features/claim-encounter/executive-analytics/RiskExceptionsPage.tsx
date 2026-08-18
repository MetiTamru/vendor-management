"use client";

import { type ReactNode } from "react";

import {
	AlertTriangle,
	ArrowDownRight,
	ArrowUpRight,
	CheckCircle2,
	CircleAlert,
	Clock,
	DollarSign,
	Download,
	Filter,
	LineChart,
	type LucideIcon,
} from "lucide-react";
import {
	CartesianGrid,
	Cell,
	Line,
	Pie,
	PieChart,
	LineChart as RechartsLineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
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
	RE_ALERTS,
	RE_COMPARE_PERIODS,
	RE_EXCEPTION_CATEGORIES,
	RE_FINANCIAL_IMPACT,
	RE_KPIS,
	RE_RAF_GAUGE,
	RE_RAF_OPPORTUNITY,
	RE_RAF_TREND,
	RE_REPORTING_PERIODS,
	RE_SEVERITY_BARS,
	RE_TOP_EXCEPTIONS,
	RE_TOTAL_EXCEPTIONS,
	type ReAlertTone,
	reSeverityPillClass,
	reStatusPillClass,
} from "@/features/admin/features/claim-encounter/executive-analytics/feature/queries/useExecutiveAnalyticsQuery";
import { cn } from "@/lib/utils";

const PAGE_STACK = "space-y-4 pb-4";
const TABLE_HEAD =
	"h-9 bg-muted/30 px-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground";
const TABLE_CELL = "px-3 py-2.5 text-xs";

const KPI_ICONS: Record<string, LucideIcon> = {
	"high-risk": AlertTriangle,
	exceptions: CircleAlert,
	pending: Clock,
	financial: DollarSign,
	"ra-impact": CheckCircle2,
	raf: LineChart,
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
	hint,
	delta,
	deltaPositive,
	iconTone,
}: {
	id: string;
	label: string;
	value: string;
	hint: string;
	delta: string;
	deltaPositive: boolean;
	iconTone: string;
}) {
	const Icon = KPI_ICONS[id] ?? AlertTriangle;
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
					<p className="mt-1 text-xl font-bold tabular-nums leading-none text-foreground">
						{value}
					</p>
					<p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
					<div className="mt-1.5">
						<DeltaHint delta={delta} positive={deltaPositive} />
					</div>
				</div>
			</div>
		</div>
	);
}

function AlertIcon({ tone }: { tone: ReAlertTone }) {
	if (tone === "critical") {
		return (
			<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-700">
				!
			</div>
		);
	}
	if (tone === "warning") {
		return (
			<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-700">
				!
			</div>
		);
	}
	return (
		<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[10px] font-bold text-sky-700">
			i
		</div>
	);
}

export function RiskExceptionsPage() {
	const financialMax = Math.max(
		...RE_FINANCIAL_IMPACT.categories.map((c) => c.amount)
	);

	return (
		<div className={PAGE_STACK}>
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="min-w-0 space-y-1">
					<h1 className="text-2xl font-bold tracking-tight text-foreground">
						Risk & Exceptions
					</h1>
					<p className="text-sm text-muted-foreground">
						Risk adjustment performance and exception management overview
					</p>
				</div>
				<div className="flex flex-wrap items-end gap-2">
					<div className="flex flex-col gap-1">
						<span className="text-[11px] font-medium text-muted-foreground">
							Reporting Period
						</span>
						<Select defaultValue="may-2025">
							<SelectTrigger className="h-9 w-[180px] bg-card text-xs shadow-sm">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{RE_REPORTING_PERIODS.map((p) => (
									<SelectItem key={p.id} value={p.id}>
										{p.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-[11px] font-medium text-muted-foreground">
							Compare To
						</span>
						<Select defaultValue="apr-2025">
							<SelectTrigger className="h-9 w-[180px] bg-card text-xs shadow-sm">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{RE_COMPARE_PERIODS.map((p) => (
									<SelectItem key={p.id} value={p.id}>
										{p.label}
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

			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
				{RE_KPIS.map((kpi) => (
					<KpiCard key={kpi.id} {...kpi} />
				))}
			</div>

			{/* Charts row */}
			<div className="grid gap-3 xl:grid-cols-3">
				<CmsEdgeSectionPanel
					title="Risk Adjustment Performance"
					bodyClassName="space-y-3 p-3"
					footer={
						<div className="border-t border-border/50 px-4 py-2.5">
							<PanelLink>View Risk Adjustment Dashboard →</PanelLink>
						</div>
					}
				>
					<div className="flex items-center justify-center gap-2 rounded-md border border-border/40 bg-muted/20 px-3 py-2">
						<p className="text-2xl font-bold tabular-nums text-foreground">
							{RE_RAF_GAUGE.score}
						</p>
						<DeltaHint
							delta={RE_RAF_GAUGE.delta}
							positive={RE_RAF_GAUGE.deltaPositive}
						/>
					</div>
					<div>
						<p className="mb-1 text-[11px] font-semibold text-muted-foreground">
							RAF Score Trend
						</p>
						<div className="h-[160px] w-full">
							<ResponsiveContainer width="100%" height="100%">
								<RechartsLineChart
									data={RE_RAF_TREND}
									margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
								>
									<CartesianGrid
										strokeDasharray="3 3"
										className="stroke-border/40"
										vertical={false}
									/>
									<XAxis
										dataKey="month"
										tick={{ fontSize: 10 }}
										axisLine={false}
										tickLine={false}
									/>
									<YAxis
										domain={[1.08, 1.16]}
										tick={{ fontSize: 10 }}
										width={36}
										axisLine={false}
										tickLine={false}
									/>
									<Tooltip />
									<Line
										type="monotone"
										dataKey="score"
										stroke="hsl(var(--primary))"
										strokeWidth={2}
										dot={{ r: 3 }}
										isAnimationActive={false}
									/>
								</RechartsLineChart>
							</ResponsiveContainer>
						</div>
					</div>
				</CmsEdgeSectionPanel>

				<CmsEdgeSectionPanel
					title="Open Exceptions by Category"
					bodyClassName="p-3"
					footer={
						<div className="border-t border-border/50 px-4 py-2.5">
							<PanelLink>View All Exceptions →</PanelLink>
						</div>
					}
				>
					<div className="flex flex-col items-center gap-3 sm:flex-row">
						<div className="relative h-[140px] w-[140px] shrink-0">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={RE_EXCEPTION_CATEGORIES}
										dataKey="value"
										nameKey="name"
										innerRadius="55%"
										outerRadius="88%"
										paddingAngle={2}
										stroke="none"
										isAnimationActive={false}
									>
										{RE_EXCEPTION_CATEGORIES.map((entry) => (
											<Cell key={entry.name} fill={entry.color} />
										))}
									</Pie>
								</PieChart>
							</ResponsiveContainer>
							<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
								<p className="text-lg font-bold tabular-nums">
									{RE_TOTAL_EXCEPTIONS}
								</p>
								<p className="text-[10px] text-muted-foreground">Total</p>
							</div>
						</div>
						<ul className="min-w-0 flex-1 space-y-1.5 text-xs">
							{RE_EXCEPTION_CATEGORIES.map((item) => (
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
										{item.value}{" "}
										<span className="text-[10px]">({item.pct})</span>
									</span>
								</li>
							))}
						</ul>
					</div>
				</CmsEdgeSectionPanel>

				<CmsEdgeSectionPanel
					title="Exceptions by Severity"
					bodyClassName="space-y-3 p-4"
					footer={
						<div className="border-t border-border/50 px-4 py-2.5">
							<PanelLink>View Exception Details →</PanelLink>
						</div>
					}
				>
					{RE_SEVERITY_BARS.map((row) => (
						<div key={row.name} className="space-y-1">
							<div className="flex items-center justify-between text-xs">
								<span className="font-medium text-foreground">{row.name}</span>
								<span className="tabular-nums text-muted-foreground">
									{row.count} <span className="text-[10px]">({row.pct})</span>
								</span>
							</div>
							<div className="h-2.5 overflow-hidden rounded-full bg-muted/80">
								<div
									className="h-full rounded-full"
									style={{
										width: `${(row.count / row.max) * 100}%`,
										backgroundColor: row.color,
									}}
								/>
							</div>
						</div>
					))}
				</CmsEdgeSectionPanel>
			</div>

			{/* Exceptions + financial */}
			<div className="grid gap-3 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
				<CmsEdgeSectionPanel
					title="Top Exceptions Requiring Attention"
					bodyClassName="p-0"
					footer={
						<div className="border-t border-border/50 px-4 py-2.5">
							<PanelLink>View All Exceptions →</PanelLink>
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
									<TableHead className={cn(TABLE_HEAD, "min-w-[200px]")}>
										Exception / Issue
									</TableHead>
									<TableHead className={TABLE_HEAD}>Category</TableHead>
									<TableHead className={TABLE_HEAD}>Severity</TableHead>
									<TableHead className={TABLE_HEAD}>Detected On</TableHead>
									<TableHead className={TABLE_HEAD}>Impact (Est.)</TableHead>
									<TableHead className={TABLE_HEAD}>Status</TableHead>
									<TableHead className={TABLE_HEAD}>Owner</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{RE_TOP_EXCEPTIONS.map((row) => (
									<TableRow key={row.id}>
										<TableCell className={cn(TABLE_CELL, "font-medium")}>
											{row.issue}
										</TableCell>
										<TableCell className={TABLE_CELL}>{row.category}</TableCell>
										<TableCell className={TABLE_CELL}>
											<span
												className={cn(
													CMS_EDGE_STATUS_PILL_CLASS,
													reSeverityPillClass(row.severity)
												)}
											>
												{row.severity}
											</span>
										</TableCell>
										<TableCell className={cn(TABLE_CELL, "tabular-nums")}>
											{row.detectedOn}
										</TableCell>
										<TableCell
											className={cn(TABLE_CELL, "tabular-nums font-medium")}
										>
											{row.impact}
										</TableCell>
										<TableCell className={TABLE_CELL}>
											<span
												className={cn(
													CMS_EDGE_STATUS_PILL_CLASS,
													reStatusPillClass(row.status)
												)}
											>
												{row.status}
											</span>
										</TableCell>
										<TableCell className={TABLE_CELL}>{row.owner}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CmsEdgeTableScroll>
				</CmsEdgeSectionPanel>

				<CmsEdgeSectionPanel
					title="Financial Impact by Category"
					bodyClassName="space-y-4 p-4"
					footer={
						<div className="border-t border-border/50 px-4 py-2.5">
							<PanelLink>View Financial Impact Report →</PanelLink>
						</div>
					}
				>
					<div>
						<p className="text-2xl font-bold tabular-nums text-foreground">
							{RE_FINANCIAL_IMPACT.total}
						</p>
						<p className="text-xs text-muted-foreground">
							Total Potential Impact
						</p>
						<div className="mt-1">
							<DeltaHint
								delta={RE_FINANCIAL_IMPACT.delta}
								positive={RE_FINANCIAL_IMPACT.deltaPositive}
							/>
						</div>
					</div>
					<div className="space-y-3">
						{RE_FINANCIAL_IMPACT.categories.map((row) => (
							<div key={row.name} className="space-y-1">
								<div className="flex items-center justify-between text-xs">
									<span className="font-medium text-foreground">
										{row.name}
									</span>
									<span className="tabular-nums font-semibold">
										{row.label}
									</span>
								</div>
								<div className="h-2.5 overflow-hidden rounded-full bg-muted/80">
									<div
										className="h-full rounded-full"
										style={{
											width: `${(row.amount / financialMax) * 100}%`,
											backgroundColor: row.color,
										}}
									/>
								</div>
							</div>
						))}
					</div>
				</CmsEdgeSectionPanel>
			</div>

			{/* Opportunity + alerts */}
			<div className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
				<CmsEdgeSectionPanel
					title="Risk Adjustment Opportunity Summary"
					bodyClassName="p-4"
					footer={
						<div className="border-t border-border/50 px-4 py-2.5">
							<PanelLink>View RAF Opportunity Dashboard →</PanelLink>
						</div>
					}
				>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
						{RE_RAF_OPPORTUNITY.map((item) => (
							<div
								key={item.label}
								className="rounded-lg border border-border/50 bg-muted/15 px-3 py-3 text-center"
							>
								<p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
									{item.label}
								</p>
								<p
									className={cn(
										"mt-1.5 text-lg font-bold tabular-nums",
										item.tone === "danger" ? "text-red-600" : "text-foreground"
									)}
								>
									{item.value}
								</p>
							</div>
						))}
					</div>
				</CmsEdgeSectionPanel>

				<CmsEdgeSectionPanel
					title="Recent Risk & Exception Alerts"
					action={<PanelLink>View All Alerts →</PanelLink>}
					bodyClassName="p-0"
				>
					<ul className="divide-y divide-border/40">
						{RE_ALERTS.map((alert) => (
							<li
								key={alert.id}
								className="flex items-start gap-2.5 px-4 py-2.5"
							>
								<AlertIcon tone={alert.tone} />
								<div className="min-w-0 flex-1">
									<p className="text-xs font-semibold leading-snug text-foreground">
										{alert.title}
									</p>
									<p className="mt-0.5 text-[10px] text-muted-foreground">
										{alert.time}
									</p>
								</div>
								<span
									className={cn(
										CMS_EDGE_STATUS_PILL_CLASS,
										reStatusPillClass(alert.status),
										"shrink-0 text-[10px]"
									)}
								>
									{alert.status}
								</span>
							</li>
						))}
					</ul>
				</CmsEdgeSectionPanel>
			</div>
		</div>
	);
}
