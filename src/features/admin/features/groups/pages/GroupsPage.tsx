"use client";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { GroupStatsCards } from "../components/GroupStatsCards";
import { GroupsCreateButton } from "../components/GroupsCreateButton";
import { GroupsEmptyState } from "../components/GroupsEmptyState";
import { GroupsTable } from "../components/GroupsTable";
import { useGroupSearch } from "../hooks/useGroupSearch";
import { useDeleteGroupMutation } from "../service/mutations/group.mutation";
import { useGroupsList } from "../service/queries/group.query";
import { useGroupUiStore } from "../store/group.ui-store";

export function GroupsPage() {
	const t = useTranslations("Groups");
	const { groups, isInitialLoading, isRefreshing, isEmpty, error } =
		useGroupsList();
	const { filtered } = useGroupSearch(groups);
	const setSearch = useGroupUiStore((s) => s.setSearch);
	const setMembershipMode = useGroupUiStore((s) => s.setMembershipMode);
	const deleteMutation = useDeleteGroupMutation();

	if (isInitialLoading) {
		return (
			<div className="container space-y-6 py-8">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-32 w-full" />
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
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
					<p className="text-sm text-muted-foreground">
						{t("subtitle")} {isRefreshing ? t("refreshing") : ""}
					</p>
				</div>
				<GroupsCreateButton />
			</div>

			<GroupStatsCards groups={groups} />

			<div className="flex flex-wrap gap-4">
				<Input
					placeholder={t("searchPlaceholder")}
					className="max-w-sm"
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Select
					defaultValue="all"
					onValueChange={(v) =>
						setMembershipMode(v as "all" | "enumerated" | "definitional")
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder={t("membershipMode")} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">{t("allModes")}</SelectItem>
						<SelectItem value="enumerated">{t("enumerated")}</SelectItem>
						<SelectItem value="definitional">{t("definitional")}</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{isEmpty ? (
				<GroupsEmptyState variant="list" />
			) : (
				<GroupsTable
					groups={filtered}
					onDelete={(id) => {
						if (confirm(t("deleteConfirm"))) {
							deleteMutation.mutate(id);
						}
					}}
					isDeleting={deleteMutation.isPending}
				/>
			)}
		</div>
	);
}
