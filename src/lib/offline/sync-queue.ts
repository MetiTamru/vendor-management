import { v4 as uuidv4 } from "uuid";

import { offlineDb } from "./db";
import type { SyncEntity, SyncJob, SyncOperation } from "./types";

export async function enqueueSyncJob(
	entity: SyncEntity,
	operation: SyncOperation,
	entityId: string,
	payload: unknown
): Promise<SyncJob> {
	if (!offlineDb) {
		throw new Error("Offline database is not available");
	}

	const job: SyncJob = {
		id: uuidv4(),
		entity,
		operation,
		entityId,
		payload,
		status: "pending",
		retries: 0,
		createdAt: new Date().toISOString(),
	};

	await offlineDb.syncQueue.add(job);
	return job;
}

export async function getPendingSyncJobs(): Promise<SyncJob[]> {
	if (!offlineDb) return [];
	return offlineDb.syncQueue
		.where("status")
		.equals("pending")
		.sortBy("createdAt");
}

export async function getFailedSyncJobsForEntity(
	entityId: string
): Promise<SyncJob[]> {
	if (!offlineDb) return [];
	return offlineDb.syncQueue
		.where("entityId")
		.equals(entityId)
		.filter((job) => job.status === "failed")
		.toArray();
}

export async function markSyncJobProcessing(jobId: string): Promise<void> {
	if (!offlineDb) return;
	await offlineDb.syncQueue.update(jobId, { status: "processing" });
}

export async function markSyncJobDone(jobId: string): Promise<void> {
	if (!offlineDb) return;
	await offlineDb.syncQueue.delete(jobId);
}

export async function markSyncJobFailed(
	jobId: string,
	errorMessage: string
): Promise<void> {
	if (!offlineDb) return;
	const job = await offlineDb.syncQueue.get(jobId);
	if (!job) return;
	await offlineDb.syncQueue.update(jobId, {
		status: "failed",
		retries: job.retries + 1,
		errorMessage,
	});
}

export async function retryFailedJobsForEntity(
	entityId: string
): Promise<void> {
	if (!offlineDb) return;
	const failed = await getFailedSyncJobsForEntity(entityId);
	await Promise.all(
		failed.map((job) =>
			offlineDb!.syncQueue.update(job.id, {
				status: "pending",
				errorMessage: null,
			})
		)
	);
}
