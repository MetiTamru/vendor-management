"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useVendorCoreUsersQuery } from "@/features/admin/features/users/feature/queries/useUsersQuery";
import type { MigrationCaseCreateInput } from "@/lib/vendor-core/types";

import { vendorTypeToApi } from "../feature/mappers/workQueueMappers";
import { workQueueErrorMessage } from "../feature/workQueueErrors";

const fieldClass =
	"h-9 rounded-sm border-border bg-background text-sm shadow-none";

type WorkQueueRegistrationDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (body: MigrationCaseCreateInput) => Promise<void>;
	saving?: boolean;
};

const EMPTY_FORM = {
	name: "",
	code: "",
	type: "TPA" as "TPA" | "TPV",
	wave: "1",
	serverType: "New SFTP",
	primaryContact: "",
	primaryEmail: "",
	primaryPhone: "",
	secondaryContact: "",
	secondaryEmail: "",
	secondaryPhone: "",
	assignedToId: "",
	notes: "",
	nextStep: "",
};

export function WorkQueueRegistrationDialog({
	open,
	onOpenChange,
	onSubmit,
	saving,
}: WorkQueueRegistrationDialogProps) {
	const usersQ = useVendorCoreUsersQuery();
	const [form, setForm] = useState(EMPTY_FORM);

	useEffect(() => {
		if (!open) return;
		setForm({
			...EMPTY_FORM,
			code: `TPA-${Date.now().toString().slice(-6)}`,
		});
	}, [open]);

	const users = usersQ.data ?? [];

	async function handleSubmit() {
		if (!form.name.trim()) {
			toast.error("Name is required");
			return;
		}
		if (!form.code.trim()) {
			toast.error("Code is required");
			return;
		}
		try {
			await onSubmit({
				name: form.name.trim(),
				code: form.code.trim(),
				vendor_type: vendorTypeToApi(form.type),
				wave: Number(form.wave) || 1,
				server_type: form.serverType.trim(),
				primary_contact: form.primaryContact.trim(),
				primary_email: form.primaryEmail.trim(),
				primary_phone: form.primaryPhone.trim(),
				secondary_contact: form.secondaryContact.trim(),
				secondary_email: form.secondaryEmail.trim(),
				secondary_phone: form.secondaryPhone.trim(),
				assigned_to_id: form.assignedToId || null,
				notes: form.notes.trim(),
				next_step: form.nextStep.trim(),
			});
			onOpenChange(false);
		} catch (err) {
			toast.error(workQueueErrorMessage(err, "Registration failed"));
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-sm p-0">
				<DialogHeader className="border-b border-border px-4 py-3">
					<DialogTitle className="text-base font-semibold">
						Add TPA/TPV Registration
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 px-4 py-4">
					<div className="grid gap-3 sm:grid-cols-2">
						<div className="sm:col-span-2">
							<Label className="text-xs">Name</Label>
							<Input
								value={form.name}
								onChange={(e) =>
									setForm((f) => ({ ...f, name: e.target.value }))
								}
								className={fieldClass}
								placeholder="Vendor display name"
							/>
						</div>
						<div>
							<Label className="text-xs">Code</Label>
							<Input
								value={form.code}
								onChange={(e) =>
									setForm((f) => ({ ...f, code: e.target.value }))
								}
								className={fieldClass}
							/>
						</div>
						<div>
							<Label className="text-xs">Type</Label>
							<Select
								value={form.type}
								onValueChange={(value: "TPA" | "TPV") =>
									setForm((f) => ({ ...f, type: value }))
								}
							>
								<SelectTrigger className={fieldClass}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="TPA">TPA</SelectItem>
									<SelectItem value="TPV">TPV</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label className="text-xs">Wave</Label>
							<Input
								type="number"
								min={1}
								value={form.wave}
								onChange={(e) =>
									setForm((f) => ({ ...f, wave: e.target.value }))
								}
								className={fieldClass}
							/>
						</div>
						<div>
							<Label className="text-xs">Server / feed type</Label>
							<Input
								value={form.serverType}
								onChange={(e) =>
									setForm((f) => ({ ...f, serverType: e.target.value }))
								}
								className={fieldClass}
								placeholder="New SFTP"
							/>
						</div>
						<div className="sm:col-span-2">
							<Label className="text-xs">Assigned analyst</Label>
							<Select
								value={form.assignedToId || "__none__"}
								onValueChange={(value) =>
									setForm((f) => ({
										...f,
										assignedToId: value === "__none__" ? "" : value,
									}))
								}
							>
								<SelectTrigger className={fieldClass}>
									<SelectValue placeholder="Unassigned" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="__none__">Unassigned</SelectItem>
									{users.map((user) => (
										<SelectItem key={user.id} value={user.id}>
											{user.full_name?.trim() ||
												[user.first_name, user.last_name]
													.filter(Boolean)
													.join(" ")
													.trim() ||
												user.username ||
												user.email}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div>
						<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
							Primary contact
						</p>
						<div className="grid gap-3 sm:grid-cols-2">
							<Input
								value={form.primaryContact}
								onChange={(e) =>
									setForm((f) => ({ ...f, primaryContact: e.target.value }))
								}
								className={fieldClass}
								placeholder="Contact name"
							/>
							<Input
								value={form.primaryEmail}
								onChange={(e) =>
									setForm((f) => ({ ...f, primaryEmail: e.target.value }))
								}
								className={fieldClass}
								placeholder="Email"
							/>
							<Input
								value={form.primaryPhone}
								onChange={(e) =>
									setForm((f) => ({ ...f, primaryPhone: e.target.value }))
								}
								className={fieldClass}
								placeholder="Phone"
							/>
						</div>
					</div>

					<div>
						<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
							Secondary contact
						</p>
						<div className="grid gap-3 sm:grid-cols-2">
							<Input
								value={form.secondaryContact}
								onChange={(e) =>
									setForm((f) => ({ ...f, secondaryContact: e.target.value }))
								}
								className={fieldClass}
								placeholder="Contact name"
							/>
							<Input
								value={form.secondaryEmail}
								onChange={(e) =>
									setForm((f) => ({ ...f, secondaryEmail: e.target.value }))
								}
								className={fieldClass}
								placeholder="Email"
							/>
							<Input
								value={form.secondaryPhone}
								onChange={(e) =>
									setForm((f) => ({ ...f, secondaryPhone: e.target.value }))
								}
								className={fieldClass}
								placeholder="Phone"
							/>
						</div>
					</div>

					<div>
						<Label className="text-xs">Next step</Label>
						<Input
							value={form.nextStep}
							onChange={(e) =>
								setForm((f) => ({ ...f, nextStep: e.target.value }))
							}
							className={fieldClass}
						/>
					</div>
					<div>
						<Label className="text-xs">Notes</Label>
						<Textarea
							value={form.notes}
							onChange={(e) =>
								setForm((f) => ({ ...f, notes: e.target.value }))
							}
							rows={3}
							className="min-h-[72px] resize-none rounded-sm border-border bg-background text-sm shadow-none"
						/>
					</div>
				</div>
				<DialogFooter className="border-t border-border px-4 py-3 sm:justify-end">
					<Button
						variant="outline"
						size="sm"
						className="h-9 rounded-sm shadow-none"
						onClick={() => onOpenChange(false)}
						disabled={saving}
					>
						Cancel
					</Button>
					<Button
						size="sm"
						className="h-9 rounded-sm shadow-none"
						disabled={saving}
						onClick={() => void handleSubmit()}
					>
						{saving ? "Saving…" : "Register TPA/TPV"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
