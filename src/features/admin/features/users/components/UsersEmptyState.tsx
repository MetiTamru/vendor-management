"use client";

import { useTranslations } from "next-intl";

export function UsersEmptyState() {
	const t = useTranslations("Users");

	return (
		<div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
			<p className="max-w-sm text-sm text-muted-foreground">{t("emptyList")}</p>
		</div>
	);
}
