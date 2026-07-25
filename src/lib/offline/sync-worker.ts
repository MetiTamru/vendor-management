import type {
	GroupCreateDto,
	GroupUpdateDto,
} from "@/features/admin/features/groups/dto/group.dto";
import {
	patchCachedGroup,
	reconcileGroupId,
	removeCachedGroup,
} from "@/features/admin/features/groups/offline/group.cache";
import { groupApi } from "@/features/admin/features/groups/service/api/group.api";

import {
	getPendingSyncJobs,
	markSyncJobDone,
	markSyncJobFailed,
	markSyncJobProcessing,
} from "./sync-queue";

let flushing = false;

export async function flushGroupSyncQueue(): Promise<void> {
	if (typeof navigator !== "undefined" && !navigator.onLine) {
		return;
	}
	if (flushing) return;
	flushing = true;

	try {
		const jobs = await getPendingSyncJobs();
		for (const job of jobs) {
			if (job.entity !== "group") continue;
			await markSyncJobProcessing(job.id);
			try {
				if (job.operation === "create") {
					const dto = job.payload as GroupCreateDto;
					const created = await groupApi.create(dto);
					if (job.entityId !== created.id) {
						await reconcileGroupId(job.entityId, created);
					} else {
						await patchCachedGroup(created.id, {
							...created,
							syncStatus: "synced",
						});
					}
				} else if (job.operation === "update") {
					const { id, dto } = job.payload as {
						id: string;
						dto: GroupUpdateDto;
					};
					const updated = await groupApi.update(id, dto);
					await patchCachedGroup(updated.id, {
						...updated,
						syncStatus: "synced",
					});
				} else if (job.operation === "delete") {
					await groupApi.remove(job.entityId);
					await removeCachedGroup(job.entityId);
				}
				await markSyncJobDone(job.id);
			} catch (error) {
				const message = error instanceof Error ? error.message : "Sync failed";
				await markSyncJobFailed(job.id, message);
				await patchCachedGroup(job.entityId, { syncStatus: "failed" });
			}
		}
	} finally {
		flushing = false;
	}
}
