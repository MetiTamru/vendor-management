import { type CachedGroupRow, offlineDb } from "@/lib/offline/db";

import { fromCacheRow, toCacheRow } from "../service/mappers/group.mapper";
import type { GroupModel } from "../types/group.types";

function assertDb() {
	if (!offlineDb) {
		throw new Error("Offline database is not available");
	}
	return offlineDb;
}

function toRow(
	model: GroupModel,
	deletedAt: string | null = null
): CachedGroupRow {
	return { ...toCacheRow(model), deletedAt };
}

export async function listCachedGroups(): Promise<GroupModel[]> {
	const db = assertDb();
	const rows = await db.groups
		.filter((row) => row.deletedAt === null)
		.toArray();
	return rows.map((row) => fromCacheRow(row));
}

export async function getCachedGroup(id: string): Promise<GroupModel | null> {
	const db = assertDb();
	const row = await db.groups.get(id);
	if (!row || row.deletedAt) return null;
	return fromCacheRow(row);
}

export async function replaceAllCachedGroups(
	models: GroupModel[]
): Promise<void> {
	const db = assertDb();
	await db.transaction("rw", db.groups, async () => {
		const remoteIds = new Set(models.map((m) => m.id));
		const existing = await db.groups.toArray();
		for (const row of existing) {
			if (!remoteIds.has(row.id) && row.deletedAt === null) {
				await db.groups.delete(row.id);
			}
		}
		for (const model of models) {
			await db.groups.put(toRow({ ...model, syncStatus: "synced" }));
		}
	});
}

export async function putCachedGroup(
	model: GroupModel,
	deletedAt: string | null = null
): Promise<void> {
	const db = assertDb();
	await db.groups.put(toRow(model, deletedAt));
}

export async function patchCachedGroup(
	id: string,
	patch: Partial<GroupModel>
): Promise<GroupModel | null> {
	const db = assertDb();
	const existing = await db.groups.get(id);
	if (!existing || existing.deletedAt) return null;
	const merged = fromCacheRow({ ...existing, ...patch });
	await db.groups.put(toRow(merged, existing.deletedAt));
	return merged;
}

export async function softDeleteCachedGroup(id: string): Promise<void> {
	const db = assertDb();
	const existing = await db.groups.get(id);
	if (!existing) return;
	await db.groups.put({
		...existing,
		deletedAt: new Date().toISOString(),
		syncStatus: "pending",
	});
}

export async function removeCachedGroup(id: string): Promise<void> {
	const db = assertDb();
	await db.groups.delete(id);
}

export async function reconcileGroupId(
	tempId: string,
	serverModel: GroupModel
): Promise<void> {
	const db = assertDb();
	const temp = await db.groups.get(tempId);
	if (temp) {
		await db.groups.delete(tempId);
	}
	await db.groups.put(toRow({ ...serverModel, syncStatus: "synced" }));
}
