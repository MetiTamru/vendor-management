"use client";

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
import { useInvoicesList } from "@/features/shared/vms/queries";
import { formatDate, formatMoney } from "@/features/shared/vms/utils";
import { Link } from "@/i18n/navigation";

export function InvoicesPage() {
	const { invoices, isLoading, error } = useInvoicesList();
	const exceptions = invoices.filter((invoice) =>
		["exception", "submitted"].includes(invoice.status)
	).length;
	return (
		<div className="container space-y-6 py-8">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
					<p className="text-sm text-muted-foreground">
						Review invoices, matching results, and payment status.
					</p>
				</div>
				<Button variant={exceptions ? "default" : "outline"} asChild>
					<Link href="/admin/invoices/match">Match queue ({exceptions})</Link>
				</Button>
			</div>
			{isLoading ? (
				<Skeleton className="h-72 w-full" />
			) : error ? (
				<p className="text-sm text-destructive">Unable to load invoices.</p>
			) : (
				<div className="rounded-lg border bg-card">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Invoice</TableHead>
								<TableHead>Vendor</TableHead>
								<TableHead>PO</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Match</TableHead>
								<TableHead>Due</TableHead>
								<TableHead>Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{invoices.map((invoice) => (
								<TableRow key={invoice.id}>
									<TableCell>
										<Link
											href={`/admin/invoices/${invoice.id}`}
											className="font-medium hover:underline"
										>
											{invoice.number}
										</Link>
									</TableCell>
									<TableCell>{invoice.vendorName}</TableCell>
									<TableCell>{invoice.poNumber || "—"}</TableCell>
									<TableCell>
										<StatusBadge status={invoice.status} />
									</TableCell>
									<TableCell>
										{invoice.matchScore == null
											? "—"
											: `${invoice.matchScore}%`}
									</TableCell>
									<TableCell>{formatDate(invoice.dueDate)}</TableCell>
									<TableCell>
										{formatMoney(invoice.amount, invoice.currency)}
									</TableCell>
								</TableRow>
							))}
							{invoices.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={7}
										className="h-24 text-center text-muted-foreground"
									>
										No invoices.
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
