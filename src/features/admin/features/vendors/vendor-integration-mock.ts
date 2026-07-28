import {
	FILE_RUNS,
	type FileRun,
	displayRunStatus,
} from "@/features/admin/features/file-management/mock-data";

export type VendorHealth = "healthy" | "warning" | "failed" | "in_progress";

export type VendorIntegrationProfile = {
	vendorId: string;
	vendorType: string;
	sftpHost: string;
	timezone: string;
	transmissionMethod: string;
	encryption: string;
	fileFormats: string[];
	tradingPartnerId: string;
	slaPercent: number;
	protocol: string;
	createdBy: string;
	accountsCount: number;
	jobsCount: number;
	alertsCount: number;
	avgProcessingTime: string;
	health: VendorHealth;
	notes: string;
};

export const VENDOR_INTEGRATION: Record<string, VendorIntegrationProfile> = {
	"vnd-1": {
		vendorId: "vnd-1",
		vendorType: "Supplier — Materials",
		sftpHost: "sftp.apex-supply.example",
		timezone: "Central CT",
		transmissionMethod: "SFTP",
		encryption: "PGP",
		fileFormats: ["XML", "EDI X12", "CSV"],
		tradingPartnerId: "TP-APX-001",
		slaPercent: 99.2,
		protocol: "SFTP / AS2",
		createdBy: "Admin",
		accountsCount: 3,
		jobsCount: 8,
		alertsCount: 1,
		avgProcessingTime: "00:02:14",
		health: "healthy",
		notes:
			"Preferred supplier for packaging and raw materials. Daily invoice EDI and remittance feeds are active.",
	},
	"vnd-2": {
		vendorId: "vnd-2",
		vendorType: "Logistics Partner",
		sftpHost: "sftp.horizon.example",
		timezone: "East Africa EAT",
		transmissionMethod: "SFTP",
		encryption: "PGP",
		fileFormats: ["CSV", "JSON"],
		tradingPartnerId: "TP-HRZ-002",
		slaPercent: 96.4,
		protocol: "SFTP",
		createdBy: "Admin",
		accountsCount: 2,
		jobsCount: 6,
		alertsCount: 3,
		avgProcessingTime: "00:03:48",
		health: "failed",
		notes:
			"Regional freight partner. ASN and claims feeds have recent SLA and validation failures requiring follow-up.",
	},
	"vnd-3": {
		vendorId: "vnd-3",
		vendorType: "IT Hardware Vendor",
		sftpHost: "as2.novatech.example",
		timezone: "Central Europe CET",
		transmissionMethod: "AS2",
		encryption: "AS2 + TLS",
		fileFormats: ["XML", "X12"],
		tradingPartnerId: "TP-NVA-003",
		slaPercent: 98.8,
		protocol: "AS2",
		createdBy: "Admin",
		accountsCount: 4,
		jobsCount: 10,
		alertsCount: 2,
		avgProcessingTime: "00:01:38",
		health: "warning",
		notes:
			"EU component supplier. Weekly catalog feed missed the last SLA window; invoice EDI remains healthy.",
	},
	"vnd-4": {
		vendorId: "vnd-4",
		vendorType: "Food & Beverage",
		sftpHost: "sftp.greenfield.example",
		timezone: "East Africa EAT",
		transmissionMethod: "SFTP",
		encryption: "PGP",
		fileFormats: ["CSV"],
		tradingPartnerId: "TP-GRF-004",
		slaPercent: 97.1,
		protocol: "SFTP",
		createdBy: "Admin",
		accountsCount: 1,
		jobsCount: 3,
		alertsCount: 1,
		avgProcessingTime: "00:02:12",
		health: "warning",
		notes:
			"Onboarding in progress. Inventory feed shows schema drift warnings under tolerant mode.",
	},
};

const VENDOR_NAME_MAP: Record<string, string> = {
	"Apex Industrial Supply": "vnd-1",
	"Horizon Logistics": "vnd-2",
	"NovaTech Components": "vnd-3",
	"GreenField Organics": "vnd-4",
	"Summit Packaging Co.": "vnd-1",
};

export function vendorIdForRun(run: FileRun): string | null {
	for (const [name, id] of Object.entries(VENDOR_NAME_MAP)) {
		if (run.vendor.startsWith(name) || name.startsWith(run.vendor)) return id;
	}
	return null;
}

export function runsForVendor(vendorId: string): FileRun[] {
	return FILE_RUNS.filter((run) => vendorIdForRun(run) === vendorId);
}

export function getVendorIntegration(
	vendorId: string
): VendorIntegrationProfile {
	return (
		VENDOR_INTEGRATION[vendorId] ?? {
			vendorId,
			vendorType: "Supplier",
			sftpHost: "—",
			timezone: "UTC",
			transmissionMethod: "SFTP",
			encryption: "None",
			fileFormats: [],
			tradingPartnerId: "—",
			slaPercent: 99,
			protocol: "SFTP",
			createdBy: "Admin",
			accountsCount: 0,
			jobsCount: 0,
			alertsCount: 0,
			avgProcessingTime: "—",
			health: "in_progress",
			notes: "No integration profile configured yet.",
		}
	);
}

export function runBucket(status: FileRun["status"]) {
	const label = displayRunStatus(status);
	if (label === "Success") return "success" as const;
	if (label === "Failed") return "failed" as const;
	if (status === "processing") return "in_progress" as const;
	if (status === "warning" || status === "late") return "warning" as const;
	return "pending" as const;
}

