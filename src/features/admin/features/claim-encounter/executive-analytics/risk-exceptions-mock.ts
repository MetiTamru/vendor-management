export const RE_REPORTING_PERIODS = [
	{ id: "may-2025", label: "May 1 – May 31, 2025" },
	{ id: "apr-2025", label: "Apr 1 – Apr 30, 2025" },
	{ id: "mar-2025", label: "Mar 1 – Mar 31, 2025" },
] as const;

export const RE_COMPARE_PERIODS = [
	{ id: "apr-2025", label: "Apr 1 – Apr 30, 2025" },
	{ id: "mar-2025", label: "Mar 1 – Mar 31, 2025" },
	{ id: "feb-2025", label: "Feb 1 – Feb 28, 2025" },
] as const;

export const RE_KPIS = [
	{
		id: "high-risk",
		label: "High Risk Items",
		value: "28",
		hint: "Require immediate attention",
		delta: "+8",
		deltaPositive: false,
		iconTone: "bg-red-100 text-red-700",
	},
	{
		id: "exceptions",
		label: "Open Exceptions",
		value: "124",
		hint: "Across all domains",
		delta: "+15",
		deltaPositive: false,
		iconTone: "bg-orange-100 text-orange-700",
	},
	{
		id: "pending",
		label: "Pending Resolutions",
		value: "57",
		hint: "Awaiting action",
		delta: "+6",
		deltaPositive: false,
		iconTone: "bg-amber-100 text-amber-700",
	},
	{
		id: "financial",
		label: "Financial Impact (Est.)",
		value: "$2.81M",
		hint: "Potential at risk",
		delta: "+$620K",
		deltaPositive: false,
		iconTone: "bg-violet-100 text-violet-700",
	},
	{
		id: "ra-impact",
		label: "Risk Adjustment Impact",
		value: "$14.7M",
		hint: "YTD Opportunity",
		delta: "+$1.9M",
		deltaPositive: true,
		iconTone: "bg-emerald-100 text-emerald-700",
	},
	{
		id: "raf",
		label: "RAF Score (YTD)",
		value: "1.152",
		hint: "Risk score",
		delta: "+0.032",
		deltaPositive: true,
		iconTone: "bg-sky-100 text-sky-700",
	},
] as const;

export const RE_RAF_GAUGE = {
	score: 1.152,
	delta: "+0.032",
	deltaPositive: true,
};

export const RE_RAF_TREND = [
	{ month: "Dec '24", score: 1.098 },
	{ month: "Jan '25", score: 1.112 },
	{ month: "Feb '25", score: 1.105 },
	{ month: "Mar '25", score: 1.128 },
	{ month: "Apr '25", score: 1.141 },
	{ month: "May '25", score: 1.152 },
];

export const RE_EXCEPTION_CATEGORIES = [
	{ name: "Data Quality", value: 34, pct: "27.4%", color: "#ef4444" },
	{ name: "Eligibility Issues", value: 28, pct: "22.6%", color: "#f97316" },
	{ name: "Encounter/Claims", value: 22, pct: "17.7%", color: "#eab308" },
	{ name: "Coding/RAF", value: 18, pct: "14.5%", color: "#3b82f6" },
	{ name: "Vendor/File Issues", value: 14, pct: "11.3%", color: "#22c55e" },
	{ name: "Other", value: 8, pct: "6.5%", color: "#94a3b8" },
];

export const RE_TOTAL_EXCEPTIONS = 124;

export const RE_SEVERITY_BARS = [
	{ name: "Critical", count: 12, pct: "9.7%", color: "#ef4444", max: 50 },
	{ name: "High", count: 38, pct: "30.6%", color: "#f97316", max: 50 },
	{ name: "Medium", count: 46, pct: "37.1%", color: "#eab308", max: 50 },
	{ name: "Low", count: 28, pct: "22.6%", color: "#22c55e", max: 50 },
];

export type ReSeverity = "Critical" | "High" | "Medium" | "Low";
export type ReStatus = "Open" | "In Progress" | "Investigating" | "Resolved";

