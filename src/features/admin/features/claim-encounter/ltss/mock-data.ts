import type { LucideIcon } from "lucide-react";
import {
	AlertTriangle,
	BarChart3,
	CalendarDays,
	ClipboardCheck,
	FileSpreadsheet,
	HandHeart,
	Link2,
	Store,
	Users,
} from "lucide-react";

export type LtssTabId =
	| "authorizations"
	| "utilization"
	| "vendors"
	| "exceptions"
	| "submissions";

export const LTSS_TABS: {
	id: LtssTabId;
	label: string;
	icon: LucideIcon;
	description: string;
	tone: string;
}[] = [
	{
		id: "authorizations",
		label: "Authorizations & Services",
		icon: ClipboardCheck,
		description: "Manage member authorizations and status.",
		tone: "text-sky-700 bg-sky-500/10",
	},
	{
		id: "utilization",
		label: "Utilization",
		icon: BarChart3,
		description: "Track usage vs. authorized units.",
		tone: "text-emerald-700 bg-emerald-500/10",
	},
	{
		id: "vendors",
		label: "Vendors",
		icon: Store,
		description: "Monitor performance and SLA status.",
		tone: "text-violet-700 bg-violet-500/10",
	},
	{
		id: "exceptions",
		label: "Exceptions",
		icon: AlertTriangle,
		description: "Identify data quality and service impacts.",
		tone: "text-amber-700 bg-amber-500/10",
	},
	{
		id: "submissions",
		label: "Submissions",
		icon: FileSpreadsheet,
		description: "Track encounter file timeliness and validation.",
		tone: "text-teal-700 bg-teal-500/10",
	},
];

export type AuthStatus =
	| "Active"
	| "Near Limit"
	| "Exception"
	| "Pending"
	| "Closed";

export type AuthorizationRow = {
	id: string;
	member: string;
	service: string;
	period: string;
	authorizedUnits: number;
	usedUnits: number;
	remainingUnits: number;
	status: AuthStatus;
};

export const LTSS_AUTHORIZATIONS: AuthorizationRow[] = [
	{
		id: "auth-1",
		member: "John D.",
		service: "Personal Care",
		period: "05/01/2024 – 07/31/2024",
		authorizedUnits: 120,
		usedUnits: 86,
		remainingUnits: 34,
		status: "Active",
	},
	{
		id: "auth-2",
		member: "Mary S.",
		service: "Home Support",
		period: "06/01/2024 – 07/31/2024",
		authorizedUnits: 80,
		usedUnits: 79,
		remainingUnits: 1,
		status: "Near Limit",
	},
	{
		id: "auth-3",
		member: "Linda P.",
		service: "Adult Day Care",
		period: "05/15/2024 – 07/14/2024",
		authorizedUnits: 100,
		usedUnits: 60,
		remainingUnits: 40,
		status: "Exception",
	},
	{
		id: "auth-4",
		member: "Robert K.",
		service: "Respite Care",
		period: "04/01/2024 – 09/30/2024",
		authorizedUnits: 48,
		usedUnits: 22,
		remainingUnits: 26,
		status: "Active",
	},
	{
		id: "auth-5",
		member: "Helen T.",
		service: "Personal Care",
		period: "03/01/2024 – 08/31/2024",
		authorizedUnits: 160,
		usedUnits: 148,
		remainingUnits: 12,
		status: "Near Limit",
	},
	{
		id: "auth-6",
		member: "James W.",
		service: "Home Support",
		period: "05/01/2024 – 10/31/2024",
		authorizedUnits: 96,
		usedUnits: 40,
		remainingUnits: 56,
		status: "Active",
	},
	{
		id: "auth-7",
		member: "Patricia M.",
		service: "Adult Day Care",
		period: "02/15/2024 – 08/14/2024",
		authorizedUnits: 120,
		usedUnits: 120,
		remainingUnits: 0,
		status: "Exception",
	},
	{
		id: "auth-8",
		member: "Charles B.",
		service: "Respite Care",
		period: "06/01/2024 – 11/30/2024",
		authorizedUnits: 36,
		usedUnits: 8,
		remainingUnits: 28,
		status: "Pending",
	},
	{
		id: "auth-9",
		member: "Susan R.",
		service: "Personal Care",
		period: "01/01/2024 – 06/30/2024",
		authorizedUnits: 200,
		usedUnits: 200,
		remainingUnits: 0,
		status: "Closed",
	},
	{
		id: "auth-10",
		member: "David L.",
		service: "Home Support",
		period: "07/01/2024 – 12/31/2024",
		authorizedUnits: 110,
		usedUnits: 55,
		remainingUnits: 55,
		status: "Active",
	},
];

