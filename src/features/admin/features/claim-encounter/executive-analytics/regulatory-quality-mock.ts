export const RQ_REPORTING_PERIODS = [
	{ id: "apr-2025", label: "Apr 1 – Apr 30, 2025" },
	{ id: "mar-2025", label: "Mar 1 – Mar 31, 2025" },
	{ id: "may-2025", label: "May 1 – May 31, 2025" },
] as const;

export type RqTab =
	| "regulatory-overview"
	| "cms-edge"
	| "medicaid"
	| "medicare"
	| "quality-performance";

export const RQ_TABS: { id: RqTab; label: string }[] = [
	{ id: "regulatory-overview", label: "Regulatory Overview" },
	{ id: "cms-edge", label: "CMS EDGE" },
	{ id: "medicaid", label: "Medicaid" },
	{ id: "medicare", label: "Medicare" },
	{ id: "quality-performance", label: "Quality Performance" },
];

export const RQ_KPIS = [
	{
		id: "compliance",
		label: "Overall Compliance Score",
		value: "88/100",
		badge: "Good",
		badgeTone: "success" as const,
		delta: "+ 6 pts",
		deltaPositive: true,
		iconTone: "bg-emerald-100 text-emerald-700",
	},
	{
		id: "on-track",
		label: "Obligations On Track",
		value: "32 (76%)",
		delta: "+ 5",
		deltaPositive: true,
		iconTone: "bg-violet-100 text-violet-700",
	},
	{
		id: "at-risk",
		label: "At Risk",
		value: "7 (17%)",
		delta: "- 1",
		deltaPositive: false,
		iconTone: "bg-amber-100 text-amber-700",
	},
	{
		id: "overdue",
		label: "Overdue",
		value: "3 (7%)",
		delta: "- 1",
		deltaPositive: false,
		iconTone: "bg-red-100 text-red-700",
	},
	{
		id: "submissions",
		label: "Submissions Completed",
		value: "46/52",
		delta: "+ 3",
		deltaPositive: true,
		iconTone: "bg-sky-100 text-sky-700",
	},
	{
		id: "quality",
		label: "Quality Composite Score",
		value: "82.1/100",
		delta: "- 1.8 pts",
		deltaPositive: false,
		iconTone: "bg-teal-100 text-teal-700",
	},
] as const;

export type RqObligationStatus = "Overdue" | "Upcoming";

export const RQ_OBLIGATIONS = [
	{
		id: "o1",
		obligation: "EDGE Server Truncation File",
		program: "CMS EDGE",
		dueDate: "05/15/2025",
		daysLeft: -23,
		status: "Overdue" as RqObligationStatus,
	},
	{
		id: "o2",
		obligation: "Medicaid Encounter Batch",
		program: "Medicaid",
		dueDate: "06/15/2025",
		daysLeft: 8,
		status: "Upcoming" as RqObligationStatus,
	},
	{
		id: "o3",
		obligation: "HEDIS Measure Submission",
		program: "NCQA",
		dueDate: "06/20/2025",
		daysLeft: 13,
		status: "Upcoming" as RqObligationStatus,
	},
	{
		id: "o4",
		obligation: "Risk Adjustment Data Extract",
		program: "CMS-HCC",
		dueDate: "06/25/2025",
		daysLeft: 18,
		status: "Upcoming" as RqObligationStatus,
	},
	{
		id: "o5",
		obligation: "Medicare Part D Reporting",
		program: "Medicare",
		dueDate: "06/30/2025",
		daysLeft: 23,
		status: "Upcoming" as RqObligationStatus,
	},
];

export const RQ_PROGRAM_COMPLIANCE = [
	{ name: "CMS EDGE", score: 92, color: "#2563eb" },
	{ name: "Medicaid", score: 86, color: "#16a34a" },
	{ name: "Medicare", score: 84, color: "#ea580c" },
	{ name: "Quality", score: 82, color: "#9333ea" },
	{ name: "Risk Adjustment", score: 90, color: "#0d9488" },
];

export const RQ_OVERALL_SCORE = 88;

export const RQ_SUBMISSION_STATUS = [
	{
		program: "CMS EDGE",
		completed: "17/18",
		onTime: 16,
		late: 1,
		acceptance: "94.4%",
	},
	{
		program: "Medicaid",
		completed: "12/13",
		onTime: 11,
		late: 1,
		acceptance: "92.3%",
	},
	{
		program: "Medicare",
		completed: "9/10",
		onTime: 9,
		late: 0,
		acceptance: "100%",
	},
	{
		program: "Quality / NCQA",
		completed: "5/7",
		onTime: 4,
		late: 1,
		acceptance: "85.7%",
	},
	{
		program: "Risk Adjustment",
		completed: "3/4",
		onTime: 3,
		late: 0,
		acceptance: "100%",
	},
];

