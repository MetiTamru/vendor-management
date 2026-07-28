"use client";

import { type FormEvent, useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { vmsApi } from "@/features/shared/vms/api";
import {
	useCreateInvoiceMutation,
	useCurrentVendor,
	usePurchaseOrdersList,
} from "@/features/shared/vms/queries";
import { formatMoney } from "@/features/shared/vms/utils";
import { useRouter } from "@/i18n/navigation";

export function VendorInvoiceCreatePage() {
	const router = useRouter();
	const { vendor } = useCurrentVendor();
	const { orders: purchaseOrders } = usePurchaseOrdersList(
		vmsApi.currentVendorId
	);
	const createInvoice = useCreateInvoiceMutation();
	const [poId, setPoId] = useState("");
	const [number, setNumber] = useState("");
	const [amount, setAmount] = useState("");
	const orders = purchaseOrders.filter(
		(po) =>
			po.vendorId === vendor?.id && !["draft", "cancelled"].includes(po.status)
	);
	const selectedPo = orders.find((po) => po.id === poId);

	async function submit(event: FormEvent) {
		event.preventDefault();
		if (!vendor || !selectedPo || !number.trim() || Number(amount) <= 0) return;
		const now = new Date();
		const dueDate = new Date(now);
		dueDate.setDate(dueDate.getDate() + 30);
		try {
			const invoice = await createInvoice.mutateAsync({
				number: number.trim(),
				vendorId: vendor.id,
				vendorName: vendor.legalName,
				poId: selectedPo.id,
				poNumber: selectedPo.number,
				status: "submitted",
				amount: Number(amount),
				currency: selectedPo.currency,
				matchScore: null,
				submittedAt: now.toISOString(),
				dueDate: dueDate.toISOString().slice(0, 10),
			});
			toast.success("Invoice submitted");
			router.push(`/vendor/invoices/${invoice.id}`);
		} catch {
			toast.error("Could not create invoice");
		}
	}

	return (
		<div className="container max-w-2xl space-y-6 py-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">
					Create invoice
				</h1>
				<p className="text-sm text-muted-foreground">
					Submit an invoice against an eligible purchase order.
				</p>
			</div>
			<form
				onSubmit={submit}
				className="space-y-5 rounded-xl border bg-card p-6 shadow-sm"
			>
				<div className="space-y-2">
					<Label>Purchase order</Label>
					<Select value={poId} onValueChange={setPoId}>
						<SelectTrigger>
							<SelectValue placeholder="Select purchase order" />
						</SelectTrigger>
						<SelectContent>
							{orders.map((po) => (
								<SelectItem key={po.id} value={po.id}>
									{po.number} · {formatMoney(po.total, po.currency)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label htmlFor="number">Invoice number</Label>
					<Input
						id="number"
						value={number}
						onChange={(event) => setNumber(event.target.value)}
						placeholder="INV-10001"
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="amount">
						Amount{selectedPo ? ` (${selectedPo.currency})` : ""}
					</Label>
					<Input
						id="amount"
						type="number"
						min="0.01"
						step="0.01"
						value={amount}
						onChange={(event) => setAmount(event.target.value)}
						required
					/>
				</div>
				{selectedPo && Number(amount) > selectedPo.total && (
					<p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
						The amount exceeds the purchase order total and may require review.
					</p>
				)}
				<div className="flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.push("/vendor/invoices")}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						disabled={!selectedPo || createInvoice.isPending}
					>
						Submit invoice
					</Button>
				</div>
			</form>
		</div>
	);
}
