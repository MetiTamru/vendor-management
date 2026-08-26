"use client";

import { KeyRound, Lock, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { AppSettingModel } from "../types/setting.types";
import { settingsLabelClass } from "./settings-layout";

type SettingsTableProps = {
	settings: AppSettingModel[];
	grouped?: Array<[string, AppSettingModel[]]>;
};

function CategoryBadge({ category }: { category: string }) {
	return (
		<span className="inline-flex rounded-sm border border-border/70 bg-muted/25 px-1.5 py-px text-[10px] font-semibold capitalize text-muted-foreground">
			{category}
		</span>
	);
}

function SettingRow({
	setting,
	index,
}: {
	setting: AppSettingModel;
	index: number;
}) {
	return (
		<TableRow
			className={cn(
				"border-b border-border/40 transition-colors duration-150",
				index % 2 === 1 && "bg-muted/[0.06]",
				"hover:bg-primary/[0.03]"
			)}
		>
			<TableCell className="py-3 pl-4 align-top">
				<div className="flex items-start gap-2">
					<span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary/15 bg-primary/5 text-primary">
						{setting.isSecret ? (
							<Lock className="size-3" strokeWidth={2} />
						) : (
							<KeyRound className="size-3" strokeWidth={2} />
						)}
					</span>
					<div className="min-w-0">
						<p className="font-mono text-xs font-semibold text-primary">
							{setting.key}
						</p>
						<p className="mt-0.5 lg:hidden">
							<CategoryBadge category={setting.category} />
						</p>
					</div>
				</div>
			</TableCell>
			<TableCell className="max-w-md py-3 align-top">
				<p
					className={cn(
						"text-xs leading-relaxed break-all",
						setting.isSecret
							? "font-mono text-muted-foreground"
							: "font-medium text-foreground/90"
					)}
				>
					{setting.value}
				</p>
			</TableCell>
			<TableCell className="hidden py-3 pr-4 align-top lg:table-cell">
				<CategoryBadge category={setting.category} />
			</TableCell>
		</TableRow>
	);
}

function GroupHeader({ category, count }: { category: string; count: number }) {
	return (
		<TableRow className="border-b border-border bg-muted/15 hover:bg-muted/15">
			<TableCell colSpan={3} className="py-2 pl-4">
				<div className="flex items-center gap-2">
					<span className={settingsLabelClass}>{category}</span>
					<span className="text-[10px] text-muted-foreground">
						{count} {count === 1 ? "key" : "keys"}
					</span>
				</div>
			</TableCell>
		</TableRow>
	);
}

export function SettingsTable({ settings, grouped }: SettingsTableProps) {
	const t = useTranslations("Settings");

	if (settings.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center px-4 py-16 text-center">
				<span className="flex size-12 items-center justify-center rounded-md border border-border bg-muted/20 text-muted-foreground/50">
					<Settings2 className="size-5" />
				</span>
				<p className="mt-3 text-sm font-medium text-foreground">
					No settings match
				</p>
				<p className="mt-1 max-w-xs text-xs text-muted-foreground">
					{t("emptyList")}
				</p>
			</div>
		);
	}

	const sections = grouped ?? [["", settings] as [string, AppSettingModel[]]];

	return (
		<Table>
			<TableHeader>
				<TableRow className="border-b border-border bg-muted/15 hover:bg-muted/15">
					<TableHead
						className={cn(settingsLabelClass, "h-9 whitespace-nowrap pl-4")}
					>
						{t("table.key")}
					</TableHead>
					<TableHead
						className={cn(settingsLabelClass, "h-9 whitespace-nowrap")}
					>
						{t("table.value")}
					</TableHead>
					<TableHead
						className={cn(
							settingsLabelClass,
							"hidden h-9 whitespace-nowrap pr-4 lg:table-cell"
						)}
					>
						{t("table.category")}
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{sections.flatMap(([category, items]) => [
					grouped && category ? (
						<GroupHeader
							key={`header-${category}`}
							category={category}
							count={items.length}
						/>
					) : null,
					...items.map((setting, index) => (
						<SettingRow key={setting.id} setting={setting} index={index} />
					)),
				])}
			</TableBody>
		</Table>
	);
}
