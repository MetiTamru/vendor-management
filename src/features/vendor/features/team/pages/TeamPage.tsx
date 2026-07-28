"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import { useTeamList } from "@/features/shared/vms/queries";

export function TeamPage() {
	const { members, isLoading } = useTeamList();
	if (isLoading)
		return (
			<div className="container space-y-5 py-8">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	return (
		<div className="container space-y-6 py-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Team</h1>
				<p className="text-sm text-muted-foreground">
					People with access to your organization&apos;s vendor portal.
				</p>
			</div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{members.map((member) => (
					<div
						key={member.id}
						className="rounded-xl border bg-card p-5 shadow-sm"
					>
						<div className="flex items-start justify-between gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
								{member.name
									.split(" ")
									.map((part) => part[0])
									.slice(0, 2)
									.join("")}
							</div>
							<StatusBadge status={member.isActive ? "active" : "inactive"} />
						</div>
						<h2 className="mt-4 font-semibold">{member.name}</h2>
						<p className="text-sm text-muted-foreground">{member.email}</p>
						<p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
							{member.role.replace("vendor_", "").replace(/_/g, " ")}
						</p>
					</div>
				))}
				{members.length === 0 && (
					<p className="text-sm text-muted-foreground">
						No team members found.
					</p>
				)}
			</div>
		</div>
	);
}
