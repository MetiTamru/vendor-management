import { redirect } from "next/navigation";

import { getHomePath } from "@/lib/routes";

export const dynamic = "force-dynamic";

/** Vendor portal disabled — admin-only app. */
export default async function VendorLayout({
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	redirect(getHomePath(locale));
}
