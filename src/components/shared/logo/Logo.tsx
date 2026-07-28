"use client";

import Image from "next/image";

import { siteConfig } from "@/constants/siteconfig";
import { cn } from "@/lib/utils";

type Props = {
	/** Compact icon + wordmark for sidebar / header */
	className?: string;
	showWordmark?: boolean;
};

export default function Logo({ className, showWordmark = true }: Props) {
	return (
		<div className={cn("flex min-w-0 items-center gap-2.5", className)}>
			<Image
				src="/images/white-logo-icon.png"
				alt={`${siteConfig.name} logo`}
				width={36}
				height={36}
				className="size-9 shrink-0 object-contain"
				priority
			/>
			{showWordmark ? (
				<span className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
					Vendor Management
				</span>
			) : null}
		</div>
	);
}
