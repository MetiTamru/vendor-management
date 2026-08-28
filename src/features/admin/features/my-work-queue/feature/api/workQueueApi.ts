import { isMockEnabled } from "@/lib/mock-mode";
import { vendorCoreApi } from "@/lib/vendor-core/api";
import type {
	MigrationCaseCreateInput,
	MigrationCaseListQuery,
	MigrationCaseUpdateInput,
	MigrationStatusDto,
	WorkQueueSeedInput,
} from "@/lib/vendor-core/types";

import { TPA_TPV_ROWS, type TpaTpvRow, WORK_QUEUE_KPI } from "../../mock-data";
import {
	eventDtoToHistory,
	kpisToCards,
	migrationCaseToRow,
} from "../mappers/workQueueMappers";

export async function listWorkQueueRows(
	params?: MigrationCaseListQuery
): Promise<TpaTpvRow[]> {
	if (isMockEnabled()) return TPA_TPV_ROWS;
	const page = await vendorCoreApi.listMigrationCases(params);
	return (page.results ?? []).map(migrationCaseToRow);
}

export async function listWorkQueueRowsPage(params?: MigrationCaseListQuery) {
	if (isMockEnabled()) {
		const all = TPA_TPV_ROWS;
		const limit = params?.limit ?? 20;
		const offset = params?.offset ?? 0;
		return {
			count: all.length,
			results: all.slice(offset, offset + limit),
			limit,
			offset,
			next: null as string | null,
			previous: null as string | null,
		};
	}
	const page = await vendorCoreApi.listMigrationCasesPage(params);
	return {
		...page,
		results: (page.results ?? []).map(migrationCaseToRow),
	};
}

export async function getWorkQueueKpiCards() {
	if (isMockEnabled()) return WORK_QUEUE_KPI;
	const kpis = await vendorCoreApi.getWorkQueueKpis();
	return kpisToCards(kpis);
}

export async function getMigrationCaseDetail(
	id: string
): Promise<TpaTpvRow | null> {
	if (isMockEnabled()) {
		return TPA_TPV_ROWS.find((r) => r.id === id) ?? null;
	}
	const dto = await vendorCoreApi.getMigrationCase(id);
	return migrationCaseToRow(dto);
}

export async function listMigrationCaseHistory(id: string) {
	if (isMockEnabled()) {
		return TPA_TPV_ROWS.find((r) => r.id === id)?.history ?? [];
	}
	const page = await vendorCoreApi.listMigrationCaseEvents(id, {
		limit: 50,
		offset: 0,
	});
	return (page.results ?? []).map(eventDtoToHistory);
}

export async function createMigrationCase(body: MigrationCaseCreateInput) {
	return vendorCoreApi.createMigrationCase(body).then(migrationCaseToRow);
}

export async function updateMigrationCase(
	id: string,
	body: MigrationCaseUpdateInput
) {
	return vendorCoreApi.updateMigrationCase(id, body).then(migrationCaseToRow);
}

export async function setMigrationCaseStatus(
	id: string,
	migration_status: MigrationStatusDto | string
) {
	return vendorCoreApi
		.setMigrationCaseStatus(id, { migration_status })
		.then(migrationCaseToRow);
}

export async function markMigrationCaseTesting(id: string) {
	return vendorCoreApi.markMigrationCaseTesting(id).then(migrationCaseToRow);
}

export async function markMigrationCaseReady(id: string) {
	return vendorCoreApi.markMigrationCaseReady(id).then(migrationCaseToRow);
}

export async function markMigrationCaseWaitingOnVendor(id: string) {
	return vendorCoreApi
		.markMigrationCaseWaitingOnVendor(id)
		.then(migrationCaseToRow);
}

export async function bulkSetMigrationCaseStatus(
	ids: string[],
	migration_status: MigrationStatusDto | string
) {
	return vendorCoreApi.bulkSetMigrationCaseStatus({ ids, migration_status });
}

export async function importWorkQueueSpreadsheet(file: File) {
	return vendorCoreApi.importWorkQueueSpreadsheet(file);
}

export async function seedWorkQueue(body?: WorkQueueSeedInput) {
	return vendorCoreApi.seedWorkQueue(body);
}

export async function uploadMigrationCaseDocument(id: string, file: File) {
	return vendorCoreApi.uploadMigrationCaseDocument(id, file);
}
