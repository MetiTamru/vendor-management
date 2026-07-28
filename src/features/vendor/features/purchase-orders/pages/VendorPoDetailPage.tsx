"use client";

import { useParams } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import {
	useCurrentVendor,
	usePurchaseOrder,
	useUpdatePoMutation,
} from "@/features/shared/vms/queries";
import { formatDate, formatMoney } from "@/features/shared/vms/utils";

export function VendorPoDetailPage() {
	const params = useParams<{ poId: string }>();
	const { order: purchaseOrder, isLoading } = usePurchaseOrder(params.poId);
	const { vendor } = useCurrentVendor();
	const updatePo = useUpdatePoMutation();

	async function acknowledge() {
		if (!purchaseOrder) return;
		try {
			await updatePo.mutateAsync({
				id: purchaseOrder.id,
				patch: {
					status: "acknowledged",
					acknowledgedAt: new Date().toISOString(),
				},
			});
			toast.success("Purchase order acknowledged");
		} catch {
			toast.error("Could not acknowledge purchase order");
		}
	}

	if (isLoading)
		return (
			<div className="container space-y-5 py-8">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-80 w-full" />
			</div>
		);
	if (!purchaseOrder || purchaseOrder.vendorId !== vendor?.id)
		return (
			<div className="container py-8 text-sm text-muted-foreground">
				Purchase order not found.
			</div>
		);
	return (
		<div className="container max-w-5xl space-y-6 py-8">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<p className="text-sm text-muted-foreground">Purchase order</p>
					<h1 className="text-2xl font-semibold tracking-tight">
						{purchaseOrder.number}
					</h1>
				</div>
				<div className="flex items-center gap-3">
					<StatusBadge status={purchaseOrder.status} />
					{purchaseOrder.status === "sent" && (
						<Button
							onClick={() => void acknowledge()}
							disabled={updatePo.isPending}
						>
							Acknowledge
						</Button>
					)}
				</div>
			</div>
			<section className="rounded-xl border bg-card shadow-sm">
				<div className="grid gap-4 border-b p-6 sm:grid-cols-3">
					<div>
						<p className="text-xs text-muted-foreground">Order date</p>
						<p className="mt-1 text-sm font-medium">
							{formatDate(purchaseOrder.orderedAt)}
						</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Acknowledged</p>
						<p className="mt-1 text-sm font-medium">
							{purchaseOrder.acknowledgedAt
								? formatDate(purchaseOrder.acknowledgedAt)
								: "Pending"}
						</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Total</p>
						<p className="mt-1 text-sm font-medium">
							{formatMoney(purchaseOrder.total, purchaseOrder.currency)}
						</p>
					</div>
				</div>
				<div className="p-6">
					<h2 className="font-semibold">Line items</h2>
					<div className="mt-4 divide-y rounded-lg border">
						{purchaseOrder.lines.map((line) => (
							<div
								key={line.id}
								className="grid gap-2 p-4 text-sm sm:grid-cols-[1fr_auto_auto_auto]"
							>
								<span className="font-medium">{line.description}</span>
								<span className="text-muted-foreground">
									Qty {line.quantity}
								</span>
								<span>
									{formatMoney(line.unitPrice, purchaseOrder.currency)} each
								</span>
								<span className="font-medium">
									{formatMoney(
										line.quantity * line.unitPrice,
										purchaseOrder.currency
									)}
								</span>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
