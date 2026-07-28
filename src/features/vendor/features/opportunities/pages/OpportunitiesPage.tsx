"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import { useCurrentVendor, useRfxList } from "@/features/shared/vms/queries";
import { formatDate, formatMoney } from "@/features/shared/vms/utils";
import { Link } from "@/i18n/navigation";

export function OpportunitiesPage() {
	const { vendor, isLoading: vendorLoading } = useCurrentVendor();
	const { events, isLoading } = useRfxList();
	const visible = events.filter(
		(event) =>
			event.status === "published" ||
			(vendor ? event.invitedVendorIds.includes(vendor.id) : false)
	);

	if (vendorLoading || isLoading)
		return (
			<div className="container space-y-5 py-8">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-64 w-full" />
			</div>
		);

	return (
		<div className="container space-y-6 py-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Opportunities</h1>
				<p className="text-sm text-muted-foreground">
					Review sourcing events and submit competitive bids.
				</p>
			</div>
			<div className="grid gap-4 lg:grid-cols-2">
				{visible.map((event) => (
					<Link
						key={event.id}
						href={`/vendor/opportunities/${event.id}`}
						className="rounded-xl border bg-card p-5 shadow-sm transition-colors hover:bg-muted/40"
					>
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="text-xs font-medium text-muted-foreground">
									{event.number} · {event.type}
								</p>
								<h2 className="mt-1 font-semibold">{event.title}</h2>
							</div>
							<StatusBadge status={event.status} />
						</div>
						<p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
							{event.description}
						</p>
						<div className="mt-5 flex flex-wrap justify-between gap-3 text-xs text-muted-foreground">
							<span>Closes {formatDate(event.closesAt)}</span>
							<span>
								{event.budget === null
									? "Budget not disclosed"
									: formatMoney(event.budget, event.currency)}
							</span>
						</div>
					</Link>
				))}
			</div>
			{visible.length === 0 && (
				<div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
					No opportunities are currently available.
				</div>
			)}
		</div>
	);
}
