import { enqueueSyncJob } from "@/lib/offline/sync-queue";
import { flushGroupSyncQueue } from "@/lib/offline/sync-worker";

import type { GroupCreateDto, GroupUpdateDto } from "../../dto/group.dto";
import {
	getCachedGroup,
	patchCachedGroup,
	putCachedGroup,
	softDeleteCachedGroup,
} from "../../offline/group.cache";
import type {
	CreateGroupCommand,
	GroupModel,
	UpdateGroupCommand,
} from "../../types/group.types";
import { groupApi } from "../api/group.api";
import { toCreateDto, toUpdateDto } from "../mappers/group-form.mapper";

function tempId(): string {
	return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function flushIfOnline(): Promise<void> {
	if (typeof navigator !== "undefined" && navigator.onLine) {
		await flushGroupSyncQueue();
	}
}

export async function createGroupCommand(
	command: CreateGroupCommand
): Promise<GroupModel> {
	const dto: GroupCreateDto = toCreateDto(command);
	const id = tempId();
	const optimistic: GroupModel = {
		id,
		name: command.name,
		description: command.description ?? null,
		membershipMode: command.membershipMode,
		members: command.members.map((m, i) => ({
			id: `temp-m-${i}`,
			externalId: m.externalId ?? null,
			displayName: m.displayName,
			role: m.role ?? null,
		})),
		characteristics: command.characteristics.map((c, i) => ({
			id: `temp-c-${i}`,
			key: c.key,
			operator: c.operator,
			value: c.value,
		})),
		periodStart: command.periodStart ?? null,
		periodEnd: command.periodEnd ?? null,
		isActive: true,
		syncStatus: "pending",
		updatedAt: new Date().toISOString(),
	};

	await putCachedGroup(optimistic);
	await enqueueSyncJob("group", "create", id, dto);
	await flushIfOnline();

	const cached = await getCachedGroup(id);
	return cached ?? optimistic;
}

export async function updateGroupCommand(
	command: UpdateGroupCommand
): Promise<GroupModel> {
	const dto: GroupUpdateDto = toUpdateDto(command);
	const existing = await getCachedGroup(command.id);
	if (!existing) {
		const remote = await groupApi.update(command.id, dto);
		return remote;
	}

	const patched: GroupModel = {
		...existing,
		...(command.name !== undefined ? { name: command.name } : {}),
		...(command.description !== undefined
			? { description: command.description ?? null }
			: {}),
		...(command.membershipMode !== undefined
			? { membershipMode: command.membershipMode }
			: {}),
		syncStatus: "pending",
		updatedAt: new Date().toISOString(),
	};

	await patchCachedGroup(command.id, patched);
	await enqueueSyncJob("group", "update", command.id, {
		id: command.id,
		dto,
	});
	await flushIfOnline();

	const cached = await getCachedGroup(command.id);
	return cached ?? patched;
}

export async function deleteGroupCommand(id: string): Promise<void> {
	await softDeleteCachedGroup(id);
	await enqueueSyncJob("group", "delete", id, null);
	await flushIfOnline();
}

/** Pull remote list into Dexie (hydration). */
export async function hydrateGroupsFromRemote(): Promise<GroupModel[]> {
	const remote = await groupApi.list();
	const { replaceAllCachedGroups } = await import("../../offline/group.cache");
	await replaceAllCachedGroups(remote);
	return remote;
}

/** Re-queue failed jobs for a group and flush. */
export async function retryGroupSync(groupId: string): Promise<void> {
	const { retryFailedJobsForEntity } = await import("@/lib/offline/sync-queue");
	await retryFailedJobsForEntity(groupId);
	await patchCachedGroup(groupId, { syncStatus: "pending" });
	await flushIfOnline();
}
