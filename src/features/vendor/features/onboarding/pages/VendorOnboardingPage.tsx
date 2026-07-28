"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import {
	useCurrentVendor,
	useOnboardingList,
	useUpdateOnboardingMutation,
} from "@/features/shared/vms/queries";

export function VendorOnboardingPage() {
	const { vendor, isLoading: vendorLoading } = useCurrentVendor();
	const { cases, isLoading } = useOnboardingList();
	const updateOnboarding = useUpdateOnboardingMutation();
	const onboarding = cases.find((item) => item.vendorId === vendor?.id);

	async function setCompleted(itemId: string, completed: boolean) {
		if (!onboarding) return;
		const checklist = onboarding.checklist.map((item) =>
			item.id === itemId ? { ...item, completed } : item
		);
		const progress = Math.round(
			(checklist.filter((item) => item.completed).length / checklist.length) *
				100
		);
		try {
			await updateOnboarding.mutateAsync({
				id: onboarding.id,
				patch: { checklist, progress, status: "in_progress" },
			});
		} catch {
			toast.error("Could not update checklist");
		}
	}

	async function submit() {
		if (!onboarding) return;
		try {
			await updateOnboarding.mutateAsync({
				id: onboarding.id,
				patch: { status: "submitted", submittedAt: new Date().toISOString() },
			});
			toast.success("Onboarding submitted for review");
		} catch {
			toast.error("Could not submit onboarding");
		}
	}

	if (vendorLoading || isLoading)
		return (
			<div className="container space-y-5 py-8">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	if (!onboarding)
		return (
			<div className="container space-y-2 py-8">
				<h1 className="text-2xl font-semibold">Vendor onboarding</h1>
				<p className="text-sm text-muted-foreground">
					There is no active onboarding case for your company.
				</p>
			</div>
		);

	const canEdit = ["not_started", "in_progress", "changes_requested"].includes(
		onboarding.status
	);
	const requiredComplete = onboarding.checklist
		.filter((item) => item.required)
		.every((item) => item.completed);

	return (
		<div className="container max-w-4xl space-y-6 py-8">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">
						Vendor onboarding
					</h1>
					<p className="text-sm text-muted-foreground">
						Complete all required items before submitting for review.
					</p>
				</div>
				<StatusBadge status={onboarding.status} />
			</div>
			<div className="rounded-xl border bg-card p-6 shadow-sm">
				<div className="mb-5 flex items-center justify-between text-sm">
					<span className="font-medium">Completion</span>
					<span className="tabular-nums text-muted-foreground">
						{onboarding.progress}%
					</span>
				</div>
				<Progress value={onboarding.progress} />
				<div className="mt-6 divide-y">
					{onboarding.checklist.map((item) => (
						<label
							key={item.id}
							className="flex cursor-pointer items-center gap-3 py-4"
						>
							<Checkbox
								checked={item.completed}
								disabled={!canEdit || updateOnboarding.isPending}
								onCheckedChange={(value) =>
									void setCompleted(item.id, value === true)
								}
							/>
							<span className="flex-1 text-sm font-medium">{item.label}</span>
							{item.required && (
								<span className="text-xs text-muted-foreground">Required</span>
							)}
						</label>
					))}
				</div>
				{onboarding.reviewerNote && (
					<div className="mt-4 rounded-lg bg-muted p-4 text-sm">
						<span className="font-medium">Reviewer note: </span>
						{onboarding.reviewerNote}
					</div>
				)}
				<div className="mt-6 flex justify-end">
					<Button
						onClick={() => void submit()}
						disabled={
							!canEdit || !requiredComplete || updateOnboarding.isPending
						}
					>
						Submit for review
					</Button>
				</div>
			</div>
		</div>
	);
}
