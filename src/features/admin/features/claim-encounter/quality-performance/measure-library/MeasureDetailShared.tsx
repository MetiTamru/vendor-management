"use client";

import { type ReactNode } from "react";

import { ChevronLeft, ChevronRight, ArrowDownRight, ArrowUpRight, ExternalLink, FileText, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
	CMS_EDGE_STATUS_PILL_CLASS,
	CMS_EDGE_TABLE_CONTAINER,
	CmsEdgeTableScroll,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import { cn } from "@/lib/utils";

/** Consistent spacing for measure detail tab content */
export const MEASURE_TAB_STACK = "space-y-3";
export const MEASURE_GRID_GAP = "gap-3";
export const MEASURE_PANEL_BODY = "p-3";
export const MEASURE_PANEL_BODY_STACK = "space-y-3 p-3";
export const MEASURE_CALLOUT =
	"rounded-lg border border-border/50 bg-muted/15 px-3 py-2.5 text-sm leading-relaxed text-muted-foreground";

/** Table styling — readable defaults for measure detail pages */
export const MEASURE_TABLE_CLASS = "text-sm";
export const MEASURE_TABLE_HEAD =
	"h-9 bg-muted/40 px-3 text-xs font-semibold tracking-wide text-foreground";
export const MEASURE_TABLE_CELL = "px-3 py-2 align-middle text-sm text-foreground";
export const MEASURE_TABLE_MUTED = "text-muted-foreground";

export function PanelLink({
	children,
	icon,
}: {
	children: ReactNode;
	icon?: ReactNode;
}) {
	return (
		<Button variant="link" size="sm" className="h-8 gap-1.5 px-0 text-sm text-primary">
			{icon}
			{children}
		</Button>
	);
}

export function PdfLink({ label }: { label: string }) {
	return (
		<PanelLink icon={<FileText className="size-3.5" />}>{label}</PanelLink>
	);
}

export function ExternalRefLink({ label }: { label: string }) {
	return (
		<Button
			variant="link"
			size="sm"
			className="h-auto justify-start gap-1.5 px-0 py-1 text-sm text-primary"
		>
			<span>{label}</span>
			<ExternalLink className="size-3.5" />
		</Button>
	);
}

export function MeasureStatusPill({
	label,
	tone = "neutral",
}: {
	label: string;
	tone?: "success" | "warning" | "danger" | "info" | "neutral" | "purple";
}) {
	const toneClass = {
		success: "border-emerald-200 bg-emerald-50 text-emerald-800",
		warning: "border-amber-200 bg-amber-50 text-amber-800",
		danger: "border-red-200 bg-red-50 text-red-800",
		info: "border-sky-200 bg-sky-50 text-sky-800",
		purple: "border-violet-200 bg-violet-50 text-violet-800",
		neutral: "border-border bg-muted text-muted-foreground",
	}[tone];

	return (
		<span className={cn(CMS_EDGE_STATUS_PILL_CLASS, "text-xs", toneClass)}>{label}</span>
	);
}

export function MeasureField({
	label,
	value,
	className,
}: {
	label: string;
	value: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("space-y-1", className)}>
			<p className="text-xs font-medium text-muted-foreground">{label}</p>
			<div className="text-sm leading-relaxed text-foreground">{value}</div>
		</div>
	);
}

export function MeasureFieldGrid({
	fields,
	columns = 2,
}: {
	fields: { label: string; value: ReactNode }[];
	columns?: 2 | 3;
}) {
	return (
		<div
			className={cn(
				"grid gap-3",
				columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"
			)}
		>
			{fields.map((field) => (
				<MeasureField key={field.label} label={field.label} value={field.value} />
			))}
		</div>
	);
}

export function SpecRow({ label, value }: { label: string; value: ReactNode }) {
	return (
		<div className="grid gap-2 border-b border-border/50 py-2.5 last:border-b-0 sm:grid-cols-[minmax(160px,220px)_1fr] sm:gap-4">
			<p className="text-sm font-medium text-foreground">{label}</p>
			<div className="text-sm leading-relaxed text-muted-foreground">{value}</div>
		</div>
	);
}

