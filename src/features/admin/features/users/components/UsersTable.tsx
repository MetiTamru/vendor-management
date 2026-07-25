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

import type { UserModel } from "../types/user.types";
import { UsersEmptyState } from "./UsersEmptyState";

type UsersTableProps = {
	users: UserModel[];
};

export function UsersTable({ users }: UsersTableProps) {
	const t = useTranslations("Users");

	if (users.length === 0) {
		return <UsersEmptyState />;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>{t("table.name")}</TableHead>
					<TableHead>{t("table.email")}</TableHead>
					<TableHead>{t("table.roles")}</TableHead>
					<TableHead>{t("table.status")}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user) => (
					<TableRow key={user.id}>
						<TableCell className="font-medium">{user.name}</TableCell>
						<TableCell>{user.email}</TableCell>
						<TableCell>
							<div className="flex flex-wrap gap-1">
								{user.roles.map((role) => (
									<Badge key={role} variant="secondary">
										{role}
									</Badge>
								))}
							</div>
						</TableCell>
						<TableCell>
							{user.isActive ? t("table.active") : t("table.inactive")}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
