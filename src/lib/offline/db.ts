import Dexie, { type Table } from "dexie";

import type { GroupModel } from "@/features/admin/features/groups/types/group.types";

import type { SyncJob } from "./types";

export type CachedGroupRow = GroupModel & {
	deletedAt: string | null;
};

export class OfflineDatabase extends Dexie {
	groups!: Table<CachedGroupRow, string>;
	syncQueue!: Table<SyncJob, string>;

	constructor() {
		super("starter_offline");
		this.version(1).stores({
			groups: "id, syncStatus, updatedAt",
			syncQueue: "id, entityId, status, createdAt",
		});
	}
}

export const offlineDb =
	typeof indexedDB !== "undefined" ? new OfflineDatabase() : null;
