"use client";

import { Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useVendorCoreSession } from "@/components/vendor-core/VendorCoreGate";
import { cn } from "@/lib/utils";
import { getVendorCoreBaseUrl } from "@/lib/vendor-core/client";

export function VendorCoreLiveChrome({
	title,
	subtitle,
	onRefresh,
	refreshing,
	compact = false,
	children,
}: {
	title: string;
	subtitle?: string;
	onRefresh?: () => void;
	refreshing?: boolean;
	/** Hide page title block (e.g. embedded in Settings tabs). */
	compact?: boolean;
	children: React.ReactNode;
}) {
	const { signOut, shellAuth } = useVendorCoreSession();

	return (
		<div className={cn("space-y-6", compact ? "p-0" : "p-6")}>
			<div className="flex flex-wrap items-start justify-between gap-3">
				{compact ? (
					subtitle ? (
						<p className="text-sm text-muted-foreground">{subtitle}</p>
					) : (
						<span />
					)
				) : (
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
						<p className="text-muted-foreground mt-1 text-sm">
							{subtitle ?? `Live from ${getVendorCoreBaseUrl()}`}
						</p>
					</div>
				)}
				<div className="flex gap-2">
					{onRefresh ? (
						<Button
							variant="outline"
							size="sm"
							onClick={onRefresh}
							disabled={refreshing}
						>
							<RefreshCw className={cn(refreshing && "animate-spin")} />
							Refresh
						</Button>
					) : null}
					{!shellAuth ? (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								void signOut();
							}}
						>
							Disconnect
						</Button>
					) : null}
				</div>
			</div>
			{children}
		</div>
	);
}

export function VendorCoreLoadingRow({
	label = "Loading…",
}: {
	label?: string;
}) {
	return (
		<div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
			<Loader2 className="size-4 animate-spin" />
			{label}
		</div>
	);
}

export function VendorCoreErrorBanner({ message }: { message: string }) {
	return (
		<div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
			{message}
		</div>
	);
}
