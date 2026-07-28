"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import { usePurchaseOrdersList } from "@/features/shared/vms/queries";
import { formatDate, formatMoney } from "@/features/shared/vms/utils";
import { Link } from "@/i18n/navigation";

export function PurchaseOrdersPage() {
	const { orders, isLoading, error } = usePurchaseOrdersList();
	return (
		<div className="container space-y-6 py-8">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Purchase orders</h1>
					<p className="text-sm text-muted-foreground">
						Track orders from draft through receipt.
					</p>
				</div>
				<Button asChild>
					<Link href="/admin/purchase-orders/create">
						<Plus className="mr-2 size-4" /> Create PO
					</Link>
				</Button>
			</div>
			{isLoading ? (
				<Skeleton className="h-72 w-full" />
			) : error ? (
				<p className="text-sm text-destructive">
					Unable to load purchase orders.
				</p>
			) : (
				<div className="rounded-lg border bg-card">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>PO number</TableHead>
								<TableHead>Vendor</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Ordered</TableHead>
								<TableHead>Lines</TableHead>
								<TableHead>Total</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders.map((order) => (
								<TableRow key={order.id}>
									<TableCell>
										<Link
											href={`/admin/purchase-orders/${order.id}`}
											className="font-medium hover:underline"
										>
											{order.number}
										</Link>
									</TableCell>
									<TableCell>{order.vendorName}</TableCell>
									<TableCell>
										<StatusBadge status={order.status} />
									</TableCell>
									<TableCell>{formatDate(order.orderedAt)}</TableCell>
									<TableCell>{order.lines.length}</TableCell>
									<TableCell>
										{formatMoney(order.total, order.currency)}
									</TableCell>
								</TableRow>
							))}
							{orders.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={6}
										className="h-24 text-center text-muted-foreground"
									>
										No purchase orders.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
