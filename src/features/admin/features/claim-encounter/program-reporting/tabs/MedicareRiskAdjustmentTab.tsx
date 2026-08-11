"use client";

import { type ReactNode } from "react";

import {
	AlertTriangle,
	BarChart3,
	CheckCircle2,
	ClipboardList,
	Users,
	type LucideIcon,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

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
	CmsEdgePageFooter,
	CmsEdgeSectionPanel,
	CmsEdgeTableScroll,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import { formatCount } from "@/features/admin/features/claim-encounter/mock-data";
import {
	MEDICARE_RISK_ADJUSTMENT_HCC_CATEGORIES,
	MEDICARE_RISK_ADJUSTMENT_KPIS,
} from "@/features/admin/features/claim-encounter/program-reporting/mock-data";
import { cn } from "@/lib/utils";

const PAGE_STACK = "space-y-5";
const SECTION_GAP = "gap-4";
const TABLE_HEAD = "h-9 bg-muted/30 px-4 text-[11px] font-semibold text-foreground";
const TABLE_CELL = "px-4 py-2.5";

const MEMBER_SEGMENTS = [
	{ name: "HCC Captured", pct: MEDICARE_RISK_ADJUSTMENT_KPIS.hccCapturedPct, color: "#22c55e" },
	{ name: "Suspect Conditions", pct: MEDICARE_RISK_ADJUSTMENT_KPIS.suspectPct, color: "#94a3b8" },
	{ name: "Potential Gaps", pct: MEDICARE_RISK_ADJUSTMENT_KPIS.gapsPct, color: "#ef4444" },
	{ name: "No HCC", pct: MEDICARE_RISK_ADJUSTMENT_KPIS.noHccPct, color: "#f59e0b" },
];

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
						<div className="mt-0.5 truncate text-[10px] text-muted-foreground">{hint}</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

function RiskAdjustmentKpiRow() {
	const k = MEDICARE_RISK_ADJUSTMENT_KPIS;

	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
			<MetricCard
				label="Total Members"
				value={formatCount(k.totalMembers)}
				hint="Risk Adjustment Population"
				icon={Users}
				tone="text-sky-700 bg-sky-500/10"
			/>
			<MetricCard
				label="HCC Captured"
				value={formatCount(k.hccCaptured)}
				hint={`${k.hccCapturedPct}% Capture Rate`}
				icon={CheckCircle2}
				tone="text-emerald-700 bg-emerald-500/10"
				valueClassName="text-emerald-700"
			/>
			<MetricCard
				label="Suspect Conditions"
				value={formatCount(k.suspectConditions)}
				hint={`${k.suspectPct}% of Population`}
				icon={AlertTriangle}
				tone="text-amber-700 bg-amber-500/10"
				valueClassName="text-amber-600"
			/>
			<MetricCard
				label="Potential Gaps"
				value={formatCount(k.potentialGaps)}
				hint={`${k.gapsPct}% Gap Rate`}
				icon={BarChart3}
				tone="text-red-700 bg-red-500/10"
				valueClassName="text-red-600"
			/>
			<MetricCard
				label="Open Reviews"
				value={k.openReviews}
				hint={`${k.chartReviewsDue} Chart Reviews Due`}
				icon={ClipboardList}
				tone="text-violet-700 bg-violet-500/10"
			/>
			<MetricCard
				label="No HCC"
				value={formatCount(k.noHcc)}
				hint={`${k.noHccPct}% of Population`}
				icon={Users}
				tone="text-slate-700 bg-slate-500/10"
			/>
		</div>
	);
}

function HccCaptureTablePanel() {
	return (
		<CmsEdgeSectionPanel title="HCC Capture by Category">
			<CmsEdgeTableScroll className="border-t border-border/50">
				<Table containerClassName={CMS_EDGE_TABLE_CONTAINER} className={CMS_EDGE_TABLE_CLASS}>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className={TABLE_HEAD}>Category</TableHead>
							<TableHead className={cn(TABLE_HEAD, "text-right")}>Captured</TableHead>
							<TableHead className={cn(TABLE_HEAD, "text-right")}>Suspected</TableHead>
							<TableHead className={cn(TABLE_HEAD, "text-right")}>Gaps</TableHead>
							<TableHead className={cn(TABLE_HEAD, "text-right")}>Target</TableHead>
							<TableHead className={cn(TABLE_HEAD, "pr-5 text-right")}>Capture Rate</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{MEDICARE_RISK_ADJUSTMENT_HCC_CATEGORIES.map((row) => (
							<TableRow key={row.category} className="border-b border-border/40 hover:bg-muted/20">
								<TableCell className={cn(TABLE_CELL, "font-medium")}>{row.category}</TableCell>
								<TableCell className={cn(TABLE_CELL, "text-right tabular-nums")}>
									{formatCount(row.captured)}
								</TableCell>
								<TableCell className={cn(TABLE_CELL, "text-right tabular-nums text-muted-foreground")}>
									{formatCount(row.suspected)}
								</TableCell>
								<TableCell className={cn(TABLE_CELL, "text-right tabular-nums text-red-600")}>
									{formatCount(row.gaps)}
								</TableCell>
								<TableCell className={cn(TABLE_CELL, "text-right tabular-nums")}>
									{row.target.toFixed(1)}%
								</TableCell>
								<TableCell className={cn(TABLE_CELL, "pr-5 text-right tabular-nums")}>
									<span
										className={cn(
											row.rate >= row.target ? "text-emerald-700" : "text-amber-600"
										)}
									>
										{row.rate.toFixed(1)}%
									</span>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CmsEdgeTableScroll>
		</CmsEdgeSectionPanel>
	);
}

function MemberSegmentsDonutPanel() {
	const pieData = MEMBER_SEGMENTS.map((seg) => ({
		name: seg.name,
		value: seg.pct,
		color: seg.color,
	}));

	return (
		<CmsEdgeSectionPanel
			className="flex h-full min-h-0 flex-col"
			title="Member Segments"
			bodyClassName="flex min-h-0 flex-1 flex-col"
		>
			<div className="flex min-h-[260px] flex-1 gap-4 border-t border-border/50 px-5 py-4">
				<div className="relative mx-auto w-full max-w-[160px] shrink-0">
					<ResponsiveContainer width="100%" height={200}>
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
						<p className="text-sm font-bold tabular-nums">
							{formatCount(MEDICARE_RISK_ADJUSTMENT_KPIS.totalMembers)}
						</p>
						<p className="text-[10px] text-muted-foreground">Members</p>
					</div>
				</div>
				<ul className="flex min-w-0 flex-1 flex-col justify-center gap-3 py-1 text-xs leading-relaxed">
					{MEMBER_SEGMENTS.map((item) => (
						<li key={item.name} className="flex items-center justify-between gap-4">
							<span className="flex min-w-0 items-center gap-2 font-medium">
								<span
									className="size-2 shrink-0 rounded-full"
									style={{ backgroundColor: item.color }}
								/>
								{item.name}
							</span>
							<span className="shrink-0 tabular-nums text-muted-foreground">{item.pct}%</span>
						</li>
					))}
				</ul>
			</div>
		</CmsEdgeSectionPanel>
	);
}

export function MedicareRiskAdjustmentTab() {
	return (
		<div className={PAGE_STACK}>
			<RiskAdjustmentKpiRow />
			<div className={cn("grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]", SECTION_GAP)}>
				<HccCaptureTablePanel />
				<MemberSegmentsDonutPanel />
			</div>
			<CmsEdgePageFooter />
		</div>
	);
}
