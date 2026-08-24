"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useMemo, useState } from "react";

import {
	Download,
	RefreshCw,
	Search,
	Shield,
	SlidersHorizontal,
	Users,
	UsersRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { authOutlineButtonClass } from "@/components/auth/auth-field";
import { ModeToggle } from "@/components/shared/DropDown/modeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { GroupsPage } from "@/features/admin/features/groups/pages/GroupsPage";
import { RolesPage } from "@/features/admin/features/roles/pages/RolesPage";
import { UsersPage } from "@/features/admin/features/users/pages/UsersPage";
import { cn } from "@/lib/utils";

import { SettingsTable } from "../components/SettingsTable";
import {
	SettingsMetric,
	SettingsNav,
	SettingsPanel,
	SettingsSection,
	settingsFieldClass,
	settingsLabelClass,
} from "../components/settings-layout";
import { useSettingsList } from "../feature/queries/useSettingsQuery";

const SETTINGS_TABS = ["general", "groups", "roles", "users"] as const;

type SettingsTab = (typeof SETTINGS_TABS)[number];

function parseSettingsTab(value: string | null): SettingsTab {
	if (value && SETTINGS_TABS.includes(value as SettingsTab)) {
		return value as SettingsTab;
	}
	return "general";
}

function CategoryPills({
	categories,
	value,
	onChange,
}: {
	categories: string[];
	value: string;
	onChange: (value: string) => void;
}) {
	const items = ["all", ...categories];

	return (
		<div className="flex flex-wrap gap-1.5">
			{items.map((item) => {
				const active = value === item;
				return (
					<button
						key={item}
						type="button"
						onClick={() => onChange(item)}
						className={cn(
							"rounded-md border px-2.5 py-1 text-[11px] font-medium capitalize transition-colors",
							active
								? "border-primary/30 bg-primary/10 text-primary"
								: "border-border/70 bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
						)}
					>
						{item === "all" ? "All categories" : item}
					</button>
				);
			})}
		</div>
	);
}

function SettingsGeneralPanel() {
	const t = useTranslations("Settings");
	const { settings, isInitialLoading, isRefreshing, isEmpty, error } =
		useSettingsList();
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("all");

	const categories = useMemo(
		() =>
			Array.from(new Set(settings.map((setting) => setting.category))).sort(),
		[settings]
	);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return settings.filter((s) => {
			if (category !== "all" && s.category !== category) return false;
			if (!q) return true;
			return (
				s.key.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
			);
		});
	}, [category, settings, search]);

	const grouped = useMemo(() => {
		if (category !== "all") return undefined;
		const map = new Map<string, typeof filtered>();
		for (const setting of filtered) {
			const bucket = map.get(setting.category) ?? [];
			bucket.push(setting);
			map.set(setting.category, bucket);
		}
		return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
	}, [category, filtered]);

	if (isInitialLoading) {
		return (
			<SettingsPanel>
				<div className="space-y-3 p-4 sm:p-5">
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-56 w-full" />
				</div>
			</SettingsPanel>
		);
	}

	if (error) {
		return (
			<SettingsPanel>
				<div className="border-l-2 border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
					{error.message}
				</div>
			</SettingsPanel>
		);
	}

	return (
		<SettingsPanel>
			<SettingsSection
				title="Appearance"
				description="Personal display preferences for this browser."
				action={<ModeToggle />}
			>
				<div className="border-t border-border px-4 pb-4 sm:px-5">
					<div className="grid gap-3 sm:grid-cols-3">
						<SettingsMetric label="Total keys" value={settings.length} />
						<SettingsMetric label="Categories" value={categories.length} />
						<SettingsMetric
							label="Showing"
							value={isRefreshing ? "…" : filtered.length}
						/>
					</div>
				</div>
			</SettingsSection>

			<SettingsSection
				title="Configuration register"
				description="Search and browse application configuration keys."
			>
				<div className="space-y-3 border-t border-border px-4 py-4 sm:px-5">
					<div className="relative">
						<Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder={t("searchPlaceholder")}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className={cn(settingsFieldClass, "h-9 pl-8")}
						/>
					</div>
					<CategoryPills
						categories={categories}
						value={category}
						onChange={setCategory}
					/>
				</div>

				<div className="border-t border-border">
					{isEmpty ? (
						<SettingsTable settings={[]} />
					) : (
						<SettingsTable settings={filtered} grouped={grouped} />
					)}
				</div>
			</SettingsSection>
		</SettingsPanel>
	);
}

