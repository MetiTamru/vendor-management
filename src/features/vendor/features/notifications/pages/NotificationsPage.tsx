"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	useMarkNotificationReadMutation,
	useNotificationsList,
} from "@/features/shared/vms/queries";
import { formatDate } from "@/features/shared/vms/utils";
import { Link } from "@/i18n/navigation";

export function NotificationsPage() {
	const { notifications, isLoading } = useNotificationsList();
	const markRead = useMarkNotificationReadMutation();
	if (isLoading)
		return (
			<div className="container space-y-5 py-8">
				<Skeleton className="h-10 w-56" />
				<Skeleton className="h-64 w-full" />
			</div>
		);

	return (
		<div className="container max-w-4xl space-y-6 py-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
				<p className="text-sm text-muted-foreground">
					Updates requiring your awareness or action.
				</p>
			</div>
			<div className="overflow-hidden rounded-xl border bg-card">
				{notifications.map((notification) => (
					<div
						key={notification.id}
						className={`flex gap-4 border-b p-5 last:border-0 ${notification.read ? "" : "bg-primary/[0.04]"}`}
					>
						<span
							className={`mt-2 h-2 w-2 shrink-0 rounded-full ${notification.read ? "bg-muted" : "bg-primary"}`}
						/>
						<div className="min-w-0 flex-1">
							<div className="flex flex-wrap items-start justify-between gap-2">
								<h2 className="text-sm font-semibold">{notification.title}</h2>
								<span className="text-xs text-muted-foreground">
									{formatDate(notification.createdAt)}
								</span>
							</div>
							<p className="mt-1 text-sm text-muted-foreground">
								{notification.body}
							</p>
							<div className="mt-3 flex items-center gap-2">
								{notification.href && (
									<Button variant="outline" size="sm" asChild>
										<Link href={notification.href}>View</Link>
									</Button>
								)}
								{!notification.read && (
									<Button
										variant="ghost"
										size="sm"
										disabled={markRead.isPending}
										onClick={() => markRead.mutate(notification.id)}
									>
										Mark as read
									</Button>
								)}
							</div>
						</div>
					</div>
				))}
				{notifications.length === 0 && (
					<p className="p-8 text-center text-sm text-muted-foreground">
						You have no notifications.
					</p>
				)}
			</div>
		</div>
	);
}
