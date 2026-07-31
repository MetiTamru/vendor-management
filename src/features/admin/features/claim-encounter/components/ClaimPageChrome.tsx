"use client";

import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type ClaimKpiItem = {
	label: string;
	value: string;
	hint: string;
	icon: LucideIcon;
	tone: string;
};

export function ClaimPageHeader({
	title,
	description,
	actions,
}: {
	title: string;
	description: string;
	actions?: ReactNode;
}) {
	return (
		<div className="flex flex-wrap items-start justify-between gap-2">
			<div>
				<h1 className="text-lg font-medium tracking-tight sm:text-xl">
					{title}
				</h1>
				<p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
			</div>
			{actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
		</div>
	);
}

export function ClaimKpiGrid({ items }: { items: ClaimKpiItem[] }) {
	return (
		<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
			{items.map((k) => {
				const Icon = k.icon;
				return (
					<div
						key={k.label}
						className="rounded-lg border border-border/50 bg-card/70 p-2.5"
					>
						<div className="flex items-start justify-between gap-2">
							<div className="min-w-0">
								<p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
									{k.label}
								</p>
								<p className="mt-1 text-lg font-medium tabular-nums tracking-tight">
									{k.value}
								</p>
								<p className="mt-1 text-xs text-muted-foreground">{k.hint}</p>
							</div>
							<div
								className={cn(
									"flex size-8 shrink-0 items-center justify-center rounded-lg",
									k.tone
								)}
							>
								<Icon className="size-4" />
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
