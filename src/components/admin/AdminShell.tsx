"use client";

import type { ReactNode } from "react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { OfflineBanner } from "@/components/admin/OfflineBanner";
import { GeneralShell } from "@/components/shared/Wrappers/GeneralShell";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type AdminShellProps = {
	children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
	return (
		<SidebarProvider>
			<AdminSidebar />
			<SidebarInset>
				<OfflineBanner />
				<AdminHeader />
				<GeneralShell>{children}</GeneralShell>
			</SidebarInset>
		</SidebarProvider>
	);
}
