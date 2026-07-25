"use client";

import { useTranslations } from "next-intl";

import LocaleSwitcher from "@/components/shared/DropDown/LocaleSwitcher";
import { ModeToggle } from "@/components/shared/DropDown/modeToggle";
import UserAvatar from "@/components/shared/User/userAvater";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "@/i18n/navigation";

function formatSegment(segment: string) {
	return segment
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

export function AdminHeader() {
	const pathname = usePathname();
	const t = useTranslations("Admin");

	const segments = pathname.split("/").filter(Boolean);
	const adminIndex = segments.indexOf("admin");
	const trail = adminIndex >= 0 ? segments.slice(adminIndex + 1) : segments;

	return (
		<header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
			<SidebarTrigger />
			<Separator orientation="vertical" className="h-6" />
			<nav
				aria-label="Breadcrumb"
				className="flex min-w-0 flex-1 items-center gap-1 text-sm text-muted-foreground"
			>
				<span className="font-medium text-foreground">{t("title")}</span>
				{trail.map((segment) => (
					<span key={segment} className="flex items-center gap-1">
						<span>/</span>
						<span className="truncate">{formatSegment(segment)}</span>
					</span>
				))}
			</nav>
			<div className="flex items-center gap-2">
				<ModeToggle />
				<LocaleSwitcher />
				<UserAvatar />
			</div>
		</header>
	);
}