export function MeasureSubsection({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: ReactNode;
}) {
	return (
		<div className="space-y-2.5 rounded-lg border border-border/60 bg-muted/20 p-3">
			<div>
				<h4 className="text-sm font-semibold text-foreground">{title}</h4>
				{description ? (
					<p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
				) : null}
			</div>
			{children}
		</div>
	);
}

export function MeasureKpiCard({
	label,
	value,
	hint,
	icon: Icon,
	tone = "default",
	className,
}: {
	label: string;
	value: ReactNode;
	hint?: ReactNode;
	icon?: LucideIcon;
	tone?: "default" | "primary" | "success" | "warning" | "danger";
	className?: string;
}) {
	const toneStyles = {
		default: "border-border/70 bg-card",
		primary: "border-primary/20 bg-primary/[0.03]",
		success: "border-emerald-200/80 bg-emerald-50/50",
		warning: "border-amber-200/80 bg-amber-50/50",
		danger: "border-red-200/80 bg-red-50/50",
	};

	const valueStyles = {
		default: "text-foreground",
		primary: "text-primary",
		success: "text-emerald-700",
		warning: "text-amber-700",
		danger: "text-red-600",
	};

	return (
		<div
			className={cn(
				"rounded-lg border p-3 shadow-sm",
				toneStyles[tone],
				className
			)}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0 flex-1">
					<p className="text-xs font-medium text-muted-foreground">{label}</p>
					<p className={cn("mt-0.5 text-xl font-semibold tabular-nums tracking-tight", valueStyles[tone])}>
						{value}
					</p>
					{hint != null && hint !== "" ? (
						<div className="mt-1.5 text-xs text-muted-foreground">{hint}</div>
					) : null}
				</div>
				{Icon ? (
					<div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background/80 text-muted-foreground shadow-sm">
						<Icon className="size-4" aria-hidden />
					</div>
				) : null}
			</div>
		</div>
	);
}

export function MeasureStatTile({
	label,
	value,
	accent,
}: {
	label: string;
	value: ReactNode;
	accent?: "green" | "red" | "amber";
}) {
	const accentClass =
		accent === "green"
			? "text-emerald-700"
			: accent === "red"
				? "text-red-600"
				: accent === "amber"
					? "text-amber-700"
					: "text-foreground";

	return (
		<div className="rounded-lg border border-border/60 bg-background px-3 py-2.5">
			<p className="text-[11px] font-medium text-muted-foreground">{label}</p>
			<p className={cn("mt-0.5 text-base font-semibold tabular-nums", accentClass)}>{value}</p>
		</div>
	);
}

export function MeasurePipeline({
	steps,
}: {
	steps: { label: string; value: string | number; description?: string }[];
}) {
	return (
		<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
			{steps.map((step, index) => (
				<div key={step.label} className="relative">
					<div className="rounded-lg border border-border/60 bg-background px-3 py-2">
						<p className="text-xs font-medium text-muted-foreground">{step.label}</p>
						<p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
							{typeof step.value === "number" ? step.value.toLocaleString() : step.value}
						</p>
						{step.description ? (
							<p className="mt-0.5 text-[11px] text-muted-foreground">{step.description}</p>
						) : null}
					</div>
					{index < steps.length - 1 ? (
						<span
							className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-muted-foreground/40 lg:block"
							aria-hidden
						>
							→
						</span>
					) : null}
				</div>
			))}
		</div>
	);
}

export function MeasureActivityList({
	items,
}: {
	items: { id: string; activity: string; user: string; dateTime: string; details: string }[];
}) {
	return (
		<ul className="divide-y divide-border/50">
			{items.map((item) => (
				<li key={item.id} className="flex gap-3 px-3 py-2.5">
					<div className="mt-1.5 size-2 shrink-0 rounded-full bg-primary/70" />
					<div className="min-w-0 flex-1 space-y-1">
						<div className="flex flex-wrap items-start justify-between gap-2">
							<p className="text-sm font-medium text-foreground">{item.activity}</p>
							<time className="shrink-0 text-xs tabular-nums text-muted-foreground">
								{item.dateTime}
							</time>
						</div>
						<p className="text-sm text-muted-foreground">{item.details}</p>
						<p className="text-xs text-muted-foreground/80">by {item.user}</p>
					</div>
				</li>
			))}
		</ul>
	);
}

