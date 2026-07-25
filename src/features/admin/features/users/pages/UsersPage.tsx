"use client";

import { useMemo, useState } from "react";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { UsersTable } from "../components/UsersTable";
import { useUsersList } from "../service/queries/user.query";

export function UsersPage() {
	const t = useTranslations("Users");
	const { users, isInitialLoading, isRefreshing, isEmpty, error } =
		useUsersList();
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return users;
		return users.filter(
			(u) =>
				u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
		);
	}, [users, search]);

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
				<UsersTable users={filtered} />
			)}
		</div>
	);
}
