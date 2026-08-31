"use client";

import {
	useInvalidateVendorCore,
	useVendorCoreFeatureMutation,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";
import type {
	MigrationCaseCreateInput,
	MigrationCaseListQuery,
	MigrationCaseUpdateInput,
	MigrationStatusDto,
	WorkQueueSeedInput,
} from "@/lib/vendor-core/types";

import type { ConnectionProgress } from "../../progress-data";
import {
	assignMigrationCase,
	bulkSetMigrationCaseStatus,
	createMigrationCase,
	getMigrationCaseDetail,
	getWorkQueueKpiCards,
	getWorkQueueKpisRaw,
	importWorkQueueSpreadsheet,
	listMigrationCaseHistory,
	listWorkQueueRows,
	listWorkQueueRowsPage,
	markMigrationCaseReady,
	markMigrationCaseTesting,
	markMigrationCaseWaitingOnVendor,
	seedWorkQueue,
	setMigrationCaseStatus,
	updateMigrationCase,
	updateMigrationCaseProgress,
	uploadMigrationCaseDocument,
} from "../api/workQueueApi";

const domain = "work-queue";

export function useWorkQueueRowsQuery(
	params?: MigrationCaseListQuery,
	enabled = true
) {
	return useVendorCoreFeatureQuery(
		domain,
		"rows",
		() => listWorkQueueRows(params),
		enabled,
		[params]
	);
}

export function useWorkQueueRowsPageQuery(
	params?: MigrationCaseListQuery,
	enabled = true
) {
	return useVendorCoreFeatureQuery(
		domain,
		"rows-page",
		() => listWorkQueueRowsPage(params),
		enabled,
		[params]
	);
}

export function useWorkQueueKpisQuery(enabled = true) {
	return useVendorCoreFeatureQuery(
		domain,
		"kpis",
		getWorkQueueKpiCards,
		enabled
	);
}

export function useWorkQueueKpisRawQuery(enabled = true) {
	return useVendorCoreFeatureQuery(
		domain,
		"kpis-raw",
		() => getWorkQueueKpisRaw(),
		enabled
	);
}

export function useMigrationCaseDetailQuery(id: string, enabled = true) {
	return useVendorCoreFeatureQuery(
		domain,
		"detail",
		() => getMigrationCaseDetail(id),
		enabled && Boolean(id),
		[id]
	);
}

export function useMigrationCaseHistoryQuery(id: string, enabled = true) {
	return useVendorCoreFeatureQuery(
		domain,
		"events",
		() => listMigrationCaseHistory(id),
		enabled && Boolean(id),
		[id]
	);
}

export function useCreateMigrationCaseMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof createMigrationCase>>,
		MigrationCaseCreateInput
	>(domain, {
		mutationFn: (body) => createMigrationCase(body),
	});
}

export function useUpdateMigrationCaseMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof updateMigrationCase>>,
		{ id: string; body: MigrationCaseUpdateInput }
	>(domain, {
		mutationFn: ({ id, body }) => updateMigrationCase(id, body),
	});
}

export function useAssignMigrationCaseMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof assignMigrationCase>>,
		{ id: string; assigned_to_id: string | null }
	>(domain, {
		mutationFn: ({ id, assigned_to_id }) =>
			assignMigrationCase(id, assigned_to_id),
	});
}

export function useUpdateMigrationCaseProgressMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof updateMigrationCaseProgress>>,
		{ id: string; track: "sftp" | "edi"; progress: ConnectionProgress }
	>(domain, {
		mutationFn: ({ id, track, progress }) =>
			updateMigrationCaseProgress(id, track, progress),
	});
}

export function useSetMigrationCaseStatusMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof setMigrationCaseStatus>>,
		{ id: string; migration_status: MigrationStatusDto | string }
	>(domain, {
		mutationFn: ({ id, migration_status }) =>
			setMigrationCaseStatus(id, migration_status),
	});
}

export function useMarkMigrationCaseTestingMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof markMigrationCaseTesting>>,
		{ id: string }
	>(domain, {
		mutationFn: ({ id }) => markMigrationCaseTesting(id),
	});
}

export function useMarkMigrationCaseReadyMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof markMigrationCaseReady>>,
		{ id: string }
	>(domain, {
		mutationFn: ({ id }) => markMigrationCaseReady(id),
	});
}

export function useMarkMigrationCaseWaitingOnVendorMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof markMigrationCaseWaitingOnVendor>>,
		{ id: string }
	>(domain, {
		mutationFn: ({ id }) => markMigrationCaseWaitingOnVendor(id),
	});
}

export function useBulkSetMigrationCaseStatusMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof bulkSetMigrationCaseStatus>>,
		{ ids: string[]; migration_status: MigrationStatusDto | string }
	>(domain, {
		mutationFn: ({ ids, migration_status }) =>
			bulkSetMigrationCaseStatus(ids, migration_status),
	});
}

export function useImportWorkQueueSpreadsheetMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof importWorkQueueSpreadsheet>>,
		File
	>(domain, {
		mutationFn: (file) => importWorkQueueSpreadsheet(file),
	});
}

export function useSeedWorkQueueMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof seedWorkQueue>>,
		WorkQueueSeedInput | undefined
	>(domain, {
		mutationFn: (body) => seedWorkQueue(body),
	});
}

export function useUploadMigrationCaseDocumentMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof uploadMigrationCaseDocument>>,
		{ id: string; file: File }
	>(domain, {
		mutationFn: ({ id, file }) => uploadMigrationCaseDocument(id, file),
	});
}

export { useInvalidateVendorCore };
