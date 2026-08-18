import { LtssAuthDetailPage } from "@/features/admin/features/claim-encounter/ltss/LtssAuthDetailPage";

export default async function Page({
	params,
}: {
	params: Promise<{ authId: string }>;
}) {
	const { authId } = await params;
	return <LtssAuthDetailPage authId={authId} />;
}
