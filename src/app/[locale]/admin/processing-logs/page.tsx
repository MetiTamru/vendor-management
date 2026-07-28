import { Suspense } from "react";

import { ProcessingLogsPage } from "@/features/admin/features/processing-logs/pages/ProcessingLogsPage";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
	return (
		<Suspense
			fallback={
				<div className="space-y-6">
					<Skeleton className="h-10 w-64" />
					<Skeleton className="h-96 w-full rounded-xl" />
				</div>
			}
		>
			<ProcessingLogsPage />
		</Suspense>
	);
}
