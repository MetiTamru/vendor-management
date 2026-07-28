"use client";

import { GeneralShell } from "@/components/shared/Wrappers/GeneralShell";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { VendorHeader } from "./VendorHeader";
import { VendorSidebar } from "./VendorSidebar";

type VendorShellProps = {
	children: React.ReactNode;
};

export function VendorShell({ children }: VendorShellProps) {
	return (
		<SidebarProvider>
			<VendorSidebar />
			<SidebarInset>
				<VendorHeader />
				<GeneralShell>{children}</GeneralShell>
			</SidebarInset>
		</SidebarProvider>
	);
}
