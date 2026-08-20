"use client";

import {
	AlertTriangle,
	CheckCircle2,
	Info,
	RefreshCw,
	ShieldCheck,
	XCircle,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
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
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import {
	type ComponentStatus,
	MCR_KPIS,
	MCR_MEASURE_LIBRARY_HREF,
	MCR_READINESS_BY_DOMAIN,
	MCR_READINESS_ROWS,
	MCR_READINESS_SUMMARY,
	type ReadinessStatus,
} from "./feature/queries/useMeasureComparisonQuery";

const TABLE_HEAD =
	"h-8 bg-sky-50 px-2 text-[9px] font-semibold uppercase tracking-wide text-sky-950 dark:bg-sky-950/40 dark:text-sky-100";
const TABLE_CELL = "px-2 py-2.5 text-xs";

function scoreBarColor(score: number) {
	if (score >= 80) return "bg-emerald-500";
	if (score >= 60) return "bg-orange-500";
	return "bg-red-500";
}

function domainBarColor(score: number) {
	if (score >= 75) return "bg-emerald-500";
	if (score >= 65) return "bg-orange-500";
	return "bg-red-500";
}

function ReadinessStatusPill({ status }: { status: ReadinessStatus }) {
	const styles: Record<ReadinessStatus, string> = {
		Ready:
			"bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
		"Needs Review":
			"bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
		"At Risk":
			"bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200",
		"Not Ready": "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
	};
	return (
		<span
			className={cn(
				"inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
				styles[status]
			)}
		>
			{status}
		</span>
	);
}

function ComponentIcon({ status }: { status: ComponentStatus }) {
	if (status === "pass") {
		return (
			<CheckCircle2
				className="mx-auto size-4 text-emerald-600"
				aria-label="Pass"
			/>
		);
	}
	if (status === "warn") {
		return (
			<AlertTriangle
				className="mx-auto size-4 text-orange-500"
				aria-label="Warning"
			/>
		);
	}
	return <XCircle className="mx-auto size-4 text-red-600" aria-label="Fail" />;
}

export function ReadinessOverviewSection() {
	const chartData = MCR_READINESS_SUMMARY.map((item) => ({
		name: item.label,
		value: item.count,
		color: item.color,
	}));

	return (
		<section className="space-y-3">
			<div className="flex items-start gap-2">
				<span className="mt-0.5 flex size-7 items-center justify-center rounded-md bg-sky-500/10 text-sky-700">
					<ShieldCheck className="size-4" aria-hidden />
				</span>
				<div>
					<h2 className="text-sm font-bold uppercase tracking-wide text-sky-800 dark:text-sky-300">
						Readiness Overview
					</h2>
					<p className="text-xs text-muted-foreground">
						Check digital readiness for HEDIS measures and submission.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
				<div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className={TABLE_HEAD} rowSpan={2}>
										Measure
									</TableHead>
									<TableHead className={TABLE_HEAD} rowSpan={2}>
										Domain
									</TableHead>
									<TableHead className={TABLE_HEAD} rowSpan={2}>
										Readiness Score (0 – 100)
									</TableHead>
									<TableHead className={TABLE_HEAD} rowSpan={2}>
										Readiness Status
									</TableHead>
									<TableHead
										className={cn(TABLE_HEAD, "text-center")}
										colSpan={6}
									>
										Readiness Components
									</TableHead>
									<TableHead className={TABLE_HEAD} rowSpan={2}>
										Last Updated
									</TableHead>
									<TableHead className={TABLE_HEAD} rowSpan={2}>
										Action
									</TableHead>
								</TableRow>
								<TableRow>
									{[
										"Data Availability",
										"FHIR Resources",
										"Logic Validated",
										"Data Quality",
										"Calculation",
										"Submission Config",
									].map((label) => (
										<TableHead
											key={label}
											className={cn(TABLE_HEAD, "max-w-[4.5rem] text-center")}
										>
											{label}
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{MCR_READINESS_ROWS.map((row) => (
									<TableRow key={row.code}>
										<TableCell className={TABLE_CELL}>
											<p className="font-semibold">{row.code}</p>
											<p className="mt-0.5 max-w-[12rem] text-[11px] leading-snug text-muted-foreground">
												{row.name}
											</p>
										</TableCell>
										<TableCell
											className={cn(TABLE_CELL, "text-muted-foreground")}
										>
											{row.domain}
										</TableCell>
										<TableCell className={TABLE_CELL}>
											<p className="font-semibold tabular-nums">{row.score}</p>
											<div className="mt-1.5 h-1.5 w-24 overflow-hidden rounded-full bg-muted">
												<div
													className={cn(
														"h-full rounded-full",
														scoreBarColor(row.score)
													)}
													style={{ width: `${row.score}%` }}
												/>
											</div>
										</TableCell>
										<TableCell className={TABLE_CELL}>
											<ReadinessStatusPill status={row.status} />
										</TableCell>
										{(
											[
												"dataAvailability",
												"fhirResources",
												"logicValidated",
												"dataQuality",
												"calculation",
												"submissionConfig",
											] as const
										).map((key) => (
											<TableCell
												key={key}
												className={cn(TABLE_CELL, "text-center")}
											>
												<ComponentIcon status={row.components[key]} />
											</TableCell>
										))}
										<TableCell
											className={cn(
												TABLE_CELL,
												"whitespace-nowrap text-muted-foreground"
											)}
										>
											{row.lastUpdated}
										</TableCell>
										<TableCell className={TABLE_CELL}>
											<Button
												variant="outline"
												size="sm"
												className="h-7 border-primary/40 px-3 text-xs text-primary"
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

					<div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2.5 text-[11px] text-muted-foreground">
						<p className="inline-flex max-w-3xl items-start gap-1.5">
							<Info className="mt-0.5 size-3.5 shrink-0 text-sky-600" />
							Percentiles are based on NCQA Quality Compass® national benchmarks
							where available, otherwise internal plan benchmarks.
						</p>
						<button
							type="button"
							className="inline-flex items-center gap-1.5 hover:text-foreground"
							onClick={() => toast.success("Readiness refreshed")}
						>
							Last Updated: Jul 30, 2025 02:15 AM
							<RefreshCw className="size-3.5 text-sky-600" />
						</button>
					</div>
				</div>

				<div className="space-y-4">
					<section className="rounded-xl border border-border bg-card p-4 shadow-sm">
						<h3 className="text-sm font-semibold">Readiness Summary</h3>
						<div className="mt-3 flex flex-col items-center gap-4 sm:flex-row">
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
							<ul className="w-full space-y-2 text-xs">
								{MCR_READINESS_SUMMARY.map((item) => (
									<li
										key={item.label}
										className="flex items-center justify-between gap-2"
									>
										<span className="inline-flex items-center gap-2">
											<span
												className="size-2.5 rounded-full"
												style={{ backgroundColor: item.color }}
											/>
											{item.label}
										</span>
										<span className="tabular-nums text-muted-foreground">
											{item.count} ({item.pct}%)
										</span>
									</li>
								))}
							</ul>
						</div>
					</section>

					<section className="rounded-xl border border-border bg-card p-4 shadow-sm">
						<h3 className="text-sm font-semibold">
							Readiness by Domain (Avg Score)
						</h3>
						<div className="mt-4 space-y-3">
							{MCR_READINESS_BY_DOMAIN.map((item) => (
								<div key={item.domain} className="space-y-1">
									<div className="flex items-center justify-between gap-2 text-xs">
										<span className="text-muted-foreground">{item.domain}</span>
										<span className="font-semibold tabular-nums">
											{item.score}
										</span>
									</div>
									<div className="h-2 overflow-hidden rounded-full bg-muted">
										<div
											className={cn(
												"h-full rounded-full",
												domainBarColor(item.score)
											)}
											style={{ width: `${item.score}%` }}
										/>
									</div>
								</div>
							))}
							<div className="flex justify-between pt-1 text-[10px] tabular-nums text-muted-foreground">
								<span>0</span>
								<span>25</span>
								<span>50</span>
								<span>75</span>
								<span>100</span>
							</div>
						</div>
					</section>
				</div>
			</div>
		</section>
	);
}
