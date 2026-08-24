"use client";

import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export const settingsFieldClass = cn(
	"h-9 rounded-md border border-foreground/15 bg-background text-sm shadow-none",
	"transition-[border-color,box-shadow] duration-150",
	"hover:border-foreground/25",
	"focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"
);

export const settingsLabelClass =
	"text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground";

export function SettingsPanel({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn("overflow-hidden border border-border bg-card", className)}
		>
			{children}
		</div>
	);
}

export function SettingsSection({
	title,
	description,
	action,
	children,
	className,
	noBorder,
}: {
	title?: string;
	description?: string;
	action?: ReactNode;
	children: ReactNode;
	className?: string;
	noBorder?: boolean;
}) {
	return (
		<section
			className={cn(
				!noBorder && "border-b border-border last:border-b-0",
				className
			)}
		>
			{title ? (
				<div className="flex flex-wrap items-start justify-between gap-3 px-4 py-3 sm:px-5">
					<div className="min-w-0">
						<h2 className="text-sm font-semibold text-foreground">{title}</h2>
						{description ? (
							<p className="mt-0.5 text-xs text-muted-foreground">
								{description}
							</p>
						) : null}
					</div>
					{action}
				</div>
			) : null}
			{children}
		</section>
	);
}

export type SettingsNavItem = {
	id: string;
	label: string;
	description: string;
	icon: LucideIcon;
};

export function SettingsNav({
	items,
	activeId,
	onChange,
}: {
	items: SettingsNavItem[];
	activeId: string;
	onChange: (id: string) => void;
}) {
	return (
		<nav className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
			{items.map((item) => {
				const Icon = item.icon;
				const active = item.id === activeId;
				return (
					<button
						key={item.id}
						type="button"
						onClick={() => onChange(item.id)}
						className={cn(
							"flex min-w-[9.5rem] shrink-0 items-start gap-2.5 rounded-md border px-3 py-2.5 text-left transition-colors lg:min-w-0 lg:w-full",
							active
								? "border-primary/25 bg-primary/[0.06] text-foreground"
								: "border-transparent text-muted-foreground hover:border-border hover:bg-muted/30 hover:text-foreground"
						)}
					>
						<span
							className={cn(
								"mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border",
								active
									? "border-primary/20 bg-primary/10 text-primary"
									: "border-border/60 bg-muted/30 text-muted-foreground"
							)}
						>
							<Icon className="size-3.5" strokeWidth={2} />
						</span>
						<span className="min-w-0">
							<span className="block text-xs font-semibold">{item.label}</span>
							<span className="mt-0.5 hidden text-[10px] leading-snug text-muted-foreground lg:block">
								{item.description}
							</span>
						</span>
					</button>
				);
			})}
		</nav>
	);
}

export function SettingsMetric({
	label,
	value,
}: {
	label: string;
	value: string | number;
}) {
	return (
		<div className="rounded-md border border-border/70 bg-muted/20 px-3 py-2">
			<p className={settingsLabelClass}>{label}</p>
			<p className="mt-1 text-lg font-semibold tabular-nums tracking-tight text-foreground">
				{value}
			</p>
		</div>
	);
}
