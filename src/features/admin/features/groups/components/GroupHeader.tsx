"use client";

import type { GroupModel } from "../types/group.types";
import { GroupEditButton } from "./GroupEditButton";
import { GroupSyncBadge } from "./GroupSyncBadge";

export function GroupHeader({ group }: { group: GroupModel }) {
	return (
		<div className="flex flex-wrap items-start justify-between gap-4">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">{group.name}</h1>
				{group.description ? (
					<p className="mt-1 text-muted-foreground">{group.description}</p>
				) : null}
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<GroupEditButton groupId={group.id} />
				<GroupSyncBadge status={group.syncStatus} />
			</div>
		</div>
	);
}
