export const QUALITY_PERFORMANCE_KPIS = {
	totalMeasures: 72,
	totalMeasuresDelta: 5,
	membersInMeasure: 72_842,
	membersDelta: 6.3,
	openGaps: 18_562,
	openGapsDelta: -5.7,
	closedGaps: 26_478,
	closedGapsDelta: 12.4,
	complianceRate: 78.3,
	complianceDelta: 4.6,
	measureCompletion: 64.2,
	measureCompletionDelta: 5.1,
};

export const QUALITY_COMPLIANCE_TREND = [
	{ month: "Jan 2025", rate: 68.1 },
	{ month: "Feb 2025", rate: 70.4 },
	{ month: "Mar 2025", rate: 72.8 },
	{ month: "Apr 2025", rate: 74.2 },
	{ month: "May 2025", rate: 76.5 },
	{ month: "Jun 2025", rate: 78.3 },
];

export const QUALITY_COMPLIANCE_GOAL = 90;

export const QUALITY_TOP_MEASURES = [
	{ name: "Controlling High Blood Pressure (CBP)", rate: 92.1, color: "#22c55e" },
	{ name: "Follow-Up After ED Visit (FUA)", rate: 81.4, color: "#22c55e" },
	{ name: "Diabetes: HbA1c Control (A1C)", rate: 76.8, color: "#22c55e" },
	{ name: "Breast Cancer Screening (BCS)", rate: 63.3, color: "#f97316" },
	{ name: "Colorectal Cancer Screening (COL)", rate: 52.7, color: "#ef4444" },
];

export const QUALITY_GAP_STATUS = [
	{ name: "Critical", value: 2_854, color: "#ef4444", pct: 15.4 },
	{ name: "High", value: 6_123, color: "#f97316", pct: 33.0 },
	{ name: "Medium", value: 5_876, color: "#8b5cf6", pct: 31.7 },
	{ name: "Low", value: 3_709, color: "#3b82f6", pct: 19.9 },
];

export type GapTrend = "Up" | "Down" | "Flat";

export const QUALITY_OPEN_GAPS_BY_MEASURE = [
	{
		id: "m1",
		code: "FUA",
		description: "Follow-Up After ED Visit for Mental Illness",
		openGaps: 3_842,
		gapRate: 18.2,
		dueSoon: 412,
		overdue: 186,
		trend: "Down" as GapTrend,
	},
	{
		id: "m2",
		code: "CBP",
		description: "Controlling High Blood Pressure",
		openGaps: 2_916,
		gapRate: 12.4,
		dueSoon: 298,
		overdue: 94,
		trend: "Down" as GapTrend,
	},
	{
		id: "m3",
		code: "A1C",
		description: "Diabetes: HbA1c Poor Control",
		openGaps: 2_684,
		gapRate: 15.8,
		dueSoon: 356,
		overdue: 142,
		trend: "Flat" as GapTrend,
	},
	{
		id: "m4",
		code: "BCS",
		description: "Breast Cancer Screening",
		openGaps: 2_412,
		gapRate: 22.6,
		dueSoon: 524,
		overdue: 218,
		trend: "Up" as GapTrend,
	},
	{
		id: "m5",
		code: "COL",
		description: "Colorectal Cancer Screening",
		openGaps: 2_186,
		gapRate: 28.4,
		dueSoon: 612,
		overdue: 284,
		trend: "Up" as GapTrend,
	},
];

export const QUALITY_GAP_CLOSURE_ACTIVITY = [
	{
		id: "gc1",
		memberId: "MBR-2025-88421",
		measure: "CBP",
		action: "BP Reading Documented",
		closedOn: "Jun 28, 2025",
		closedBy: "Care Manager",
	},
	{
		id: "gc2",
		memberId: "MBR-2025-77204",
		measure: "A1C",
		action: "Lab Result Uploaded",
		closedOn: "Jun 27, 2025",
		closedBy: "Clinical Staff",
	},
	{
		id: "gc3",
		memberId: "MBR-2025-66118",
		measure: "BCS",
		action: "Mammogram Confirmed",
		closedOn: "Jun 26, 2025",
		closedBy: "Outreach Team",
	},
	{
		id: "gc4",
		memberId: "MBR-2025-55892",
		measure: "FUA",
		action: "Follow-Up Visit Scheduled",
		closedOn: "Jun 25, 2025",
		closedBy: "Care Manager",
	},
	{
		id: "gc5",
		memberId: "MBR-2025-44107",
		measure: "COL",
		action: "Screening Completed",
		closedOn: "Jun 24, 2025",
		closedBy: "Provider Portal",
	},
];

export const QUALITY_NCQA_SUBMISSION = {
	title: "MY 2025 HEDIS Submission",
	window: "May 1 – May 31, 2026",
	status: "In Progress",
	statusStyle: "border-violet-200 bg-violet-50 text-violet-800",
	steps: [
		{ id: "s1", label: "File Creation", state: "complete" as const },
		{ id: "s2", label: "Validation", state: "complete" as const },
		{ id: "s3", label: "Submission", state: "active" as const },
		{ id: "s4", label: "NCQA Response", state: "pending" as const },
	],
};

export const QUALITY_DOCUMENTS = [
	{ id: "d1", name: "HEDIS Measure Specifications", size: "4.2 MB" },
	{ id: "d2", name: "MY 2025 HEDIS Code Set", size: "1.8 MB" },
	{ id: "d3", name: "Quality Performance Report - Jun 2025", size: "2.6 MB" },
	{ id: "d4", name: "NCQA Reporting Requirements", size: "980 KB" },
];

export const QUALITY_QUICK_ACTIONS = [
	{ id: "qa-1", title: "View Measures", description: "Browse HEDIS measures" },
	{ id: "qa-2", title: "Gap Closure", description: "Manage member gaps" },
	{ id: "qa-3", title: "Member Outreach", description: "Track outreach activities" },
	{ id: "qa-4", title: "Provider Performance", description: "View provider results" },
	{ id: "qa-5", title: "NCQA Submission", description: "Track submission status" },
	{ id: "qa-6", title: "View Reports", description: "Generate quality reports" },
];
