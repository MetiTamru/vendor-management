import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { VendorInvitePage } from "@/features/admin/features/vendors/pages/VendorInvitePage";

export default function InviteVendorRoutePage() {
	return (
		<Suspense
			fallback={<Skeleton className="h-64 w-full max-w-2xl rounded-xl" />}
		>
			<VendorInvitePage />
		</Suspense>
	);
}
