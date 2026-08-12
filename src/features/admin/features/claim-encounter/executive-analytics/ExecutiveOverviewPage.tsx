"use client";

import { type ReactNode } from "react";

import {
	ArrowDownRight,
	ArrowUpRight,
	Briefcase,
	Building2,
	Ellipsis,
	FileCheck,
	Filter,
	HeartPulse,
	RefreshCw,
	Scale,
	ShieldCheck,
	Users,
	type LucideIcon,
} from "lucide-react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart as RechartsLineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
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
	CmsEdgeTripleRow,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import {
	EXECUTIVE_ACCEPTANCE_TARGET,
	EXECUTIVE_ACCEPTANCE_TREND,
	EXECUTIVE_ALERTS,
	EXECUTIVE_COMPARE_PERIODS,
	EXECUTIVE_COMPLIANCE_OBLIGATIONS,
	EXECUTIVE_DATA_AS_OF,
	EXECUTIVE_DOMAINS,
	EXECUTIVE_KPIS,
	EXECUTIVE_OPERATIONAL_HEALTH,
	EXECUTIVE_REPORTING_PERIODS,
	EXECUTIVE_TOP_VENDORS,
	executiveStatusPillClass,
	type ExecutiveAlertSeverity,
	type ExecutiveDomain,
} from "@/features/admin/features/claim-encounter/executive-analytics/mock-data";
import { cn } from "@/lib/utils";

const PAGE_STACK = "space-y-4 pb-4";
const KPI_CARD =
	"relative flex min-h-[140px] flex-col overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm";
const TABLE_HEAD =
	"h-9 bg-muted/30 px-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground";
const TABLE_CELL = "px-3 py-2.5 text-xs";

const DOMAIN_ICONS: Record<string, LucideIcon> = {
	vendor: Briefcase,
	claims: FileCheck,
	regulatory: ShieldCheck,
	quality: HeartPulse,
	risk: Scale,
	members: Users,
};

function PanelLink({ children }: { children: ReactNode }) {
	return (
		<Button variant="link" size="sm" className="h-7 px-0 text-xs font-medium text-primary">
			{children}
		</Button>
	);
}

function DeltaHint({
	delta,
	positive,
	suffix = "vs prior period",
	useBlue = false,
}: {
	delta: string;
	positive: boolean;
	suffix?: string;
	useBlue?: boolean;
}) {
	const Icon = positive ? ArrowUpRight : ArrowDownRight;
	const tone = positive
		? useBlue
			? "text-primary"
			: "text-emerald-700"
		: "text-red-600";

	return (
		<span className={cn("inline-flex items-center gap-0.5 text-[11px] font-medium", tone)}>
			<Icon className="size-3" />
			{delta} {suffix}
		</span>
	);
}

function KpiAreaChart({
	data,
	id,
	variant = "primary",
}: {
	data: readonly number[];
	id: string;
	variant?: "primary" | "danger";
}) {
	const chartData = data.map((value, index) => ({ index, value }));
	const color = variant === "danger" ? "hsl(var(--destructive))" : "hsl(var(--primary))";
	const config = {
		value: { label: "Value", color },
	} satisfies ChartConfig;

	return (
		<ChartContainer
			config={config}
			className="pointer-events-none absolute inset-x-0 bottom-5 aspect-auto h-[52px] w-full"
		>
			<AreaChart data={chartData} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
				<defs>
					<linearGradient id={`kpi-fill-${id}`} x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.35} />
						<stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.05} />
					</linearGradient>
				</defs>
				<Area
					type="monotone"
					dataKey="value"
					stroke="var(--color-value)"
					strokeWidth={2}
					fill={`url(#kpi-fill-${id})`}
					dot={false}
					isAnimationActive={false}
				/>
			</AreaChart>
		</ChartContainer>
	);
}

function buildGaugeData(score: number) {
	const colors = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];
	const segmentValue = score / colors.length;
	const filled = colors.map((fill, index) => ({
		name: `filled-${index}`,
		value: segmentValue,
		fill,
	}));
	const remainder = 100 - score;
	return [...filled, { name: "remainder", value: remainder, fill: "#e8edf2" }];
}

