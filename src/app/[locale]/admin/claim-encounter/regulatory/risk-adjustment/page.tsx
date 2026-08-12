import { redirect } from "next/navigation";

export default async function Page({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	redirect(`/${locale}/admin/claim-encounter/regulatory/risk-adjustment/overview`);
}
