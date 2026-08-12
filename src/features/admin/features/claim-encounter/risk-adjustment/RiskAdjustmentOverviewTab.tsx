"use client";

import { type ReactNode } from "react";

import {
	ArrowUpRight,
	ClipboardList,
	DollarSign,
	FileText,
	LineChart,
	type LucideIcon,
	Stethoscope,
	Target,
	Users,
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
import { formatCount } from "@/features/admin/features/claim-encounter/mock-data";
import {
	RISK_ADJUSTMENT_AUDIT_ITEMS,
	RISK_ADJUSTMENT_DATA_AS_OF,
	RISK_ADJUSTMENT_HCC_CATEGORIES,
	RISK_ADJUSTMENT_KPIS,
	RISK_ADJUSTMENT_OPPORTUNITIES,
	RISK_ADJUSTMENT_PROGRAM_INFO,
	RISK_ADJUSTMENT_RAF_TREND,
	RISK_ADJUSTMENT_SUBMISSIONS,
} from "@/features/admin/features/claim-encounter/risk-adjustment/mock-data";
import { cn } from "@/lib/utils";

const PAGE_STACK = "space-y-3";
const SECTION_GAP = "gap-3";
const TABLE_HEAD =
	"h-9 bg-muted/30 px-3 text-[11px] font-semibold text-foreground";
const TABLE_CELL = "px-3 py-2";

function PanelLink({ children }: { children: ReactNode }) {
	return (
		<Button variant="link" size="sm" className="h-7 px-0 text-xs text-primary">
			{children}
		</Button>
	);
}

function TrendLine({
	delta,
	deltaPct,
	prefix = "",
}: {
	delta: number | string;
	deltaPct: number;
	prefix?: string;
}) {
	return (
		<span className="inline-flex flex-wrap items-center gap-0.5 text-[11px] text-emerald-700">
			<ArrowUpRight className="size-3" />
			{prefix}
			{typeof delta === "number"
				? delta.toLocaleString(undefined, { maximumFractionDigits: 3 })
				: delta}
			<span className="text-muted-foreground">
				( {deltaPct.toFixed(2)}%) vs prior year
			</span>
		</span>
	);
}

function OverviewKpiCard({
	label,
	value,
	delta,
	deltaPct,
	deltaPrefix,
	icon: Icon,
	iconClass,
}: {
	label: string;
	value: ReactNode;
	delta: number | string;
	deltaPct: number;
	deltaPrefix?: string;
	icon: LucideIcon;
	iconClass: string;
}) {
	return (
		<div className="rounded-lg border border-border/70 bg-card p-3 shadow-sm">
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0 flex-1">
					<p className="text-[11px] font-medium text-muted-foreground">
						{label}
					</p>
					<p className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-foreground">
						{value}
					</p>
					<div className="mt-1">
						<TrendLine delta={delta} deltaPct={deltaPct} prefix={deltaPrefix} />
					</div>
				</div>
				<div
					className={cn(
						"flex size-9 shrink-0 items-center justify-center rounded-full text-white shadow-sm",
						iconClass
					)}
				>
					<Icon className="size-4" aria-hidden />
				</div>
			</div>
		</div>
	);
}

function KpiRow() {
	const k = RISK_ADJUSTMENT_KPIS;

	return (
		<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
			<OverviewKpiCard
				label="RAF Score (YTD)"
				value={k.rafScoreYtd.toFixed(3)}
				delta={k.rafScoreDelta}
				deltaPct={k.rafScoreDeltaPct}
				icon={LineChart}
				iconClass="bg-emerald-500"
			/>
			<OverviewKpiCard
				label="Members Assessed"
				value={formatCount(k.membersAssessed)}
				delta={k.membersAssessedDelta}
				deltaPct={k.membersAssessedDeltaPct}
				icon={Users}
				iconClass="bg-sky-500"
			/>
			<OverviewKpiCard
				label="HCCs Captured"
				value={formatCount(k.hccsCaptured)}
				delta={k.hccsCapturedDelta}
				deltaPct={k.hccsCapturedDeltaPct}
				icon={ClipboardList}
				iconClass="bg-violet-500"
			/>
			<OverviewKpiCard
				label="Potential RAF Impact"
				value={k.potentialRafImpact.toFixed(3)}
				delta={k.potentialRafImpactDelta}
				deltaPct={k.potentialRafImpactDeltaPct}
				icon={Target}
				iconClass="bg-orange-500"
			/>
			<OverviewKpiCard
				label="Payment Impact (Est.)"
				value={`$${(k.paymentImpactEst / 1_000_000).toFixed(1)}M`}
				delta={`$${(k.paymentImpactDelta / 1_000_000).toFixed(1)}M`}
				deltaPct={k.paymentImpactDeltaPct}
				deltaPrefix=""
				icon={DollarSign}
				iconClass="bg-emerald-600"
			/>
		</div>
	);
}

function RafTrendPanel() {
	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="RAF Score Trend"
			action={
				<Select defaultValue="monthly">
					<SelectTrigger className="h-7 w-[100px] border-border/70 bg-card text-xs shadow-sm">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="monthly">Monthly</SelectItem>
						<SelectItem value="quarterly">Quarterly</SelectItem>
					</SelectContent>
				</Select>
			}
			bodyClassName="flex min-h-0 flex-1 flex-col pb-3"
		>
			<div className="min-h-[220px] flex-1 border-t border-border/50 px-2 py-2">
				<ResponsiveContainer width="100%" height="100%" minHeight={200}>
					<RechartsLineChart
						data={RISK_ADJUSTMENT_RAF_TREND}
						margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
					>
						<CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
						<XAxis dataKey="month" tick={{ fontSize: 10 }} />
						<YAxis tick={{ fontSize: 10 }} width={36} domain={[0.8, 1.4]} />
						<Tooltip formatter={(v: number) => v.toFixed(3)} />
						<Line
							type="monotone"
							dataKey="y2025"
							name="2025"
							stroke="#2563eb"
							strokeWidth={2}
							dot={{ r: 3, fill: "#2563eb" }}
						/>
						<Line
							type="monotone"
							dataKey="y2024"
							name="2024"
							stroke="#94a3b8"
							strokeWidth={2}
							dot={{ r: 3, fill: "#94a3b8" }}
						/>
					</RechartsLineChart>
				</ResponsiveContainer>
			</div>
			<div className="flex items-center justify-center gap-4 px-3 pb-1 text-[11px] text-muted-foreground">
				<span className="inline-flex items-center gap-1.5">
					<span className="size-2 rounded-full bg-blue-600" />
					2025
				</span>
				<span className="inline-flex items-center gap-1.5">
					<span className="size-2 rounded-full bg-slate-400" />
					2024
				</span>
			</div>
		</CmsEdgeSectionPanel>
	);
}