export type UtilizationRow = {
	service: string;
	authorized: number;
	used: number;
	utilizationPct: number;
	trendPct: number;
};

export const LTSS_UTILIZATION: UtilizationRow[] = [
	{
		service: "Personal Care",
		authorized: 2980,
		used: 2152,
		utilizationPct: 72,
		trendPct: 5.2,
	},
	{
		service: "Home Support",
		authorized: 1920,
		used: 1642,
		utilizationPct: 86,
		trendPct: 3.1,
	},
	{
		service: "Respite Care",
		authorized: 1260,
		used: 842,
		utilizationPct: 67,
		trendPct: -2.4,
	},
	{
		service: "Adult Day Care",
		authorized: 1840,
		used: 1210,
		utilizationPct: 66,
		trendPct: 1.8,
	},
];

export type VendorPerfRow = {
	vendor: string;
	expected: number;
	received: number;
	encounters: number;
	completenessPct: number;
	status: "Healthy" | "Review" | "Issue";
};

export const LTSS_VENDORS: VendorPerfRow[] = [
	{
		vendor: "CareWell HC",
		expected: 4,
		received: 4,
		encounters: 8421,
		completenessPct: 98.4,
		status: "Healthy",
	},
	{
		vendor: "Better Living",
		expected: 4,
		received: 3,
		encounters: 5210,
		completenessPct: 74.1,
		status: "Review",
	},
	{
		vendor: "Family Care",
		expected: 4,
		received: 4,
		encounters: 3987,
		completenessPct: 95.6,
		status: "Healthy",
	},
	{
		vendor: "Sunshine Cr",
		expected: 4,
		received: 2,
		encounters: 2104,
		completenessPct: 49.8,
		status: "Issue",
	},
];

export type ExceptionRow = {
	type: string;
	count: number;
	trendPct: number;
	severity: "high" | "medium" | "low";
};

export const LTSS_EXCEPTIONS: ExceptionRow[] = [
	{
		type: "Missing Authorization",
		count: 32,
		trendPct: 12.5,
		severity: "high",
	},
	{
		type: "Units Exceeded",
		count: 28,
		trendPct: 8.7,
		severity: "high",
	},
	{
		type: "Missing Encounter Data",
		count: 26,
		trendPct: 4.0,
		severity: "medium",
	},
	{
		type: "Eligibility Mismatch",
		count: 18,
		trendPct: -5.3,
		severity: "medium",
	},
	{
		type: "Late Submission",
		count: 16,
		trendPct: -10.0,
		severity: "low",
	},
];

export type SubmissionRow = {
	vendor: string;
	period: string;
	expected: number;
	received: number;
	records: number;
	accepted: number;
	rejected: number;
	completenessPct: number;
	status: "On Time" | "Late" | "Partial";
};

export const LTSS_SUBMISSIONS: SubmissionRow[] = [
	{
		vendor: "CareWell HC",
		period: "Jul 2026",
		expected: 4,
		received: 4,
		records: 8421,
		accepted: 8310,
		rejected: 111,
		completenessPct: 98.7,
		status: "On Time",
	},
	{
		vendor: "Better Living",
		period: "Jul 2026",
		expected: 4,
		received: 3,
		records: 5210,
		accepted: 4890,
		rejected: 320,
		completenessPct: 74.1,
		status: "Late",
	},
	{
		vendor: "Family Care",
		period: "Jul 2026",
		expected: 4,
		received: 4,
		records: 3987,
		accepted: 3892,
		rejected: 95,
		completenessPct: 97.6,
		status: "On Time",
	},
	{
		vendor: "Sunshine Cr",
		period: "Jul 2026",
		expected: 4,
		received: 2,
		records: 2104,
		accepted: 1650,
		rejected: 454,
		completenessPct: 49.8,
		status: "Late",
	},
];

export const LTSS_KPI = {
	members: { value: 5276, trendPct: 4.2 },
	activeAuthorizations: { value: 1892, trendPct: 3.8 },
	servicesDelivered: { value: 3642, trendPct: 5.6 },
	unitsAuthorized: { value: 12540, used: 9846, usedPct: 78.5 },
	exceptions: { value: 128, trendPct: -6.3 },
} as const;

export const LTSS_KPI_ICONS = {
	members: Users,
	activeAuthorizations: ClipboardCheck,
	servicesDelivered: HandHeart,
	unitsAuthorized: CalendarDays,
	exceptions: AlertTriangle,
	quality: BarChart3,
	drillDown: Link2,
} as const;

export const LTSS_QUALITY_HREF =
	"/admin/claim-encounter/regulatory/quality-performance/measure-library";

export const LTSS_DRILLDOWN_EXAMPLES = [
	"From an exception → affected measures",
	"From a vendor → data completeness impact",
	"From a service → measure performance",
] as const;