export function MeasureDataTable({
	columns,
	rows,
	getRowKey,
}: {
	columns: { key: string; header: string; className?: string; align?: "left" | "right" }[];
	rows: Record<string, ReactNode>[];
	getRowKey: (row: Record<string, ReactNode>, index: number) => string;
}) {
	return (
		<CmsEdgeTableScroll>
			<Table className={MEASURE_TABLE_CLASS} containerClassName={CMS_EDGE_TABLE_CONTAINER}>
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{columns.map((col) => (
							<TableHead
								key={col.key}
								className={cn(
									MEASURE_TABLE_HEAD,
									col.align === "right" && "text-right",
									col.className
								)}
							>
								{col.header}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map((row, index) => (
						<TableRow key={getRowKey(row, index)} className="hover:bg-muted/30">
							{columns.map((col) => (
								<TableCell
									key={col.key}
									className={cn(
										MEASURE_TABLE_CELL,
										col.align === "right" && "text-right tabular-nums",
										col.className
									)}
								>
									{row[col.key]}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</CmsEdgeTableScroll>
	);
}

export function MeasureBulletList({ items }: { items: string[] }) {
	return (
		<ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-muted-foreground">
			{items.map((item) => (
				<li key={item}>{item}</li>
			))}
		</ul>
	);
}

export function MeasureNumberedList({ items }: { items: string[] }) {
	return (
		<ol className="list-decimal space-y-1.5 pl-4 text-sm leading-relaxed text-muted-foreground">
			{items.map((item) => (
				<li key={item}>{item}</li>
			))}
		</ol>
	);
}

export function MeasureChangeCell({ value }: { value: number | null }) {
	if (value == null) return <span className="text-muted-foreground">N/A</span>;
	const up = value >= 0;
	return (
		<span
			className={cn(
				"inline-flex items-center gap-0.5 text-sm font-medium tabular-nums",
				up ? "text-emerald-700" : "text-red-600"
			)}
		>
			{up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
			{up ? "+" : ""}
			{value.toFixed(2)}%
		</span>
	);
}

export function MeasureGoalProgress({
	rate,
	goal,
	status,
	statusTone,
}: {
	rate: number;
	goal: number;
	status: string;
	statusTone: "met" | "near" | "below";
}) {
	const statusStyles = {
		met: "border-emerald-200 bg-emerald-50 text-emerald-800",
		near: "border-amber-200 bg-amber-50 text-amber-800",
		below: "border-red-200 bg-red-50 text-red-800",
	};

	return (
		<div className="space-y-2 rounded-lg border border-border/50 bg-muted/15 p-3">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<p className="text-xs font-medium text-muted-foreground">Performance Rate</p>
					<p className="text-2xl font-semibold tabular-nums text-primary">{rate.toFixed(2)}%</p>
				</div>
				<div className="text-right">
					<p className="text-xs font-medium text-muted-foreground">Goal</p>
					<p className="text-lg font-semibold tabular-nums text-foreground">{goal.toFixed(2)}%</p>
				</div>
				<span className={cn(CMS_EDGE_STATUS_PILL_CLASS, "text-xs", statusStyles[statusTone])}>
					{status}
				</span>
			</div>
			<div className="relative h-3 overflow-hidden rounded-full bg-muted">
				<div
					className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all"
					style={{ width: `${Math.min(rate, 100)}%` }}
				/>
				<div
					className="absolute inset-y-0 w-0.5 bg-emerald-600"
					style={{ left: `${Math.min(goal, 100)}%` }}
				/>
			</div>
			<div className="flex justify-between text-[11px] text-muted-foreground">
				<span>0%</span>
				<span className="text-emerald-700">Goal at {goal.toFixed(0)}%</span>
				<span>100%</span>
			</div>
		</div>
	);
}

export function MeasureReasonBar({
	label,
	value,
	max,
	pct,
	color,
}: {
	label: string;
	value: number;
	max: number;
	pct: number;
	color: string;
}) {
	return (
		<div className="space-y-1.5">
			<div className="flex items-center justify-between gap-2 text-sm">
				<span className="min-w-0 truncate font-medium text-foreground">{label}</span>
				<span className="shrink-0 tabular-nums text-muted-foreground">
					{value.toLocaleString()} ({pct.toFixed(1)}%)
				</span>
			</div>
			<div className="h-2 overflow-hidden rounded-full bg-muted">
				<div
					className="h-full rounded-full transition-all"
					style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
				/>
			</div>
		</div>
	);
}

export function MeasureTablePagination({
	shown,
	total,
}: {
	shown: number;
	total: number;
}) {
	return (
		<div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border/50 px-3 py-2 text-sm text-muted-foreground">
			<span>
				Showing 1 to {shown} of {total.toLocaleString()} entries
			</span>
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-1">
					<Button variant="outline" size="icon" className="size-8" disabled>
						<ChevronLeft className="size-4" />
					</Button>
					<Button variant="default" size="icon" className="size-8 text-xs">
						1
					</Button>
					<Button variant="outline" size="icon" className="size-8 text-xs">
						2
					</Button>
					<Button variant="outline" size="icon" className="size-8 text-xs">
						3
					</Button>
					<Button variant="outline" size="icon" className="size-8">
						<ChevronRight className="size-4" />
					</Button>
				</div>
				<span className="text-xs">Rows per page: 10</span>
			</div>
		</div>
	);
}

export function MeasureAsOfBar({
	asOf,
	onRefresh,
}: {
	asOf: string;
	onRefresh?: () => void;
}) {
	return (
		<div className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/15 px-3 py-2 text-xs text-muted-foreground">
			<span>
				As of <span className="font-medium text-foreground">{asOf}</span>
			</span>
			{onRefresh ? (
				<Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onRefresh}>
					Refresh
				</Button>
			) : null}
		</div>
	);
}

export function MeasureFilterField({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) {
	return (
		<div className="space-y-1.5">
			<p className="text-xs font-medium text-muted-foreground">{label}</p>
			{children}
		</div>
	);
}

export function MeasureDonutBreakdown({
	items,
	centerValue,
	centerLabel,
}: {
	items: { name: string; value: number; color: string; pct?: number }[];
	centerValue: string;
	centerLabel: string;
}) {
	const chartData = items.filter((item) => item.value > 0);

	return (
		<div className="flex min-h-[160px] gap-3">
			<div className="relative mx-auto w-full max-w-[160px] shrink-0">
				<ResponsiveContainer width="100%" height={150}>
					<PieChart>
						<Pie
							data={chartData.length > 0 ? chartData : items}
							dataKey="value"
							nameKey="name"
							innerRadius="58%"
							outerRadius="88%"
							paddingAngle={2}
							stroke="none"
							isAnimationActive={false}
						>
							{items.map((entry) => (
								<Cell key={entry.name} fill={entry.color} />
							))}
						</Pie>
					</PieChart>
				</ResponsiveContainer>
				<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
					<p className="text-base font-bold tabular-nums text-foreground">{centerValue}</p>
					<p className="text-[11px] text-muted-foreground">{centerLabel}</p>
				</div>
			</div>
			<ul className="flex flex-1 flex-col justify-center gap-2.5 text-sm">
				{items.map((item) => (
					<li key={item.name} className="flex items-center justify-between gap-2">
						<span className="flex min-w-0 items-center gap-2">
							<span
								className="size-2.5 shrink-0 rounded-full"
								style={{ backgroundColor: item.color }}
							/>
							<span className="truncate leading-snug">{item.name}</span>
						</span>
						<span className="shrink-0 tabular-nums text-muted-foreground">
							{item.value.toLocaleString()}
							{item.pct != null && item.pct > 0 ? ` (${item.pct}%)` : ""}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}

export function MeasureSectionPanel({
	title,
	subtitle,
	action,
	children,
	footer,
	bodyClassName,
}: {
	title: ReactNode;
	subtitle?: string;
	action?: ReactNode;
	children: ReactNode;
	footer?: ReactNode;
	bodyClassName?: string;
}) {
	return (
		<section className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
			<div className="flex shrink-0 items-start justify-between gap-2 border-b border-border/50 px-3 py-2">
				<div className="min-w-0">
					<h3 className="text-sm font-semibold text-foreground">{title}</h3>
					{subtitle ? (
						<p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
					) : null}
				</div>
				{action}
			</div>
			<div className={cn("min-h-0 p-3", bodyClassName)}>{children}</div>
			{footer ? <div className="shrink-0">{footer}</div> : null}
		</section>
	);
}
