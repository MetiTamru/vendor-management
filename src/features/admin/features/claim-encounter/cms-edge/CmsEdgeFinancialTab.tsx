"use client";

import { type ReactNode } from "react";

import {
	AlertCircle,
	ArrowDownToLine,
	ArrowUpDown,
	CalendarDays,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	DollarSign,
	Download,
	FileText,
	Info,
	type LucideIcon,
	RefreshCw,
	TrendingUp,
	TriangleAlert,
} from "lucide-react";
import {
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
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
	CMS_EDGE_PAGE_STACK,
	CMS_EDGE_TABLE_CELL_CLASS,
	CMS_EDGE_TABLE_CLASS,
	CMS_EDGE_TABLE_CONTAINER,
	CMS_EDGE_TABLE_HEAD_CLASS,
	CMS_EDGE_TABLE_LINK_CLASS,
	CmsEdgePageFooter,
	CmsEdgeSectionPanel,
	CmsEdgeSplitRow,
	CmsEdgeTableScroll,
	CmsEdgeTripleRow,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import {
	CMS_EDGE_FM_ACTIVITY,
	CMS_EDGE_FM_CATEGORIES,
	CMS_EDGE_FM_KPIS,
	CMS_EDGE_FM_OVERVIEW_MIX,
	CMS_EDGE_FM_SELECTED_DETAILS,
	CMS_EDGE_FM_SUMMARY,
	CMS_EDGE_FM_TREND,
	FM_COMPLETED_STYLE,
	formatCurrencyPrecise,
} from "@/features/admin/features/claim-encounter/cms-edge/mock-data";
import { cn } from "@/lib/utils";

function PanelLink({ children }: { children: ReactNode }) {
	return (
		<Button variant="link" size="sm" className="h-7 px-0 text-xs text-primary">
			{children}
		</Button>
	);
}

function StatusPill({ label }: { label: string }) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
				FM_COMPLETED_STYLE
			)}
		>
			{label}
		</span>
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

