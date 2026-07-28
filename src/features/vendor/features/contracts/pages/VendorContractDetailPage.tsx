"use client";

import { useParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import { useContract, useCurrentVendor } from "@/features/shared/vms/queries";
import { formatDate, formatMoney } from "@/features/shared/vms/utils";

export function VendorContractDetailPage() {
	const params = useParams<{ contractId: string }>();
	const { contract, isLoading } = useContract(params.contractId);
	const { vendor } = useCurrentVendor();
	if (isLoading)
		return (
			<div className="container space-y-5 py-8">
				<Skeleton className="h-10 w-72" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	if (!contract || contract.vendorId !== vendor?.id)
		return (
			<div className="container py-8 text-sm text-muted-foreground">
				Contract not found.
			</div>
		);

	const details = [
		["Contract number", contract.number],
		["Value", formatMoney(contract.value, contract.currency)],
		["Start date", formatDate(contract.startDate)],
		["End date", formatDate(contract.endDate)],
		["Supplier", contract.vendorName],
		["Last updated", formatDate(contract.updatedAt)],
	];
	return (
		<div className="container max-w-4xl space-y-6 py-8">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<p className="text-sm text-muted-foreground">{contract.number}</p>
					<h1 className="text-2xl font-semibold tracking-tight">
						{contract.title}
					</h1>
				</div>
				<StatusBadge status={contract.status} />
			</div>
			<section className="rounded-xl border bg-card p-6 shadow-sm">
				<h2 className="font-semibold">Agreement details</h2>
				<dl className="mt-5 grid gap-5 sm:grid-cols-2">
					{details.map(([label, value]) => (
						<div key={label}>
							<dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
								{label}
							</dt>
							<dd className="mt-1 text-sm">{value}</dd>
						</div>
					))}
				</dl>
				<div className="mt-6 border-t pt-6">
					<h2 className="text-sm font-semibold">Service-level summary</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						{contract.slaSummary ?? "No service-level summary provided."}
					</p>
				</div>
			</section>
		</div>
	);
}