export const RE_TOP_EXCEPTIONS = [
	{
		id: "e1",
		issue: "Duplicate member eligibility records",
		category: "Eligibility Issues",
		severity: "High" as ReSeverity,
		detectedOn: "05/12/2025",
		impact: "$420K",
		status: "Open" as ReStatus,
		owner: "Sarah L.",
	},
	{
		id: "e2",
		issue: "Missing HCC documentation — chronic conditions",
		category: "Coding/RAF",
		severity: "Critical" as ReSeverity,
		detectedOn: "05/10/2025",
		impact: "$680K",
		status: "In Progress" as ReStatus,
		owner: "Michael P.",
	},
	{
		id: "e3",
		issue: "Vendor C encounter rejection spike",
		category: "Vendor/File Issues",
		severity: "High" as ReSeverity,
		detectedOn: "05/14/2025",
		impact: "$310K",
		status: "Open" as ReStatus,
		owner: "Jennifer K.",
	},
	{
		id: "e4",
		issue: "Claim-to-encounter matching failures",
		category: "Encounter/Claims",
		severity: "Medium" as ReSeverity,
		detectedOn: "05/08/2025",
		impact: "$185K",
		status: "Investigating" as ReStatus,
		owner: "David R.",
	},
	{
		id: "e5",
		issue: "Incomplete diagnosis code sets in inbound files",
		category: "Data Quality",
		severity: "High" as ReSeverity,
		detectedOn: "05/11/2025",
		impact: "$540K",
		status: "Open" as ReStatus,
		owner: "Sarah L.",
	},
];

export const RE_FINANCIAL_IMPACT = {
	total: "$2.81M",
	delta: "+$620K",
	deltaPositive: false,
	categories: [
		{
			name: "Encounter/Claims",
			amount: 0.92,
			label: "$0.92M",
			color: "#eab308",
		},
		{ name: "Data Quality", amount: 0.74, label: "$0.74M", color: "#ef4444" },
		{ name: "Coding/RAF", amount: 0.58, label: "$0.58M", color: "#3b82f6" },
		{
			name: "Eligibility Issues",
			amount: 0.36,
			label: "$0.36M",
			color: "#f97316",
		},
		{
			name: "Vendor/File Issues",
			amount: 0.21,
			label: "$0.21M",
			color: "#22c55e",
		},
	],
};

export const RE_RAF_OPPORTUNITY = [
	{ label: "HCC Opportunities", value: "14,287", tone: "default" as const },
	{ label: "Documented", value: "8,432", tone: "default" as const },
	{ label: "Captured", value: "5,102", tone: "default" as const },
	{ label: "At Risk", value: "752", tone: "danger" as const },
	{ label: "Potential RAF Impact", value: "$14.7M", tone: "default" as const },
];

export type ReAlertTone = "critical" | "warning" | "info";

export const RE_ALERTS = [
	{
		id: "a1",
		tone: "critical" as ReAlertTone,
		title: "752 HCC opportunities at risk of non-capture",
		time: "2h ago",
		status: "Open" as ReStatus,
	},
	{
		id: "a2",
		tone: "warning" as ReAlertTone,
		title: "Vendor C breached encounter acceptance SLA",
		time: "5h ago",
		status: "Investigating" as ReStatus,
	},
	{
		id: "a3",
		tone: "critical" as ReAlertTone,
		title: "Financial exposure increased $620K vs prior period",
		time: "1d ago",
		status: "Open" as ReStatus,
	},
	{
		id: "a4",
		tone: "info" as ReAlertTone,
		title: "RAF score improved to 1.152 YTD",
		time: "1d ago",
		status: "Resolved" as ReStatus,
	},
	{
		id: "a5",
		tone: "warning" as ReAlertTone,
		title: "28 high-risk items require immediate attention",
		time: "2d ago",
		status: "Open" as ReStatus,
	},
];

export function reSeverityPillClass(severity: ReSeverity) {
	switch (severity) {
		case "Critical":
			return "border-red-300 bg-red-100 text-red-800";
		case "High":
			return "border-red-200 bg-red-50 text-red-700";
		case "Medium":
			return "border-amber-200 bg-amber-50 text-amber-800";
		case "Low":
			return "border-emerald-200 bg-emerald-50 text-emerald-800";
	}
}

export function reStatusPillClass(status: ReStatus) {
	switch (status) {
		case "Open":
			return "border-red-200 bg-red-50 text-red-700";
		case "In Progress":
			return "border-sky-200 bg-sky-50 text-sky-800";
		case "Investigating":
			return "border-amber-200 bg-amber-50 text-amber-800";
		case "Resolved":
			return "border-emerald-200 bg-emerald-50 text-emerald-800";
	}
}
