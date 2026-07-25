"use client";

import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { GroupModel } from "../types/group.types";

export function GroupStatsCards({ groups }: { groups: GroupModel[] }) {
	const t = useTranslations("Groups.stats");
	const enumerated = groups.filter(
		(g) => g.membershipMode === "enumerated"
	).length;
	const definitional = groups.filter(
		(g) => g.membershipMode === "definitional"
	).length;
	const pending = groups.filter((g) => g.syncStatus === "pending").length;

	return (
		<div className="grid gap-4 sm:grid-cols-3">
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">{t("total")}</CardTitle>
				</CardHeader>
				<CardContent className="text-2xl font-bold">
					{groups.length}
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">{t("byMode")}</CardTitle>
				</CardHeader>
				<CardContent className="text-sm text-muted-foreground">
					{t("byModeValue", { enumerated, definitional })}
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">
						{t("pendingSync")}
					</CardTitle>
				</CardHeader>
				<CardContent className="text-2xl font-bold">{pending}</CardContent>
			</Card>
		</div>
	);
}
