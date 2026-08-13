"use client";

import { type ReactNode, useState } from "react";

import {
	ArrowDownRight,
	ArrowUpRight,
	CheckCircle2,
	Clock,
	Download,
	FileText,
	Filter,
	FolderOpen,
	Percent,
	Users,
	type LucideIcon,
} from "lucide-react";
import {
	Bar,
	CartesianGrid,
	Cell,
	ComposedChart,
	Line,
	Pie,
	PieChart,
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
	OV_ALERTS,
	OV_CLAIMS_METRICS,
	OV_ENCOUNTER_METRICS,
	OV_FILE_STATUS,
	OV_FILES_OVER_TIME,
	OV_KPIS,
	OV_REPORTING_PERIODS,
	OV_SLA_BREACHES,
	OV_SLA_SUMMARY,
	OV_TABS,
	OV_TOP_VENDORS,
	OV_TOTAL_FILES,
	OV_TOTAL_VENDORS,
	OV_VENDOR_HEALTH,
	type OvTab,
	ovCategoryPillClass,
	ovSeverityPillClass,
	ovStatusPillClass,
} from "@/features/admin/features/claim-encounter/executive-analytics/operations-vendors-mock";
import { cn } from "@/lib/utils";

const PAGE_STACK = "space-y-4 pb-4";
const TABLE_HEAD =
	"h-9 bg-muted/30 px-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground";
const TABLE_CELL = "px-3 py-2.5 text-xs";

