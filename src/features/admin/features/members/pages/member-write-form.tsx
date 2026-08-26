"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	RecordFormChoice,
	RecordFormField,
	RecordFormRow,
	RecordFormSection,
} from "@/components/ui/record-form";
import { MemberFamilyEditor } from "@/features/admin/features/members/pages/member-family-editor";
import type { MemberDetail } from "@/features/admin/features/members/mock-data";
import { memberToWriteBody } from "@/features/admin/features/members/map-member-core";
import { useUpdateMemberMutation } from "@/features/admin/features/members/feature/queries/useMembersQuery";
import type { MemberWriteBody } from "@/lib/vendor-core/types";

const fieldClass = "h-8 w-full bg-background text-sm";

function emptyWrite(): MemberWriteBody {
	return {
		cardholder_id: "",
		person_code: "01",
		first_name: "",
		last_name: "",
		status: "active",
		demographics: {},
		eligibility: { status: "active" },
		plan_coverage: {},
		employment_group: {},
	};
}

function patchNested<K extends keyof MemberWriteBody>(
	body: MemberWriteBody,
	key: K,
	patch: Partial<NonNullable<MemberWriteBody[K]>>
): MemberWriteBody {
	const current = (body[key] ?? {}) as object;
	return { ...body, [key]: { ...current, ...patch } };
}

