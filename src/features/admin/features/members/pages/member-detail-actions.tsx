"use client";

import { useMemo, useState } from "react";

import { Pencil, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MemberWriteForm } from "@/features/admin/features/members/pages/member-write-form";
import type { MemberDetail } from "@/features/admin/features/members/mock-data";
import {
	useCreateMemberAccumulatorMutation,
	useCreateMemberClaimMutation,
	useCreateMemberExceptionMutation,
	useDeleteMemberAccumulatorMutation,
	useDeleteMemberClaimMutation,
	useDeleteMemberExceptionMutation,
	useDeleteMemberMutation,
	useHardDeleteMemberMutation,
	useRestoreMemberMutation,
	useMemberAccumulatorsQuery,
	useMemberChangeEventsQuery,
	useMemberClaimsQuery,
	useMemberEligibilityHistoryQuery,
	useMemberExceptionsQuery,
	useMemberFamilyLinksQuery,
	useMemberPlanHistoryQuery,
	useMemberSourceRecordQuery,
	useMemberSourceRecordsQuery,
	useUpdateMemberAccumulatorMutation,
	useUpdateMemberClaimMutation,
	useUpdateMemberExceptionMutation,
	useUpdateMemberMutation,
} from "@/features/admin/features/members/feature/queries/useMembersQuery";
import { useRouter } from "@/i18n/navigation";
import { isMockEnabled } from "@/lib/mock-mode";

type Tab =
	| "Edit"
	| "Overview"
	| "Demographics"
	| "Eligibility"
	| "Coverage & Plan History"
	| "Family / Dependents"
	| "Claims & Encounters"
	| "Accumulators"
	| "Vendor / Source History"
	| "Eligibility Exceptions"
	| "Change Events";

/**
 * Merge nested list API results into the detail payload for the active tab.
 * Detail already includes ~20-row slices; lists replace those when loaded.
 */
export function useMemberTabData(
	memberId: string,
	base: MemberDetail | undefined,
	tab: Tab,
	_claimsPane: "claims" | "encounters"
): MemberDetail | undefined {
	const useApi = !isMockEnabled();
	const elig = useMemberEligibilityHistoryQuery(
		memberId,
		useApi && (tab === "Eligibility" || tab === "Overview")
	);
	const plans = useMemberPlanHistoryQuery(
		memberId,
		useApi && tab === "Coverage & Plan History"
	);
	const exceptions = useMemberExceptionsQuery(
		memberId,
		useApi && (tab === "Eligibility Exceptions" || tab === "Eligibility")
	);
	const accumulators = useMemberAccumulatorsQuery(
		memberId,
		useApi && (tab === "Accumulators" || tab === "Overview")
	);
	const claims = useMemberClaimsQuery(
		memberId,
		undefined,
		useApi && (tab === "Claims & Encounters" || tab === "Overview")
	);
	const encounters = useMemberClaimsQuery(
		memberId,
		"encounter",
		useApi && (tab === "Claims & Encounters" || tab === "Overview")
	);
	const sources = useMemberSourceRecordsQuery(
		memberId,
		useApi && tab === "Vendor / Source History"
	);
	const familyLinks = useMemberFamilyLinksQuery(
		memberId,
		useApi && tab === "Family / Dependents"
	);

	return useMemo(() => {
		if (!base) return undefined;
		if (!useApi) return base;
		const next: MemberDetail = { ...base };
		if (elig.data) next.eligibilityHistory = elig.data;
		if (plans.data) next.planHistory = plans.data;
		if (exceptions.data) next.exceptions = exceptions.data;
		if (accumulators.data) next.accumulators = accumulators.data;
		if (claims.data) {
			next.claims = claims.data.filter((c) => c.type !== "Encounter");
		}
		if (encounters.data) next.encounters = encounters.data;
		if (familyLinks.data !== undefined) next.dependents = familyLinks.data;
		if (sources.data?.length) {
			next.vendorHistory = sources.data.map((s) => ({
				id: s.id,
				vendor: s.sourceSystem,
				fileFeedType: "Eligibility",
				lastReceived: s.fileReceivedAt,
				status:
					s.recordStatus === "processed"
						? ("success" as const)
						: ("warning" as const),
				frequency: "As received",
				recordsProcessed: 1,
				direction: "Inbound" as const,
			}));
			next.sourceFileName =
				sources.data[0]?.originalFilename ?? next.sourceFileName;
			next.sourceFileReceived =
				sources.data[0]?.fileReceivedAt ?? next.sourceFileReceived;
			next.recordStatus = sources.data[0]?.recordStatus ?? next.recordStatus;
			next.changeDetected =
				sources.data[0]?.changeSummary ?? next.changeDetected;
		}
		return next;
	}, [
		base,
		useApi,
		elig.data,
		plans.data,
		exceptions.data,
		accumulators.data,
		claims.data,
		encounters.data,
		familyLinks.data,
		sources.data,
	]);
}

