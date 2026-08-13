export const OV_REPORTING_PERIODS = [
	{ id: "may-2025", label: "May 1 – May 31, 2025" },
	{ id: "apr-2025", label: "Apr 1 – Apr 30, 2025" },
	{ id: "mar-2025", label: "Mar 1 – Mar 31, 2025" },
] as const;

export type OvTab =
	| "vendor-performance"
	| "file-operations"
	| "claims-encounters"
	| "sla-monitoring";

export const OV_TABS: { id: OvTab; label: string }[] = [
	{ id: "vendor-performance", label: "Vendor Performance" },
	{ id: "file-operations", label: "File Operations" },
	{ id: "claims-encounters", label: "Claims & Encounters" },
	{ id: "sla-monitoring", label: "SLA Monitoring" },
];

export const OV_KPIS = [
	{
		id: "vendors",
		label: "Total Vendors",
		value: "128",
		hint: "Active Vendors",
		delta: "+ 4",
		deltaPositive: true,
		iconTone: "bg-sky-100 text-sky-700",
	},
	{
		id: "files",
		label: "Files Processed",
		value: "4,832",
		hint: "This period",
		delta: "+ 312",
		deltaPositive: true,
		iconTone: "bg-violet-100 text-violet-700",
	},
	{
		id: "encounters",
		label: "Encounters Processed",
		value: "4.32M",
		hint: "Accepted + rejected",
		delta: "+ 8.7%",
		deltaPositive: true,
		iconTone: "bg-emerald-100 text-emerald-700",
	},
	{
		id: "acceptance",
		label: "Acceptance Rate",
		value: "93.6%",
		hint: "Enterprise average",
		delta: "+ 2.4%",
		deltaPositive: true,
		iconTone: "bg-teal-100 text-teal-700",
	},
	{
		id: "errors",
		label: "File Error Rate",
		value: "4.2%",
		hint: "Failed / errored files",
		delta: "- 0.8%",
		deltaPositive: true,
		iconTone: "bg-amber-100 text-amber-700",
	},
	{
		id: "sla",
		label: "SLA Compliance",
		value: "91.5%",
		hint: "Vendors meeting SLA",
		delta: "- 1.2%",
		deltaPositive: false,
		iconTone: "bg-orange-100 text-orange-700",
	},
] as const;

export const OV_VENDOR_HEALTH = [
	{ name: "Good", value: 72, pct: "56.3%", color: "#22c55e" },
	{ name: "Fair", value: 34, pct: "26.6%", color: "#eab308" },
	{ name: "Poor", value: 14, pct: "10.9%", color: "#ef4444" },
	{ name: "Inactive", value: 8, pct: "6.3%", color: "#94a3b8" },
];

export const OV_TOTAL_VENDORS = 128;

export const OV_TOP_VENDORS = [
	{
		id: "v1",
		vendor: "Vendor A",
		health: 96,
		trendPositive: true,
		errorRate: "1.2%",
		acceptRate: "96.2%",
	},
	{
		id: "v2",
		vendor: "Vendor B",
		health: 92,
		trendPositive: true,
		errorRate: "2.1%",
		acceptRate: "94.8%",
	},
	{
		id: "v3",
		vendor: "Vendor C",
		health: 78,
		trendPositive: false,
		errorRate: "6.8%",
		acceptRate: "91.5%",
	},
	{
		id: "v4",
		vendor: "Vendor D",
		health: 85,
		trendPositive: true,
		errorRate: "3.4%",
		acceptRate: "88.3%",
	},
	{
		id: "v5",
		vendor: "Vendor E",
		health: 71,
		trendPositive: false,
		errorRate: "8.1%",
		acceptRate: "85.2%",
	},
];

export const OV_SLA_SUMMARY = [
	{
		id: "met",
		label: "SLA Met",
		value: "91.5%",
		delta: "+ 0.4%",
		deltaPositive: true,
		tone: "bg-emerald-100 text-emerald-700",
	},
	{
		id: "response",
		label: "Avg Response Time",
		value: "4.2h",
		delta: "- 0.6h",
		deltaPositive: true,
		tone: "bg-sky-100 text-sky-700",
	},
	{
		id: "ontime",
		label: "Files On-Time",
		value: "88.7%",
		delta: "- 1.1%",
		deltaPositive: false,
		tone: "bg-amber-100 text-amber-700",
	},
];

export const OV_SLA_BREACHES = [
	{
		id: "b1",
		vendor: "Vendor C",
		metric: "Response Time",
		performance: "9.4h",
		threshold: "8h",
	},
	{
		id: "b2",
		vendor: "Vendor E",
		metric: "File On-Time",
		performance: "72%",
		threshold: "85%",
	},
	{
		id: "b3",
		vendor: "Vendor G",
		metric: "Acceptance Rate",
		performance: "86.1%",
		threshold: "90%",
	},
];

