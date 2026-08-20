import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthCardProps = {
	title: string;
	description?: string;
	children: ReactNode;
	className?: string;
};

/** Title + form stack with a sharp accent mark. */
export function AuthCard({
	title,
	description,
	children,
	className,
}: AuthCardProps) {
	return (
		<div className={cn("relative w-full", className)}>
			{/* Corner decoration */}
			<div
				aria-hidden
				className="pointer-events-none absolute -top-3 -right-3 size-16 border-t border-r border-primary/25"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -bottom-3 -left-3 size-10 border-b border-l border-primary/15"
			/>

			<header className="mb-8 space-y-3">
				<div className="flex items-center gap-3">
					<span
						aria-hidden
						className="h-8 w-1 shrink-0 rounded-sm bg-primary"
					/>
					<h1 className="font-[family-name:var(--font-poppins)] text-[1.7rem] font-semibold leading-none tracking-tight text-foreground">
						{title}
					</h1>
				</div>
				{description ? (
					<p className="pl-4 text-sm leading-relaxed text-muted-foreground">
						{description}
					</p>
				) : null}
			</header>
			{children}
		</div>
	);
}