function EmbeddedPanel({ children }: { children: ReactNode }) {
	return (
		<SettingsPanel>
			<div className="p-4 sm:p-5">{children}</div>
		</SettingsPanel>
	);
}

export function SettingsPage() {
	const t = useTranslations("Settings");
	const locale = useLocale();
	const router = useRouter();
	const searchParams = useSearchParams();
	const tab = parseSettingsTab(searchParams.get("tab"));
	const { refetch, isRefreshing } = useSettingsList();

	const navItems = useMemo(
		() => [
			{
				id: "general",
				label: t("tabs.general"),
				description: "Theme and configuration keys",
				icon: SlidersHorizontal,
			},
			{
				id: "groups",
				label: t("tabs.groups"),
				description: "Identity groups and membership",
				icon: UsersRound,
			},
			{
				id: "roles",
				label: t("tabs.roles"),
				description: "Role definitions and permissions",
				icon: Shield,
			},
			{
				id: "users",
				label: t("tabs.users"),
				description: "User accounts and access",
				icon: Users,
			},
		],
		[t]
	);

	function onTabChange(next: string) {
		const href =
			next === "general"
				? `/${locale}/admin/settings`
				: `/${locale}/admin/settings?tab=${next}`;
		router.replace(href);
	}

	const activeNav = navItems.find((item) => item.id === tab);

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
				<div className="min-w-0">
					<p className={settingsLabelClass}>Administration</p>
					<h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
						{t("title")}
					</h1>
					<p className="mt-1 max-w-2xl text-sm text-muted-foreground">
						{t("subtitle")}
						{isRefreshing ? ` ${t("refreshing")}` : ""}
					</p>
				</div>
				{tab === "general" ? (
					<div className="flex shrink-0 flex-wrap gap-1.5">
						<Button
							variant="outline"
							size="sm"
							className={cn(
								authOutlineButtonClass,
								"h-8 w-auto px-3 py-0 text-xs"
							)}
							onClick={() => void refetch()}
							disabled={isRefreshing}
						>
							<RefreshCw
								className={cn("mr-1 size-3", isRefreshing && "animate-spin")}
							/>
							Refresh
						</Button>
						<Button
							variant="outline"
							size="sm"
							className={cn(
								authOutlineButtonClass,
								"h-8 w-auto px-3 py-0 text-xs"
							)}
						>
							<Download className="mr-1 size-3" />
							Export
						</Button>
					</div>
				) : null}
			</div>

			<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
				<aside className="lg:w-[15.5rem] lg:shrink-0">
					<SettingsNav items={navItems} activeId={tab} onChange={onTabChange} />
				</aside>

				<div className="min-w-0 flex-1 space-y-3">
					{activeNav && tab !== "general" ? (
						<div className="hidden sm:block">
							<p className={settingsLabelClass}>{activeNav.label}</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								{activeNav.description}
							</p>
						</div>
					) : null}

					{tab === "general" ? <SettingsGeneralPanel /> : null}
					{tab === "groups" ? (
						<EmbeddedPanel>
							<GroupsPage embedded />
						</EmbeddedPanel>
					) : null}
					{tab === "roles" ? (
						<EmbeddedPanel>
							<RolesPage embedded />
						</EmbeddedPanel>
					) : null}
					{tab === "users" ? (
						<EmbeddedPanel>
							<UsersPage embedded />
						</EmbeddedPanel>
					) : null}
				</div>
			</div>
		</div>
	);
}
