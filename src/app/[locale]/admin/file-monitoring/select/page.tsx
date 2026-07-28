import { Suspense } from "react";

import { FileSelectPage } from "@/features/admin/features/file-management/pages/FileSelectPage";

export default function Page() {
	return (
		<Suspense
			fallback={
				<div className="p-6 text-sm text-muted-foreground">Loading…</div>
			}
		>
			<FileSelectPage />
		</Suspense>
	);
}
