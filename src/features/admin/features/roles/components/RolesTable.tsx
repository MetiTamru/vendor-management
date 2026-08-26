"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import type { RoleModel } from "../types/role.types";

type RolesTableProps = {
	roles: RoleModel[];
};

export function RolesTable({ roles }: RolesTableProps) {
	const t = useTranslations("Roles");

	if (roles.length === 0) {
		return <p className="text-sm text-muted-foreground">{t("emptyList")}</p>;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>{t("table.name")}</TableHead>
					<TableHead>{t("table.permissions")}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{roles.map((role) => (
					<TableRow key={role.id}>
						<TableCell className="font-medium">
							<div className="flex flex-col gap-0.5">
								<span>{role.name}</span>
								{role.slug !== role.name ? (
									<span className="text-xs font-normal text-muted-foreground">
										{role.slug}
									</span>
								) : null}
							</div>
						</TableCell>
						<TableCell>
							<div className="flex flex-wrap gap-1">
								{role.isSystemRole ? (
									<Badge variant="secondary">System</Badge>
								) : null}
								{role.permissions.map((perm) => (
									<Badge key={perm} variant="outline">
										{perm}
									</Badge>
								))}
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
