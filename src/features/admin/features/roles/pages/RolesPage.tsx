"use client";

import { useMemo, useState } from "react";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { RolesTable } from "../components/RolesTable";
import { useRolesList } from "../service/queries/role.query";

export function RolesPage() {
	const t = useTranslations("Roles");
	const { roles, isInitialLoading, isRefreshing, isEmpty, error } =
		useRolesList();
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return roles;
		return roles.filter((r) => r.name.toLowerCase().includes(q));
	}, [roles, search]);

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
				<RolesTable roles={filtered} />
			)}
		</div>
	);
}
