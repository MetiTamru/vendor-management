"use client";

import { useState } from "react";

import {
	AlertTriangle,
	ArrowDownRight,
	ArrowRight,
	ArrowUpRight,
	BarChart3,
	CheckCircle2,
	Download,
	FileCheck2,
	Filter,
	GitBranch,
	SlidersHorizontal,
	Target,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

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
import { ClaimPageHeader } from "@/features/admin/features/claim-encounter/components/ClaimPageChrome";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import {
	MCR_COMPLIANCE_DISTRIBUTION,
	MCR_FILTERS,
	MCR_KPIS,
	MCR_MEASURES,
	MCR_MEASURE_LIBRARY_HREF,
	MCR_TOP_GAPS,
	type MeasureTrend,
} from "./feature/queries/useMeasureComparisonQuery";
import { ReadinessOverviewSection } from "./ReadinessOverviewSection";

const PAGE_STACK = "space-y-4";
const TABLE_HEAD =
	"h-9 bg-sky-50 px-3 text-[10px] font-semibold uppercase tracking-wide text-sky-950 dark:bg-sky-950/40 dark:text-sky-100";
const TABLE_CELL = "px-3 py-2.5 text-xs";

function rateBarColor(rate: number) {
	if (rate >= 80) return "bg-emerald-500";
	if (rate >= 70) return "bg-amber-400";
	if (rate >= 50) return "bg-orange-500";
	return "bg-red-500";
}

function TrendIcon({ trend }: { trend: MeasureTrend }) {
	if (trend === "up") {
		return (
			<span className="inline-flex size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
				<ArrowUpRight className="size-3.5" aria-hidden />
			</span>
		);
	}
	if (trend === "down") {
		return (
			<span className="inline-flex size-7 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
				<ArrowDownRight className="size-3.5" aria-hidden />
			</span>
		);
	}
	return (
		<span className="inline-flex size-7 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
			<ArrowRight className="size-3.5" aria-hidden />
		</span>
	);
}

function FilterBar() {
	const [year, setYear] = useState<string>(MCR_FILTERS.measurementYears[0].value);
	const [plan, setPlan] = useState<string>(MCR_FILTERS.plans[0].value);
	const [lob, setLob] = useState<string>(MCR_FILTERS.linesOfBusiness[0].value);
	const [measureSet, setMeasureSet] = useState<string>(
		MCR_FILTERS.measureSets[0].value
	);
	const [domain, setDomain] = useState<string>(MCR_FILTERS.domains[0].value);

	return (
		<div className="rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4">
			<div className="flex flex-wrap items-end gap-3">
				<label className="min-w-[12rem] flex-1 space-y-1.5">
					<span className="text-[11px] font-semibold text-muted-foreground">
						Measurement Year
					</span>
					<Select value={year} onValueChange={setYear}>
						<SelectTrigger className="h-9 bg-background text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{MCR_FILTERS.measurementYears.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</label>

				<label className="min-w-[8rem] flex-1 space-y-1.5">
					<span className="text-[11px] font-semibold text-muted-foreground">
						Plan
					</span>
					<Select value={plan} onValueChange={setPlan}>
						<SelectTrigger className="h-9 bg-background text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{MCR_FILTERS.plans.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</label>

				<label className="min-w-[8rem] flex-1 space-y-1.5">
					<span className="text-[11px] font-semibold text-muted-foreground">
						Line of Business
					</span>
					<Select value={lob} onValueChange={setLob}>
						<SelectTrigger className="h-9 bg-background text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{MCR_FILTERS.linesOfBusiness.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</label>

				<label className="min-w-[8rem] flex-1 space-y-1.5">
					<span className="text-[11px] font-semibold text-muted-foreground">
						Measure Set
					</span>
					<Select value={measureSet} onValueChange={setMeasureSet}>
						<SelectTrigger className="h-9 bg-background text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{MCR_FILTERS.measureSets.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</label>

				<label className="min-w-[8rem] flex-1 space-y-1.5">
					<span className="text-[11px] font-semibold text-muted-foreground">
						Domain
					</span>
					<Select value={domain} onValueChange={setDomain}>
						<SelectTrigger className="h-9 bg-background text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{MCR_FILTERS.domains.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</label>

				<div className="flex items-center gap-2 pb-0.5">
					<Button
						variant="outline"
						size="sm"
						className="h-9 text-xs"
						onClick={() => {
							setYear(MCR_FILTERS.measurementYears[0].value);
							setPlan(MCR_FILTERS.plans[0].value);
							setLob(MCR_FILTERS.linesOfBusiness[0].value);
							setMeasureSet(MCR_FILTERS.measureSets[0].value);
							setDomain(MCR_FILTERS.domains[0].value);
							toast.message("Filters cleared");
						}}
					>
						Clear All
					</Button>
					<Button
						size="sm"
						className="h-9 gap-1.5 text-xs"
						onClick={() => toast.success("Filters applied")}
					>
						<Filter className="size-3.5" />
						Apply Filters
					</Button>
				</div>
			</div>
		</div>
	);
}

function KpiRow() {
	return (
		<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
			<div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
				<div className="flex items-start justify-between gap-2">
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							Total Measures
						</p>
						<p className="mt-1.5 text-2xl font-semibold tabular-nums">
							{MCR_KPIS.totalMeasures.value}
						</p>
						<p className="mt-1.5 text-xs text-muted-foreground">
							{MCR_KPIS.totalMeasures.hint}
						</p>
					</div>
					<div className="flex size-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-700">
						<BarChart3 className="size-[18px]" aria-hidden />
					</div>
				</div>
			</div>

			<div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
				<div className="flex items-start justify-between gap-2">
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							Average Compliance
						</p>
						<p className="mt-1.5 text-2xl font-semibold tabular-nums">
							{MCR_KPIS.averageCompliance.value}%
						</p>
						<p className="mt-1.5 inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
							<ArrowUpRight className="size-3.5" aria-hidden />
							{MCR_KPIS.averageCompliance.delta}% vs MY 2024
						</p>
					</div>
					<div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
						<CheckCircle2 className="size-[18px]" aria-hidden />
					</div>
				</div>
			</div>

			<div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
				<div className="flex items-start justify-between gap-2">
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							Measures Meeting Target
						</p>
						<p className="mt-1.5 text-2xl font-semibold tabular-nums">
							{MCR_KPIS.meetingTarget.value}{" "}
							<span className="text-base font-medium text-muted-foreground">
								({MCR_KPIS.meetingTarget.pct}%)
							</span>
						</p>
						<p className="mt-1.5 inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
							<ArrowUpRight className="size-3.5" aria-hidden />
							{MCR_KPIS.meetingTarget.delta} vs MY 2024
						</p>
					</div>
					<div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-700">
						<Target className="size-[18px]" aria-hidden />
					</div>
				</div>
			</div>

			<div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
				<div className="flex items-start justify-between gap-2">
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							Measures Below Target
						</p>
						<p className="mt-1.5 text-2xl font-semibold tabular-nums">
							{MCR_KPIS.belowTarget.value}{" "}
							<span className="text-base font-medium text-muted-foreground">
								({MCR_KPIS.belowTarget.pct}%)
							</span>
						</p>
						<p className="mt-1.5 inline-flex items-center gap-0.5 text-xs font-medium text-red-600">
							<ArrowDownRight className="size-3.5" aria-hidden />
							{Math.abs(MCR_KPIS.belowTarget.delta)} vs MY 2024
						</p>
					</div>
					<div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10 text-red-700">
						<AlertTriangle className="size-[18px]" aria-hidden />
					</div>
				</div>
			</div>

			<div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
				<div className="flex items-start justify-between gap-2">
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							Ready for Submission
						</p>
						<p className="mt-1.5 text-2xl font-semibold tabular-nums">
							{MCR_KPIS.readyForSubmission.value}{" "}
							<span className="text-base font-medium text-muted-foreground">
								({MCR_KPIS.readyForSubmission.pct}%)
							</span>
						</p>
						<p className="mt-1.5 inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
							<ArrowUpRight className="size-3.5" aria-hidden />
							{MCR_KPIS.readyForSubmission.delta} vs MY 2024
						</p>
					</div>
					<div className="flex size-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-700">
						<FileCheck2 className="size-[18px]" aria-hidden />
					</div>
				</div>
			</div>

			<div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
				<div className="flex items-start justify-between gap-2">
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							Data Sources Monitored
						</p>
						<p className="mt-1.5 text-2xl font-semibold tabular-nums">
							{MCR_KPIS.dataSources.value}
						</p>
						<p className="mt-1.5 text-xs text-muted-foreground">
							{MCR_KPIS.dataSources.hint}
						</p>
					</div>
					<div className="flex size-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-700">
						<GitBranch className="size-[18px]" aria-hidden />
					</div>
				</div>
			</div>
		</div>
	);
}

function MeasureComparisonTable() {
	return (
		<section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
			<div className="border-b border-border px-4 py-3">
				<div className="flex items-center gap-2">
					<span className="flex size-7 items-center justify-center rounded-md bg-sky-500/10 text-sky-700">
						<BarChart3 className="size-3.5" aria-hidden />
					</span>
					<div>
						<h2 className="text-xs font-bold uppercase tracking-wide text-foreground">
							Measure Comparison
						</h2>
						<p className="text-[11px] text-muted-foreground">
							Compliance vs target, national percentile, and gap for selected
							filters.
						</p>
					</div>
				</div>
			</div>

			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className={TABLE_HEAD}>Measure</TableHead>
							<TableHead className={TABLE_HEAD}>Domain</TableHead>
							<TableHead className={TABLE_HEAD}>
								Compliance Rate (MY 2025)
							</TableHead>
							<TableHead className={TABLE_HEAD}>Target</TableHead>
							<TableHead className={TABLE_HEAD}>
								Percentile (National)
							</TableHead>
							<TableHead className={TABLE_HEAD}>Gap to Target</TableHead>
							<TableHead className={TABLE_HEAD}>Trend</TableHead>
							<TableHead className={TABLE_HEAD}>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{MCR_MEASURES.map((row) => (
							<TableRow key={row.code}>
								<TableCell className={TABLE_CELL}>
									<p className="font-semibold text-foreground">{row.code}</p>
									<p className="mt-0.5 max-w-[14rem] text-[11px] leading-snug text-muted-foreground">
										{row.name}
									</p>
								</TableCell>
								<TableCell className={cn(TABLE_CELL, "text-muted-foreground")}>
									{row.domain}
								</TableCell>
								<TableCell className={TABLE_CELL}>
									<p className="font-semibold tabular-nums">
										{row.complianceRate.toFixed(1)}%
									</p>
									<div className="mt-1.5 h-1.5 w-28 overflow-hidden rounded-full bg-muted">
										<div
											className={cn(
												"h-full rounded-full",
												rateBarColor(row.complianceRate)
											)}
											style={{
												width: `${Math.min(100, row.complianceRate)}%`,
											}}
										/>
									</div>
								</TableCell>
								<TableCell className={cn(TABLE_CELL, "tabular-nums")}>
									{row.target}%
								</TableCell>
								<TableCell className={TABLE_CELL}>
									<p className="font-semibold tabular-nums">
										{row.percentile}
										<sup className="text-[9px]">th</sup>
									</p>
									<div className="mt-1.5 h-1.5 w-20 overflow-hidden rounded-full bg-muted">
										<div
											className={cn(
												"h-full rounded-full",
												rateBarColor(row.percentile)
											)}
											style={{ width: `${row.percentile}%` }}
										/>
									</div>
								</TableCell>
								<TableCell
									className={cn(
										TABLE_CELL,
										"font-semibold tabular-nums",
										row.gapToTarget < 0 ? "text-red-600" : "text-emerald-600"
									)}
								>
									{row.gapToTarget > 0 ? "+" : ""}
									{row.gapToTarget.toFixed(1)}%
								</TableCell>
								<TableCell className={TABLE_CELL}>
									<TrendIcon trend={row.trend} />
								</TableCell>
								<TableCell className={TABLE_CELL}>
									<Button
										variant="outline"
										size="sm"
										className="h-7 border-primary/40 px-3 text-xs text-primary hover:bg-primary/5"
										asChild
									>
										<Link href={`${MCR_MEASURE_LIBRARY_HREF}/${row.code}`}>
											View
										</Link>
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="border-t border-border px-4 py-2.5">
				<Button
					variant="link"
					className="h-auto p-0 text-xs font-medium text-primary"
					asChild
				>
					<Link href={MCR_MEASURE_LIBRARY_HREF}>
						View all {MCR_KPIS.totalMeasures.value} measures
					</Link>
				</Button>
			</div>
		</section>
	);
}

function ComplianceDistributionCard() {
	const chartData = MCR_COMPLIANCE_DISTRIBUTION.map((band) => ({
		name: band.label,
		value: band.count,
		color: band.color,
	}));

	return (
		<section className="rounded-xl border border-border bg-card p-4 shadow-sm">
			<h3 className="text-sm font-semibold text-foreground">
				Compliance Rate Distribution
			</h3>
			<div className="mt-3 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
				<div className="relative h-36 w-36 shrink-0">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={chartData}
								dataKey="value"
								innerRadius={42}
								outerRadius={64}
								paddingAngle={2}
								strokeWidth={0}
							>
								{chartData.map((entry) => (
									<Cell key={entry.name} fill={entry.color} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
					<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
						<p className="text-lg font-semibold tabular-nums leading-none">
							{MCR_KPIS.totalMeasures.value}
						</p>
						<p className="text-[10px] text-muted-foreground">Measures</p>
					</div>
				</div>

				<ul className="w-full min-w-0 space-y-2">
					{MCR_COMPLIANCE_DISTRIBUTION.map((band) => (
						<li
							key={band.label}
							className="flex items-start justify-between gap-2 text-xs"
						>
							<span className="flex min-w-0 items-start gap-2">
								<span
									className="mt-1 size-2.5 shrink-0 rounded-full"
									style={{ backgroundColor: band.color }}
								/>
								<span>
									<span className="font-medium text-foreground">
										{band.range}
									</span>
									<span className="block text-[11px] text-muted-foreground">
										{band.label}
									</span>
								</span>
							</span>
							<span className="shrink-0 tabular-nums text-muted-foreground">
								{band.count} ({band.pct}%)
							</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

function TopGapsCard() {
	return (
		<section className="rounded-xl border border-border bg-card p-4 shadow-sm">
			<h3 className="text-sm font-semibold text-foreground">
				Top 5 Largest Gaps
			</h3>
			<ol className="mt-3 space-y-2.5">
				{MCR_TOP_GAPS.map((item, index) => (
					<li
						key={item.code}
						className="flex items-center justify-between gap-3 text-sm"
					>
						<span className="inline-flex items-center gap-2.5">
							<span className="flex size-6 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
								{index + 1}
							</span>
							<span className="font-semibold text-foreground">{item.code}</span>
						</span>
						<span className="font-semibold tabular-nums text-red-600">
							{item.gap.toFixed(1)}%
						</span>
					</li>
				))}
			</ol>
			<div className="mt-3 border-t border-border pt-2.5">
				<Button
					variant="link"
					className="h-auto p-0 text-xs font-medium text-primary"
					onClick={() => toast.message("Opening all gaps")}
				>
					View all gaps
				</Button>
			</div>
		</section>
	);
}

export function MeasureComparisonPage() {
	return (
		<div className={PAGE_STACK}>
			<ClaimPageHeader
				title="Measure Comparison & Readiness"
				description="Compare HEDIS measures performance and monitor readiness for digital reporting and submission."
				actions={
					<>
						<Button
							variant="outline"
							size="sm"
							className="h-9 gap-1.5 text-xs"
							onClick={() => toast.message("Filter panel")}
						>
							<SlidersHorizontal className="size-3.5" />
							Filters
						</Button>
						<Button
							size="sm"
							className="relative h-9 gap-1.5 text-xs"
							onClick={() => toast.success("Export started")}
						>
							<Download className="size-3.5" />
							Export
							<span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-background text-[9px] font-bold text-primary ring-1 ring-primary/40">
								07
							</span>
						</Button>
					</>
				}
			/>

			<FilterBar />
			<KpiRow />

			<div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
				<MeasureComparisonTable />
				<div className="space-y-4">
					<ComplianceDistributionCard />
					<TopGapsCard />
				</div>
			</div>

			<ReadinessOverviewSection />
		</div>
	);
}
