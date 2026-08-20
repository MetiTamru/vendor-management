import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { DashboardPage } from "@/features/admin/features/dashboard/pages/DashboardPage";
import { getServerSession } from "@/lib/auth/server-session";
import { getLoginPath } from "@/lib/routes";

/** Locale home is the procurement dashboard (mock-auth, admin-only). */
export default async function Home({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const session = await getServerSession();
	if (!session) {
		redirect(getLoginPath(locale));
	}

	return (
		<AdminShell>
			<DashboardPage />
		</AdminShell>
	);
}
