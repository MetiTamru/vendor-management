"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { withPermission } from "@/permissions/components/withPermission";

function GroupsCreateButtonBase() {
	const t = useTranslations("Groups");

	return (
		<Button asChild>
			<Link href="/admin/groups/create">{t("create")}</Link>
		</Button>
	);
}

export const GroupsCreateButton = withPermission(
	GroupsCreateButtonBase,
	"groups-create"
);
