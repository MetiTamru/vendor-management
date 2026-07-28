"use client";

import { type FormEvent, useEffect, useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import {
	useCurrentVendor,
	useUpdateVendorMutation,
} from "@/features/shared/vms/queries";

export function ProfilePage() {
	const { vendor, isLoading } = useCurrentVendor();
	const updateVendor = useUpdateVendorMutation();
	const [editing, setEditing] = useState(false);
	const [form, setForm] = useState({
		legalName: "",
		tradeName: "",
		country: "",
		city: "",
		taxId: "",
		website: "",
		description: "",
	});

	useEffect(() => {
		if (vendor)
			setForm({
				legalName: vendor.legalName,
				tradeName: vendor.tradeName ?? "",
				country: vendor.country,
				city: vendor.city,
				taxId: vendor.taxId ?? "",
				website: vendor.website ?? "",
				description: vendor.description ?? "",
			});
	}, [vendor]);

	async function submit(event: FormEvent) {
		event.preventDefault();
		if (!vendor) return;
		try {
			await updateVendor.mutateAsync({
				id: vendor.id,
				patch: {
					...form,
					tradeName: form.tradeName || null,
					taxId: form.taxId || null,
					website: form.website || null,
					description: form.description || null,
				},
			});
			toast.success("Company profile updated");
			setEditing(false);
		} catch {
			toast.error("Could not update company profile");
		}
	}

	if (isLoading)
		return (
			<div className="container space-y-5 py-8">
				<Skeleton className="h-10 w-52" />
				<Skeleton className="h-72 w-full" />
			</div>
		);
	if (!vendor)
		return (
			<div className="container py-8 text-sm text-muted-foreground">
				Vendor profile unavailable.
			</div>
		);

	const fields = [
		["legalName", "Legal name"],
		["tradeName", "Trade name"],
		["country", "Country"],
		["city", "City"],
		["taxId", "Tax ID"],
		["website", "Website"],
	] as const;

	return (
		<div className="container max-w-4xl space-y-6 py-8">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">
						Company profile
					</h1>
					<p className="text-sm text-muted-foreground">
						Keep your legal and business information current.
					</p>
				</div>
				<StatusBadge status={vendor.status} />
			</div>
			<form
				onSubmit={submit}
				className="space-y-6 rounded-xl border bg-card p-6 shadow-sm"
			>
				<div className="grid gap-5 sm:grid-cols-2">
					{fields.map(([key, label]) => (
						<div key={key} className="space-y-2">
							<Label htmlFor={key}>{label}</Label>
							<Input
								id={key}
								value={form[key]}
								disabled={!editing}
								onChange={(event) =>
									setForm((current) => ({
										...current,
										[key]: event.target.value,
									}))
								}
								required={
									key === "legalName" || key === "country" || key === "city"
								}
							/>
						</div>
					))}
				</div>
				<div className="space-y-2">
					<Label htmlFor="description">Company description</Label>
					<Textarea
						id="description"
						rows={5}
						value={form.description}
						disabled={!editing}
						onChange={(event) =>
							setForm((current) => ({
								...current,
								description: event.target.value,
							}))
						}
					/>
				</div>
				<div>
					<p className="text-sm font-medium">Categories</p>
					<p className="mt-1 text-sm text-muted-foreground">
						{vendor.categories.join(", ") || "No categories assigned"}
					</p>
				</div>
				<div className="flex justify-end gap-2">
					{editing ? (
						<>
							<Button
								type="button"
								variant="outline"
								onClick={() => setEditing(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={updateVendor.isPending}>
								Save changes
							</Button>
						</>
					) : (
						<Button type="button" onClick={() => setEditing(true)}>
							Edit profile
						</Button>
					)}
				</div>
			</form>
		</div>
	);
}