export function summarizeRuns(runs: FileRun[]) {
	const total = runs.length;
	const successful = runs.filter(
		(r) => runBucket(r.status) === "success"
	).length;
	const warnings = runs.filter((r) => runBucket(r.status) === "warning").length;
	const failed = runs.filter((r) => runBucket(r.status) === "failed").length;
	const inProgress = runs.filter(
		(r) => runBucket(r.status) === "in_progress"
	).length;
	const pending = runs.filter(
		(r) => runBucket(r.status) === "pending" || r.status === "missing"
	).length;
	return {
		total,
		expected: Math.max(total + 4, total),
		successful,
		warnings,
		failed,
		inProgress,
		pending: Math.max(pending, total === 0 ? 2 : 0),
		successPct: total ? ((successful / total) * 100).toFixed(1) : "0.0",
		warningPct: total ? ((warnings / total) * 100).toFixed(1) : "0.0",
		failedPct: total ? ((failed / total) * 100).toFixed(1) : "0.0",
	};
}

export const PROCESSING_TREND = [
	{ day: "Jul 18", successful: 18, warnings: 2, failed: 1 },
	{ day: "Jul 19", successful: 20, warnings: 1, failed: 0 },
	{ day: "Jul 20", successful: 17, warnings: 3, failed: 2 },
	{ day: "Jul 21", successful: 22, warnings: 2, failed: 1 },
	{ day: "Jul 22", successful: 19, warnings: 4, failed: 1 },
	{ day: "Jul 23", successful: 21, warnings: 2, failed: 0 },
	{ day: "Jul 24", successful: 23, warnings: 3, failed: 2 },
];

export const VENDOR_TREND_BY_ID: Record<
	string,
	{ day: string; successful: number; warnings: number; failed: number }[]
> = {
	"vnd-1": [
		{ day: "Jul 18", successful: 6, warnings: 0, failed: 0 },
		{ day: "Jul 19", successful: 7, warnings: 1, failed: 0 },
		{ day: "Jul 20", successful: 5, warnings: 0, failed: 0 },
		{ day: "Jul 21", successful: 8, warnings: 0, failed: 0 },
		{ day: "Jul 22", successful: 6, warnings: 1, failed: 0 },
		{ day: "Jul 23", successful: 7, warnings: 0, failed: 0 },
		{ day: "Jul 24", successful: 8, warnings: 0, failed: 0 },
	],
	"vnd-2": [
		{ day: "Jul 18", successful: 3, warnings: 1, failed: 1 },
		{ day: "Jul 19", successful: 4, warnings: 0, failed: 0 },
		{ day: "Jul 20", successful: 2, warnings: 2, failed: 1 },
		{ day: "Jul 21", successful: 3, warnings: 1, failed: 0 },
		{ day: "Jul 22", successful: 2, warnings: 1, failed: 1 },
		{ day: "Jul 23", successful: 4, warnings: 0, failed: 0 },
		{ day: "Jul 24", successful: 1, warnings: 1, failed: 2 },
	],
	"vnd-3": [
		{ day: "Jul 18", successful: 5, warnings: 0, failed: 0 },
		{ day: "Jul 19", successful: 4, warnings: 1, failed: 0 },
		{ day: "Jul 20", successful: 5, warnings: 0, failed: 1 },
		{ day: "Jul 21", successful: 6, warnings: 0, failed: 0 },
		{ day: "Jul 22", successful: 4, warnings: 2, failed: 0 },
		{ day: "Jul 23", successful: 5, warnings: 0, failed: 0 },
		{ day: "Jul 24", successful: 5, warnings: 1, failed: 1 },
	],
	"vnd-4": [
		{ day: "Jul 18", successful: 2, warnings: 1, failed: 0 },
		{ day: "Jul 19", successful: 3, warnings: 0, failed: 0 },
		{ day: "Jul 20", successful: 2, warnings: 1, failed: 0 },
		{ day: "Jul 21", successful: 2, warnings: 1, failed: 0 },
		{ day: "Jul 22", successful: 3, warnings: 1, failed: 0 },
		{ day: "Jul 23", successful: 2, warnings: 2, failed: 0 },
		{ day: "Jul 24", successful: 2, warnings: 1, failed: 0 },
	],
};

export type VendorAlert = {
	id: string;
	vendorId: string;
	vendorName: string;
	title: string;
	when: string;
	severity: "error" | "warning" | "info";
	runId?: string;
};

export const VENDOR_ALERTS: VendorAlert[] = [
	{
		id: "va1",
		vendorId: "vnd-2",
		vendorName: "Horizon Logistics",
		title: "Horizon — ASN file processing failed.",
		when: "Today 9:45 AM",
		severity: "error",
		runId: "f2",
	},
	{
		id: "va2",
		vendorId: "vnd-3",
		vendorName: "NovaTech Components",
		title: "NovaTech — Weekly catalog feed missing.",
		when: "Today 7:00 AM",
		severity: "error",
		runId: "f3",
	},
	{
		id: "va3",
		vendorId: "vnd-4",
		vendorName: "GreenField Organics",
		title: "GreenField — Inventory schema drift warning.",
		when: "Today 7:50 AM",
		severity: "warning",
		runId: "f5",
	},
	{
		id: "va4",
		vendorId: "vnd-1",
		vendorName: "Apex Industrial Supply",
		title: "Apex — Remittance held in treasury queue.",
		when: "Today 11:02 AM",
		severity: "info",
		runId: "f6",
	},
	{
		id: "va5",
		vendorId: "vnd-2",
		vendorName: "Horizon Logistics",
		title: "Horizon — Claims file not delivered.",
		when: "Yesterday 9:15 AM",
		severity: "error",
		runId: "f7",
	},
];