function FmMetricCard({
	label,
	value,
	hint,
	icon: Icon,
	tone = "text-primary bg-primary/10",
}: {
	label: string;
	value: ReactNode;
	hint?: ReactNode;
	icon: LucideIcon;
	tone?: string;
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
					<p className="mt-0.5 text-sm font-semibold tabular-nums leading-tight text-foreground">
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

function FmKpiRow() {
	const k = CMS_EDGE_FM_KPIS;
	return (
		<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
			<FmMetricCard
				label="Total Payments"
				value={formatCurrencyPrecise(k.totalPayments)}
				icon={DollarSign}
				tone="text-sky-700 bg-sky-500/10"
			/>
			<FmMetricCard
				label="Withholds"
				value={formatCurrencyPrecise(k.withholds)}
				hint={`${k.withholdsPercent.toFixed(2)}%`}
				icon={ArrowDownToLine}
				tone="text-emerald-700 bg-emerald-500/10"
			/>
			<FmMetricCard
				label="Adjustments"
				value={formatCurrencyPrecise(k.adjustments)}
				hint={`${k.adjustmentsPercent.toFixed(2)}%`}
				icon={RefreshCw}
				tone="text-amber-700 bg-amber-500/10"
			/>
			<FmMetricCard
				label="Net Payment"
				value={formatCurrencyPrecise(k.netPayment)}
				icon={FileText}
				tone="text-violet-700 bg-violet-500/10"
			/>
			<FmMetricCard
				label="Last FM Response"
				value={
					<span className="text-xs font-semibold">{k.lastFmResponse}</span>
				}
				hint={<PanelLink>View Latest FM Report</PanelLink>}
				icon={CalendarDays}
				tone="text-sky-700 bg-sky-500/10"
			/>
			<FmMetricCard
				label="FM Reports"
				value={k.fmReportsReceived}
				hint="This period"
				icon={CheckCircle2}
				tone="text-emerald-700 bg-emerald-500/10"
			/>
		</div>
	);
}

function FmSummaryTable() {
	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Financial Management Summary (By Response)"
			bodyClassName="flex min-h-0 flex-1 flex-col"
			action={
				<div className="flex items-center gap-3">
					<PanelLink>View All</PanelLink>
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
					<span>Showing 1 to 5 of 5 entries</span>
					<div className="flex items-center gap-1">
						<Button variant="outline" size="icon" className="size-7" disabled>
							<ChevronLeft className="size-3.5" />
						</Button>
						<Button variant="default" size="icon" className="size-7 text-xs">
							1
						</Button>
						<Button variant="outline" size="icon" className="size-7" disabled>
							<ChevronRight className="size-3.5" />
						</Button>
					</div>
				</div>
			}
		>
			<div className="flex min-h-0 flex-1 flex-col border-t border-border/50">
				<CmsEdgeTableScroll className="min-h-[300px] flex-1">
					<Table
						containerClassName={CMS_EDGE_TABLE_CONTAINER}
						className={cn(CMS_EDGE_TABLE_CLASS, "min-w-[1080px]")}
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
									Related Submission
								</TableHead>
								<TableHead className={CMS_EDGE_TABLE_HEAD_CLASS}>
									<SortableHead>Data Received</SortableHead>
								</TableHead>
								<TableHead
									className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "text-right")}
								>
									Paid Amount
								</TableHead>
								<TableHead
									className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "text-right")}
								>
									Withholds
								</TableHead>
								<TableHead
									className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "text-right")}
								>
									Adjustments
								</TableHead>
								<TableHead
									className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "text-right")}
								>
									Net Payment
								</TableHead>
								<TableHead className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "pr-4")}>
									Status
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{CMS_EDGE_FM_SUMMARY.map((row) => (
								<TableRow
									key={row.id}
									className="border-b border-border/40 hover:bg-muted/20"
								>
									<TableCell className={CMS_EDGE_TABLE_CELL_CLASS}>
										<Button
											variant="link"
											className="h-auto p-0 font-mono text-[11px] text-primary"
										>
											{row.responseFile}
										</Button>
									</TableCell>
									<TableCell className={CMS_EDGE_TABLE_CELL_CLASS}>
										{row.responseType}
									</TableCell>
									<TableCell className={CMS_EDGE_TABLE_CELL_CLASS}>
										<Button
											variant="link"
											className="h-auto p-0 text-[11px] text-primary"
										>
											{row.relatedSubmission}
										</Button>
									</TableCell>
									<TableCell
										className={cn(CMS_EDGE_TABLE_CELL_CLASS, "tabular-nums")}
									>
										{row.dataReceived}
									</TableCell>
									<TableCell
										className={cn(
											CMS_EDGE_TABLE_CELL_CLASS,
											"text-right tabular-nums"
										)}
									>
										{formatCurrencyPrecise(row.paidAmount)}
									</TableCell>
									<TableCell
										className={cn(
											CMS_EDGE_TABLE_CELL_CLASS,
											"text-right tabular-nums"
										)}
									>
										{formatCurrencyPrecise(row.withholds)}
									</TableCell>
									<TableCell
										className={cn(
											CMS_EDGE_TABLE_CELL_CLASS,
											"text-right tabular-nums"
										)}
									>
										{formatCurrencyPrecise(row.adjustments)}
									</TableCell>
									<TableCell
										className={cn(
											CMS_EDGE_TABLE_CELL_CLASS,
											"text-right tabular-nums"
										)}
									>
										{formatCurrencyPrecise(row.netPayment)}
									</TableCell>
									<TableCell className={cn(CMS_EDGE_TABLE_CELL_CLASS, "pr-4")}>
										<StatusPill label={row.status} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CmsEdgeTableScroll>
			</div>
		</CmsEdgeSectionPanel>
	);
}

function FmChartLegend({
	items,
	className,
}: {
	items: { name: string; color: string; value: number; pct?: number }[];
	className?: string;
}) {
	return (
		<ul className={cn("grid gap-1.5 text-[11px]", className)}>
			{items.map((item) => (
				<li key={item.name} className="flex items-center justify-between gap-2">
					<span className="flex min-w-0 items-center gap-1.5 font-medium">
						<span
							className="size-2 shrink-0 rounded-full"
							style={{ backgroundColor: item.color }}
						/>
						<span className="truncate">{item.name}</span>
					</span>
					<span className="shrink-0 text-right tabular-nums text-muted-foreground">
						{formatCurrencyPrecise(item.value)}
						{item.pct != null ? (
							<span className="ml-1">({item.pct.toFixed(2)}%)</span>
						) : null}
					</span>
				</li>
			))}
		</ul>
	);
}

function FmOverviewPanel() {
	const donutData = CMS_EDGE_FM_OVERVIEW_MIX.map((item) => ({
		name: item.name,
		value: item.value,
		color: item.color,
	}));

	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Financial Management Overview (This Period)"
			bodyClassName="flex min-h-0 flex-1 flex-col"
			infoBar={
				<div className="flex items-start gap-2 border-t border-sky-200/80 bg-sky-50/80 px-4 py-2 text-[11px] leading-snug text-sky-900">
					<Info className="mt-0.5 size-3.5 shrink-0" />
					Percentages are calculated based on Total Payments.
				</div>
			}
		>
			<div className="flex min-h-[300px] flex-1 flex-col border-t border-border/50">
				<div className="relative mx-auto w-full max-w-[168px] flex-1 px-4 pt-4">
					<ResponsiveContainer width="100%" height="100%" minHeight={140}>
						<PieChart>
							<Pie
								data={donutData}
								dataKey="value"
								nameKey="name"
								innerRadius="58%"
								outerRadius="88%"
								paddingAngle={1}
								stroke="none"
								isAnimationActive={false}
							>
								{donutData.map((entry) => (
									<Cell key={entry.name} fill={entry.color} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
					<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-4 text-center">
						<p className="text-sm font-bold text-foreground">$12.85M</p>
						<p className="text-[10px] text-muted-foreground">Total Paid</p>
					</div>
				</div>
				<div className="shrink-0 px-4 pb-3 pt-1">
					<FmChartLegend
						items={CMS_EDGE_FM_OVERVIEW_MIX.map((item) => ({
							name: item.name,
							color: item.color,
							value: item.value,
							pct: item.name === "Total Payments" ? undefined : item.pct,
						}))}
					/>
				</div>
			</div>
		</CmsEdgeSectionPanel>
	);
}

function PaymentTrendPanel() {
	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Payment Trend Over Time"
			bodyClassName="flex min-h-0 flex-1 flex-col"
			footer={
				<div className="mt-auto flex justify-end border-t border-border/50 px-4 py-2.5">
					<PanelLink>View Full Trend Report</PanelLink>
				</div>
			}
		>
			<div className="min-h-[220px] flex-1 border-t border-border/50 px-2 py-3">
				<ResponsiveContainer width="100%" height="100%" minHeight={200}>
					<LineChart
						data={CMS_EDGE_FM_TREND}
						margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
					>
						<CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
						<XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
						<YAxis
							tick={{ fontSize: 10 }}
							width={44}
							tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
						/>
						<RechartsTooltip
							formatter={(value: number) => formatCurrencyPrecise(value)}
						/>
						<Legend
							verticalAlign="top"
							align="left"
							iconType="circle"
							iconSize={8}
							wrapperStyle={{ fontSize: 10, paddingBottom: 4 }}
						/>
						<Line
							type="monotone"
							dataKey="totalPayments"
							name="Total Payments"
							stroke="#3b82f6"
							strokeWidth={2}
							dot={{ r: 3 }}
						/>
						<Line
							type="monotone"
							dataKey="withholds"
							name="Withholds"
							stroke="#ef4444"
							strokeWidth={2}
							dot={{ r: 3 }}
						/>
						<Line
							type="monotone"
							dataKey="adjustments"
							name="Adjustments"
							stroke="#f59e0b"
							strokeWidth={2}
							dot={{ r: 3 }}
						/>
						<Line
							type="monotone"
							dataKey="netPayment"
							name="Net Payment"
							stroke="#22c55e"
							strokeWidth={2}
							dot={{ r: 3 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</CmsEdgeSectionPanel>
	);
}

function PaymentBreakdownPanel() {
	const pieData = CMS_EDGE_FM_CATEGORIES.map((row) => ({
		name: row.category,
		value: row.paidAmount,
		color: row.color,
		percent: row.percent,
	}));

	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Payment Breakdown by Category (This Period)"
			bodyClassName="flex min-h-0 flex-1 flex-col"
			footer={
				<div className="mt-auto flex justify-end border-t border-border/50 px-4 py-2.5">
					<PanelLink>View All Categories</PanelLink>
				</div>
			}
		>
			<div className="flex min-h-[220px] flex-1 flex-col border-t border-border/50">
				<div className="relative mx-auto w-full max-w-[200px] flex-1 px-4 pt-3">
					<ResponsiveContainer width="100%" height="100%" minHeight={130}>
						<PieChart>
							<Pie
								data={pieData}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								outerRadius="88%"
								paddingAngle={1}
								stroke="none"
								isAnimationActive={false}
							>
								{pieData.map((entry) => (
									<Cell key={entry.name} fill={entry.color} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
				</div>
				<div className="shrink-0 px-4 pb-3 pt-1">
					<FmChartLegend
						items={CMS_EDGE_FM_CATEGORIES.map((row) => ({
							name: row.category,
							color: row.color,
							value: row.paidAmount,
							pct: row.percent,
						}))}
					/>
				</div>
			</div>
		</CmsEdgeSectionPanel>
	);
}

function FinancialDetailsPanel() {
	const d = CMS_EDGE_FM_SELECTED_DETAILS;

	type DetailRow = {
		label: string;
		value: ReactNode;
	};

	const rows: DetailRow[] = [
		{
			label: "Response File",
			value: (
				<Button variant="link" className="h-auto p-0 text-[11px] text-primary">
					{d.responseFile}
				</Button>
			),
		},
		{ label: "Response Type", value: d.responseType },
		{
			label: "Related Submission",
			value: (
				<Button variant="link" className="h-auto p-0 text-[11px] text-primary">
					{d.relatedSubmission}
				</Button>
			),
		},
		{ label: "Date Received", value: d.dataReceived },
		{ label: "Payment Period", value: d.reportingPeriod },
		{
			label: "Total Payments",
			value: (
				<span className="font-semibold text-emerald-700">
					{formatCurrencyPrecise(d.paidAmount)}
				</span>
			),
		},
		{
			label: "Withholds",
			value: (
				<span className="font-semibold text-red-600">
					{formatCurrencyPrecise(d.withholds)}
				</span>
			),
		},
		{
			label: "Adjustments",
			value: (
				<span className="font-semibold text-red-600">
					{formatCurrencyPrecise(d.adjustments)}
				</span>
			),
		},
		{
			label: "Net Payment",
			value: (
				<span className="font-semibold text-emerald-700">
					{formatCurrencyPrecise(d.netPayment)}
				</span>
			),
		},
		{
			label: "Status",
			value: <StatusPill label={d.status} />,
		},
	];

	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Financial Details (Selected Response)"
			bodyClassName="flex min-h-0 flex-1 flex-col"
			footer={
				<div className="mt-auto border-t border-border/50 px-4 py-3">
					<Button
						variant="outline"
						size="sm"
						className="h-9 w-full border-primary/30 text-primary"
						onClick={() => toast.success("Payment report download queued")}
					>
						<Download className="mr-1.5 size-3.5" />
						Download Payment Report
					</Button>
				</div>
			}
		>
			<dl className="flex-1 divide-y divide-border/40 border-t border-border/50 px-4 py-1">
				{rows.map((row) => (
					<div
						key={row.label}
						className="grid grid-cols-[118px_1fr] items-center gap-3 py-2.5 text-xs"
					>
						<dt className="font-medium text-muted-foreground">{row.label}</dt>
						<dd className="font-medium text-foreground">{row.value}</dd>
					</div>
				))}
			</dl>
		</CmsEdgeSectionPanel>
	);
}

function ActivityIcon({ activity }: { activity: string }) {
	const key = activity.toLowerCase();
	if (
		key.includes("discrepancy") ||
		key.includes("error") ||
		key.includes("failed")
	) {
		return <TriangleAlert className="size-3.5 shrink-0 text-red-500" />;
	}
	if (key.includes("withhold")) {
		return <AlertCircle className="size-3.5 shrink-0 text-amber-500" />;
	}
	if (key.includes("report") || key.includes("received")) {
		return <FileText className="size-3.5 shrink-0 text-violet-600" />;
	}
	if (key.includes("payment") || key.includes("processed")) {
		return <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />;
	}
	return <TrendingUp className="size-3.5 shrink-0 text-primary" />;
}

function RecentFmActivityPanel() {
	return (
		<CmsEdgeSectionPanel
			title="Recent Financial Management Activity"
			bodyClassName="flex min-h-0 flex-col"
			action={<PanelLink>View All Activity</PanelLink>}
		>
			<CmsEdgeTableScroll className="min-h-[280px] border-t border-border/50">
				<Table
					containerClassName={CMS_EDGE_TABLE_CONTAINER}
					className={cn(CMS_EDGE_TABLE_CLASS, "min-w-[960px]")}
				>
					<TableHeader>
						<TableRow className="border-b border-border/50 hover:bg-transparent">
							<TableHead className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "px-4")}>
								Activity
							</TableHead>
							<TableHead className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "px-4")}>
								Description
							</TableHead>
							<TableHead className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "px-4")}>
								Related Submission
							</TableHead>
							<TableHead className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "px-4")}>
								Date / Time
							</TableHead>
							<TableHead className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "px-4")}>
								Status
							</TableHead>
							<TableHead className={cn(CMS_EDGE_TABLE_HEAD_CLASS, "px-4 pr-4")}>
								User
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{CMS_EDGE_FM_ACTIVITY.map((row) => (
							<TableRow
								key={row.id}
								className="border-b border-border/40 hover:bg-muted/20"
							>
								<TableCell className={cn(CMS_EDGE_TABLE_CELL_CLASS, "px-4")}>
									<span className="inline-flex items-center gap-1.5 font-medium">
										<ActivityIcon activity={row.activity} />
										{row.activity}
									</span>
								</TableCell>
								<TableCell className="px-4 py-2.5 text-muted-foreground">
									{row.description}
								</TableCell>
								<TableCell className={cn(CMS_EDGE_TABLE_CELL_CLASS, "px-4")}>
									<Button
										variant="link"
										className="h-auto p-0 font-mono text-[11px] text-primary"
									>
										{row.relatedSubmission}
									</Button>
								</TableCell>
								<TableCell className="px-4 py-2.5 tabular-nums text-muted-foreground">
									{row.dateTime}
								</TableCell>
								<TableCell className={cn(CMS_EDGE_TABLE_CELL_CLASS, "px-4")}>
									<StatusPill label={row.status} />
								</TableCell>
								<TableCell className="px-4 py-2.5 pr-4 text-muted-foreground">
									{row.user}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CmsEdgeTableScroll>
		</CmsEdgeSectionPanel>
	);
}

export function CmsEdgeFinancialTab() {
	return (
		<div className={CMS_EDGE_PAGE_STACK}>
			<FmKpiRow />

			<CmsEdgeSplitRow
				wideMain
				main={<FmSummaryTable />}
				side={<FmOverviewPanel />}
			/>

			<CmsEdgeTripleRow
				left={<PaymentTrendPanel />}
				center={<PaymentBreakdownPanel />}
				right={<FinancialDetailsPanel />}
			/>

			<RecentFmActivityPanel />

			<CmsEdgePageFooter />
		</div>
	);
}
