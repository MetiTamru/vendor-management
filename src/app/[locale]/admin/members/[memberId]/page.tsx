import { Suspense } from "react";

import { VendorCoreLoadingRow } from "@/components/vendor-core/VendorCoreLiveChrome";
import { MemberDetailPage } from "@/features/admin/features/members/pages/MemberDetailPage";

type PageProps = {
	params: Promise<{ memberId: string }>;
};

export default async function Page({ params }: PageProps) {
	const { memberId } = await params;
	return (
		<Suspense fallback={<VendorCoreLoadingRow label="Loading member…" />}>
			<MemberDetailPage memberId={memberId} />
		</Suspense>
	);
}
