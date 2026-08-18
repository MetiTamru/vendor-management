import type { FileRun } from "@/features/admin/features/file-management/mock-data";
import type { ProgramFileType } from "@/types/UI/system.types";

export type SlaRunModel = Pick<
	FileRun,
	| "id"
	| "program"
	| "vendor"
	| "fileType"
	| "runId"
	| "scheduleId"
	| "status"
	| "expectedAt"
	| "receivedAt"
	| "slaMinutes"
	| "latencyMinutes"
>;

export type VendorSlaModel = {
	vendor: string;
	total: number;
	onTime: number;
	atRisk: number;
	breached: number;
	score: number;
};

export type SlaSummaryModel = {
	monitored: number;
	onTime: number;
	atRisk: number;
	breached: number;
	avgLatency: number;
	attainment: number;
};

export type SlaMonitoringModel = {
	program: ProgramFileType;
	events: SlaRunModel[];
	summary: SlaSummaryModel;
	vendorScores: VendorSlaModel[];
	watchlist: SlaRunModel[];
};

export type SlaMonitoringListResult = {
	items: SlaMonitoringModel[];
	total: number;
};
