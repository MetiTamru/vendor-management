import "fake-indexeddb/auto";

import { offlineDb } from "@/lib/offline/db";
import {
	enqueueSyncJob,
	getPendingSyncJobs,
	markSyncJobDone,
} from "@/lib/offline/sync-queue";

describe("sync-queue", () => {
	beforeEach(async () => {
		await offlineDb?.syncQueue.clear();
	});

	it("enqueues and completes a pending job", async () => {
		const job = await enqueueSyncJob("group", "create", "temp-1", {
			name: "Test",
		});
		expect(job.status).toBe("pending");

		const pending = await getPendingSyncJobs();
		expect(pending).toHaveLength(1);

		await markSyncJobDone(job.id);
		const after = await getPendingSyncJobs();
		expect(after).toHaveLength(0);
	});
});
