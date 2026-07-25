"use client";

import { useTranslations } from "next-intl";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import type { AppSettingModel } from "../types/setting.types";

type SettingsTableProps = {
	settings: AppSettingModel[];
};

export function SettingsTable({ settings }: SettingsTableProps) {
	const t = useTranslations("Settings");

	if (settings.length === 0) {
		return <p className="text-sm text-muted-foreground">{t("emptyList")}</p>;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>{t("table.key")}</TableHead>
					<TableHead>{t("table.value")}</TableHead>
					<TableHead>{t("table.category")}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{settings.map((setting) => (
					<TableRow key={setting.id}>
						<TableCell className="font-mono text-sm">{setting.key}</TableCell>
						<TableCell>{setting.value}</TableCell>
						<TableCell className="capitalize">{setting.category}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
