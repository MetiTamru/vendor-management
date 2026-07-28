"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import { vmsApi } from "@/features/shared/vms/api";
import {
	useContractsList,
	useCurrentVendor,
} from "@/features/shared/vms/queries";
import { formatDate, formatMoney } from "@/features/shared/vms/utils";
import { Link } from "@/i18n/navigation";

export function VendorContractsPage() {
	const { vendor } = useCurrentVendor();
	const { contracts, isLoading } = useContractsList(vmsApi.currentVendorId);
	const visible = contracts.filter(
		(contract) => contract.vendorId === vendor?.id
	);
	if (isLoading)
		return (
			<div className="container space-y-5 py-8">
				<Skeleton className="h-10 w-52" />
				<Skeleton className="h-64 w-full" />
			</div>
		);

	return (
		<div className="container space-y-6 py-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Contracts</h1>
				<p className="text-sm text-muted-foreground">
					Review agreements, terms, and renewal dates.
				</p>
			</div>
			<div className="overflow-hidden rounded-xl border bg-card">
				{visible.map((contract) => (
					<Link
						key={contract.id}
						href={`/vendor/contracts/${contract.id}`}
						className="grid gap-3 border-b p-5 last:border-0 hover:bg-muted/40 sm:grid-cols-[1fr_auto_auto] sm:items-center"
					>
						<div>
							<p className="text-xs text-muted-foreground">{contract.number}</p>
							<p className="font-medium">{contract.title}</p>
						</div>
						<div className="text-sm sm:text-right">
							<p>{formatMoney(contract.value, contract.currency)}</p>
							<p className="text-xs text-muted-foreground">
								{formatDate(contract.startDate)} –{" "}
								{formatDate(contract.endDate)}
							</p>
						</div>
						<StatusBadge status={contract.status} />
					</Link>
				))}
				{visible.length === 0 && (
					<p className="p-8 text-center text-sm text-muted-foreground">
						No contracts found.
					</p>
				)}
			</div>
		</div>
	);
}
