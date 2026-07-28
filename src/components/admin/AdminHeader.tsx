"use client";

import { Suspense, useMemo, useState } from "react";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import LocaleSwitcher from "@/components/shared/DropDown/LocaleSwitcher";
import { ModeToggle } from "@/components/shared/DropDown/modeToggle";
import UserAvatar from "@/components/shared/User/userAvater";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/constants/siteconfig";
import { useVendorsList } from "@/features/shared/vms/queries";
import { useRouter } from "@/i18n/navigation";

export function AdminHeader() {
	const router = useRouter();
	const t = useTranslations("Admin");
	const { vendors } = useVendorsList();
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);

	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return [];

		const navMatches = siteConfig.sidebarNav
			.filter((item) => item.href)
			.map((item) => ({
				id: `nav-${item.href}`,
				label: item.title,
				subtitle: "Page",
				href: item.href as string,
			}))
			.filter((item) => item.label.toLowerCase().includes(q));

		const vendorMatches = vendors
			.map((vendor) => ({
				id: `vendor-${vendor.id}`,
				label: vendor.tradeName ?? vendor.legalName,
				subtitle: "Vendor",
				href: `/admin/vendors/${vendor.id}`,
			}))
			.filter((item) => item.label.toLowerCase().includes(q));

		return [...navMatches, ...vendorMatches].slice(0, 8);
	}, [query, vendors]);

	function goToResult(href: string) {
		setOpen(false);
		setQuery("");
		router.push(href);
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (results[0]) goToResult(results[0].href);
	}

	return (
		<header className="z-40 flex h-16 shrink-0 items-center gap-3 border-b border-border/80 bg-background px-4 shadow-sm sm:px-6">
			<SidebarTrigger className="text-primary" />
			<Separator orientation="vertical" className="h-7" />
			<Suspense
				fallback={
					<div className="flex min-w-0 flex-1 items-center gap-2">
						<Skeleton className="h-4 w-28" />
						<Skeleton className="h-4 w-20" />
					</div>
				}
			>
				<AdminBreadcrumb appTitle={t("title")} />
			</Suspense>
			<div className="relative hidden w-full max-w-md lg:block">
				<form onSubmit={handleSubmit}>
					<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={query}
						onChange={(e) => {
							setQuery(e.target.value);
							setOpen(true);
						}}
						onFocus={() => setOpen(true)}
						onBlur={() => setTimeout(() => setOpen(false), 150)}
						placeholder="Search pages and vendors..."
						className="h-10 bg-card pl-9"
					/>
				</form>
				{open && query.trim() && results.length > 0 ? (
					<div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
						{results.map((result) => (
							<button
								key={result.id}
								type="button"
								className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-muted/50"
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => goToResult(result.href)}
							>
								<span className="truncate text-sm font-medium">
									{result.label}
								</span>
								<span className="ml-3 shrink-0 text-xs text-muted-foreground">
									{result.subtitle}
								</span>
							</button>
						))}
					</div>
				) : null}
			</div>
			<div className="flex items-center gap-2">
				<ModeToggle />
				<LocaleSwitcher />
				<UserAvatar />
			</div>
		</header>
	);
}
