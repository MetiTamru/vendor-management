"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { withPermission } from "@/permissions/components/withPermission";

type GroupEditButtonProps = {
	groupId: string;
	variant?: "default" | "outline" | "secondary";
	size?: "default" | "sm";
};

function GroupEditButtonBase({
	groupId,
	variant = "outline",
	size = "sm",
}: GroupEditButtonProps) {
	const t = useTranslations("Groups");

	return (
		<Button variant={variant} size={size} asChild>
			<Link href={`/admin/groups/${groupId}/edit`}>{t("table.edit")}</Link>
		</Button>
	);
}

export const GroupEditButton = withPermission(
	GroupEditButtonBase,
	"groups-edit"
);
