"use client";

import {
	Bell,
	Building2,
	ClipboardList,
	FileText,
	Handshake,
	LayoutDashboard,
	Receipt,
	ShoppingCart,
	Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

import Logo from "@/components/shared/logo/Logo";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/constants/siteconfig";
import { Link, usePathname } from "@/i18n/navigation";
import { usePermissions } from "@/providers/permission-provider";

const NAV_ICONS: Record<string, typeof LayoutDashboard> = {
	Dashboard: LayoutDashboard,
	"Company profile": Building2,
	Onboarding: ClipboardList,
	Documents: FileText,
	Team: Users,
	Opportunities: ClipboardList,
	Contracts: Handshake,
	"Purchase orders": ShoppingCart,
	Invoices: Receipt,
	Notifications: Bell,
};

const SECTION_ORDER = ["overview", "company", "commerce"] as const;

export function VendorSidebar() {
	const pathname = usePathname();
	const { hasComponentAccess } = usePermissions();
	const t = useTranslations("Vendor");

	const visibleNav = siteConfig.vendorSidebarNav.filter((item) => {
		if (!item.permission) return true;
		return hasComponentAccess(item.permission);
	});

	return (
		<Sidebar>
			<SidebarHeader className="border-b px-4 py-3">
				<Link href="/vendor" className="flex flex-col gap-0.5">
					<Logo />
					<span className="text-xs text-muted-foreground">
						{t("portalLabel")}
					</span>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				{SECTION_ORDER.map((section) => {
					const items = visibleNav.filter((i) => i.section === section);
					if (items.length === 0) return null;
					return (
						<SidebarGroup key={section}>
							<SidebarGroupLabel>
								{t(`sections.${section}`)}
							</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{items.map((item) => {
										if (!item.href) return null;
										const Icon = NAV_ICONS[item.title] ?? LayoutDashboard;
										const active =
											item.href === "/vendor"
												? pathname === "/vendor"
												: pathname === item.href ||
													pathname.startsWith(`${item.href}/`);
										const labelKey = item.title
											.toLowerCase()
											.replace(/\s+/g, "");
										const label = t.has(`nav.${labelKey}`)
											? t(`nav.${labelKey}`)
											: item.title;

										return (
											<SidebarMenuItem key={item.href}>
												<SidebarMenuButton asChild isActive={active}>
													<Link href={item.href}>
														<Icon />
														<span>{label}</span>
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									})}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					);
				})}
			</SidebarContent>
		</Sidebar>
	);
}
