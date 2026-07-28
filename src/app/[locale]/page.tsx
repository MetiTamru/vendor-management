import { AdminShell } from "@/components/admin/AdminShell";
import { DashboardPage } from "@/features/admin/features/dashboard/pages/DashboardPage";

/** Locale home is the procurement dashboard (mock-auth, admin-only). */
export default function Home() {
	return (
		<AdminShell>
			<DashboardPage />
		</AdminShell>
	);
}
