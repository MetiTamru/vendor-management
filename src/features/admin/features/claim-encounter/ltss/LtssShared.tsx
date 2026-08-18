"use client";

import type { ReactNode } from "react";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { AuthStatus } from "./feature/queries/useLtssQuery";

export const LTSS_PAGE_STACK = "space-y-4";

export const LTSS_TAB_TRIGGER_CLASS = cn(
	"inline-flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2.5 text-xs font-semibold shadow-none",
	"text-muted-foreground hover:text-foreground",
	"data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
);

export const LTSS_STATUS_PILL_CLASS =
	"inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold";

export const LTSS_TABLE_HEAD =
	"h-8 bg-muted/30 px-3 text-[11px] font-semibold text-foreground";

export const LTSS_TABLE_CELL = "px-3 py-2 text-xs";

export function formatCount(n: number) {
	return n.toLocaleString("en-US");
}

export function TrendHint({
	pct,
	suffix = "vs prior 30 days",
}: {
	pct: number;
	suffix?: string;
}) {
	const up = pct >= 0;
	const Icon = up ? ArrowUp : ArrowDown;
	return (
		<span
			className={cn(
				"inline-flex items-center gap-0.5 text-xs font-medium",
				up ? "text-emerald-600" : "text-red-600"
			)}
		>
			<Icon className="size-3" aria-hidden />
			{Math.abs(pct).toFixed(1)}% {suffix}
		</span>
	);
}

export function StatusPill({ status }: { status: AuthStatus | string }) {
	const styles: Record<string, string> = {
		Active:
			"border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
		"Near Limit":
			"border-transparent bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
		Exception:
			"border-transparent bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
		Pending:
			"border-transparent bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
		Closed:
			"border-transparent bg-muted text-muted-foreground",
		Healthy: "border-transparent bg-emerald-100 text-emerald-800",
		Review: "border-transparent bg-amber-100 text-amber-900",
		Issue: "border-transparent bg-red-100 text-red-800",
		"On Time":
			"border-transparent bg-emerald-100 text-emerald-800",
		Late: "border-transparent bg-red-100 text-red-800",
		Partial: "border-transparent bg-amber-100 text-amber-900",
	};
	return (
		<span className={cn(LTSS_STATUS_PILL_CLASS, styles[status] ?? styles.Pending)}>
			{status}
		</span>
	);
}

export function StatusDot({
	status,
}: {
	status: "Healthy" | "Review" | "Issue";
}) {
	return (
		<span className="inline-flex items-center gap-1.5 text-xs">
			<span
				className={cn(
					"size-2 rounded-full",
					status === "Healthy" && "bg-emerald-500",
					status === "Review" && "bg-amber-500",
					status === "Issue" && "bg-red-500"
				)}
			/>
			{status}
		</span>
	);
}

export function SortableHead({ children }: { children: ReactNode }) {
	return (
		<span className="inline-flex items-center gap-1">
			{children}
			<ArrowUpDown className="size-3 text-muted-foreground/70" />
		</span>
	);
}

export function PanelCard({
	title,
	action,
	children,
	className,
}: {
	title: string;
	action?: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
				className
			)}
		>
			<div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
				<h3 className="text-sm font-semibold text-foreground">{title}</h3>
				{action}
			</div>
			<div className="min-h-0 flex-1 p-0">{children}</div>
		</div>
	);
}

export function PanelLink({
	children,
	onClick,
}: {
	children: ReactNode;
	onClick?: () => void;
}) {
	return (
		<Button
			variant="link"
			size="sm"
			className="h-7 px-0 text-xs text-primary"
			onClick={onClick}
		>
			{children}
		</Button>
	);
}

export function TableFooterBar({
	from,
	to,
	total,
	page,
	pageCount,
	onPageChange,
}: {
	from: number;
	to: number;
	total: number;
	page: number;
	pageCount: number;
	onPageChange: (page: number) => void;
}) {
	const pages = Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
		if (pageCount <= 5) return i + 1;
		if (page <= 3) return i + 1;
		if (page >= pageCount - 2) return pageCount - 4 + i;
		return page - 2 + i;
	});
	const firstPage = pages[0] ?? 1;
	const lastPage = pages[pages.length - 1] ?? pageCount;

	return (
		<div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2 text-xs text-muted-foreground">
			<span>
				{from}–{to} of {total}
			</span>
			<div className="flex items-center gap-1">
				{firstPage > 1 ? (
					<>
						<PageBtn active={page === 1} onClick={() => onPageChange(1)}>
							1
						</PageBtn>
						<span className="px-1">…</span>
					</>
				) : null}
				{pages.map((p) => (
					<PageBtn key={p} active={page === p} onClick={() => onPageChange(p)}>
						{p}
					</PageBtn>
				))}
				{lastPage < pageCount ? (
					<>
						<span className="px-1">…</span>
						<PageBtn
							active={page === pageCount}
							onClick={() => onPageChange(pageCount)}
						>
							{pageCount}
						</PageBtn>
					</>
				) : null}
			</div>
		</div>
	);
}

function PageBtn({
	children,
	active,
	onClick,
}: {
	children: ReactNode;
	active?: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex size-7 items-center justify-center rounded-md text-xs font-medium transition-colors",
				active
					? "bg-primary text-primary-foreground"
					: "hover:bg-muted text-foreground"
			)}
		>
			{children}
		</button>
	);
}
