"use client";

import { useParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import { useCurrentVendor, useInvoice } from "@/features/shared/vms/queries";
import { formatDate, formatMoney } from "@/features/shared/vms/utils";

export function VendorInvoiceDetailPage() {
	const params = useParams<{ invoiceId: string }>();
	const { invoice, isLoading } = useInvoice(params.invoiceId);
	const { vendor } = useCurrentVendor();
	if (isLoading)
		return (
			<div className="container space-y-5 py-8">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	if (!invoice || invoice.vendorId !== vendor?.id)
		return (
			<div className="container py-8 text-sm text-muted-foreground">
				Invoice not found.
			</div>
		);
	const details = [
		["Invoice number", invoice.number],
		["Purchase order", invoice.poNumber ?? "Not linked"],
		["Amount", formatMoney(invoice.amount, invoice.currency)],
		[
			"Submitted",
			invoice.submittedAt ? formatDate(invoice.submittedAt) : "Not submitted",
		],
		["Due date", formatDate(invoice.dueDate)],
		[
			"Match score",
			invoice.matchScore === null ? "Pending" : `${invoice.matchScore}%`,
		],
	];
	return (
		<div className="container max-w-4xl space-y-6 py-8">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<p className="text-sm text-muted-foreground">Invoice</p>
					<h1 className="text-2xl font-semibold tracking-tight">
						{invoice.number}
					</h1>
				</div>
				<StatusBadge status={invoice.status} />
			</div>
			<section className="rounded-xl border bg-card p-6 shadow-sm">
				<h2 className="font-semibold">Invoice details</h2>
				<dl className="mt-5 grid gap-6 sm:grid-cols-2">
					{details.map(([label, value]) => (
						<div key={label}>
							<dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
								{label}
							</dt>
							<dd className="mt-1 text-sm font-medium">{value}</dd>
						</div>
					))}
				</dl>
				{invoice.status === "exception" && (
					<p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
						This invoice has a matching exception and is awaiting buyer review.
					</p>
				)}
			</section>
		</div>
	);
}
