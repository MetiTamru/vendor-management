/** Intentionally mock-backed workspace domain; no vendor-core route yet. */
import { withMockOrRemote } from "@/lib/mock-mode";

import {
	MIGRATION_STATUS_LABEL,
	TPA_TPV_ROWS,
	WHITELIST_STATUS_LABEL,
	WORK_QUEUE_KPI,
} from "../../mock-data";
import type {
	MyWorkQueueListFiltersDto,
	TpaTpvContactsUpdateDto,
	TpaTpvInfoUpdateDto,
	TpaTpvMigrationUpdateDto,
	TpaTpvProgressUpdateDto,
} from "../dto/myWorkQueueDto";
import {
	milestonesFromProgressUpdate,
	toTpaTpvModel,
	toWorkQueueKpi,
} from "../mappers/myWorkQueueMappers";
import {
	computeMigrationProgressPercent,
	computeOverallMigrationProgress,
} from "../progress";
import type {
	MyWorkQueueDashboardModel,
	MyWorkQueueListResult,
	TpaTpvModel,
} from "../types/myWorkQueueModel";

export {
	MIGRATION_STATUS_LABEL,
	WHITELIST_STATUS_LABEL,
} from "../../mock-data";

export {
	computeMigrationProgressPercent,
	computeOverallMigrationProgress,
	MIGRATION_PROGRESS_STEPS,
} from "../progress";

export async function listWorkQueueKpis() {
	return withMockOrRemote(
		() => WORK_QUEUE_KPI.map(toWorkQueueKpi),
		async () => [],
		[]
	);
}

export async function listTpaTpvRows(
	filters?: MyWorkQueueListFiltersDto
): Promise<MyWorkQueueListResult> {
	return withMockOrRemote(
		() => {
			const q = filters?.search?.trim().toLowerCase() ?? "";
			const items = TPA_TPV_ROWS.map((row, index) =>
				toTpaTpvModel(row, index)
			).filter((row) => {
				if (
					filters?.status &&
					filters.status !== "all" &&
					row.status !== filters.status
				) {
					return false;
				}
				if (
					filters?.analyst &&
					filters.analyst !== "all" &&
					row.assignedAnalyst !== filters.analyst
				) {
					return false;
				}
				if (
					filters?.wave &&
					filters.wave !== "all" &&
					String(row.wave) !== filters.wave
				) {
					return false;
				}
				if (!q) return true;
				return (
					row.name.toLowerCase().includes(q) ||
					row.serverType.toLowerCase().includes(q) ||
					row.contactEmail.toLowerCase().includes(q) ||
					row.assignedAnalyst.toLowerCase().includes(q) ||
					row.code.toLowerCase().includes(q)
				);
			});
			return { items, total: items.length };
		},
		async () => ({ items: [] as TpaTpvModel[], total: 0 }),
		{ items: [] as TpaTpvModel[], total: 0 }
	);
}

export async function getTpaTpvDetail(
	id: string
): Promise<TpaTpvModel | undefined> {
	return withMockOrRemote(
		() => {
			const row = TPA_TPV_ROWS.find((item) => item.id === id);
			return row ? toTpaTpvModel(row) : undefined;
		},
		async () => undefined,
		undefined
	);
}

export async function getMyWorkQueueDashboard(): Promise<MyWorkQueueDashboardModel> {
	const [kpis, list] = await Promise.all([
		listWorkQueueKpis(),
		listTpaTpvRows(),
	]);
	return { kpis, rows: list.items };
}

export async function updateTpaTpvInfo(
	id: string,
	body: TpaTpvInfoUpdateDto
): Promise<TpaTpvModel | undefined> {
	return withMockOrRemote(
		() => {
			const row = TPA_TPV_ROWS.find((item) => item.id === id);
			if (!row) return undefined;
			Object.assign(row, body);
			row.lastUpdated = new Date().toLocaleString("en-US", {
				month: "2-digit",
				day: "2-digit",
				year: "numeric",
				hour: "numeric",
				minute: "2-digit",
			});
			return toTpaTpvModel(row);
		},
		async () => undefined,
		undefined
	);
}

export async function updateTpaTpvContacts(
	id: string,
	body: TpaTpvContactsUpdateDto
): Promise<TpaTpvModel | undefined> {
	return withMockOrRemote(
		() => {
			const row = TPA_TPV_ROWS.find((item) => item.id === id);
			if (!row) return undefined;
			Object.assign(row, body);
			row.contactEmail = body.primaryEmail || row.contactEmail;
			row.lastUpdated = new Date().toLocaleString("en-US", {
				month: "2-digit",
				day: "2-digit",
				year: "numeric",
				hour: "numeric",
				minute: "2-digit",
			});
			return toTpaTpvModel(row);
		},
		async () => undefined,
		undefined
	);
}

export async function updateTpaTpvMigration(
	id: string,
	body: TpaTpvMigrationUpdateDto
): Promise<TpaTpvModel | undefined> {
	return withMockOrRemote(
		() => {
			const row = TPA_TPV_ROWS.find((item) => item.id === id);
			if (!row) return undefined;
			Object.assign(row, body);
			row.lastUpdated = new Date().toLocaleString("en-US", {
				month: "2-digit",
				day: "2-digit",
				year: "numeric",
				hour: "numeric",
				minute: "2-digit",
			});
			row.history = [
				{
					id: `h-${Date.now()}`,
					at: row.lastUpdated,
					message: `Status updated to ${MIGRATION_STATUS_LABEL[body.status]} by system`,
					tone:
						body.status === "waiting_on_vendor" || body.status === "exception"
							? "orange"
							: body.status === "testing" || body.status === "need_testing"
								? "purple"
								: body.status === "ready" || body.status === "production_ready"
									? "green"
									: "blue",
				},
				...row.history,
			];
			return toTpaTpvModel(row);
		},
		async () => undefined,
		undefined
	);
}

function formatNow(): string {
	return new Date().toLocaleString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}

export async function updateTpaTpvProgress(
	id: string,
	body: TpaTpvProgressUpdateDto
): Promise<TpaTpvModel | undefined> {
	return withMockOrRemote(
		() => {
			const row = TPA_TPV_ROWS.find((item) => item.id === id);
			if (!row) return undefined;
			const milestones = milestonesFromProgressUpdate(body);
			const progressPercent = computeMigrationProgressPercent(milestones);
			const now = formatNow();
			const actor = row.assignedAnalyst || "EDI Analyst";
			Object.assign(row, milestones, {
				notes: body.notes,
				progressPercent,
				progressUpdatedBy: actor,
				progressUpdatedAt: now,
				lastUpdated: now,
			});
			row.history = [
				{
					id: `h-${Date.now()}`,
					at: now,
					message: `Progress updated to ${progressPercent}% by ${actor}`,
					tone: progressPercent === 100 ? "green" : "blue",
				},
				...row.history,
			];
			return toTpaTpvModel(row);
		},
		async () => undefined,
		undefined
	);
}

export async function getOverallMigrationProgress(): Promise<number> {
	return withMockOrRemote(
		() =>
			computeOverallMigrationProgress(
				TPA_TPV_ROWS.map((row) => ({
					progressPercent: row.sftpProgress.percent,
				}))
			),
		async () => 0,
		0
	);
}
