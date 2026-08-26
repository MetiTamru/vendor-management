"use client";

import { useState } from "react";

import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	useCreateMemberMutation,
	useDeleteMemberMutation,
	useSeedMembersMutation,
	useUpdateMemberMutation,
	useVendorCoreVendors,
} from "@/features/admin/features/members/feature/queries/useMembersQuery";
import { MemberWriteForm } from "@/features/admin/features/members/pages/member-write-form";
import type { MemberWriteBody } from "@/lib/vendor-core/types";

export function MemberDirectoryActions() {
	const [open, setOpen] = useState(false);
	const [vendorId, setVendorId] = useState("");
	const create = useCreateMemberMutation();
	const seed = useSeedMembersMutation();
	const vendorsQ = useVendorCoreVendors();
	const vendors = (vendorsQ.data ?? []).map((v) => ({
		id: v.id,
		name: v.name || v.legal_name || v.id,
	}));

	return (
		<>
			<Button
				variant="outline"
				size="sm"
				className="h-9"
				disabled={seed.isPending}
				onClick={() =>
					seed.mutate(
						{
							vendor_id: vendorId || vendors[0]?.id,
							count: 2,
							force: true,
						},
						{
							onSuccess: (res) =>
								toast.success(
									res?.created != null
										? `Seeded ${res.created} member(s)`
										: "Seed complete"
								),
							onError: (err) =>
								toast.error(err instanceof Error ? err.message : "Seed failed"),
						}
					)
				}
			>
				Seed
			</Button>
			<Button size="sm" className="h-9" onClick={() => setOpen(true)}>
				Add member
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="flex max-h-[min(36rem,85vh)] w-[min(72rem,calc(100%-2rem))] flex-col overflow-hidden sm:max-w-5xl">
					<DialogHeader>
						<DialogTitle>Create member</DialogTitle>
					</DialogHeader>
					<MemberWriteForm
						vendorId={vendorId}
						onVendorIdChange={setVendorId}
						vendors={vendors}
						pending={create.isPending}
						submitLabel="Create"
						onSubmit={(body: MemberWriteBody) => {
							if (!vendorId || !body.cardholder_id) {
								toast.error("Vendor and cardholder ID are required");
								return;
							}
							create.mutate(
								{ ...body, vendor_id: vendorId },
								{
									onSuccess: () => {
										toast.success("Member created");
										setOpen(false);
									},
									onError: (err) =>
										toast.error(
											err instanceof Error ? err.message : "Create failed"
										),
								}
							);
						}}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}

export function MemberListRowDelete({
	memberId,
	firstName,
	lastName,
}: {
	memberId: string;
	firstName: string;
	lastName: string;
}) {
	const [open, setOpen] = useState(false);
	const [nextFirst, setNextFirst] = useState(firstName);
	const [nextLast, setNextLast] = useState(lastName);
	const update = useUpdateMemberMutation();
	const remove = useDeleteMemberMutation();

	return (
		<div
			className="flex items-center justify-end gap-0.5"
			onClick={(e) => e.stopPropagation()}
		>
			<Button
				type="button"
				size="icon"
				variant="ghost"
				className="size-7"
				title="Update member"
				onClick={() => setOpen(true)}
			>
				<Pencil className="size-3.5" />
				<span className="sr-only">Update</span>
			</Button>
			<Button
				type="button"
				size="icon"
				variant="ghost"
				className="size-7 text-destructive"
				title="Delete member"
				disabled={remove.isPending}
				onClick={() => {
					if (
						typeof window !== "undefined" &&
						!window.confirm("Soft-delete this member?")
					) {
						return;
					}
					remove.mutate(memberId, {
						onSuccess: () => toast.success("Member deleted"),
						onError: (err) =>
							toast.error(err instanceof Error ? err.message : "Delete failed"),
					});
				}}
			>
				<Trash2 className="size-3.5" />
				<span className="sr-only">Delete</span>
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update member</DialogTitle>
					</DialogHeader>
					<div className="space-y-3">
						<div className="space-y-1.5">
							<label className="text-sm font-medium">First name</label>
							<input
								className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
								value={nextFirst}
								onChange={(e) => setNextFirst(e.target.value)}
							/>
						</div>
						<div className="space-y-1.5">
							<label className="text-sm font-medium">Last name</label>
							<input
								className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
								value={nextLast}
								onChange={(e) => setNextLast(e.target.value)}
							/>
						</div>
						<Button
							disabled={update.isPending}
							onClick={() =>
								update.mutate(
									{
										id: memberId,
										body: {
											first_name: nextFirst,
											last_name: nextLast,
										},
									},
									{
										onSuccess: () => {
											toast.success("Member updated");
											setOpen(false);
										},
										onError: (err) =>
											toast.error(
												err instanceof Error ? err.message : "Update failed"
											),
									}
								)
							}
						>
							Save
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
