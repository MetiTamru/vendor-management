"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import { vmsApi } from "@/features/shared/vms/api";
import {
	useCurrentVendor,
	useInvoicesList,
} from "@/features/shared/vms/queries";
import { formatDate, formatMoney } from "@/features/shared/vms/utils";
import { Link } from "@/i18n/navigation";

export function VendorInvoicesPage() {
	const { vendor } = useCurrentVendor();
	const { invoices, isLoading } = useInvoicesList(vmsApi.currentVendorId);
	const visible = invoices.filter((invoice) => invoice.vendorId === vendor?.id);
	if (isLoading)
		return (
			<div className="container space-y-5 py-8">
				<Skeleton className="h-10 w-52" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	return (
		<div className="container space-y-6 py-8">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
					<p className="text-sm text-muted-foreground">
						Track invoice review, matching, and payment status.
					</p>
				</div>
				<Button asChild>
					<Link href="/vendor/invoices/create">Create invoice</Link>
				</Button>
			</div>
			<div className="overflow-hidden rounded-xl border bg-card">
				{visible.map((invoice) => (
					<Link
						key={invoice.id}
						href={`/vendor/invoices/${invoice.id}`}
						className="grid gap-3 border-b p-5 last:border-0 hover:bg-muted/40 sm:grid-cols-[1fr_auto_auto] sm:items-center"
					>
						<div>
							<p className="font-medium">{invoice.number}</p>
							<p className="text-xs text-muted-foreground">
								{invoice.poNumber ?? "No purchase order"} · Due{" "}
								{formatDate(invoice.dueDate)}
							</p>
						</div>
						<p className="text-sm font-medium">
							{formatMoney(invoice.amount, invoice.currency)}
						</p>
						<StatusBadge status={invoice.status} />
					</Link>
				))}
				{visible.length === 0 && (
					<p className="p-8 text-center text-sm text-muted-foreground">
						No invoices found.
					</p>
				)}
			</div>
		</div>
	);
}
