"use client";

import Image from "next/image";

import { siteConfig } from "@/constants/siteconfig";
import { cn } from "@/lib/utils";

type Props = {
	/** Compact icon + wordmark for sidebar / header */
	className?: string;
	showWordmark?: boolean;
	/** Sidebar title — typically the active module name */
	title?: string;
};

export default function Logo({ className, showWordmark = true, title }: Props) {
	const wordmark = title ?? siteConfig.name;

	return (
		<div className={cn("flex min-w-0 items-center gap-2.5", className)}>
			<Image
				src="/images/unnamed.webp"
				alt={`${wordmark} logo`}
				width={36}
				height={36}
				className="size-9 shrink-0 rounded-full object-cover"
				priority
			/>
			{showWordmark ? (
				<span className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
					{wordmark}
				</span>
			) : null}
		</div>
	);
}