const KPI_ICONS: Record<string, LucideIcon> = {
	vendors: Users,
	files: FolderOpen,
	encounters: FileText,
	acceptance: Percent,
	errors: FileText,
	sla: CheckCircle2,
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
	const Icon = KPI_ICONS[id] ?? Users;
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

function PeriodCompareTable({
	title,
	rows,
}: {
	title: string;
	rows: { metric: string; current: string; prior: string; positive: boolean }[];
}) {
	return (
		<div>
			<p className="border-b border-border/40 px-3 py-2 text-xs font-semibold text-foreground">
				{title}
			</p>
			<Table className={CMS_EDGE_TABLE_CLASS} containerClassName={CMS_EDGE_TABLE_CONTAINER}>
				<TableHeader>
					<TableRow>
						<TableHead className={TABLE_HEAD}>Metric</TableHead>
						<TableHead className={TABLE_HEAD}>Current Period</TableHead>
						<TableHead className={TABLE_HEAD}>Prior Period</TableHead>
						<TableHead className={TABLE_HEAD}>Trend</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map((row) => (
						<TableRow key={row.metric}>
							<TableCell className={cn(TABLE_CELL, "font-medium")}>
								{row.metric}
							</TableCell>
							<TableCell className={cn(TABLE_CELL, "tabular-nums")}>
								{row.current}
							</TableCell>
							<TableCell className={cn(TABLE_CELL, "tabular-nums text-muted-foreground")}>
								{row.prior}
							</TableCell>
							<TableCell className={TABLE_CELL}>
								{row.positive ? (
									<ArrowUpRight className="size-3.5 text-emerald-700" />
								) : (
									<ArrowDownRight className="size-3.5 text-red-600" />
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function VendorPerformanceContent() {
	return (
		<div className="space-y-4">
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
				{OV_KPIS.map((kpi) => (
					<KpiCard key={kpi.id} {...kpi} />
				))}
			</div>

			{/* Vendor health / top vendors / SLA */}
			<div className="grid gap-3 xl:grid-cols-3">
				<CmsEdgeSectionPanel
					title="Vendor Health Score"
					bodyClassName="p-3"
					footer={
						<div className="border-t border-border/50 px-4 py-2.5">
							<PanelLink>View Vendor Health Details →</PanelLink>
						</div>
					}
				>
					<div className="flex flex-col items-center gap-3 sm:flex-row">
						<div className="relative h-[140px] w-[140px] shrink-0">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={OV_VENDOR_HEALTH}
										dataKey="value"
										nameKey="name"
										innerRadius="55%"
										outerRadius="88%"
										paddingAngle={2}
										stroke="none"
										isAnimationActive={false}
									>
										{OV_VENDOR_HEALTH.map((entry) => (
											<Cell key={entry.name} fill={entry.color} />
										))}
									</Pie>
								</PieChart>
							</ResponsiveContainer>
							<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
								<p className="text-lg font-bold tabular-nums">{OV_TOTAL_VENDORS}</p>
								<p className="text-[10px] text-muted-foreground">Vendors</p>
							</div>
						</div>
						<ul className="min-w-0 flex-1 space-y-1.5 text-xs">
							{OV_VENDOR_HEALTH.map((item) => (
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
					title="Top Vendors by Overall Health Score"
					bodyClassName="p-0"
					footer={
						<div className="border-t border-border/50 px-4 py-2.5">
							<PanelLink>View All Vendors →</PanelLink>
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
									<TableHead className={TABLE_HEAD}>Vendor</TableHead>
									<TableHead className={TABLE_HEAD}>Health</TableHead>
									<TableHead className={TABLE_HEAD}>Trend</TableHead>
									<TableHead className={TABLE_HEAD}>File Error</TableHead>
									<TableHead className={TABLE_HEAD}>Enc. Accept.</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{OV_TOP_VENDORS.map((row) => (
									<TableRow key={row.id}>
										<TableCell className={cn(TABLE_CELL, "font-medium")}>
											{row.vendor}
										</TableCell>
										<TableCell className={cn(TABLE_CELL, "tabular-nums font-semibold")}>
											{row.health}
										</TableCell>
										<TableCell className={TABLE_CELL}>
											{row.trendPositive ? (
												<ArrowUpRight className="size-3.5 text-emerald-700" />
											) : (
												<ArrowDownRight className="size-3.5 text-red-600" />
											)}
										</TableCell>
										<TableCell className={cn(TABLE_CELL, "tabular-nums")}>
											{row.errorRate}
										</TableCell>
										<TableCell className={cn(TABLE_CELL, "tabular-nums")}>
											{row.acceptRate}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CmsEdgeTableScroll>
				</CmsEdgeSectionPanel>

				<CmsEdgeSectionPanel
					title="SLA Summary"
					bodyClassName="space-y-3 p-3"
					footer={
						<div className="border-t border-border/50 px-4 py-2.5">
							<PanelLink>View SLA Dashboard →</PanelLink>
						</div>
					}
				>
					<div className="grid grid-cols-3 gap-2">
						{OV_SLA_SUMMARY.map((item) => (
							<div
								key={item.id}
								className="rounded-lg border border-border/50 bg-muted/15 px-2 py-2.5 text-center"
							>
								<div
									className={cn(
										"mx-auto mb-1.5 flex size-8 items-center justify-center rounded-full",
										item.tone
									)}
								>
									{item.id === "response" ? (
										<Clock className="size-3.5" />
									) : (
										<CheckCircle2 className="size-3.5" />
									)}
								</div>
								<p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
									{item.label}
								</p>
								<p className="mt-0.5 text-sm font-bold tabular-nums">{item.value}</p>
								<div className="mt-1 flex justify-center">
									<DeltaHint delta={item.delta} positive={item.deltaPositive} />
								</div>
							</div>
						))}
					</div>
					<div>
						<p className="mb-1.5 text-xs font-semibold text-foreground">
							Vendors Breaching SLA
						</p>
						<CmsEdgeTableScroll>
							<Table
								className={CMS_EDGE_TABLE_CLASS}
								containerClassName={CMS_EDGE_TABLE_CONTAINER}
							>
								<TableHeader>
									<TableRow>
										<TableHead className={TABLE_HEAD}>Vendor</TableHead>
										<TableHead className={TABLE_HEAD}>SLA Metric</TableHead>
										<TableHead className={TABLE_HEAD}>Perf.</TableHead>
										<TableHead className={TABLE_HEAD}>Threshold</TableHead>
										<TableHead className={TABLE_HEAD}>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{OV_SLA_BREACHES.map((row) => (
										<TableRow key={row.id}>
											<TableCell className={cn(TABLE_CELL, "font-medium")}>
												{row.vendor}
											</TableCell>
											<TableCell className={TABLE_CELL}>{row.metric}</TableCell>
											<TableCell className={cn(TABLE_CELL, "tabular-nums")}>
												{row.performance}
											</TableCell>
											<TableCell className={cn(TABLE_CELL, "tabular-nums")}>
												{row.threshold}
											</TableCell>
											<TableCell className={TABLE_CELL}>
												<span
													className={cn(
														CMS_EDGE_STATUS_PILL_CLASS,
														"border-red-200 bg-red-50 text-red-700"
													)}
												>
													Breached
												</span>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CmsEdgeTableScroll>
					</div>
				</CmsEdgeSectionPanel>
			</div>

			{/* File + claims/encounters */}
			<div className="grid gap-3 xl:grid-cols-2">
				<CmsEdgeSectionPanel
					title="File Processing Overview"
					bodyClassName="p-3"
					footer={
						<div className="border-t border-border/50 px-4 py-2.5">
							<PanelLink>View File Operations →</PanelLink>
						</div>
					}
				>
					<div className="grid gap-3 lg:grid-cols-[160px_minmax(0,1fr)]">
						<div className="flex flex-col items-center">
							<p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
								File Status
							</p>
							<div className="relative h-[120px] w-[120px]">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={OV_FILE_STATUS}
											dataKey="value"
											nameKey="name"
											innerRadius="55%"
											outerRadius="88%"
											paddingAngle={2}
											stroke="none"
											isAnimationActive={false}
										>
											{OV_FILE_STATUS.map((entry) => (
												<Cell key={entry.name} fill={entry.color} />
											))}
										</Pie>
									</PieChart>
								</ResponsiveContainer>
								<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
									<p className="text-sm font-bold tabular-nums">{OV_TOTAL_FILES}</p>
									<p className="text-[9px] text-muted-foreground">Files</p>
								</div>
							</div>
							<ul className="mt-2 w-full space-y-1 text-[10px]">
								{OV_FILE_STATUS.map((item) => (
									<li key={item.name} className="flex items-center justify-between gap-1">
										<span className="flex items-center gap-1">
											<span
												className="size-1.5 rounded-full"
												style={{ backgroundColor: item.color }}
											/>
											<span className="truncate">{item.name}</span>
										</span>
										<span className="tabular-nums text-muted-foreground">{item.pct}</span>
									</li>
								))}
							</ul>
						</div>
						<div>
							<p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
								Files Over Time
							</p>
							<div className="h-[200px] w-full">
								<ResponsiveContainer width="100%" height="100%">
									<ComposedChart
										data={OV_FILES_OVER_TIME}
										margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
									>
										<CartesianGrid
											strokeDasharray="3 3"
											className="stroke-border/40"
											vertical={false}
										/>
										<XAxis
											dataKey="day"
											tick={{ fontSize: 9 }}
											axisLine={false}
											tickLine={false}
										/>
										<YAxis
											yAxisId="left"
											tick={{ fontSize: 9 }}
											width={28}
											axisLine={false}
											tickLine={false}
										/>
										<YAxis
											yAxisId="right"
											orientation="right"
											tick={{ fontSize: 9 }}
											width={28}
											axisLine={false}
											tickLine={false}
											tickFormatter={(v) => `${v}%`}
										/>
										<Tooltip />
										<Bar
											yAxisId="left"
											dataKey="total"
											name="Total Files"
											fill="hsl(var(--primary))"
											radius={[3, 3, 0, 0]}
											barSize={16}
											isAnimationActive={false}
										/>
										<Line
											yAxisId="right"
											type="monotone"
											dataKey="errorRate"
											name="Error Rate (%)"
											stroke="#ef4444"
											strokeWidth={2}
											dot={{ r: 2 }}
											isAnimationActive={false}
										/>
									</ComposedChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
				</CmsEdgeSectionPanel>

				<CmsEdgeSectionPanel
					title="Claims & Encounter Performance"
					bodyClassName="p-0"
					footer={
						<div className="border-t border-border/50 px-4 py-2.5">
							<PanelLink>View Claims & Encounters →</PanelLink>
						</div>
					}
				>
					<div className="grid divide-y divide-border/40 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
						<PeriodCompareTable title="Claims" rows={OV_CLAIMS_METRICS} />
						<PeriodCompareTable title="Encounters" rows={OV_ENCOUNTER_METRICS} />
					</div>
				</CmsEdgeSectionPanel>
			</div>

			{/* Alerts */}
			<CmsEdgeSectionPanel
				title="Recent Operational Alerts"
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
								<TableHead className={cn(TABLE_HEAD, "min-w-[220px]")}>Alert</TableHead>
								<TableHead className={TABLE_HEAD}>Category</TableHead>
								<TableHead className={TABLE_HEAD}>Vendor</TableHead>
								<TableHead className={TABLE_HEAD}>Severity</TableHead>
								<TableHead className={TABLE_HEAD}>Detected On</TableHead>
								<TableHead className={TABLE_HEAD}>Impact</TableHead>
								<TableHead className={TABLE_HEAD}>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{OV_ALERTS.map((row) => (
								<TableRow key={row.id}>
									<TableCell className={cn(TABLE_CELL, "font-medium")}>
										{row.alert}
									</TableCell>
									<TableCell className={TABLE_CELL}>
										<span
											className={cn(
												CMS_EDGE_STATUS_PILL_CLASS,
												ovCategoryPillClass(row.category)
											)}
										>
											{row.category}
										</span>
									</TableCell>
									<TableCell className={TABLE_CELL}>{row.vendor}</TableCell>
									<TableCell className={TABLE_CELL}>
										<span
											className={cn(
												CMS_EDGE_STATUS_PILL_CLASS,
												ovSeverityPillClass(row.severity)
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
												ovStatusPillClass(row.status)
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
		<div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-border/70 bg-card p-8 text-center shadow-sm">
			<p className="text-sm font-semibold text-foreground">{label}</p>
			<p className="mt-1 max-w-md text-xs text-muted-foreground">
				Focused metrics for this operational area will appear here. Use Vendor
				Performance for the full enterprise operations summary.
			</p>
		</div>
	);
}

export function OperationsVendorsPage() {
	const [tab, setTab] = useState<OvTab>("vendor-performance");

	return (
		<div className={PAGE_STACK}>
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="min-w-0 space-y-1">
					<h1 className="text-2xl font-bold tracking-tight text-foreground">
						Operations & Vendors
					</h1>
					<p className="text-sm text-muted-foreground">
						Vendor, file, claims and encounter operational performance
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
								{OV_REPORTING_PERIODS.map((p) => (
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

			{/* Pill tabs */}
			<div className="flex flex-wrap gap-2">
				{OV_TABS.map((item) => (
					<button
						key={item.id}
						type="button"
						onClick={() => setTab(item.id)}
						className={cn(
							"rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
							tab === item.id
								? "border-primary bg-primary text-primary-foreground"
								: "border-border/70 bg-card text-primary hover:bg-muted/40"
						)}
					>
						{item.label}
					</button>
				))}
			</div>

			{tab === "vendor-performance" ? (
				<VendorPerformanceContent />
			) : (
				<TabPlaceholder
					label={OV_TABS.find((t) => t.id === tab)?.label ?? tab}
				/>
			)}
		</div>
	);
}
