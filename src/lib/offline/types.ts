export type SyncEntity = "group";

export type SyncOperation = "create" | "update" | "delete";

export type SyncJobStatus = "pending" | "processing" | "failed";

export type SyncJob = {
	id: string;
	entity: SyncEntity;
	operation: SyncOperation;
	entityId: string;
	payload: unknown;
	status: SyncJobStatus;
	retries: number;
	createdAt: string;
	errorMessage?: string | null;
};
