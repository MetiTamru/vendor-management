import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
	eyebrow?: string;
	title: string;
	description?: string;
	actions?: ReactNode;
	className?: string;
};

/** Strong, professional page title block used across admin surfaces. */
export function PageHeader({
	eyebrow,
	title,
	description,
	actions,
	className,
}: PageHeaderProps) {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-xl border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-card to-card px-5 py-6 sm:px-7 sm:py-7",
				className
			)}
		>
			<div
				aria-hidden
				className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-primary/10 blur-2xl"
			/>
			<div className="relative flex flex-wrap items-start justify-between gap-4">
				<div className="min-w-0 max-w-3xl space-y-2">
					{eyebrow ? (
						<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
							{eyebrow}
						</p>
					) : null}
					<h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
						{title}
					</h1>
					{description ? (
						<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
							{description}
						</p>
					) : null}
				</div>
				{actions ? (
					<div className="flex shrink-0 flex-wrap items-center gap-2">
						{actions}
					</div>
				) : null}
			</div>
		</div>
	);
}
