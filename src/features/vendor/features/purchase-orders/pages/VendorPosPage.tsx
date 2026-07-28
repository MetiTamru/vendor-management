"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import { vmsApi } from "@/features/shared/vms/api";
import {
	useCurrentVendor,
	usePurchaseOrdersList,
} from "@/features/shared/vms/queries";
import { formatDate, formatMoney } from "@/features/shared/vms/utils";
import { Link } from "@/i18n/navigation";

export function VendorPosPage() {
	const { vendor } = useCurrentVendor();
	const { orders: purchaseOrders, isLoading } = usePurchaseOrdersList(
		vmsApi.currentVendorId
	);
	const visible = purchaseOrders.filter((po) => po.vendorId === vendor?.id);
	if (isLoading)
		return (
			<div className="container space-y-5 py-8">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	return (
		<div className="container space-y-6 py-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">
					Purchase orders
				</h1>
				<p className="text-sm text-muted-foreground">
					Review orders and acknowledge new commitments.
				</p>
			</div>
			<div className="overflow-hidden rounded-xl border bg-card">
				{visible.map((po) => (
					<Link
						key={po.id}
						href={`/vendor/purchase-orders/${po.id}`}
						className="grid gap-3 border-b p-5 last:border-0 hover:bg-muted/40 sm:grid-cols-[1fr_auto_auto] sm:items-center"
					>
						<div>
							<p className="font-medium">{po.number}</p>
							<p className="text-xs text-muted-foreground">
								{po.lines.length} line item{po.lines.length === 1 ? "" : "s"} ·
								Ordered {formatDate(po.orderedAt)}
							</p>
						</div>
						<p className="text-sm font-medium">
							{formatMoney(po.total, po.currency)}
						</p>
						<StatusBadge status={po.status} />
					</Link>
				))}
				{visible.length === 0 && (
					<p className="p-8 text-center text-sm text-muted-foreground">
						No purchase orders found.
					</p>
				)}
			</div>
		</div>
	);
}