function OperationalHealthGauge() {
	const { score, maxScore, label, deltaPts } = EXECUTIVE_OPERATIONAL_HEALTH;
	const gaugeData = buildGaugeData(score);

	return (
		<div className={cn(KPI_CARD, "p-3")}>
			<p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
				Overall Operational Health
			</p>
			<div className="flex flex-1 flex-col items-center justify-center py-1">
				<div className="h-[58px] w-full max-w-[132px]">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={gaugeData}
								dataKey="value"
								startAngle={180}
								endAngle={0}
								innerRadius="68%"
								outerRadius="100%"
								cy="100%"
								stroke="none"
								isAnimationActive={false}
							/>
						</PieChart>
					</ResponsiveContainer>
				</div>
				<div className="-mt-1 text-center">
					<p className="text-lg font-bold tabular-nums leading-none text-foreground">
						{score}/{maxScore}
					</p>
					<p className="mt-0.5 text-[11px] font-semibold text-emerald-700">{label}</p>
				</div>
			</div>
			<div className="relative z-10 mt-auto">
				<DeltaHint delta={`+ ${deltaPts} pts`} positive />
			</div>
		</div>
	);
}

function KpiSparkCard({
	id,
	label,
	value,
	delta,
	deltaPositive,
	sparkline,
}: {
	id: string;
	label: string;
	value: string;
	delta: string;
	deltaPositive: boolean;
	sparkline: readonly number[];
}) {
	return (
		<div className={cn(KPI_CARD, "p-3")}>
			<KpiAreaChart
				data={sparkline}
				id={id}
				variant={deltaPositive ? "primary" : "danger"}
			/>
			<div className="relative z-10 mt-1">
				<p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
					{label}
				</p>
				<p className="mt-1 text-2xl font-bold tabular-nums leading-none tracking-tight text-foreground">
					{value}
				</p>
			</div>
			<div className="relative z-10 mt-auto pt-1">
				<DeltaHint delta={delta} positive={deltaPositive} useBlue={deltaPositive} />
			</div>
		</div>
	);
}

function DomainRow({ domain }: { domain: ExecutiveDomain }) {
	const Icon = DOMAIN_ICONS[domain.id] ?? Building2;
	const deltaPositive = domain.deltaPts >= 0;
	const deltaLabel = `${deltaPositive ? "+" : ""}${domain.deltaPts} pt${Math.abs(domain.deltaPts) === 1 ? "" : "s"}`;

	return (
		<div className="flex items-center gap-2.5 border-b border-border/40 px-4 py-2.5 last:border-b-0">
			<div
				className={cn(
					"flex size-7 shrink-0 items-center justify-center rounded-md",
					domain.iconTone
				)}
			>
				<Icon className="size-3.5" aria-hidden />
			</div>
			<p className="w-[128px] shrink-0 truncate text-xs font-semibold text-foreground sm:w-[148px] sm:text-sm">
				{domain.name}
			</p>
			<span
				className={cn(
					"shrink-0",
					CMS_EDGE_STATUS_PILL_CLASS,
					executiveStatusPillClass(domain.status)
				)}
			>
				{domain.status}
			</span>
			<div className="relative min-w-[72px] flex-1">
				<span
					className={cn(
						"absolute -top-3.5 right-0 text-[10px] font-semibold tabular-nums",
						deltaPositive ? "text-emerald-700" : "text-red-600"
					)}
				>
					{deltaLabel}
				</span>
				<div className="h-2 overflow-hidden rounded-full bg-muted/80">
					<div
						className={cn("h-full rounded-full", domain.progressTone)}
						style={{ width: `${domain.score}%` }}
					/>
				</div>
			</div>
			<span className="w-11 shrink-0 text-right text-xs font-semibold tabular-nums text-foreground">
				{domain.score}/{domain.maxScore}
			</span>
		</div>
	);
}

function AlertIcon({ severity }: { severity: ExecutiveAlertSeverity }) {
	if (severity === "critical") {
		return (
			<div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red-100">
				<span className="text-[11px] font-bold leading-none text-red-600">!</span>
			</div>
		);
	}
	return (
		<div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-100">
			<span className="text-[11px] font-bold leading-none text-amber-700">!</span>
		</div>
	);
}