export const RQ_QUALITY_COMPOSITE = {
	score: 82.1,
	maxScore: 100,
	label: "Good" as const,
	delta: "- 1.8 pts",
	deltaPositive: false,
};

export const RQ_QUALITY_MEASURES = [
	{
		id: "m1",
		measure: "CBP",
		current: "78.4%",
		target: "85%",
		vsTarget: "-6.6%",
		vsPositive: false,
		sparkline: [84, 82, 81, 80, 79, 78.4],
	},
	{
		id: "m2",
		measure: "CDC",
		current: "91.2%",
		target: "90%",
		vsTarget: "+1.2%",
		vsPositive: true,
		sparkline: [88, 89, 90, 90.5, 91, 91.2],
	},
	{
		id: "m3",
		measure: "BCS",
		current: "86.5%",
		target: "88%",
		vsTarget: "-1.5%",
		vsPositive: false,
		sparkline: [88, 87.5, 87, 86.8, 86.6, 86.5],
	},
	{
		id: "m4",
		measure: "COL",
		current: "72.1%",
		target: "75%",
		vsTarget: "-2.9%",
		vsPositive: false,
		sparkline: [74, 73.5, 73, 72.8, 72.4, 72.1],
	},
	{
		id: "m5",
		measure: "WCC",
		current: "94.0%",
		target: "90%",
		vsTarget: "+4.0%",
		vsPositive: true,
		sparkline: [91, 92, 92.5, 93, 93.5, 94],
	},
];

export const RQ_MEASURE_DISTRIBUTION = [
	{ name: "On Target", value: 9, pct: "32.1%", color: "#22c55e" },
	{ name: "Near Target", value: 10, pct: "35.7%", color: "#eab308" },
	{ name: "Below Target", value: 7, pct: "25.0%", color: "#ef4444" },
	{ name: "No Benchmark", value: 2, pct: "7.1%", color: "#94a3b8" },
];

export const RQ_TOTAL_MEASURES = 28;

export type RqAlertSeverity = "High" | "Medium" | "Low";
export type RqAlertStatus = "Open" | "Monitoring" | "Resolved";

export const RQ_ALERTS = [
	{
		id: "a1",
		alert: "Medicaid encounter acceptance rate below target",
		category: "Acceptance",
		program: "Medicaid",
		severity: "High" as RqAlertSeverity,
		detectedOn: "05/12/2025",
		impact: "87.2% vs 90% target",
		status: "Open" as RqAlertStatus,
	},
	{
		id: "a2",
		alert: "EDGE truncation file overdue",
		category: "Submission",
		program: "CMS EDGE",
		severity: "High" as RqAlertSeverity,
		detectedOn: "05/16/2025",
		impact: "23 days overdue",
		status: "Open" as RqAlertStatus,
	},
	{
		id: "a3",
		alert: "CBP performance below target",
		category: "Quality",
		program: "Quality",
		severity: "Medium" as RqAlertSeverity,
		detectedOn: "05/10/2025",
		impact: "78.4% vs 85% target",
		status: "Monitoring" as RqAlertStatus,
	},
	{
		id: "a4",
		alert: "3 compliance obligations approaching deadline",
		category: "Compliance",
		program: "All",
		severity: "Medium" as RqAlertSeverity,
		detectedOn: "05/14/2025",
		impact: "Next due in 5 days",
		status: "Monitoring" as RqAlertStatus,
	},
	{
		id: "a5",
		alert: "HEDIS submission window opening soon",
		category: "Submission",
		program: "Quality",
		severity: "Low" as RqAlertSeverity,
		detectedOn: "05/08/2025",
		impact: "Due 06/20/2025",
		status: "Monitoring" as RqAlertStatus,
	},
];

export function rqObligationPillClass(status: RqObligationStatus) {
	return status === "Overdue"
		? "border-red-200 bg-red-50 text-red-700"
		: "border-amber-200 bg-amber-50 text-amber-800";
}

export function rqSeverityPillClass(severity: RqAlertSeverity) {
	switch (severity) {
		case "High":
			return "border-red-200 bg-red-50 text-red-700";
		case "Medium":
			return "border-amber-200 bg-amber-50 text-amber-800";
		case "Low":
			return "border-sky-200 bg-sky-50 text-sky-800";
	}
}

export function rqAlertStatusPillClass(status: RqAlertStatus) {
	switch (status) {
		case "Open":
			return "border-red-200 bg-red-50 text-red-700";
		case "Monitoring":
			return "border-sky-200 bg-sky-50 text-sky-800";
		case "Resolved":
			return "border-emerald-200 bg-emerald-50 text-emerald-800";
	}
}
