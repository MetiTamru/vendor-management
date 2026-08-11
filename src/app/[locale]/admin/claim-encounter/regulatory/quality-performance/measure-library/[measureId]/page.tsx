import { notFound } from "next/navigation";

import { MeasureDetailPage } from "@/features/admin/features/claim-encounter/quality-performance/measure-library/MeasureDetailPage";
import { getMeasureDetail } from "@/features/admin/features/claim-encounter/quality-performance/measure-library/mock-data";

export default async function Page({
	params,
}: {
	params: Promise<{ measureId: string }>;
}) {
	const { measureId } = await params;
	const measure = getMeasureDetail(measureId.toUpperCase());

	if (!measure) {
		notFound();
	}

	return <MeasureDetailPage measure={measure} />;
}
