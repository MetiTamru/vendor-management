import { notFound } from "next/navigation";

import { ComplianceObligationDetailPage } from "@/features/admin/features/claim-encounter/compliance-calendar/ComplianceObligationDetailPage";
import { getObligationDetail } from "@/features/admin/features/claim-encounter/compliance-calendar/mock-data";

export default async function Page({
	params,
}: {
	params: Promise<{ obligationId: string }>;
}) {
	const { obligationId } = await params;
	const obligation = getObligationDetail(obligationId);

	if (!obligation) {
		notFound();
	}

	return <ComplianceObligationDetailPage obligation={obligation} />;
}
