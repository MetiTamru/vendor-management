"use client";

import { useTranslations } from "next-intl";

import { GroupsCreateButton } from "./GroupsCreateButton";

type GroupsEmptyStateProps = {
	variant: "list" | "filter";
};

export function GroupsEmptyState({ variant }: GroupsEmptyStateProps) {
	const t = useTranslations("Groups");

	return (
		<div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-12 text-center">
			<p className="max-w-sm text-sm text-muted-foreground">
				{variant === "list" ? t("emptyList") : t("empty")}
			</p>
			{variant === "list" ? <GroupsCreateButton /> : null}
		</div>
	);
}
