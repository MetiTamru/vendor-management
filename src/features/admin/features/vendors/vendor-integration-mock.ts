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
		vendorType: "Clearinghouse",
		sftpHost: "sftp.apex-supply.example",
		timezone: "Central CT",
		transmissionMethod: "SFTP",
		encryption: "PGP",
		fileFormats: ["XML", "EDI X12", "CSV"],
		tradingPartnerId: "VND-0001",
		slaPercent: 99.2,
		protocol: "SFTP / AS2",
		createdBy: "Admin",
		accountsCount: 3,
		jobsCount: 8,
		alertsCount: 0,
		avgProcessingTime: "00:02:14",
		health: "healthy",
		notes:
			"Preferred supplier for packaging and raw materials. Daily invoice EDI and remittance feeds are active.",
	},
	"vnd-2": {
		vendorId: "vnd-2",
		vendorType: "Logistics",
		sftpHost: "sftp.horizon.example",
		timezone: "East Africa EAT",
		transmissionMethod: "SFTP",
		encryption: "PGP",
		fileFormats: ["CSV", "JSON"],
		tradingPartnerId: "VND-0002",
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
		vendorType: "Laboratory",
		sftpHost: "as2.novatech.example",
		timezone: "Central Europe CET",
		transmissionMethod: "AS2",
		encryption: "AS2 + TLS",
		fileFormats: ["XML", "X12"],
		tradingPartnerId: "VND-0003",
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
		vendorType: "PBM",
		sftpHost: "sftp.greenfield.example",
		timezone: "East Africa EAT",
		transmissionMethod: "SFTP",
		encryption: "PGP",
		fileFormats: ["CSV"],
		tradingPartnerId: "VND-0004",
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

export type VendorListStatus = "active" | "at_risk" | "inactive";
export type VendorListHealth = "healthy" | "warning" | "critical";

export type VendorDirectoryRow = {
	id: string;
	name: string;
	vendorCode: string;
	vendorType: string;
	status: VendorListStatus;
	linkedAccounts: number;
	activeJobs: number;
	lastFileReceived: string;
	lastFileRelative: string;
	health: VendorListHealth;
	mark: string;
	avatarBg: string;
};

/** Directory used by the Vendors list page (matches ops console mock). */
export const VENDOR_DIRECTORY: VendorDirectoryRow[] = [
	{
		id: "vnd-1",
		name: "UST Healthcare",
		vendorCode: "VND-0003",
		vendorType: "Clearinghouse",
		status: "active",
		linkedAccounts: 12,
		activeJobs: 8,
		lastFileReceived: "07/24/2026 6:02 AM",
		lastFileRelative: "Today",
		health: "healthy",
		mark: "U",
		avatarBg: "bg-[#13446c]",
	},
	{
		id: "vnd-2",
		name: "CVS Caremark",
		vendorCode: "VND-0011",
		vendorType: "PBM",
		status: "active",
		linkedAccounts: 9,
		activeJobs: 14,
		lastFileReceived: "07/24/2026 5:41 AM",
		lastFileRelative: "Today",
		health: "healthy",
		mark: "C",
		avatarBg: "bg-[#c2410c]",
	},
	{
		id: "vnd-3",
		name: "Labcorp",
		vendorCode: "VND-0007",
		vendorType: "Laboratory",
		status: "at_risk",
		linkedAccounts: 6,
		activeJobs: 4,
		lastFileReceived: "07/23/2026 8:25 PM",
		lastFileRelative: "Yesterday",
		health: "critical",
		mark: "L",
		avatarBg: "bg-[#1d4ed8]",
	},
	{
		id: "vnd-4",
		name: "Avesis",
		vendorCode: "VND-0014",
		vendorType: "Dental",
		status: "active",
		linkedAccounts: 5,
		activeJobs: 7,
		lastFileReceived: "07/23/2026 7:18 PM",
		lastFileRelative: "Yesterday",
		health: "warning",
		mark: "A",
		avatarBg: "bg-[#15803d]",
	},
	{
		id: "vnd-5",
		name: "OptumRx",
		vendorCode: "VND-0002",
		vendorType: "PBM",
		status: "active",
		linkedAccounts: 11,
		activeJobs: 10,
		lastFileReceived: "07/24/2026 4:12 AM",
		lastFileRelative: "Today",
		health: "healthy",
		mark: "O",
		avatarBg: "bg-[#0e7490]",
	},
	{
		id: "vnd-6",
		name: "Quest Diagnostics",
		vendorCode: "VND-0009",
		vendorType: "Laboratory",
		status: "active",
		linkedAccounts: 8,
		activeJobs: 6,
		lastFileReceived: "07/24/2026 3:55 AM",
		lastFileRelative: "Today",
		health: "healthy",
		mark: "Q",
		avatarBg: "bg-[#7c3aed]",
	},
	{
		id: "vnd-7",
		name: "Change Healthcare",
		vendorCode: "VND-0001",
		vendorType: "Clearinghouse",
		status: "inactive",
		linkedAccounts: 3,
		activeJobs: 0,
		lastFileReceived: "07/10/2026 9:14 AM",
		lastFileRelative: "19 days ago",
		health: "warning",
		mark: "C",
		avatarBg: "bg-[#0369a1]",
	},
	{
		id: "vnd-8",
		name: "Express Scripts",
		vendorCode: "VND-0018",
		vendorType: "PBM",
		status: "active",
		linkedAccounts: 7,
		activeJobs: 9,
		lastFileReceived: "07/24/2026 2:40 AM",
		lastFileRelative: "Today",
		health: "healthy",
		mark: "E",
		avatarBg: "bg-[#be123c]",
	},
	{
		id: "vnd-9",
		name: "Availity",
		vendorCode: "VND-0020",
		vendorType: "Clearinghouse",
		status: "active",
		linkedAccounts: 10,
		activeJobs: 11,
		lastFileReceived: "07/24/2026 1:18 AM",
		lastFileRelative: "Today",
		health: "healthy",
		mark: "A",
		avatarBg: "bg-[#b45309]",
	},
	{
		id: "vnd-10",
		name: "Delta Dental",
		vendorCode: "VND-0015",
		vendorType: "Dental",
		status: "active",
		linkedAccounts: 4,
		activeJobs: 5,
		lastFileReceived: "07/23/2026 11:02 PM",
		lastFileRelative: "Yesterday",
		health: "healthy",
		mark: "D",
		avatarBg: "bg-[#0f766e]",
	},
	{
		id: "vnd-11",
		name: "Humana Pharmacy",
		vendorCode: "VND-0022",
		vendorType: "PBM",
		status: "at_risk",
		linkedAccounts: 6,
		activeJobs: 3,
		lastFileReceived: "07/22/2026 6:44 PM",
		lastFileRelative: "2 days ago",
		health: "critical",
		mark: "H",
		avatarBg: "bg-[#9333ea]",
	},
	{
		id: "vnd-12",
		name: "BioReference Labs",
		vendorCode: "VND-0008",
		vendorType: "Laboratory",
		status: "active",
		linkedAccounts: 5,
		activeJobs: 4,
		lastFileReceived: "07/24/2026 12:51 AM",
		lastFileRelative: "Today",
		health: "healthy",
		mark: "B",
		avatarBg: "bg-[#2563eb]",
	},
	{
		id: "vnd-13",
		name: "Trizetto Provider",
		vendorCode: "VND-0024",
		vendorType: "Clearinghouse",
		status: "inactive",
		linkedAccounts: 2,
		activeJobs: 0,
		lastFileReceived: "06/30/2026 4:20 PM",
		lastFileRelative: "24 days ago",
		health: "warning",
		mark: "T",
		avatarBg: "bg-[#475569]",
	},
	{
		id: "vnd-14",
		name: "MetLife Dental",
		vendorCode: "VND-0016",
		vendorType: "Dental",
		status: "active",
		linkedAccounts: 6,
		activeJobs: 5,
		lastFileReceived: "07/23/2026 9:33 PM",
		lastFileRelative: "Yesterday",
		health: "healthy",
		mark: "M",
		avatarBg: "bg-[#047857]",
	},
	{
		id: "vnd-15",
		name: "EmblemHealth Rx",
		vendorCode: "VND-0019",
		vendorType: "PBM",
		status: "active",
		linkedAccounts: 8,
		activeJobs: 7,
		lastFileReceived: "07/24/2026 5:05 AM",
		lastFileRelative: "Today",
		health: "healthy",
		mark: "E",
		avatarBg: "bg-[#dc2626]",
	},
	{
		id: "vnd-16",
		name: "Sonic Healthcare",
		vendorCode: "VND-0010",
		vendorType: "Laboratory",
		status: "active",
		linkedAccounts: 7,
		activeJobs: 6,
		lastFileReceived: "07/24/2026 3:22 AM",
		lastFileRelative: "Today",
		health: "healthy",
		mark: "S",
		avatarBg: "bg-[#0284c7]",
	},
	{
		id: "vnd-17",
		name: "Office Ally",
		vendorCode: "VND-0005",
		vendorType: "Clearinghouse",
		status: "active",
		linkedAccounts: 9,
		activeJobs: 8,
		lastFileReceived: "07/24/2026 2:11 AM",
		lastFileRelative: "Today",
		health: "healthy",
		mark: "O",
		avatarBg: "bg-[#4f46e5]",
	},
	{
		id: "vnd-18",
		name: "Prime Therapeutics",
		vendorCode: "VND-0021",
		vendorType: "PBM",
		status: "active",
		linkedAccounts: 10,
		activeJobs: 12,
		lastFileReceived: "07/24/2026 4:48 AM",
		lastFileRelative: "Today",
		health: "healthy",
		mark: "P",
		avatarBg: "bg-[#ea580c]",
	},
	{
		id: "vnd-19",
		name: "PathGroup",
		vendorCode: "VND-0012",
		vendorType: "Laboratory",
		status: "active",
		linkedAccounts: 4,
		activeJobs: 3,
		lastFileReceived: "07/23/2026 10:15 PM",
		lastFileRelative: "Yesterday",
		health: "healthy",
		mark: "P",
		avatarBg: "bg-[#0891b2]",
	},
	{
		id: "vnd-20",
		name: "Guardian Dental",
		vendorCode: "VND-0017",
		vendorType: "Dental",
		status: "active",
		linkedAccounts: 3,
		activeJobs: 2,
		lastFileReceived: "07/23/2026 8:01 PM",
		lastFileRelative: "Yesterday",
		health: "warning",
		mark: "G",
		avatarBg: "bg-[#65a30d]",
	},
	{
		id: "vnd-21",
		name: "Waystar",
		vendorCode: "VND-0006",
		vendorType: "Clearinghouse",
		status: "active",
		linkedAccounts: 11,
		activeJobs: 9,
		lastFileReceived: "07/24/2026 1:47 AM",
		lastFileRelative: "Today",
		health: "healthy",
		mark: "W",
		avatarBg: "bg-[#1e40af]",
	},
	{
		id: "vnd-22",
		name: "Magellan Rx",
		vendorCode: "VND-0023",
		vendorType: "PBM",
		status: "active",
		linkedAccounts: 5,
		activeJobs: 4,
		lastFileReceived: "07/24/2026 12:20 AM",
		lastFileRelative: "Today",
		health: "healthy",
		mark: "M",
		avatarBg: "bg-[#9f1239]",
	},
	{
		id: "vnd-23",
		name: "ARUP Laboratories",
		vendorCode: "VND-0013",
		vendorType: "Laboratory",
		status: "active",
		linkedAccounts: 6,
		activeJobs: 5,
		lastFileReceived: "07/23/2026 6:55 PM",
		lastFileRelative: "Yesterday",
		health: "healthy",
		mark: "A",
		avatarBg: "bg-[#0d9488]",
	},
	{
		id: "vnd-24",
		name: "SSI Claims",
		vendorCode: "VND-0004",
		vendorType: "Clearinghouse",
		status: "inactive",
		linkedAccounts: 1,
		activeJobs: 0,
		lastFileReceived: "07/01/2026 2:30 PM",
		lastFileRelative: "23 days ago",
		health: "critical",
		mark: "S",
		avatarBg: "bg-[#334155]",
	},
];

export function summarizeVendorDirectory(rows: VendorDirectoryRow[]) {
	const total = rows.length;
	const active = rows.filter((r) => r.status === "active").length;
	const atRisk = rows.filter((r) => r.status === "at_risk").length;
	const inactive = rows.filter((r) => r.status === "inactive").length;
	const withAlerts = rows.filter(
		(r) => r.health === "warning" || r.health === "critical"
	).length;
	const healthy = rows.filter((r) => r.health === "healthy").length;
	const warning = rows.filter((r) => r.health === "warning").length;
	const critical = rows.filter((r) => r.health === "critical").length;
	return {
		total,
		active,
		atRisk,
		inactive,
		withAlerts,
		healthPie: [
			{
				name: "Healthy",
				value: healthy,
				pct: total ? Math.round((healthy / total) * 100) : 0,
				color: "#059669",
			},
			{
				name: "Warning",
				value: warning,
				pct: total ? Math.round((warning / total) * 100) : 0,
				color: "#d97706",
			},
			{
				name: "Critical",
				value: critical,
				pct: total ? Math.round((critical / total) * 100) : 0,
				color: "#dc2626",
			},
		],
	};
}

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
	fileName?: string;
	when: string;
	severity: "error" | "warning" | "info";
	runId?: string;
};

