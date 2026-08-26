"use client";

import { useMemo, useState } from "react";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { RolesTable } from "../components/RolesTable";
import { useRolesList } from "../feature/queries/useRolesQuery";

type RolesPageProps = {
	embedded?: boolean;
};

export function RolesPage({ embedded = false }: RolesPageProps) {
	const t = useTranslations("Roles");
	const { roles, isInitialLoading, isRefreshing, isEmpty, error } =
		useRolesList();
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return roles;
		return roles.filter((r) => r.name.toLowerCase().includes(q));
	}, [roles, search]);

	const shellClass = embedded ? "space-y-6" : "container space-y-6 py-8";

	if (isInitialLoading) {
		return (
			<div className={shellClass}>
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	if (error) {
		return (
			<div className={embedded ? "py-4" : "container py-8"}>
				<p className="text-sm text-destructive">{error.message}</p>
			</div>
		);
	}

	return (
		<div className={shellClass}>
			{embedded ? (
				<p className="text-sm text-muted-foreground">
					{t("subtitle")} {isRefreshing ? t("refreshing") : ""}
				</p>
			) : (
				<div>
					<h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
					<p className="text-sm text-muted-foreground">
						{t("subtitle")} {isRefreshing ? t("refreshing") : ""}
					</p>
				</div>
			)}

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
