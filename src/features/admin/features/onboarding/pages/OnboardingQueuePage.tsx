"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import { useOnboardingList } from "@/features/shared/vms/queries";
import { formatDate } from "@/features/shared/vms/utils";
import { Link } from "@/i18n/navigation";

export function OnboardingQueuePage() {
	const { cases, isLoading, error } = useOnboardingList();

	if (isLoading) {
		return (
			<div className="container space-y-5 py-8">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-72 w-full" />
			</div>
		);
	}

	return (
		<div className="container space-y-6 py-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">
					Onboarding queue
				</h1>
				<p className="text-sm text-muted-foreground">
					Review supplier readiness and outstanding requirements.
				</p>
			</div>
			{error ? (
				<p className="text-sm text-destructive">{error.message}</p>
			) : (
				<div className="divide-y rounded-lg border bg-card">
					{cases.map((item) => (
						<Link
							key={item.id}
							href={`/admin/onboarding/${item.id}`}
							className="block px-5 py-4 transition-colors hover:bg-muted/40"
						>
							<div className="flex flex-wrap items-center justify-between gap-3">
								<div>
									<p className="font-medium">{item.vendorName}</p>
									<p className="text-xs text-muted-foreground">
										Updated {formatDate(item.updatedAt)}
									</p>
								</div>
								<StatusBadge status={item.status} />
							</div>
							<div className="mt-4 flex items-center gap-3">
								<div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
									<div
										className="h-full rounded-full bg-primary"
										style={{
											width: `${Math.min(100, Math.max(0, item.progress))}%`,
										}}
									/>
								</div>
								<span className="w-10 text-right text-xs font-medium tabular-nums">
									{item.progress}%
								</span>
							</div>
						</Link>
					))}
					{cases.length === 0 && (
						<p className="px-5 py-10 text-center text-sm text-muted-foreground">
							No onboarding cases.
						</p>
					)}
				</div>
			)}
		</div>
	);
}
