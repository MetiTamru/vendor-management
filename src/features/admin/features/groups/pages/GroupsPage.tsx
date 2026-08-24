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
import {
	useDeleteGroupMutation,
	useGroupsList,
} from "../feature/queries/useGroupsQuery";
import { useGroupSearch } from "../hooks/useGroupSearch";
import { useGroupUiStore } from "../store/group.ui-store";

type GroupsPageProps = {
	/** Render inside Settings tabs — no standalone page chrome. */
	embedded?: boolean;
};

export function GroupsPage({ embedded = false }: GroupsPageProps) {
	const t = useTranslations("Groups");
	const { groups, isInitialLoading, isRefreshing, isEmpty, error } =
		useGroupsList();
	const { filtered } = useGroupSearch(groups);
	const setSearch = useGroupUiStore((s) => s.setSearch);
	const setMembershipMode = useGroupUiStore((s) => s.setMembershipMode);
	const deleteMutation = useDeleteGroupMutation();

	const shellClass = embedded ? "space-y-6" : "container space-y-6 py-8";

	if (isInitialLoading) {
		return (
			<div className={shellClass}>
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-32 w-full" />
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
			<div className="flex flex-wrap items-center justify-between gap-4">
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
