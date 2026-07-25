"use client";

import { useMemo, useState } from "react";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { SettingsTable } from "../components/SettingsTable";
import { useSettingsList } from "../service/queries/setting.query";

export function SettingsPage() {
	const t = useTranslations("Settings");
	const { settings, isInitialLoading, isRefreshing, isEmpty, error } =
		useSettingsList();
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return settings;
		return settings.filter(
			(s) =>
				s.key.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
		);
	}, [settings, search]);

	if (isInitialLoading) {
		return (
			<div className="container space-y-6 py-8">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="container py-8">
				<p className="text-sm text-destructive">{error.message}</p>
			</div>
		);
	}

	return (
		<div className="container space-y-6 py-8">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
				<p className="text-sm text-muted-foreground">
					{t("subtitle")} {isRefreshing ? t("refreshing") : ""}
				</p>
			</div>

			<Input
				placeholder={t("searchPlaceholder")}
				className="max-w-sm"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>

			{isEmpty ? (
				<p className="text-sm text-muted-foreground">{t("emptyList")}</p>
			) : (
				<SettingsTable settings={filtered} />
			)}
		</div>
	);
}