export function MemberCreateExceptionButton({
	memberId,
}: {
	memberId: string;
}) {
	const [open, setOpen] = useState(false);
	const [exceptionType, setExceptionType] = useState("");
	const [description, setDescription] = useState("");
	const mutation = useCreateMemberExceptionMutation(memberId);

	return (
		<>
			<Button size="sm" variant="outline" onClick={() => setOpen(true)}>
				Add exception
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create eligibility exception</DialogTitle>
					</DialogHeader>
					<div className="space-y-3">
						<div className="space-y-1.5">
							<Label>Type</Label>
							<Input
								value={exceptionType}
								onChange={(e) => setExceptionType(e.target.value)}
							/>
						</div>
						<div className="space-y-1.5">
							<Label>Description</Label>
							<Input
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
						<Button
							disabled={mutation.isPending}
							onClick={() => {
								mutation.mutate(
									{
										exception_type: exceptionType,
										description,
										status: "open",
										source: "ops",
									},
									{
										onSuccess: () => {
											toast.success("Exception created");
											setOpen(false);
											setExceptionType("");
											setDescription("");
										},
										onError: (err) =>
											toast.error(
												err instanceof Error ? err.message : "Create failed"
											),
									}
								);
							}}
						>
							Save
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

export function MemberCreateAccumulatorButton({
	memberId,
}: {
	memberId: string;
}) {
	const [open, setOpen] = useState(false);
	const [label, setLabel] = useState("");
	const [limit, setLimit] = useState("1500");
	const [remaining, setRemaining] = useState("1500");
	const mutation = useCreateMemberAccumulatorMutation(memberId);

	return (
		<>
			<Button size="sm" variant="outline" onClick={() => setOpen(true)}>
				Add accumulator
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create / upsert accumulator</DialogTitle>
					</DialogHeader>
					<div className="space-y-3">
						<div className="space-y-1.5">
							<Label>Label</Label>
							<Input value={label} onChange={(e) => setLabel(e.target.value)} />
						</div>
						<div className="space-y-1.5">
							<Label>Limit</Label>
							<Input
								type="number"
								value={limit}
								onChange={(e) => setLimit(e.target.value)}
							/>
						</div>
						<div className="space-y-1.5">
							<Label>Remaining</Label>
							<Input
								type="number"
								value={remaining}
								onChange={(e) => setRemaining(e.target.value)}
							/>
						</div>
						<Button
							disabled={mutation.isPending || !label.trim()}
							onClick={() => {
								mutation.mutate(
									{
										label: label.trim(),
										limit: Number(limit) || 0,
										remaining: Number(remaining) || 0,
										individual: 0,
										family: 0,
									},
									{
										onSuccess: () => {
											toast.success("Accumulator saved");
											setOpen(false);
										},
										onError: (err) =>
											toast.error(
												err instanceof Error ? err.message : "Create failed"
											),
									}
								);
							}}
						>
							Save
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

export function MemberCreateClaimButton({ memberId }: { memberId: string }) {
	const [open, setOpen] = useState(false);
	const [claimNumber, setClaimNumber] = useState("");
	const [provider, setProvider] = useState("");
	const [kind, setKind] = useState("medical");
	const mutation = useCreateMemberClaimMutation(memberId);

	return (
		<>
			<Button size="sm" variant="outline" onClick={() => setOpen(true)}>
				Add claim
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create claim / encounter</DialogTitle>
					</DialogHeader>
					<div className="space-y-3">
						<div className="space-y-1.5">
							<Label>Claim number</Label>
							<Input
								value={claimNumber}
								onChange={(e) => setClaimNumber(e.target.value)}
							/>
						</div>
						<div className="space-y-1.5">
							<Label>Provider</Label>
							<Input
								value={provider}
								onChange={(e) => setProvider(e.target.value)}
							/>
						</div>
						<div className="space-y-1.5">
							<Label>Kind</Label>
							<Input
								value={kind}
								onChange={(e) => setKind(e.target.value)}
								placeholder="medical | pharmacy | encounter | …"
							/>
						</div>
						<Button
							disabled={mutation.isPending}
							onClick={() => {
								mutation.mutate(
									{
										claim_number: claimNumber,
										provider_name: provider,
										claim_kind: kind,
										status: "pending",
										billed_amount: 0,
										paid_amount: 0,
									},
									{
										onSuccess: () => {
											toast.success("Claim created");
											setOpen(false);
										},
										onError: (err) =>
											toast.error(
												err instanceof Error ? err.message : "Create failed"
											),
									}
								);
							}}
						>
							Save
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

function confirmDelete(label: string) {
	return typeof window !== "undefined"
		? window.confirm(`Delete this ${label}?`)
		: false;
}

export function MemberExceptionRowActions({
	memberId,
	exceptionId,
	status,
}: {
	memberId: string;
	exceptionId: string;
	status: string;
}) {
	const [open, setOpen] = useState(false);
	const [nextStatus, setNextStatus] = useState(status);
	const [resolution, setResolution] = useState("");
	const update = useUpdateMemberExceptionMutation(memberId);
	const remove = useDeleteMemberExceptionMutation(memberId);

	return (
		<div className="flex gap-0.5" onClick={(e) => e.stopPropagation()}>
			<Button
				type="button"
				size="icon"
				variant="ghost"
				className="size-7"
				title="Update exception"
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
				title="Delete exception"
				disabled={remove.isPending}
				onClick={() => {
					if (!confirmDelete("exception")) return;
					remove.mutate(exceptionId, {
						onSuccess: () => toast.success("Exception deleted"),
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
						<DialogTitle>Update exception</DialogTitle>
					</DialogHeader>
					<div className="space-y-3">
						<div className="space-y-1.5">
							<Label>Status</Label>
							<Input
								value={nextStatus}
								onChange={(e) => setNextStatus(e.target.value)}
								placeholder="open | in_progress | resolved"
							/>
						</div>
						<div className="space-y-1.5">
							<Label>Resolution</Label>
							<Input
								value={resolution}
								onChange={(e) => setResolution(e.target.value)}
							/>
						</div>
						<Button
							disabled={update.isPending}
							onClick={() =>
								update.mutate(
									{
										exceptionId,
										body: {
											status: nextStatus,
											resolution,
										},
									},
									{
										onSuccess: () => {
											toast.success("Exception updated");
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

export function MemberAccumulatorRowActions({
	memberId,
	accumulatorId,
	label,
	limit,
	remaining,
}: {
	memberId: string;
	accumulatorId: string;
	label: string;
	limit: number;
	remaining: number;
}) {
	const [open, setOpen] = useState(false);
	const [nextLimit, setNextLimit] = useState(String(limit));
	const [nextRemaining, setNextRemaining] = useState(String(remaining));
	const update = useUpdateMemberAccumulatorMutation(memberId);
	const remove = useDeleteMemberAccumulatorMutation(memberId);

	return (
		<div className="flex gap-0.5">
			<Button
				type="button"
				size="icon"
				variant="ghost"
				className="size-7"
				title="Update accumulator"
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
				title="Delete accumulator"
				disabled={remove.isPending}
				onClick={() => {
					if (!confirmDelete("accumulator")) return;
					remove.mutate(accumulatorId, {
						onSuccess: () => toast.success("Accumulator deleted"),
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
						<DialogTitle>Update {label}</DialogTitle>
					</DialogHeader>
					<div className="space-y-3">
						<div className="space-y-1.5">
							<Label>Limit</Label>
							<Input
								type="number"
								value={nextLimit}
								onChange={(e) => setNextLimit(e.target.value)}
							/>
						</div>
						<div className="space-y-1.5">
							<Label>Remaining</Label>
							<Input
								type="number"
								value={nextRemaining}
								onChange={(e) => setNextRemaining(e.target.value)}
							/>
						</div>
						<Button
							disabled={update.isPending}
							onClick={() =>
								update.mutate(
									{
										accumulatorId,
										body: {
											limit: Number(nextLimit) || 0,
											remaining: Number(nextRemaining) || 0,
										},
									},
									{
										onSuccess: () => {
											toast.success("Accumulator updated");
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

export function MemberClaimRowActions({
	memberId,
	claimId,
	status,
}: {
	memberId: string;
	claimId: string;
	status: string;
}) {
	const [open, setOpen] = useState(false);
	const [nextStatus, setNextStatus] = useState(status);
	const update = useUpdateMemberClaimMutation(memberId);
	const remove = useDeleteMemberClaimMutation(memberId);

	return (
		<div className="flex gap-0.5">
			<Button
				type="button"
				size="icon"
				variant="ghost"
				className="size-7"
				title="Update claim"
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
				title="Delete claim"
				disabled={remove.isPending}
				onClick={() => {
					if (!confirmDelete("claim")) return;
					remove.mutate(claimId, {
						onSuccess: () => toast.success("Claim deleted"),
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
						<DialogTitle>Update claim</DialogTitle>
					</DialogHeader>
					<div className="space-y-3">
						<div className="space-y-1.5">
							<Label>Status</Label>
							<Input
								value={nextStatus}
								onChange={(e) => setNextStatus(e.target.value)}
								placeholder="pending | paid | denied"
							/>
						</div>
						<Button
							disabled={update.isPending}
							onClick={() =>
								update.mutate(
									{ claimId, body: { status: nextStatus } },
									{
										onSuccess: () => {
											toast.success("Claim updated");
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

export function MemberChangeEventsPanel({ memberId }: { memberId: string }) {
	const query = useMemberChangeEventsQuery(memberId, !isMockEnabled());
	const rows = query.data ?? [];

	return (
		<section className="rounded-xl border border-border/40 bg-card p-4 shadow-sm">
			<h3 className="text-sm font-semibold">Change events</h3>
			{query.isLoading ? (
				<p className="mt-2 text-sm text-muted-foreground">Loading…</p>
			) : rows.length === 0 ? (
				<p className="mt-2 text-sm text-muted-foreground">No change events.</p>
			) : (
				<ul className="mt-3 space-y-2">
					{rows.map((row) => (
						<li
							key={row.id}
							className="rounded-md border border-border/30 px-3 py-2 text-sm"
						>
							<p className="font-medium">
								{row.category}: {row.fieldName}
							</p>
							<p className="text-xs text-muted-foreground">
								{row.oldValue} → {row.newValue}
							</p>
							<p className="text-[11px] text-muted-foreground">{row.createdAt}</p>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}

export function MemberSourceRecordViewer({
	memberId,
	recordId,
	open,
	onOpenChange,
}: {
	memberId: string;
	recordId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const q = useMemberSourceRecordQuery(
		memberId,
		recordId,
		open && Boolean(recordId)
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Full source record</DialogTitle>
				</DialogHeader>
				{q.isLoading ? (
					<p className="text-sm text-muted-foreground">Loading…</p>
				) : q.error ? (
					<p className="text-sm text-destructive">{q.error.message}</p>
				) : (
					<pre className="max-h-[60vh] overflow-auto rounded-md bg-muted/40 p-3 text-xs">
						{JSON.stringify(q.data ?? {}, null, 2)}
					</pre>
				)}
			</DialogContent>
		</Dialog>
	);
}

export function MemberProfileActions({
	member,
	onEdit,
}: {
	member: MemberDetail;
	onEdit?: () => void;
}) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const update = useUpdateMemberMutation();
	const softDelete = useDeleteMemberMutation();
	const hardDelete = useHardDeleteMemberMutation();
	const restore = useRestoreMemberMutation();
	const memberId = member.id;

	function afterGone() {
		toast.success("Member removed");
		router.push("/admin/members");
	}

	return (
		<div className="flex flex-wrap items-center gap-1">
			<Button
				type="button"
				variant="outline"
				size="icon"
				className="size-8"
				title="Edit member"
				onClick={() => (onEdit ? onEdit() : setOpen(true))}
			>
				<Pencil className="size-3.5" />
				<span className="sr-only">Update member</span>
			</Button>
			{member.status === "active" ? (
				<Button
					type="button"
					variant="outline"
					size="icon"
					className="size-8 text-destructive"
					title="Delete member"
					disabled={softDelete.isPending}
					onClick={() => {
						if (!confirmDelete("member (soft-delete)")) return;
						softDelete.mutate(memberId, {
							onSuccess: afterGone,
							onError: (err) =>
								toast.error(err instanceof Error ? err.message : "Delete failed"),
						});
					}}
				>
					<Trash2 className="size-3.5" />
					<span className="sr-only">Delete member</span>
				</Button>
			) : (
				<Button
					type="button"
					variant="outline"
					size="icon"
					className="size-8"
					title="Restore member"
					disabled={restore.isPending}
					onClick={() =>
						restore.mutate(memberId, {
							onSuccess: () => toast.success("Member restored"),
							onError: (err) =>
								toast.error(err instanceof Error ? err.message : "Restore failed"),
						})
					}
				>
					<RotateCcw className="size-3.5" />
					<span className="sr-only">Restore member</span>
				</Button>
			)}
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="size-8 text-destructive"
				title="Permanently delete member"
				disabled={hardDelete.isPending}
				onClick={() => {
					if (
						typeof window !== "undefined" &&
						!window.confirm(
							"Permanently delete this member? This cannot be undone."
						)
					) {
						return;
					}
					hardDelete.mutate(memberId, {
						onSuccess: afterGone,
						onError: (err) =>
							toast.error(
								err instanceof Error ? err.message : "Hard delete failed"
							),
					});
				}}
			>
				<Trash2 className="size-3.5" />
				<span className="sr-only">Hard delete member</span>
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="flex max-h-[min(36rem,85vh)] w-[min(72rem,calc(100%-2rem))] flex-col overflow-hidden sm:max-w-5xl">
					<DialogHeader>
						<DialogTitle>Update member</DialogTitle>
					</DialogHeader>
					<MemberWriteForm
						member={member}
						pending={update.isPending}
						submitLabel="Save"
						onSubmit={(body) =>
							update.mutate(
								{ id: memberId, body },
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
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
