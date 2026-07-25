"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { usePermissions } from "@/providers/permission-provider";

import type { GroupModel } from "../types/group.types";
import { GroupEditButton } from "./GroupEditButton";
import { GroupSyncBadge } from "./GroupSyncBadge";
import { GroupsEmptyState } from "./GroupsEmptyState";

type GroupsTableProps = {
	groups: GroupModel[];
	onDelete: (id: string) => void;
	isDeleting?: boolean;
};

export function GroupsTable({
	groups,
	onDelete,
	isDeleting,
}: GroupsTableProps) {
	const t = useTranslations("Groups");
	const { hasComponentAccess } = usePermissions();
	const canDelete = hasComponentAccess("groups-delete", "delete");

	if (groups.length === 0) {
		return <GroupsEmptyState variant="filter" />;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>{t("table.name")}</TableHead>
					<TableHead>{t("table.mode")}</TableHead>
					<TableHead>{t("table.members")}</TableHead>
					<TableHead>{t("table.sync")}</TableHead>
					<TableHead className="text-right">{t("table.actions")}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{groups.map((group) => (
					<TableRow key={group.id}>
						<TableCell className="font-medium">
							<Link
								href={`/admin/groups/${group.id}`}
								className="hover:underline"
							>
								{group.name}
							</Link>
						</TableCell>
						<TableCell className="capitalize">{group.membershipMode}</TableCell>
						<TableCell>{group.members.length}</TableCell>
						<TableCell>
							<GroupSyncBadge status={group.syncStatus} />
						</TableCell>
						<TableCell className="space-x-2 text-right">
							<Button variant="outline" size="sm" asChild>
								<Link href={`/admin/groups/${group.id}`}>
									{t("table.view")}
								</Link>
							</Button>
							<GroupEditButton groupId={group.id} />
							{canDelete ? (
								<Button
									variant="destructive"
									size="sm"
									disabled={isDeleting}
									onClick={() => onDelete(group.id)}
								>
									{t("table.delete")}
								</Button>
							) : null}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