function HccDistributionPanel() {
	const total = RISK_ADJUSTMENT_HCC_CATEGORIES.reduce(
		(sum, item) => sum + item.value,
		0
	);

	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="HCC Category Distribution (Top 5)"
			bodyClassName="flex min-h-0 flex-1 flex-col pb-3"
		>
			<div className="flex min-h-[220px] flex-1 gap-3 border-t border-border/50 px-3 py-3">
				<div className="relative mx-auto w-full max-w-[140px] shrink-0">
					<ResponsiveContainer width="100%" height={180}>
						<PieChart>
							<Pie
								data={RISK_ADJUSTMENT_HCC_CATEGORIES}
								dataKey="value"
								nameKey="name"
								innerRadius="58%"
								outerRadius="88%"
								paddingAngle={2}
								stroke="none"
								isAnimationActive={false}
							>
								{RISK_ADJUSTMENT_HCC_CATEGORIES.map((entry) => (
									<Cell key={entry.name} fill={entry.color} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
					<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
						<p className="text-sm font-bold tabular-nums">
							{formatCount(total)}
						</p>
						<p className="text-[10px] text-muted-foreground">Total HCCs</p>
					</div>
				</div>
				<ul className="flex min-w-0 flex-1 flex-col justify-center gap-2 text-xs">
					{RISK_ADJUSTMENT_HCC_CATEGORIES.map((item) => (
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

const OPPORTUNITY_ICONS = {
	users: Users,
	file: FileText,
	clipboard: ClipboardList,
	stethoscope: Stethoscope,
};

function OpportunitySummaryPanel() {
	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Opportunity Summary"
			bodyClassName="flex min-h-0 flex-1 flex-col"
		>
			<ul className="divide-y divide-border/50 border-t border-border/50">
				{RISK_ADJUSTMENT_OPPORTUNITIES.map((item) => {
					const Icon = OPPORTUNITY_ICONS[item.iconKey];
					return (
						<li key={item.id} className="px-3 py-2.5">
							<div className="flex items-start gap-2.5">
								<div
									className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white"
									style={{ backgroundColor: item.color }}
								>
									<Icon className="size-3.5" />
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-start justify-between gap-2">
										<p className="text-xs font-medium text-foreground">
											{item.title}
										</p>
										<span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
											{formatCount(item.count)}
										</span>
									</div>
									<p className="mt-0.5 text-[11px] text-muted-foreground">
										Potential RAF Impact:{" "}
										<span className="font-medium text-foreground">
											{item.rafImpact.toFixed(3)}
										</span>
									</p>
									<div className="mt-1.5 flex items-center gap-2">
										<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
											<div
												className="h-full rounded-full"
												style={{
													width: `${item.pct}%`,
													backgroundColor: item.color,
												}}
											/>
										</div>
										<span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
											{item.pct}%
										</span>
									</div>
								</div>
							</div>
						</li>
					);
				})}
			</ul>
			<div className="border-t border-border/50 px-3 py-2">
				<PanelLink>View All Opportunities →</PanelLink>
			</div>
		</CmsEdgeSectionPanel>
	);
}

function SubmissionsStatusPanel() {
	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Submissions Status"
			bodyClassName="flex min-h-0 flex-1 flex-col"
		>
			<CmsEdgeTableScroll className="min-h-0 flex-1 border-t border-border/50">
				<Table
					containerClassName={CMS_EDGE_TABLE_CONTAINER}
					className={CMS_EDGE_TABLE_CLASS}
				>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className={TABLE_HEAD}>Submission Type</TableHead>
							<TableHead className={TABLE_HEAD}>Status</TableHead>
							<TableHead className={TABLE_HEAD}>Last Submission</TableHead>
							<TableHead className={cn(TABLE_HEAD, "text-right")}>
								Records
							</TableHead>
							<TableHead className={cn(TABLE_HEAD, "pr-3 text-right")}>
								Acceptance Rate
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{RISK_ADJUSTMENT_SUBMISSIONS.map((row) => (
							<TableRow
								key={row.id}
								className="border-b border-border/40 hover:bg-muted/20"
							>
								<TableCell className={cn(TABLE_CELL, "font-medium")}>
									{row.type}
								</TableCell>
								<TableCell className={TABLE_CELL}>
									<span
										className={cn(
											CMS_EDGE_STATUS_PILL_CLASS,
											"text-[10px]",
											row.statusStyle
										)}
									>
										{row.status}
									</span>
								</TableCell>
								<TableCell
									className={cn(
										TABLE_CELL,
										"tabular-nums text-muted-foreground"
									)}
								>
									{row.lastSubmission}
								</TableCell>
								<TableCell
									className={cn(TABLE_CELL, "text-right tabular-nums")}
								>
									{row.records != null ? formatCount(row.records) : "—"}
								</TableCell>
								<TableCell
									className={cn(TABLE_CELL, "pr-3 text-right tabular-nums")}
								>
									{row.acceptanceRate != null ? (
										<span className="font-medium text-emerald-700">
											{row.acceptanceRate}%
										</span>
									) : (
										"—"
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CmsEdgeTableScroll>
			<div className="border-t border-border/50 px-3 py-2">
				<PanelLink>View All Submissions →</PanelLink>
			</div>
		</CmsEdgeSectionPanel>
	);
}

function AuditReconciliationPanel() {
	return (
		<CmsEdgeSectionPanel
			title="Audit & Reconciliation"
			bodyClassName="flex min-h-0 flex-1 flex-col"
		>
			<ul className="divide-y divide-border/50 border-t border-border/50">
				{RISK_ADJUSTMENT_AUDIT_ITEMS.map((item) => (
					<li
						key={item.label}
						className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm"
					>
						<span className="text-foreground">{item.label}</span>
						<span className="font-semibold tabular-nums text-foreground">
							{item.count}
						</span>
					</li>
				))}
			</ul>
			<div className="border-t border-border/50 px-3 py-2">
				<PanelLink>Go to Audit & Reconciliation →</PanelLink>
			</div>
		</CmsEdgeSectionPanel>
	);
}

function ProgramInformationPanel() {
	const info = RISK_ADJUSTMENT_PROGRAM_INFO;

	return (
		<CmsEdgeSectionPanel
			title="Program Information"
			bodyClassName="flex min-h-0 flex-1 flex-col"
		>
			<dl className="divide-y divide-border/50 border-t border-border/50">
				{[
					{ label: "Program", value: info.program },
					{ label: "Measurement Year", value: info.measurementYear },
					{ label: "Risk Model", value: info.riskModel },
					{ label: "LOB", value: info.lob },
					{ label: "Data Last Refreshed", value: info.dataLastRefreshed },
				].map((row) => (
					<div
						key={row.label}
						className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm"
					>
						<dt className="text-muted-foreground">{row.label}</dt>
						<dd className="font-medium text-foreground">{row.value}</dd>
					</div>
				))}
			</dl>
			<div className="border-t border-border/50 px-3 py-2">
				<PanelLink>View Program Details →</PanelLink>
			</div>
		</CmsEdgeSectionPanel>
	);
}

function OverviewFooter() {
	return (
		<div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-muted-foreground">
			<p>
				All data shown is based on the most recent refresh and may not reflect
				real-time updates.
			</p>
			<p className="shrink-0 tabular-nums">
				Data as of {RISK_ADJUSTMENT_DATA_AS_OF}
			</p>
		</div>
	);
}

export function RiskAdjustmentOverviewTab() {
	return (
		<div className={PAGE_STACK}>
			<KpiRow />

			<div
				className={cn(
					"grid grid-cols-1 items-stretch lg:grid-cols-3",
					SECTION_GAP
				)}
			>
				<RafTrendPanel />
				<HccDistributionPanel />
				<OpportunitySummaryPanel />
			</div>

			<div
				className={cn(
					"grid grid-cols-1 items-stretch lg:grid-cols-3",
					SECTION_GAP
				)}
			>
				<SubmissionsStatusPanel />
				<AuditReconciliationPanel />
				<ProgramInformationPanel />
			</div>

			<OverviewFooter />
		</div>
	);
}
