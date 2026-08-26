import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { SettingsPage } from "@/features/admin/features/settings/pages/SettingsPage";

export default function AdminSettingsRoute() {
	return (
		<Suspense
			fallback={
				<div className="space-y-4">
					<Skeleton className="h-10 w-48" />
					<Skeleton className="h-64 w-full" />
				</div>
			}
		>
			<SettingsPage />
		</Suspense>
	);
}
