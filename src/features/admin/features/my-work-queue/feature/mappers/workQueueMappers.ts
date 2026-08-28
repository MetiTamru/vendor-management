import type {
	MigrationCaseDto,
	MigrationCaseEventDto,
	WorkQueueKpisDto,
} from "@/lib/vendor-core/types";

import {
	type HistoryEvent,
	type MigrationStatus,
	type TpaTpvRow,
	type VendorType,
	WORK_QUEUE_KPI,
	type WhitelistStatus,
} from "../../mock-data";
import { EMPTY_EDI_PROGRESS, EMPTY_SFTP_PROGRESS } from "../../progress-data";

const STAGE_LABEL: Record<string, string> = {
	not_started: "Not Started",
	data_exchange: "Data Exchange",
	connectivity_testing: "Connectivity Testing",
	whitelist_review: "Whitelist Review",
	contract_review: "Contract Review",
	go_live_readiness: "Go-Live Readiness",
	exception_handling: "Exception Handling",
	production: "Production",
};

const STAGE_FROM_LABEL: Record<string, string> = Object.fromEntries(
	Object.entries(STAGE_LABEL).map(([k, v]) => [v.toLowerCase(), k])
);

const HISTORY_TONES = new Set(["orange", "purple", "green", "blue", "red"]);

export const CURRENT_STAGE_OPTIONS = Object.entries(STAGE_LABEL).map(
	([value, label]) => ({ value, label })
);

export function stageToApi(value: string): string {
	const trimmed = value.trim();
	if (!trimmed) return "not_started";
	if (STAGE_LABEL[trimmed]) return trimmed;
	return STAGE_FROM_LABEL[trimmed.toLowerCase()] ?? "not_started";
}

export function stageToLabel(value: string): string {
	return STAGE_LABEL[value] ?? value;
}

export function vendorTypeToApi(type: VendorType | string): "tpa" | "tpv" {
	return String(type).toLowerCase() === "tpv" ? "tpv" : "tpa";
}

export function vendorTypeToUi(type: string): VendorType {
	return type.toLowerCase() === "tpv" ? "TPV" : "TPA";
}

/** Accept MM/DD/YYYY or ISO; emit YYYY-MM-DD for API date fields. */
export function dateToApi(value: string): string | null {
	const v = value.trim();
	if (!v) return null;
	if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
	const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
	if (m?.[1] && m[2] && m[3]) {
		const mm = m[1].padStart(2, "0");
		const dd = m[2].padStart(2, "0");
		const yyyy = m[3];
		return `${yyyy}-${mm}-${dd}`;
	}
	const parsed = new Date(v);
	if (Number.isNaN(parsed.getTime())) return null;
	return parsed.toISOString().slice(0, 10);
}

function formatDisplayDate(iso: string | null | undefined): string {
	if (!iso) return "";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) {
		if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
			const [y, m, day] = iso.split("-");
			return `${m}/${day}/${y}`;
		}
		return iso;
	}
	return d.toLocaleDateString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
	});
}

function formatDisplayDateTime(iso: string | null | undefined): string {
	if (!iso) return "";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return d.toLocaleString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}

function analystName(assigned: MigrationCaseDto["assigned_to"]): string {
	if (!assigned) return "Unassigned";
	return (
		assigned.full_name?.trim() ||
		[assigned.first_name, assigned.last_name]
			.filter(Boolean)
			.join(" ")
			.trim() ||
		assigned.username ||
		assigned.email ||
		"Unassigned"
	);
}

function asMigrationStatus(value: string): MigrationStatus {
	const allowed: MigrationStatus[] = [
		"waiting_on_vendor",
		"testing",
		"need_testing",
		"ready",
		"production_ready",
		"not_started",
		"exception",
	];
	return (
		allowed.includes(value as MigrationStatus) ? value : "not_started"
	) as MigrationStatus;
}

function asWhitelistStatus(value: string): WhitelistStatus {
	if (value === "complete" || value === "pending") return value;
	return "not_started";
}

export function eventDtoToHistory(event: MigrationCaseEventDto): HistoryEvent {
	const tone = HISTORY_TONES.has(event.tone)
		? (event.tone as HistoryEvent["tone"])
		: "blue";
	return {
		id: event.id,
		at: formatDisplayDateTime(event.created_at),
		message: event.message,
		tone,
	};
}

export function migrationCaseToRow(dto: MigrationCaseDto): TpaTpvRow {
	return {
		id: dto.id,
		wave: dto.wave ?? 1,
		name: dto.name,
		code: dto.code,
		type: vendorTypeToUi(String(dto.vendor_type)),
		serverType: dto.server_type ?? "",
		contactEmail: dto.primary_email || "",
		whitelistStatus: asWhitelistStatus(String(dto.whitelist_status)),
		lastCommunication: formatDisplayDate(dto.last_communication_at),
		status: asMigrationStatus(String(dto.migration_status)),
		assignedAnalyst: analystName(dto.assigned_to),
		lastUpdated: formatDisplayDateTime(dto.updated_at),
		notes: dto.notes ?? "",
		primaryContact: dto.primary_contact ?? "",
		primaryEmail: dto.primary_email ?? "",
		primaryPhone: dto.primary_phone ?? "",
		secondaryContact: dto.secondary_contact ?? "",
		secondaryEmail: dto.secondary_email ?? "",
		secondaryPhone: dto.secondary_phone ?? "",
		migrationStartDate: formatDisplayDate(dto.migration_start_date),
		waitingOnVendorDate: formatDisplayDate(dto.waiting_on_vendor_date),
		currentStage: stageToLabel(String(dto.current_stage ?? "not_started")),
		nextStep: dto.next_step ?? "",
		history: (dto.events ?? []).map(eventDtoToHistory),
		sftpProgress: EMPTY_SFTP_PROGRESS,
		ediProgress: EMPTY_EDI_PROGRESS,
	};
}

export function kpisToCards(kpis: WorkQueueKpisDto) {
	const counts: Record<string, number> = {
		assigned: kpis.assigned,
		connected: kpis.connected,
		migration: kpis.in_migration,
		testing: kpis.testing,
		exceptions: kpis.exceptions,
		not_started: kpis.not_started,
	};
	return WORK_QUEUE_KPI.map((card) => ({
		...card,
		count: counts[card.id] ?? 0,
	}));
}
