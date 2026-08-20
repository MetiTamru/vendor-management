import Image from "next/image";
import type { ReactNode } from "react";

import { siteConfig } from "@/constants/siteconfig";
import { cn } from "@/lib/utils";

type AuthShellProps = {
	children: ReactNode;
	className?: string;
};

/**
 * Auth layout — brand plane + decorated form column.
 */
export function AuthShell({ children, className }: AuthShellProps) {
	return (
		<div
			className={cn(
				"relative grid min-h-svh w-full bg-background lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]",
				className
			)}
		>
			<aside className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-11 xl:px-14 xl:py-12">
				{/* Base gradient */}
				<div
					aria-hidden
					className="absolute inset-0 bg-[linear-gradient(155deg,oklch(0.43_0.07_247)_0%,oklch(0.33_0.085_248)_42%,oklch(0.25_0.06_250)_100%)]"
				/>
				{/* Soft highlight */}
				<div
					aria-hidden
					className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_12%,oklch(1_0_0/0.16),transparent_42%)]"
				/>
				{/* Angled plane */}
				<div
					aria-hidden
					className="absolute -right-[18%] top-[-10%] h-[130%] w-[58%] rotate-[-12deg] bg-primary-foreground/[0.04]"
				/>
				{/* Edge line */}
				<div
					aria-hidden
					className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary-foreground/20 to-transparent"
				/>
				{/* Quiet geometry */}
				<div
					aria-hidden
					className="absolute bottom-[-18%] left-[-22%] size-[34rem] rounded-full border border-primary-foreground/[0.08]"
				/>
				<div
					aria-hidden
					className="absolute top-[12%] right-[-12%] size-[22rem] rounded-full border border-primary-foreground/[0.06]"
				/>
				{/* Oversized watermark */}
				<p
					aria-hidden
					className="pointer-events-none absolute -bottom-10 -right-4 select-none font-[family-name:var(--font-poppins)] text-[14rem] font-semibold leading-none tracking-tighter text-primary-foreground/[0.05]"
				>
					T
				</p>

				{/* Top mark */}
				<div className="relative z-10 flex items-center gap-3">
					<Image
						src="/images/unnamed.webp"
						alt=""
						width={40}
						height={40}
						className="size-10 rounded-full object-cover ring-1 ring-primary-foreground/25"
						priority
					/>
					<div className="leading-tight">
						<p className="font-[family-name:var(--font-poppins)] text-sm font-semibold tracking-wide">
							{siteConfig.appPublisher}
						</p>
						<p className="text-[11px] tracking-[0.16em] text-primary-foreground/50 uppercase">
							Platform
						</p>
					</div>
				</div>

				{/* Main brand block */}
				<div className="relative z-10 max-w-lg space-y-8 py-10">
					<div className="space-y-5">
						<p className="font-[family-name:var(--font-poppins)] text-[clamp(2.8rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-tight">
							{siteConfig.name}
						</p>
						<div className="flex items-center gap-4">
							<span className="h-px w-14 bg-primary-foreground/40" />
							<span className="text-[12px] font-medium tracking-[0.2em] text-primary-foreground/55 uppercase">
								Enterprise access
							</span>
						</div>
					</div>
					<p className="max-w-sm text-[15px] leading-7 text-primary-foreground/72">
						One workspace for vendors, files, and claims.
					</p>
				</div>

				{/* Footer */}
				<div className="relative z-10 flex items-end justify-between gap-6">
					<p className="text-[11px] tracking-wide text-primary-foreground/40">
						© {new Date().getFullYear()} {siteConfig.appPublisher}
					</p>
					<div className="flex gap-1.5" aria-hidden>
						<span className="size-1.5 rounded-full bg-primary-foreground/35" />
						<span className="size-1.5 rounded-full bg-primary-foreground/20" />
						<span className="size-1.5 rounded-full bg-primary-foreground/10" />
					</div>
				</div>
			</aside>

			<main className="relative flex flex-1 flex-col justify-center overflow-hidden px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
				{/* Form-side atmosphere */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.376_0.086_247.6/0.07),transparent_55%)]"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:linear-gradient(to_right,oklch(0.376_0.086_247.6/0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.376_0.086_247.6/0.04)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute top-10 right-10 hidden h-24 w-24 border border-primary/20 lg:block"
				>
					<div className="absolute top-0 left-0 size-2 bg-primary" />
					<div className="absolute right-0 bottom-0 size-2 bg-primary/60" />
				</div>
				<div
					aria-hidden
					className="pointer-events-none absolute bottom-12 left-8 hidden h-px w-28 bg-primary/25 lg:block"
				/>

				<div className="relative mx-auto w-full max-w-[26rem]">
					<div className="mb-10 flex items-center gap-3 lg:hidden">
						<Image
							src="/images/unnamed.webp"
							alt=""
							width={32}
							height={32}
							className="size-8 rounded-full object-cover"
							priority
						/>
						<span className="font-[family-name:var(--font-poppins)] text-sm font-semibold tracking-tight">
							{siteConfig.name}
						</span>
					</div>
					{children}
				</div>
			</main>
		</div>
	);
}
