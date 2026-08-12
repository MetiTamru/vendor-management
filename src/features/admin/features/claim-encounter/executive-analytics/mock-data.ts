export const EXECUTIVE_DATA_AS_OF = "06/07/2025 8:30 AM";

export const EXECUTIVE_REPORTING_PERIODS = [
	{ id: "may-2025", label: "May 1 - May 31, 2025" },
	{ id: "apr-2025", label: "Apr 1 - Apr 30, 2025" },
	{ id: "mar-2025", label: "Mar 1 - Mar 31, 2025" },
] as const;

export const EXECUTIVE_COMPARE_PERIODS = [
	{ id: "apr-2025", label: "Apr 1 - Apr 30, 2025" },
	{ id: "mar-2025", label: "Mar 1 - Mar 31, 2025" },
	{ id: "feb-2025", label: "Feb 1 - Feb 28, 2025" },
] as const;

export type ExecutiveHealthStatus = "Good" | "At Risk" | "Critical";

export const EXECUTIVE_OPERATIONAL_HEALTH = {
	score: 84,
	maxScore: 100,
	label: "Good" as const,
	deltaPts: 6,
};

export const EXECUTIVE_KPIS = [
	{
		id: "encounters",
		label: "Total Encounters Processed",
		value: "4.32M",
		delta: "+ 8.7%",
		deltaPositive: true,
		sparkline: [3.6, 3.72, 3.85, 3.98, 4.12, 4.32],
	},
	{
		id: "acceptance",
		label: "Encounter Acceptance Rate",
		value: "93.6%",
		delta: "+ 2.4%",
		deltaPositive: true,
		sparkline: [89.2, 90.1, 91.4, 92.0, 92.8, 93.6],
	},
	{
		id: "submissions",
		label: "On-Time Regulatory Submissions",
		value: "92.3%",
		delta: "+ 5.1%",
		deltaPositive: true,
		sparkline: [84.5, 86.2, 88.0, 89.5, 91.0, 92.3],
	},
	{
		id: "quality",
		label: "Quality Performance (Avg)",
		value: "82.1%",
		delta: "- 1.8%",
		deltaPositive: false,
		sparkline: [84.2, 83.8, 83.5, 83.0, 82.5, 82.1],
	},
	{
		id: "risk",
		label: "Risk Adjustment Impact",
		value: "$14.7M",
		delta: "+ $1.9M",
		deltaPositive: true,
		sparkline: [11.2, 11.8, 12.4, 13.1, 13.9, 14.7],
	},
] as const;

export type ExecutiveDomain = {
	id: string;
	name: string;
	status: ExecutiveHealthStatus;
	score: number;
	maxScore: number;
	deltaPts: number;
	iconTone: string;
	progressTone: string;
};

export const EXECUTIVE_DOMAINS: ExecutiveDomain[] = [
	{
		id: "vendor",
		name: "Vendor Management",
		status: "Good",
		score: 87,
		maxScore: 100,
		deltaPts: 7,
		iconTone: "bg-violet-100 text-violet-700",
		progressTone: "bg-emerald-500",
	},
	{
		id: "claims",
		name: "Claims & Encounters",
		status: "Good",
		score: 82,
		maxScore: 100,
		deltaPts: 5,
		iconTone: "bg-sky-100 text-sky-700",
		progressTone: "bg-emerald-500",
	},
	{
		id: "regulatory",
		name: "Regulatory & Compliance",
		status: "At Risk",
		score: 71,
		maxScore: 100,
		deltaPts: -3,
		iconTone: "bg-teal-100 text-teal-700",
		progressTone: "bg-amber-500",
	},
	{
		id: "quality",
		name: "Quality & Performance",
		status: "Good",
		score: 83,
		maxScore: 100,
		deltaPts: -1,
		iconTone: "bg-violet-100 text-violet-700",
		progressTone: "bg-emerald-500",
	},
	{
		id: "risk",
		name: "Risk Adjustment",
		status: "Good",
		score: 88,
		maxScore: 100,
		deltaPts: 8,
		iconTone: "bg-emerald-100 text-emerald-700",
		progressTone: "bg-emerald-500",
	},
	{
		id: "members",
		name: "Members & Providers",
		status: "Good",
		score: 85,
		maxScore: 100,
		deltaPts: 4,
		iconTone: "bg-sky-100 text-sky-700",
		progressTone: "bg-emerald-500",
	},
];