export const VENDOR_ALERTS: VendorAlert[] = [
	{
		id: "va1",
		vendorId: "vnd-2",
		vendorName: "Horizon Logistics",
		title: "Horizon Logistics - ASN file processing failed.",
		fileName: "ASN_HORIZON_20260724.xml",
		when: "Yesterday 8:25 PM",
		severity: "error",
		runId: "f2",
	},
	{
		id: "va2",
		vendorId: "vnd-3",
		vendorName: "NovaTech Components",
		title: "NovaTech Components - Catalog feed has 102 warnings.",
		fileName: "CATALOG_NOVATECH_W30.csv",
		when: "Yesterday 7:18 PM",
		severity: "warning",
		runId: "f3",
	},
	{
		id: "va3",
		vendorId: "vnd-1",
		vendorName: "Apex Industrial Supply",
		title: "Apex Industrial Supply - Invoice EDI received successfully.",
		fileName: "INV_APEX_20260724.edi",
		when: "6:02 AM",
		severity: "info",
		runId: "f6",
	},
	{
		id: "va4",
		vendorId: "vnd-4",
		vendorName: "GreenField Organics",
		title: "GreenField Organics - Inventory schema drift warning.",
		fileName: "INV_GREENFIELD_DAILY.csv",
		when: "Today 7:50 AM",
		severity: "warning",
		runId: "f5",
	},
	{
		id: "va5",
		vendorId: "vnd-2",
		vendorName: "Horizon Logistics",
		title: "Horizon Logistics - Claims file not delivered.",
		fileName: "CLAIMS_HORIZON_20260723.csv",
		when: "Yesterday 9:15 AM",
		severity: "error",
		runId: "f7",
	},
];
