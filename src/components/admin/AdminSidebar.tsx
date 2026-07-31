"use client";

import {
	AlertTriangle,
	BarChart3,
	Bell,
	CalendarDays,
	CheckCircle2,
	ClipboardList,
	Download,
	FileInput,
	FileOutput,
	FileSearch,
	FileWarning,
	FolderKanban,
	Gauge,
	GitCompare,
	History,
	Home,
	LifeBuoy,
	MessageSquareReply,
	Radio,
	ScrollText,
	Settings,
	Timer,
	Users,
	Workflow,
} from "lucide-react";
import { useTranslations } from "next-intl";

import Logo from "@/components/shared/logo/Logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { getModuleSidebarNav, siteConfig } from "@/constants/siteconfig";
import { Link, usePathname } from "@/i18n/navigation";
import { usePermissions } from "@/providers/permission-provider";
import { useAdminModuleStore } from "@/stores/admin-module-store";

const NAV_ICONS: Record<string, typeof Home> = {
	Dashboard: Home,
	Vendors: Users,
	"File Monitoring": FolderKanban,
	"Processing Status": FileSearch,
	"File History": History,
	Schedules: CalendarDays,
	"Processing Logs": ScrollText,
	"Error Management": AlertTriangle,
	Notifications: Bell,
	"SLA Monitoring": Timer,
	"Risk Scoring": Gauge,
	"Command Center": Radio,
	Automations: Workflow,
	"Vendor Comparison": GitCompare,
	"Audit Trail": ClipboardList,
	Reports: BarChart3,
	"Export Center": Download,
	Settings: Settings,
	"Inbound Vendor File": FileInput,
	"Outbound Vendor File": FileOutput,
	Responses: MessageSquareReply,
	"Acceptance Analytics": CheckCircle2,
	"Exceptions / Rejections": FileWarning,
};

const SECTION_ORDER = [
	"top",
	"vendor_management",
	"operations",
	"administration",
	"claim_encounter",
] as const;

function isActivePath(pathname: string, href: string) {
	if (href === "/") return pathname === "/";
	return pathname === href || pathname.startsWith(`${href}/`);
}

function navLabelKey(title: string) {
	return title.toLowerCase().replace(/[\s/]+/g, "");
}

export function AdminSidebar() {
	const pathname = usePathname();
	const { hasComponentAccess } = usePermissions();
	const t = useTranslations("Admin");
	const moduleId = useAdminModuleStore((s) => s.moduleId);

	const visibleNav = getModuleSidebarNav(moduleId).filter((item) => {
		if (!item.permission) return true;
		return hasComponentAccess(item.permission);
	});

	const sections =
		moduleId === "claim_encounter"
			? (["claim_encounter"] as const)
			: SECTION_ORDER.filter((s) => s !== "claim_encounter");

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="border-b border-sidebar-border px-3 py-3">
				<Link
					href={siteConfig.modules[moduleId].homeHref}
					className="flex min-w-0 items-center gap-2 outline-none ring-sidebar-ring focus-visible:ring-2"
				>
					<Logo title={siteConfig.modules[moduleId].label} />
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<ScrollArea
					className="h-full"
					scrollbarClassName="w-1.5"
					thumbClassName="bg-sidebar-foreground/15 hover:bg-sidebar-foreground/25"
				>
					<div className="flex flex-col gap-1 pb-4">
						{sections.map((section) => {
							const items = visibleNav.filter((i) => i.section === section);
							if (items.length === 0) return null;

							const showLabel = section !== "top";

							return (
								<SidebarGroup key={section}>
									{showLabel ? (
										<SidebarGroupLabel>
											{t.has(`sections.${section}`)
												? t(`sections.${section}`)
												: section}
										</SidebarGroupLabel>
									) : null}
									<SidebarGroupContent>
										<SidebarMenu>
											{items.map((item) => {
												if (!item.href) return null;
												const Icon = NAV_ICONS[item.title] ?? Home;
												const active = isActivePath(pathname, item.href);
												const labelKey = navLabelKey(item.title);
												const label = t.has(`nav.${labelKey}`)
													? t(`nav.${labelKey}`)
													: item.title;

												return (
													<SidebarMenuItem key={item.href}>
														<SidebarMenuButton
															asChild
															isActive={active}
															tooltip={label}
														>
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
									{section !== "administration" &&
									section !== "top" &&
									section !== "claim_encounter" ? (
										<SidebarSeparator className="mx-2 mt-2" />
									) : null}
								</SidebarGroup>
							);
						})}
					</div>
				</ScrollArea>
			</SidebarContent>
			<SidebarFooter className="border-t border-sidebar-border p-2">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild tooltip={t("nav.support")}>
							<a href={`mailto:${siteConfig.support.email}`}>
								<LifeBuoy />
								<span>{t("nav.support")}</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