export function MemberWriteForm({
	member,
	vendorId,
	onVendorIdChange,
	vendors,
	pending,
	submitLabel,
	onSubmit,
	onCancel,
}: {
	member?: MemberDetail;
	vendorId?: string;
	onVendorIdChange?: (id: string) => void;
	vendors?: { id: string; name: string }[];
	pending?: boolean;
	submitLabel: string;
	onSubmit: (body: MemberWriteBody) => void;
	onCancel?: () => void;
}) {
	const [body, setBody] = useState<MemberWriteBody>(() =>
		member ? memberToWriteBody(member) : emptyWrite()
	);
	const demo = body.demographics ?? {};
	const elig = body.eligibility ?? {};
	const plan = body.plan_coverage ?? {};
	const group = body.employment_group ?? {};

	return (
		<div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-0.5">
			{vendors && onVendorIdChange ? (
				<RecordFormSection title="Vendor">
					<RecordFormRow>
						<RecordFormField label="Vendor">
							<select
								className="h-8 w-full rounded-md border border-input bg-background px-3 text-sm"
								value={vendorId ?? ""}
								onChange={(e) => onVendorIdChange(e.target.value)}
							>
								<option value="">Select vendor</option>
								{vendors.map((v) => (
									<option key={v.id} value={v.id}>
										{v.name}
									</option>
								))}
							</select>
						</RecordFormField>
					</RecordFormRow>
				</RecordFormSection>
			) : null}

			<RecordFormSection title="Identity">
				<RecordFormRow>
					<RecordFormField label="Cardholder ID">
						<Input
							className={fieldClass}
							value={body.cardholder_id ?? ""}
							onChange={(e) =>
								setBody({ ...body, cardholder_id: e.target.value })
							}
						/>
					</RecordFormField>
				</RecordFormRow>
				<RecordFormRow>
					<RecordFormField label="Person code">
						<Input
							className={fieldClass}
							value={body.person_code ?? ""}
							onChange={(e) =>
								setBody({ ...body, person_code: e.target.value })
							}
						/>
					</RecordFormField>
					<RecordFormField label="External ID">
						<Input
							className={fieldClass}
							value={body.external_id ?? ""}
							onChange={(e) =>
								setBody({ ...body, external_id: e.target.value })
							}
						/>
					</RecordFormField>
				</RecordFormRow>
				<RecordFormRow>
					<RecordFormField label="First name">
						<Input
							className={fieldClass}
							value={body.first_name ?? ""}
							onChange={(e) =>
								setBody({ ...body, first_name: e.target.value })
							}
						/>
					</RecordFormField>
					<RecordFormField label="Last name">
						<Input
							className={fieldClass}
							value={body.last_name ?? ""}
							onChange={(e) =>
								setBody({ ...body, last_name: e.target.value })
							}
						/>
					</RecordFormField>
				</RecordFormRow>
				<RecordFormRow>
					<RecordFormField label="Status">
						<RecordFormChoice
							value={body.status || "active"}
							onChange={(v) => setBody({ ...body, status: v })}
							options={[
								{ value: "active", label: "Active" },
								{ value: "pending", label: "Pending" },
								{ value: "inactive", label: "Inactive" },
								{ value: "termed", label: "Termed" },
							]}
						/>
					</RecordFormField>
					<RecordFormField label="Relationship code">
						<Input
							className={fieldClass}
							value={body.relationship_code ?? ""}
							onChange={(e) =>
								setBody({ ...body, relationship_code: e.target.value })
							}
							placeholder="18 = Self, 01 = Spouse…"
						/>
					</RecordFormField>
				</RecordFormRow>
				<RecordFormRow>
					<RecordFormField label="PCP name">
						<Input
							className={fieldClass}
							value={body.pcp_name ?? ""}
							onChange={(e) => setBody({ ...body, pcp_name: e.target.value })}
						/>
					</RecordFormField>
					<RecordFormField label="PCP NPI">
						<Input
							className={fieldClass}
							value={body.pcp_npi ?? ""}
							onChange={(e) => setBody({ ...body, pcp_npi: e.target.value })}
						/>
					</RecordFormField>
				</RecordFormRow>
				<RecordFormRow>
					<RecordFormField label="Program">
						<Input
							className={fieldClass}
							value={body.program ?? ""}
							onChange={(e) => setBody({ ...body, program: e.target.value })}
						/>
					</RecordFormField>
					<RecordFormField label="LOB">
						<Input
							className={fieldClass}
							value={body.lob ?? ""}
							onChange={(e) => setBody({ ...body, lob: e.target.value })}
						/>
					</RecordFormField>
				</RecordFormRow>
			</RecordFormSection>

			<RecordFormSection title="Demographics">
				<RecordFormRow>
					<RecordFormField label="Date of birth">
						<Input
							type="date"
							className={fieldClass}
							value={demo.date_of_birth ?? ""}
							onChange={(e) =>
								setBody(
									patchNested(body, "demographics", {
										date_of_birth: e.target.value || null,
									})
								)
							}
						/>
					</RecordFormField>
					<RecordFormField label="Gender">
						<Input
							className={fieldClass}
							value={demo.gender ?? ""}
							onChange={(e) =>
								setBody(
									patchNested(body, "demographics", { gender: e.target.value })
								)
							}
						/>
					</RecordFormField>
				</RecordFormRow>
				<RecordFormRow>
					<RecordFormField label="Phone">
						<Input
							className={fieldClass}
							value={demo.phone ?? ""}
							onChange={(e) =>
								setBody(
									patchNested(body, "demographics", { phone: e.target.value })
								)
							}
						/>
					</RecordFormField>
					<RecordFormField label="Email">
						<Input
							className={fieldClass}
							value={demo.email ?? ""}
							onChange={(e) =>
								setBody(
									patchNested(body, "demographics", { email: e.target.value })
								)
							}
						/>
					</RecordFormField>
				</RecordFormRow>
				<RecordFormRow>
					<RecordFormField label="Address">
						<Input
							className={fieldClass}
							value={demo.address_line1 ?? ""}
							onChange={(e) =>
								setBody(
									patchNested(body, "demographics", {
										address_line1: e.target.value,
									})
								)
							}
						/>
					</RecordFormField>
				</RecordFormRow>
				<RecordFormRow>
					<RecordFormField label="City">
						<Input
							className={fieldClass}
							value={demo.city ?? ""}
							onChange={(e) =>
								setBody(
									patchNested(body, "demographics", { city: e.target.value })
								)
							}
						/>
					</RecordFormField>
					<RecordFormField label="State">
						<Input
							className={fieldClass}
							value={demo.state ?? ""}
							onChange={(e) =>
								setBody(
									patchNested(body, "demographics", { state: e.target.value })
								)
							}
						/>
					</RecordFormField>
				</RecordFormRow>
				<RecordFormRow>
					<RecordFormField label="Postal code">
						<Input
							className={fieldClass}
							value={demo.postal_code ?? ""}
							onChange={(e) =>
								setBody(
									patchNested(body, "demographics", {
										postal_code: e.target.value,
									})
								)
							}
						/>
					</RecordFormField>
				</RecordFormRow>
			</RecordFormSection>

			<RecordFormSection title="Eligibility">
				<RecordFormRow>
					<RecordFormField label="Status">
						<RecordFormChoice
							value={elig.status || "active"}
							onChange={(v) =>
								setBody(patchNested(body, "eligibility", { status: v }))
							}
							options={[
								{ value: "active", label: "Active" },
								{ value: "pending", label: "Pending" },
								{ value: "inactive", label: "Inactive" },
								{ value: "terminated", label: "Terminated" },
							]}
						/>
					</RecordFormField>
				</RecordFormRow>
				<RecordFormRow>
					<RecordFormField label="Status effective">
						<Input
							type="date"
							className={fieldClass}
							value={elig.status_effective_date ?? ""}
							onChange={(e) =>
								setBody(
									patchNested(body, "eligibility", {
										status_effective_date: e.target.value || null,
									})
								)
							}
						/>
					</RecordFormField>
					<RecordFormField label="Enrollment date">
						<Input
							type="date"
							className={fieldClass}
							value={elig.enrollment_date ?? ""}
							onChange={(e) =>
								setBody(
									patchNested(body, "eligibility", {
										enrollment_date: e.target.value || null,
									})
								)
							}
						/>
					</RecordFormField>
				</RecordFormRow>
			</RecordFormSection>

			<RecordFormSection title="Plan coverage">
				<RecordFormRow>
					<RecordFormField label="Plan name">
						<Input
							className={fieldClass}
							value={plan.plan_name ?? ""}
							onChange={(e) =>
								setBody(
									patchNested(body, "plan_coverage", {
										plan_name: e.target.value,
									})
								)
							}
						/>
					</RecordFormField>
					<RecordFormField label="Plan code">
						<Input
							className={fieldClass}
							value={plan.plan_code ?? ""}
							onChange={(e) =>
								setBody(
									patchNested(body, "plan_coverage", {
										plan_code: e.target.value,
									})
								)
							}
						/>
					</RecordFormField>
				</RecordFormRow>
				<RecordFormRow>
					<RecordFormField label="Coverage effective">
						<Input
							type="date"
							className={fieldClass}
							value={plan.coverage_effective_date ?? ""}
							onChange={(e) =>
								setBody(
									patchNested(body, "plan_coverage", {
										coverage_effective_date: e.target.value || null,
									})
								)
							}
						/>
					</RecordFormField>
				</RecordFormRow>
			</RecordFormSection>

			<RecordFormSection title="Employment / group">
				<RecordFormRow>
					<RecordFormField label="Group ID">
						<Input
							className={fieldClass}
							value={group.group_id ?? ""}
							onChange={(e) =>
								setBody(
									patchNested(body, "employment_group", {
										group_id: e.target.value,
									})
								)
							}
						/>
					</RecordFormField>
					<RecordFormField label="Group name">
						<Input
							className={fieldClass}
							value={group.group_name ?? ""}
							onChange={(e) =>
								setBody(
									patchNested(body, "employment_group", {
										group_name: e.target.value,
									})
								)
							}
						/>
					</RecordFormField>
				</RecordFormRow>
				<RecordFormRow>
					<RecordFormField label="Client ID">
						<Input
							className={fieldClass}
							value={group.client_id ?? ""}
							onChange={(e) =>
								setBody(
									patchNested(body, "employment_group", {
										client_id: e.target.value,
									})
								)
							}
						/>
					</RecordFormField>
				</RecordFormRow>
			</RecordFormSection>

			{member?.id ? (
				<MemberFamilyEditor
					memberId={member.id}
					vendorId={member.vendorId}
					subscriberCardholderId={member.memberId}
					planName={member.planName}
					program={member.program}
					showSync={false}
					defaultSubTab="list"
				/>
			) : null}

			<div className="flex justify-end gap-2">
				{onCancel ? (
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
				) : null}
				<Button disabled={pending} onClick={() => onSubmit(body)}>
					{submitLabel}
				</Button>
			</div>
		</div>
	);
}

export function MemberEditPanel({
	member,
	onCancel,
}: {
	member: MemberDetail;
	onCancel?: () => void;
}) {
	const update = useUpdateMemberMutation();
	return (
		<MemberWriteForm
			key={member.id}
			member={member}
			pending={update.isPending}
			submitLabel="Save changes"
			onCancel={onCancel}
			onSubmit={(body) =>
				update.mutate(
					{ id: member.id, body },
					{
						onSuccess: () => {
							toast.success("Member updated");
							onCancel?.();
						},
						onError: (err) =>
							toast.error(err instanceof Error ? err.message : "Update failed"),
					}
				)
			}
		/>
	);
}
