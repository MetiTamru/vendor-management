"use client";

import { useState } from "react";

import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { VendorCoreGate } from "@/components/vendor-core/VendorCoreGate";
import {
	createMemberFamilyLink,
} from "@/features/admin/features/members/feature/api/membersApi";
import {
	useCreateMemberMutation,
	useVendorCoreVendors,
} from "@/features/admin/features/members/feature/queries/useMembersQuery";
import type { PendingFamilyDependent } from "@/features/admin/features/members/pages/member-family-editor";
import { MemberWriteForm } from "@/features/admin/features/members/pages/member-write-form";
import { Link, useRouter } from "@/i18n/navigation";
import { isMockEnabled } from "@/lib/mock-mode";
import type { MemberWriteBody } from "@/lib/vendor-core/types";

function MemberCreatePageInner() {
	const router = useRouter();
	const [vendorId, setVendorId] = useState("");
	const [busy, setBusy] = useState(false);
	const create = useCreateMemberMutation();
	const vendorsQ = useVendorCoreVendors();
	const vendors = (vendorsQ.data ?? [])
		.filter((v) => Boolean(v.id))
		.map((v) => ({
			id: v.id,
			name: v.name || v.legal_name || v.id,
		}));

	async function handleSubmit(
		body: MemberWriteBody,
		pendingFamily: PendingFamilyDependent[] = []
	) {
		if (!vendorId) {
			toast.error("Select a vendor");
			return;
		}
		if (!body.cardholder_id?.trim()) {
			toast.error("Cardholder ID is required");
			return;
		}
		if (!body.first_name?.trim() || !body.last_name?.trim()) {
			toast.error("First and last name are required");
			return;
		}

		setBusy(true);
		try {
			const detail = await create.mutateAsync({
				...body,
				vendor_id: vendorId,
			});
			if (!detail?.id) {
				toast.error("Member created but no id returned");
				router.push("/admin/members");
				return;
			}

			let linked = 0;
			let failed = 0;
			for (const dep of pendingFamily) {
				try {
					let dependentId = dep.dependentId;
					if (dep.kind === "create") {
						const created = await create.mutateAsync({
							vendor_id: vendorId,
							cardholder_id:
								dep.cardholderId ||
								`${body.cardholder_id}-D${linked + 1}`.slice(0, 32),
							person_code: "02",
							first_name: dep.firstName,
							last_name: dep.lastName,
							status: "active",
							relationship_code: dep.relationshipCode,
							demographics: {},
							eligibility: { status: "active" },
							plan_coverage: {},
							employment_group: {},
						});
						if (!created?.id) {
							failed += 1;
							continue;
						}
						dependentId = created.id;
					}
					if (!dependentId) {
						failed += 1;
						continue;
					}
					await createMemberFamilyLink(detail.id, {
						dependent_id: dependentId,
						relationship_code: dep.relationshipCode,
						relationship_label: dep.relationshipLabel,
					});
					linked += 1;
				} catch (err) {
					failed += 1;
					console.error("Family dependent link failed", err);
					toast.error(
						err instanceof Error
							? err.message
							: "A dependent failed to create/link"
					);
				}
			}

			if (pendingFamily.length === 0) {
				toast.success("Member created");
			} else if (failed === 0) {
				toast.success(
					`Member created with ${linked} dependent${linked === 1 ? "" : "s"}`
				);
			} else if (linked > 0) {
				toast.warning(
					`Member created; linked ${linked}, ${failed} dependent(s) failed`
				);
			} else {
				toast.warning("Member created but dependents failed to link");
			}

			router.push(`/admin/members/${detail.id}`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Create failed");
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="flex w-full flex-col gap-5 pb-8">
			<nav className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
				<Link href="/admin" className="hover:text-foreground">
					Vendor Management
				</Link>
				<ChevronRight className="size-3.5 shrink-0 opacity-60" />
				<Link href="/admin/members" className="hover:text-foreground">
					Members
				</Link>
				<ChevronRight className="size-3.5 shrink-0 opacity-60" />
				<span className="font-medium text-foreground">Add member</span>
			</nav>

			<header className="border-b border-border/50 pb-4">
				<h1 className="text-xl font-semibold tracking-tight text-foreground">
					Add member
				</h1>
			</header>

			<section className="rounded-md border border-border/70 bg-card p-4 shadow-[0_1px_0_0_rgba(15,23,42,0.04)] sm:p-5">
				<MemberWriteForm
					vendorId={vendorId}
					onVendorIdChange={setVendorId}
					vendors={vendors}
					pending={busy || create.isPending}
					submitLabel="Create member"
					showFamily
					onCancel={() => router.push("/admin/members")}
					onSubmit={(body, pendingFamily) => {
						void handleSubmit(body, pendingFamily);
					}}
				/>
			</section>
		</div>
	);
}

export function MemberCreatePage() {
	if (!isMockEnabled()) {
		return (
			<VendorCoreGate title="Add member">
				<MemberCreatePageInner />
			</VendorCoreGate>
		);
	}
	return <MemberCreatePageInner />;
}