export type ExecutiveObligationStatus = "Overdue" | "Upcoming";

export const EXECUTIVE_COMPLIANCE_OBLIGATIONS = [
	{
		id: "o1",
		obligation: "EDGE Server Truncation File",
		program: "CMS EDGE",
		dueDate: "05/15/2025",
		daysLeft: -23,
		status: "Overdue" as ExecutiveObligationStatus,
	},
	{
		id: "o2",
		obligation: "Medicaid Encounter Batch",
		program: "Medicaid",
		dueDate: "06/15/2025",
		daysLeft: 8,
		status: "Upcoming" as ExecutiveObligationStatus,
	},
	{
		id: "o3",
		obligation: "HEDIS Measure Submission",
		program: "NCQA",
		dueDate: "06/20/2025",
		daysLeft: 13,
		status: "Upcoming" as ExecutiveObligationStatus,
	},
	{
		id: "o4",
		obligation: "Risk Adjustment Data Extract",
		program: "CMS-HCC",
		dueDate: "06/25/2025",
		daysLeft: 18,
		status: "Upcoming" as ExecutiveObligationStatus,
	},
	{
		id: "o5",
		obligation: "Medicare Part D Reporting",
		program: "Medicare",
		dueDate: "06/30/2025",
		daysLeft: 23,
		status: "Upcoming" as ExecutiveObligationStatus,
	},
];

export const EXECUTIVE_ACCEPTANCE_TREND = [
	{ month: "Dec '24", rate: 88.4 },
	{ month: "Jan '25", rate: 89.6 },
	{ month: "Feb '25", rate: 90.8 },
	{ month: "Mar '25", rate: 91.5 },
	{ month: "Apr '25", rate: 92.4 },
	{ month: "May '25", rate: 93.6 },
];

export const EXECUTIVE_ACCEPTANCE_TARGET = 90;

export const EXECUTIVE_TOP_VENDORS = [
	{ id: "a", name: "Vendor A", rate: 96.2, change: 3.5, positive: true },
	{ id: "b", name: "Vendor B", rate: 94.8, change: 2.1, positive: true },
	{ id: "c", name: "Vendor C", rate: 91.5, change: 0.7, positive: false },
	{ id: "d", name: "Vendor D", rate: 88.3, change: 0.5, positive: false },
	{ id: "e", name: "Vendor E", rate: 85.2, change: 3.2, positive: false },
];

export type ExecutiveAlertSeverity = "critical" | "warning";

export const EXECUTIVE_ALERTS = [
	{
		id: "a1",
		severity: "critical" as ExecutiveAlertSeverity,
		title: "Medicaid encounter acceptance rate below target",
		detail: "Current: 87.2% vs Target: 90%",
	},
	{
		id: "a2",
		severity: "warning" as ExecutiveAlertSeverity,
		title: "3 compliance obligations approaching deadline",
		detail: "Next due in 5 days",
	},
	{
		id: "a3",
		severity: "critical" as ExecutiveAlertSeverity,
		title: "2 vendors breached response time SLA",
		detail: "Vendor C, Vendor E",
	},
	{
		id: "a4",
		severity: "warning" as ExecutiveAlertSeverity,
		title: "1,245 members with RAF opportunities",
		detail: "Potential impact: $1.2M",
	},
	{
		id: "a5",
		severity: "warning" as ExecutiveAlertSeverity,
		title: "CBP performance below target",
		detail: "Current: 78.4% vs Target: 85%",
	},
];

export function executiveStatusPillClass(
	status: ExecutiveHealthStatus | ExecutiveObligationStatus
) {
	switch (status) {
		case "Good":
			return "border-emerald-200 bg-emerald-50 text-emerald-800";
		case "At Risk":
		case "Upcoming":
			return "border-amber-200 bg-amber-50 text-amber-800";
		case "Critical":
		case "Overdue":
			return "border-red-200 bg-red-50 text-red-800";
		default:
			return "border-border bg-muted text-muted-foreground";
	}
}
