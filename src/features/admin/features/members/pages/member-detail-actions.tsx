"use client";

import { useMemo, useState } from "react";

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
import type { MemberDetail } from "@/features/admin/features/members/feature/api/membersApi";
import {
	useCreateMemberAccumulatorMutation,
	useCreateMemberClaimMutation,
	useCreateMemberExceptionMutation,
	useMemberAccumulatorsQuery,
	useMemberClaimsQuery,
	useMemberEligibilityHistoryQuery,
	useMemberExceptionsQuery,
	useMemberFamilyLinksQuery,
	useMemberPlanHistoryQuery,
	useMemberSourceRecordQuery,
	useMemberSourceRecordsQuery,
} from "@/features/admin/features/members/feature/queries/useMembersQuery";
import { isMockEnabled } from "@/lib/mock-mode";

type Tab =
	| "Overview"
	| "Demographics"
	| "Eligibility"
	| "Coverage & Plan History"
	| "Family / Dependents"
	| "Claims & Encounters"
	| "Accumulators"
	| "Vendor / Source History"
	| "Eligibility Exceptions";

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
		if (familyLinks.data?.length) next.dependents = familyLinks.data;
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

	if (isMockEnabled()) return null;

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

	if (isMockEnabled()) return null;

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

	if (isMockEnabled()) return null;

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
