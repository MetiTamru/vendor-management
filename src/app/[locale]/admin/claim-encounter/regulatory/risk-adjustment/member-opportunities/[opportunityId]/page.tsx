import { notFound } from "next/navigation";

import { RiskAdjustmentMemberOpportunityDetailPage } from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentMemberOpportunityDetailPage";
import { getMemberOpportunityDetail } from "@/features/admin/features/claim-encounter/risk-adjustment/mock-data";

export default async function Page({
	params,
}: {
	params: Promise<{ opportunityId: string }>;
}) {
	const { opportunityId } = await params;
	const opportunity = getMemberOpportunityDetail(opportunityId);

	if (!opportunity) {
		notFound();
	}

	return (
		<RiskAdjustmentMemberOpportunityDetailPage opportunity={opportunity} />
	);
}