export const OV_FILE_STATUS = [
	{ name: "Processed Successfully", value: 4120, pct: "85.3%", color: "#22c55e" },
	{ name: "With Errors", value: 480, pct: "9.9%", color: "#eab308" },
	{ name: "Failed", value: 232, pct: "4.8%", color: "#ef4444" },
];

export const OV_TOTAL_FILES = 4832;

export const OV_FILES_OVER_TIME = [
	{ day: "May 1", total: 142, errorRate: 5.2 },
	{ day: "May 5", total: 168, errorRate: 4.8 },
	{ day: "May 10", total: 155, errorRate: 4.1 },
	{ day: "May 15", total: 190, errorRate: 3.9 },
	{ day: "May 20", total: 178, errorRate: 4.5 },
	{ day: "May 25", total: 201, errorRate: 3.6 },
	{ day: "May 31", total: 186, errorRate: 4.2 },
];

export const OV_CLAIMS_METRICS = [
	{ metric: "Paid", current: "3.12M", prior: "2.98M", positive: true },
	{ metric: "Denied", current: "184K", prior: "201K", positive: true },
	{ metric: "Rejected", current: "96K", prior: "88K", positive: false },
	{ metric: "Pending", current: "142K", prior: "156K", positive: true },
	{ metric: "Avg Processing Time", current: "1.8d", prior: "2.1d", positive: true },
];

export const OV_ENCOUNTER_METRICS = [
	{ metric: "Accepted", current: "4.04M", prior: "3.72M", positive: true },
	{ metric: "Rejected", current: "276K", prior: "298K", positive: true },
	{ metric: "Acceptance Rate", current: "93.6%", prior: "91.2%", positive: true },
	{ metric: "Avg Cycle Time", current: "2.4d", prior: "2.7d", positive: true },
	{ metric: "Open Exceptions", current: "1,842", prior: "1,620", positive: false },
];

export type OvSeverity = "High" | "Medium" | "Low";
export type OvAlertStatus = "Open" | "Investigating" | "Monitoring";

export const OV_ALERTS = [
	{
		id: "a1",
		alert: "Vendor C breached response time SLA (9.4h vs 8h)",
		category: "SLA",
		vendor: "Vendor C",
		severity: "High" as OvSeverity,
		detectedOn: "05/14/2025 08:22",
		impact: "Response delay affecting 3 inbound batches",
		status: "Open" as OvAlertStatus,
	},
	{
		id: "a2",
		alert: "Encounter acceptance rate drop for Vendor E",
		category: "Encounters",
		vendor: "Vendor E",
		severity: "High" as OvSeverity,
		detectedOn: "05/13/2025 16:40",
		impact: "85.2% acceptance (target 90%)",
		status: "Investigating" as OvAlertStatus,
	},
	{
		id: "a3",
		alert: "File error rate elevated across 4 vendors",
		category: "Files",
		vendor: "Multiple",
		severity: "Medium" as OvSeverity,
		detectedOn: "05/12/2025 11:05",
		impact: "232 failed files this period",
		status: "Monitoring" as OvAlertStatus,
	},
	{
		id: "a4",
		alert: "Vendor G acceptance below threshold",
		category: "SLA",
		vendor: "Vendor G",
		severity: "Medium" as OvSeverity,
		detectedOn: "05/11/2025 09:18",
		impact: "86.1% vs 90% threshold",
		status: "Open" as OvAlertStatus,
	},
	{
		id: "a5",
		alert: "Inbound claim denial volume trending up",
		category: "Claims",
		vendor: "Enterprise",
		severity: "Low" as OvSeverity,
		detectedOn: "05/10/2025 14:30",
		impact: "+6% denials vs prior week",
		status: "Monitoring" as OvAlertStatus,
	},
];

export function ovSeverityPillClass(severity: OvSeverity) {
	switch (severity) {
		case "High":
			return "border-red-200 bg-red-50 text-red-700";
		case "Medium":
			return "border-orange-200 bg-orange-50 text-orange-800";
		case "Low":
			return "border-amber-200 bg-amber-50 text-amber-800";
	}
}

export function ovStatusPillClass(status: OvAlertStatus) {
	switch (status) {
		case "Open":
			return "border-red-200 bg-red-50 text-red-700";
		case "Investigating":
			return "border-orange-200 bg-orange-50 text-orange-800";
		case "Monitoring":
			return "border-sky-200 bg-sky-50 text-sky-800";
	}
}

export function ovCategoryPillClass(category: string) {
	switch (category) {
		case "SLA":
			return "border-violet-200 bg-violet-50 text-violet-800";
		case "Encounters":
			return "border-sky-200 bg-sky-50 text-sky-800";
		case "Files":
			return "border-amber-200 bg-amber-50 text-amber-800";
		case "Claims":
			return "border-teal-200 bg-teal-50 text-teal-800";
		default:
			return "border-border bg-muted text-muted-foreground";
	}
}
