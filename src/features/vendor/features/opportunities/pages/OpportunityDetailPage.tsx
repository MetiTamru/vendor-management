"use client";

import { useParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import {
	useBidsList,
	useCurrentVendor,
	useRfx,
	useSubmitBidMutation,
} from "@/features/shared/vms/queries";
import { formatDate, formatMoney } from "@/features/shared/vms/utils";

export function OpportunityDetailPage() {
	const params = useParams<{ rfxId: string }>();
	const { rfx: event, isLoading } = useRfx(params.rfxId);
	const { vendor } = useCurrentVendor();
	const { bids } = useBidsList(params.rfxId);
	const submitBid = useSubmitBidMutation();
	const [amount, setAmount] = useState("");
	const [notes, setNotes] = useState("");
	const existingBid = bids.find((bid) => bid.vendorId === vendor?.id);

	async function submit(formEvent: FormEvent) {
		formEvent.preventDefault();
		if (!event || !vendor || !amount || Number(amount) <= 0) return;
		try {
			await submitBid.mutateAsync({
				rfxId: event.id,
				rfxTitle: event.title,
				vendorId: vendor.id,
				vendorName: vendor.legalName,
				amount: Number(amount),
				currency: event.currency,
				notes: notes || null,
			});
			toast.success("Bid submitted successfully");
			setAmount("");
			setNotes("");
		} catch {
			toast.error("Could not submit bid");
		}
	}

	if (isLoading)
		return (
			<div className="container space-y-5 py-8">
				<Skeleton className="h-10 w-72" />
				<Skeleton className="h-80 w-full" />
			</div>
		);
	if (!event)
		return (
			<div className="container py-8 text-sm text-muted-foreground">
				Opportunity not found.
			</div>
		);
	const canBid =
		event.status === "published" && new Date(event.closesAt) > new Date();

	return (
		<div className="container max-w-5xl space-y-6 py-8">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<p className="text-sm text-muted-foreground">
						{event.number} · {event.type}
					</p>
					<h1 className="text-2xl font-semibold tracking-tight">
						{event.title}
					</h1>
				</div>
				<StatusBadge status={event.status} />
			</div>
			<div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
				<section className="space-y-5 rounded-xl border bg-card p-6 shadow-sm">
					<div>
						<h2 className="text-sm font-semibold">Overview</h2>
						<p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
							{event.description}
						</p>
					</div>
					<dl className="grid gap-4 border-t pt-5 sm:grid-cols-2">
						<div>
							<dt className="text-xs text-muted-foreground">Category</dt>
							<dd className="mt-1 text-sm font-medium">{event.category}</dd>
						</div>
						<div>
							<dt className="text-xs text-muted-foreground">Closes</dt>
							<dd className="mt-1 text-sm font-medium">
								{formatDate(event.closesAt)}
							</dd>
						</div>
						<div>
							<dt className="text-xs text-muted-foreground">Budget</dt>
							<dd className="mt-1 text-sm font-medium">
								{event.budget === null
									? "Not disclosed"
									: formatMoney(event.budget, event.currency)}
							</dd>
						</div>
						<div>
							<dt className="text-xs text-muted-foreground">Currency</dt>
							<dd className="mt-1 text-sm font-medium">{event.currency}</dd>
						</div>
					</dl>
				</section>
				<form
					onSubmit={submit}
					className="space-y-5 rounded-xl border bg-card p-6 shadow-sm"
				>
					<div>
						<h2 className="font-semibold">
							{existingBid ? "Submit a revised bid" : "Submit bid"}
						</h2>
						{existingBid && (
							<p className="mt-1 text-xs text-muted-foreground">
								Current bid:{" "}
								{formatMoney(existingBid.amount, existingBid.currency)}
							</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="amount">Bid amount ({event.currency})</Label>
						<Input
							id="amount"
							type="number"
							min="0.01"
							step="0.01"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							disabled={!canBid}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="notes">Notes</Label>
						<Textarea
							id="notes"
							rows={5}
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							disabled={!canBid}
							placeholder="Delivery, validity, or commercial notes"
						/>
					</div>
					<Button
						className="w-full"
						type="submit"
						disabled={!canBid || submitBid.isPending}
					>
						{canBid ? "Submit bid" : "Bidding closed"}
					</Button>
				</form>
			</div>
		</div>
	);
}
