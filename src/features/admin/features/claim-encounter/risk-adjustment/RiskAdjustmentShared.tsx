"use client";

import { type ReactNode } from "react";

import { ChevronDown, ChevronLeft, ChevronRight, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CMS_EDGE_STATUS_PILL_CLASS } from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import { cn } from "@/lib/utils";

export const RA_TABLE_HEAD = "h-9 bg-muted/30 px-3 text-[11px] font-semibold text-foreground";
export const RA_TABLE_CELL = "px-3 py-2 text-sm";
export const RA_STACK = "space-y-3";

export function RaStatusPill({
	label,
	tone,
}: {
	label: string;
	tone: "success" | "warning" | "danger" | "info" | "neutral" | "purple";
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
		<span className={cn(CMS_EDGE_STATUS_PILL_CLASS, "text-[10px]", toneClass)}>{label}</span>
	);
}

export function RaCaptureBar({ pct }: { pct: number }) {
	return (
		<div className="flex min-w-[100px] items-center gap-2">
			<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
				<div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
			</div>
			<span className="shrink-0 text-xs tabular-nums text-muted-foreground">{pct.toFixed(1)}%</span>
		</div>
	);
}

export function RaCountPct({
	count,
	pct,
	tone = "default",
}: {
	count: number;
	pct: number;
	tone?: "success" | "danger" | "warning" | "default";
}) {
	const color =
		tone === "success"
			? "text-emerald-700"
			: tone === "danger"
				? "text-red-600"
				: tone === "warning"
					? "text-amber-700"
					: "text-foreground";

	return (
		<span className={cn("tabular-nums", color)}>
			{count.toLocaleString()}{" "}
			<span className="text-muted-foreground">({pct.toFixed(1)}%)</span>
		</span>
	);
}

export function RaFilterLabel({ children }: { children: ReactNode }) {
	return (
		<p className="text-[11px] font-medium text-muted-foreground">{children}</p>
	);
}

export function RaFilterPanel({ children }: { children: ReactNode }) {
	return (
		<div className="rounded-lg border border-border/70 bg-card p-3 shadow-sm">
			{children}
		</div>
	);
}

export function RaTablePagination({
	shown,
	total,
	rowsPerPage = 10,
}: {
	shown: number;
	total: number;
	rowsPerPage?: number;
}) {
	const totalPages = Math.ceil(total / rowsPerPage);

	return (
		<div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border/50 px-3 py-2 text-xs text-muted-foreground">
			<span>
				Showing 1 to {shown} of {total.toLocaleString()} entries
			</span>
			<div className="flex items-center gap-2">
				<span className="text-[11px]">Rows per page:</span>
				<Select defaultValue={String(rowsPerPage)}>
					<SelectTrigger className="h-7 w-14 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="10">10</SelectItem>
						<SelectItem value="25">25</SelectItem>
						<SelectItem value="50">50</SelectItem>
					</SelectContent>
				</Select>
				<div className="flex items-center gap-0.5">
					<Button variant="outline" size="icon" className="size-7" disabled>
						<ChevronLeft className="size-3.5" />
					</Button>
					{Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
						<Button
							key={page}
							variant={page === 1 ? "default" : "outline"}
							size="icon"
							className="size-7 text-xs"
						>
							{page}
						</Button>
					))}
					{totalPages > 5 ? (
						<>
							<span className="px-1">…</span>
							<Button variant="outline" size="icon" className="size-7 text-xs">
								{totalPages}
							</Button>
						</>
					) : null}
					<Button variant="outline" size="icon" className="size-7">
						<ChevronRight className="size-3.5" />
					</Button>
				</div>
			</div>
		</div>
	);
}

export function RaPanelLink({ children }: { children: ReactNode }) {
	return (
		<Button variant="link" size="sm" className="h-7 px-0 text-xs text-primary">
			{children}
		</Button>
	);
}

export function RaSectionTitle({
	title,
	subtitle,
	info,
	action,
}: {
	title: string;
	subtitle?: string;
	info?: boolean;
	action?: ReactNode;
}) {
	return (
		<div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 px-3 py-2">
			<div className="flex min-w-0 items-center gap-2">
				<h3 className="text-sm font-semibold text-foreground">{title}</h3>
				{info ? <Info className="size-3.5 text-muted-foreground" aria-hidden /> : null}
				{subtitle ? (
					<span className="text-xs text-muted-foreground">{subtitle}</span>
				) : null}
			</div>
			{action}
		</div>
	);
}

export function RaViewAction() {
	return (
		<Button variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs">
			View
			<ChevronDown className="size-3" />
		</Button>
	);
}

export function RaMetricCard({
	label,
	value,
	icon: Icon,
	iconClass,
}: {
	label: string;
	value: ReactNode;
	icon: React.ComponentType<{ className?: string }>;
	iconClass: string;
}) {
	return (
		<div className="rounded-lg border border-border/70 bg-card p-3 shadow-sm">
			<div className="flex items-center gap-2.5">
				<div
					className={cn(
						"flex size-9 shrink-0 items-center justify-center rounded-full text-white",
						iconClass
					)}
				>
					<Icon className="size-4" />
				</div>
				<div className="min-w-0">
					<p className="text-[11px] text-muted-foreground">{label}</p>
					<p className="text-lg font-semibold tabular-nums tracking-tight text-foreground">
						{value}
					</p>
				</div>
			</div>
		</div>
	);
}

export function RaAllFilterSelect({ label, defaultValue = "all" }: { label: string; defaultValue?: string }) {
	return (
		<div className="space-y-1">
			<RaFilterLabel>{label}</RaFilterLabel>
			<Select defaultValue={defaultValue}>
				<SelectTrigger className="h-8 w-full text-xs">
					<SelectValue placeholder="All" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
