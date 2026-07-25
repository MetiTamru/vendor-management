import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { getServerSession } from "@/lib/auth/server-session";
import { getLoginPath } from "@/lib/routes";

/** Admin routes require auth and client data — skip static prerender at build. */
export const dynamic = "force-dynamic";

export default async function AdminLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const session = await getServerSession();

	if (!session) {
		redirect(getLoginPath(locale));
	}

	return <AdminShell>{children}</AdminShell>;
}