function TopVendorRow({
	name,
	rate,
	change,
	positive,
}: {
	name: string;
	rate: number;
	change: number;
	positive: boolean;
}) {
	return (
		<div className="flex items-center gap-3 border-b border-border/40 px-4 py-2.5 last:border-b-0">
			<span className="w-[72px] shrink-0 text-xs font-semibold text-foreground">{name}</span>
			<span className="w-12 shrink-0 text-xs font-semibold tabular-nums text-foreground">
				{rate.toFixed(1)}%
			</span>
			<div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted/80">
				<div
					className={cn(
						"h-full rounded-full",
						rate >= 90 ? "bg-emerald-500" : "bg-slate-300"
					)}
					style={{ width: `${rate}%` }}
				/>
			</div>
			<span
				className={cn(
					"inline-flex w-14 shrink-0 items-center justify-end gap-0.5 text-[11px] font-semibold tabular-nums",
					positive ? "text-emerald-700" : "text-red-600"
				)}
			>
				{positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
				{positive ? "+" : ""}
				{Math.abs(change).toFixed(1)}%
			</span>
		</div>
	);
}

export function ExecutiveOverviewPage() {
	const upcomingCount = EXECUTIVE_COMPLIANCE_OBLIGATIONS.length;
	const targetTrend = EXECUTIVE_ACCEPTANCE_TREND.map((point) => ({
		...point,
		target: EXECUTIVE_ACCEPTANCE_TARGET,
	}));

	return (
		<div className={PAGE_STACK}>
			{/* Page header — no bottom border, matches reference */}
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="min-w-0 space-y-1">
					<h1 className="text-2xl font-bold tracking-tight text-foreground">Executive Overview</h1>
					<p className="text-sm text-muted-foreground">
						Enterprise-wide operational health and performance summary
					</p>
				</div>
				<div className="flex flex-wrap items-end gap-2">
					<div className="flex flex-col gap-1">
						<span className="text-[11px] font-medium text-muted-foreground">Reporting Period</span>
						<Select defaultValue="may-2025">
							<SelectTrigger className="h-9 w-[188px] bg-card text-xs shadow-sm">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{EXECUTIVE_REPORTING_PERIODS.map((period) => (
									<SelectItem key={period.id} value={period.id}>
										{period.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-[11px] font-medium text-muted-foreground">Compare To</span>
						<Select defaultValue="apr-2025">
							<SelectTrigger className="h-9 w-[188px] bg-card text-xs shadow-sm">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{EXECUTIVE_COMPARE_PERIODS.map((period) => (
									<SelectItem key={period.id} value={period.id}>
										{period.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<Button variant="outline" size="sm" className="h-9 gap-1.5 bg-card text-xs shadow-sm">
						<Filter className="size-3.5" />
						Filters
					</Button>
					<Button variant="outline" size="icon" className="size-9 bg-card shadow-sm" aria-label="More actions">
						<Ellipsis className="size-4" />
					</Button>
				</div>
			</div>

			{/* KPI row — equal-height cards */}
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
				<OperationalHealthGauge />
				{EXECUTIVE_KPIS.map((kpi) => (
					<KpiSparkCard
						key={kpi.id}
						id={kpi.id}
						label={kpi.label}
						value={kpi.value}
						delta={kpi.delta}
						deltaPositive={kpi.deltaPositive}
						sparkline={kpi.sparkline}
					/>
				))}
			</div>

			{/* Middle row */}
			<div className="grid gap-3 xl:grid-cols-2">
				<CmsEdgeSectionPanel
					title="Operational Health by Domain"
					bodyClassName="p-0"
					footer={
						<div className="border-t border-border/50 px-4 py-2.5">
							<PanelLink>View All Domains →</PanelLink>
						</div>
					}
				>
					{EXECUTIVE_DOMAINS.map((domain) => (
						<DomainRow key={domain.id} domain={domain} />
					))}
				</CmsEdgeSectionPanel>

				<CmsEdgeSectionPanel
					title="Upcoming Compliance Obligations"
					action={<PanelLink>View Calendar &gt;</PanelLink>}
					bodyClassName="p-0"
					footer={
						<div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5 text-xs">
							<span className="text-muted-foreground">Total Upcoming / Overdue</span>
							<span className="font-bold text-primary">{upcomingCount} obligations</span>
						</div>
					}
				>
					<CmsEdgeTableScroll>
						<Table className={CMS_EDGE_TABLE_CLASS} containerClassName={CMS_EDGE_TABLE_CONTAINER}>
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
								{EXECUTIVE_COMPLIANCE_OBLIGATIONS.map((row) => (
									<TableRow key={row.id}>
										<TableCell className={cn(TABLE_CELL, "font-medium text-foreground")}>
											{row.obligation}
										</TableCell>
										<TableCell className={TABLE_CELL}>{row.program}</TableCell>
										<TableCell className={cn(TABLE_CELL, "tabular-nums")}>{row.dueDate}</TableCell>
										<TableCell
											className={cn(
												TABLE_CELL,
												"tabular-nums",
												row.daysLeft < 0 ? "font-bold text-red-600" : "text-foreground"
											)}
										>
											{row.daysLeft}
										</TableCell>
										<TableCell className={TABLE_CELL}>
											<span
												className={cn(
													CMS_EDGE_STATUS_PILL_CLASS,
													executiveStatusPillClass(row.status)
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

			{/* Bottom row */}
			<CmsEdgeTripleRow
				left={
					<CmsEdgeSectionPanel
						title="Encounter Acceptance Rate Trend"
						bodyClassName="px-3 pb-2 pt-1"
						footer={
							<div className="border-t border-border/50 px-4 py-2.5">
								<PanelLink>View Full Report →</PanelLink>
							</div>
						}
					>
						<div className="h-[220px] w-full">
							<ResponsiveContainer width="100%" height="100%">
								<RechartsLineChart
									data={targetTrend}
									margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
								>
									<CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
									<XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
									<YAxis
										domain={[80, 100]}
										tick={{ fontSize: 10 }}
										tickFormatter={(v) => `${v}%`}
										width={32}
										axisLine={false}
										tickLine={false}
									/>
									<Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
									<Legend
										verticalAlign="top"
										align="right"
										iconType="plainline"
										wrapperStyle={{ fontSize: 10, paddingBottom: 4 }}
									/>
									<Line
										type="monotone"
										dataKey="rate"
										name="Acceptance Rate"
										stroke="hsl(var(--primary))"
										strokeWidth={2}
										dot={{ r: 3, fill: "hsl(var(--primary))" }}
										isAnimationActive={false}
									/>
									<Line
										type="monotone"
										dataKey="target"
										name="Target (90%)"
										stroke="#22c55e"
										strokeDasharray="5 5"
										strokeWidth={1.5}
										dot={false}
										isAnimationActive={false}
									/>
								</RechartsLineChart>
							</ResponsiveContainer>
						</div>
					</CmsEdgeSectionPanel>
				}
				center={
					<CmsEdgeSectionPanel
						title="Top Vendors by Encounter Acceptance Rate"
						action={<PanelLink>View All</PanelLink>}
						bodyClassName="p-0"
						footer={
							<div className="border-t border-border/50 px-4 py-2.5">
								<PanelLink>View Vendor Performance →</PanelLink>
							</div>
						}
					>
						<div className="border-t border-border/40">
							<div className="flex items-center gap-3 border-b border-border/40 bg-muted/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
								<span className="w-[72px] shrink-0">Vendor</span>
								<span className="w-12 shrink-0">Rate</span>
								<span className="flex-1">Acceptance</span>
								<span className="w-14 shrink-0 text-right">Change</span>
							</div>
							{EXECUTIVE_TOP_VENDORS.map((vendor) => (
								<TopVendorRow
									key={vendor.id}
									name={vendor.name}
									rate={vendor.rate}
									change={vendor.change}
									positive={vendor.positive}
								/>
							))}
						</div>
					</CmsEdgeSectionPanel>
				}
				right={
					<CmsEdgeSectionPanel title="Executive Attention Required" bodyClassName="p-0">
						<ul className="divide-y divide-border/40">
							{EXECUTIVE_ALERTS.map((alert) => (
								<li key={alert.id} className="flex items-start gap-2.5 px-4 py-3">
									<AlertIcon severity={alert.severity} />
									<div className="min-w-0 flex-1">
										<p className="text-xs font-semibold leading-snug text-foreground">{alert.title}</p>
										<p className="mt-0.5 text-[11px] text-muted-foreground">{alert.detail}</p>
									</div>
									<Button variant="link" size="sm" className="h-auto shrink-0 px-0 text-[11px] font-medium">
										View
									</Button>
								</li>
							))}
						</ul>
					</CmsEdgeSectionPanel>
				}
			/>

			{/* Footer */}
			<div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-muted-foreground">
				<div className="flex items-center gap-1.5 text-primary">
					<RefreshCw className="size-3" aria-hidden />
					<span className="text-muted-foreground">Last Updated: {EXECUTIVE_DATA_AS_OF}</span>
				</div>
				<span>Data refreshed daily</span>
			</div>
		</div>
	);
}
