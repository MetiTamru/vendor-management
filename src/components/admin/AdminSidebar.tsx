"use client";

import { Settings, Shield, Users, UsersRound } from "lucide-react";
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

const NAV_ICONS: Record<string, typeof UsersRound> = {
	groups: UsersRound,
	users: Users,
	roles: Shield,
	settings: Settings,
};

const NAV_TITLE_KEYS = {
	Groups: "groups",
	Users: "users",
	Roles: "roles",
	Settings: "settings",
} as const;

export function AdminSidebar() {
	const pathname = usePathname();
	const { hasComponentAccess } = usePermissions();
	const t = useTranslations("Admin");

	const visibleNav = siteConfig.sidebarNav.filter((item) => {
		if (!item.permission) return true;
		return hasComponentAccess(item.permission);
	});

	return (
		<Sidebar>
			<SidebarHeader className="border-b px-4 py-3">
				<Link href="/admin/groups" className="flex items-center gap-2">
					<Logo />
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>{t("navigation")}</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{visibleNav.map((item) => {
								if (!item.href) return null;
								const navKey =
									NAV_TITLE_KEYS[item.title as keyof typeof NAV_TITLE_KEYS] ??
									"groups";
								const Icon = NAV_ICONS[navKey] ?? UsersRound;
								const active =
									pathname === item.href ||
									pathname.startsWith(`${item.href}/`);
								const label = t(`nav.${navKey}`);

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
			</SidebarContent>
		</Sidebar>
	);
}
