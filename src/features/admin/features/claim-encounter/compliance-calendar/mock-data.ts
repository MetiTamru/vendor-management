export type ComplianceProgramKey =
	| "cms-edge"
	| "medicaid"
	| "medicare"
	| "quality"
	| "other"
	| "overdue";

export const COMPLIANCE_PROGRAM_COLORS: Record<ComplianceProgramKey, string> = {
	"cms-edge": "#2563eb",
	medicaid: "#16a34a",
	medicare: "#ea580c",
	quality: "#9333ea",
	other: "#0d9488",
	overdue: "#dc2626",
};

export const COMPLIANCE_PROGRAM_LABELS: Record<ComplianceProgramKey, string> = {
	"cms-edge": "CMS EDGE",
	medicaid: "Medicaid",
	medicare: "Medicare",
	quality: "Quality",
	other: "Other Programs",
	overdue: "Overdue",
};

export const COMPLIANCE_CALENDAR_KPIS = {
	total: { value: 156, hint: "Across all programs" },
	upcoming: { value: 28, pct: "17.9%" },
	overdue: { value: 6, pct: "3.8%" },
	completed: { value: 102, pct: "65.4%" },
	atRisk: { value: 20, pct: "12.8%" },
};

export type CalendarDayEvent = {
	program: ComplianceProgramKey;
	count: number;
};

export const COMPLIANCE_CALENDAR_MONTH = { year: 2025, month: 4 }; // May 2025 (0-indexed)

export const COMPLIANCE_CALENDAR_TODAY = 14;

/** Events keyed by day of month (May 2025) */
export const COMPLIANCE_CALENDAR_EVENTS: Record<number, CalendarDayEvent[]> = {
	1: [
		{ program: "cms-edge", count: 1 },
		{ program: "medicaid", count: 1 },
	],
	5: [{ program: "medicare", count: 2 }],
	7: [{ program: "quality", count: 1 }],
	9: [
		{ program: "cms-edge", count: 1 },
		{ program: "overdue", count: 1 },
	],
	12: [{ program: "medicaid", count: 1 }],
	14: [
		{ program: "cms-edge", count: 2 },
		{ program: "medicare", count: 1 },
	],
	16: [{ program: "quality", count: 2 }],
	19: [
		{ program: "medicaid", count: 1 },
		{ program: "other", count: 1 },
	],
	22: [{ program: "cms-edge", count: 1 }],
	24: [
		{ program: "medicare", count: 1 },
		{ program: "overdue", count: 1 },
	],
	27: [{ program: "medicaid", count: 2 }],
	30: [
		{ program: "cms-edge", count: 1 },
		{ program: "quality", count: 1 },
	],
};

export const COMPLIANCE_PROGRAM_SUMMARY = [
	{ key: "cms-edge" as const, count: 42, pct: "26.9%" },
	{ key: "medicaid" as const, count: 38, pct: "24.4%" },
	{ key: "medicare" as const, count: 40, pct: "25.6%" },
	{ key: "quality" as const, count: 24, pct: "15.4%" },
	{ key: "other" as const, count: 12, pct: "7.7%" },
];

export const COMPLIANCE_FILTER_PROGRAMS = ["All", "CMS EDGE", "Medicaid", "Medicare", "Quality", "Other"];
export const COMPLIANCE_FILTER_TYPES = ["All", "Submission", "Reporting", "Attestation", "Audit"];
export const COMPLIANCE_FILTER_STATUSES = ["All", "Upcoming", "Overdue", "Completed", "At Risk"];
export const COMPLIANCE_FILTER_OWNERS = ["All", "Compliance Team", "Regulatory Ops", "Quality Team", "Vendor Relations"];

export const COMPLIANCE_DATE_RANGE = "05/14/2025 - 06/14/2025";

export const COMPLIANCE_LEGEND_ITEMS: ComplianceProgramKey[] = [
	"cms-edge",
	"medicaid",
	"medicare",
	"quality",
	"other",
	"overdue",
];

/** Build calendar grid cells for May 2025 (includes trailing/leading days) */
export function buildMay2025Grid() {
	const year = 2025;
	const month = 4; // May
	const firstDay = new Date(year, month, 1).getDay(); // 4 = Thursday
	const daysInMonth = 31;
	const prevMonthDays = new Date(year, month, 0).getDate(); // April has 30 days

	const cells: { day: number; inMonth: boolean; isToday: boolean }[] = [];

	// Trailing days from April
	for (let i = firstDay - 1; i >= 0; i--) {
		cells.push({
			day: prevMonthDays - i,
			inMonth: false,
			isToday: false,
		});
	}

	// May days
	for (let d = 1; d <= daysInMonth; d++) {
		cells.push({
			day: d,
			inMonth: true,
			isToday: d === COMPLIANCE_CALENDAR_TODAY,
		});
	}

	// Leading days from June to fill 6 rows (42 cells)
	let juneDay = 1;
	while (cells.length < 42) {
		cells.push({
			day: juneDay++,
			inMonth: false,
			isToday: false,
		});
	}

	return cells;
}

export type ObligationStatus = "Overdue" | "At Risk" | "Upcoming" | "Completed";

export type ComplianceObligationRow = {
	id: string;
	title: string;
	program: Exclude<ComplianceProgramKey, "overdue">;
	obligationType: string;
	frequency: string;
	dueDate: string;
	status: ObligationStatus;
	daysToDue: number;
	owner: string;
	sourceModule: string;
};

export const COMPLIANCE_OBLIGATIONS: ComplianceObligationRow[] = [
	{
		id: "ob-001",
		title: "EDGE Server Truncation File (Q2 2025)",
		program: "cms-edge",
		obligationType: "Data Submission",
		frequency: "Quarterly",
		dueDate: "05/15/2025",
		status: "Overdue",
		daysToDue: -1,
		owner: "Sarah L.",
		sourceModule: "CMS EDGE",
	},
	{
		id: "ob-002",
		title: "Medicare Risk Adjustment Data Extract",
		program: "medicare",
		obligationType: "Data Submission",
		frequency: "Annual",
		dueDate: "05/20/2025",
		status: "At Risk",
		daysToDue: 4,
		owner: "Michael P.",
		sourceModule: "Medicare",
	},
	{
		id: "ob-003",
		title: "Medicaid Encounter Batch Submission",
		program: "medicaid",
		obligationType: "Data Submission",
		frequency: "Monthly",
		dueDate: "05/22/2025",
		status: "Upcoming",
		daysToDue: 6,
		owner: "Jennifer K.",
		sourceModule: "Medicaid Portal",
	},
	{
		id: "ob-004",
		title: "HEDIS Measure Submission (MY 2025)",
		program: "quality",
		obligationType: "Data Submission",
		frequency: "Annual",
		dueDate: "05/25/2025",
		status: "Upcoming",
		daysToDue: 9,
		owner: "David R.",
		sourceModule: "Quality",
	},
	{
		id: "ob-005",
		title: "CMS EDGE Audit Response",
		program: "cms-edge",
		obligationType: "Audit",
		frequency: "Quarterly",
		dueDate: "05/28/2025",
		status: "Upcoming",
		daysToDue: 12,
		owner: "Sarah L.",
		sourceModule: "CMS EDGE",
	},
	{
		id: "ob-006",
		title: "Provider Attestation (Q2)",
		program: "medicare",
		obligationType: "Attestation",
		frequency: "Quarterly",
		dueDate: "05/30/2025",
		status: "Upcoming",
		daysToDue: 14,
		owner: "Michael P.",
		sourceModule: "Medicare",
	},
	{
		id: "ob-007",
		title: "Medicaid Eligibility Reconciliation",
		program: "medicaid",
		obligationType: "Reconciliation",
		frequency: "Monthly",
		dueDate: "06/01/2025",
		status: "Upcoming",
		daysToDue: 16,
		owner: "Jennifer K.",
		sourceModule: "Medicaid Portal",
	},
	{
		id: "ob-008",
		title: "NCQA Submission Validation",
		program: "quality",
		obligationType: "Validation",
		frequency: "Annual",
		dueDate: "06/05/2025",
		status: "Upcoming",
		daysToDue: 20,
		owner: "David R.",
		sourceModule: "Quality",
	},
	{
		id: "ob-009",
		title: "EDGE Reference File Update",
		program: "cms-edge",
		obligationType: "Reference",
		frequency: "Quarterly",
		dueDate: "06/10/2025",
		status: "Upcoming",
		daysToDue: 25,
		owner: "Sarah L.",
		sourceModule: "CMS EDGE",
	},
	{
		id: "ob-010",
		title: "Medicare Encounter Certification",
		program: "medicare",
		obligationType: "Certification",
		frequency: "Monthly",
		dueDate: "06/15/2025",
		status: "Upcoming",
		daysToDue: 30,
		owner: "Michael P.",
		sourceModule: "Medicare",
	},
];

export type CalendarScheduleItem = {
	id: string;
	title: string;
	program: Exclude<ComplianceProgramKey, "overdue">;
	obligationType: string;
	status: ObligationStatus;
	dueDate: string;
	owner: string;
	obligationId?: string;
	/** Parsed from dueDate — month is 0-indexed */
	year: number;
	month: number;
	day: number;
};

const CALENDAR_WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** Week of May 11–17, 2025 (contains "today" May 14) */
export const COMPLIANCE_CALENDAR_WEEK_START = { year: 2025, month: 4, day: 11 };

function parseDueDate(dueDate: string) {
	const [mm, dd, yyyy] = dueDate.split("/").map(Number);
	return { year: yyyy!, month: mm! - 1, day: dd! };
}

/** Extra calendar-only items for days with events but no table obligation */
const COMPLIANCE_CALENDAR_EXTRA: Omit<CalendarScheduleItem, "year" | "month" | "day">[] = [
	{
		id: "cal-001",
		title: "Medicaid Provider Roster Update",
		program: "medicaid",
		obligationType: "Reporting",
		status: "Upcoming",
		dueDate: "05/12/2025",
		owner: "Jennifer K.",
	},
	{
		id: "cal-002",
		title: "CMS EDGE Daily Sync Validation",
		program: "cms-edge",
		obligationType: "Validation",
		status: "Upcoming",
		dueDate: "05/14/2025",
		owner: "Sarah L.",
	},
	{
		id: "cal-003",
		title: "Medicare Encounter Reconciliation",
		program: "medicare",
		obligationType: "Reconciliation",
		status: "At Risk",
		dueDate: "05/14/2025",
		owner: "Michael P.",
	},
	{
		id: "cal-004",
		title: "HEDIS Gap Closure Review",
		program: "quality",
		obligationType: "Review",
		status: "Upcoming",
		dueDate: "05/16/2025",
		owner: "David R.",
	},
	{
		id: "cal-005",
		title: "Quality Measure Audit Prep",
		program: "quality",
		obligationType: "Audit",
		status: "Upcoming",
		dueDate: "05/16/2025",
		owner: "David R.",
	},
	{
		id: "cal-006",
		title: "CMS EDGE Truncation Pre-check",
		program: "cms-edge",
		obligationType: "Validation",
		status: "At Risk",
		dueDate: "05/01/2025",
		owner: "Sarah L.",
	},
	{
		id: "cal-007",
		title: "Medicare Part C Reporting",
		program: "medicare",
		obligationType: "Reporting",
		status: "Upcoming",
		dueDate: "05/05/2025",
		owner: "Michael P.",
	},
	{
		id: "cal-008",
		title: "NCQA Measure Validation",
		program: "quality",
		obligationType: "Validation",
		status: "Upcoming",
		dueDate: "05/07/2025",
		owner: "David R.",
	},
	{
		id: "cal-009",
		title: "EDGE Response File Review",
		program: "cms-edge",
		obligationType: "Review",
		status: "Overdue",
		dueDate: "05/09/2025",
		owner: "Sarah L.",
	},
	{
		id: "cal-010",
		title: "Medicaid Eligibility File Sync",
		program: "medicaid",
		obligationType: "Data Submission",
		status: "Upcoming",
		dueDate: "05/19/2025",
		owner: "Jennifer K.",
	},
	{
		id: "cal-011",
		title: "Other Program Attestation",
		program: "other",
		obligationType: "Attestation",
		status: "Upcoming",
		dueDate: "05/19/2025",
		owner: "Compliance Team",
	},
	{
		id: "cal-012",
		title: "CMS EDGE Monthly Certification",
		program: "cms-edge",
		obligationType: "Certification",
		status: "Upcoming",
		dueDate: "05/22/2025",
		owner: "Sarah L.",
	},
	{
		id: "cal-013",
		title: "Medicare Risk Score Update",
		program: "medicare",
		obligationType: "Data Submission",
		status: "Upcoming",
		dueDate: "05/24/2025",
		owner: "Michael P.",
	},
	{
		id: "cal-014",
		title: "Medicaid Batch Reconciliation",
		program: "medicaid",
		obligationType: "Reconciliation",
		status: "Upcoming",
		dueDate: "05/27/2025",
		owner: "Jennifer K.",
	},
	{
		id: "cal-015",
		title: "Medicaid Portal Sync",
		program: "medicaid",
		obligationType: "Reporting",
		status: "Upcoming",
		dueDate: "05/27/2025",
		owner: "Jennifer K.",
	},
	{
		id: "cal-016",
		title: "Quality Performance Certification",
		program: "quality",
		obligationType: "Certification",
		status: "Upcoming",
		dueDate: "05/30/2025",
		owner: "David R.",
	},
];

function toScheduleItem(
	row: ComplianceObligationRow | (typeof COMPLIANCE_CALENDAR_EXTRA)[number]
): CalendarScheduleItem {
	const parsed = parseDueDate(row.dueDate);
	return {
		id: row.id,
		title: row.title,
		program: row.program,
		obligationType: row.obligationType,
		status: row.status,
		dueDate: row.dueDate,
		owner: row.owner,
		obligationId: "id" in row && row.id.startsWith("ob-") ? row.id : undefined,
		...parsed,
	};
}

export const COMPLIANCE_CALENDAR_SCHEDULE: CalendarScheduleItem[] = [
	...COMPLIANCE_OBLIGATIONS.map(toScheduleItem),
	...COMPLIANCE_CALENDAR_EXTRA.map(toScheduleItem),
].sort((a, b) => {
	if (a.year !== b.year) return a.year - b.year;
	if (a.month !== b.month) return a.month - b.month;
	return a.day - b.day;
});

export function buildComplianceWeekDays() {
	const { year, month, day } = COMPLIANCE_CALENDAR_WEEK_START;
	return Array.from({ length: 7 }, (_, index) => {
		const date = new Date(year, month, day + index);
		return {
			weekday: CALENDAR_WEEKDAY_LABELS[date.getDay()]!,
			day: date.getDate(),
			month: date.getMonth(),
			year: date.getFullYear(),
			inCurrentMonth: date.getMonth() === COMPLIANCE_CALENDAR_MONTH.month,
			isToday:
				date.getDate() === COMPLIANCE_CALENDAR_TODAY &&
				date.getMonth() === COMPLIANCE_CALENDAR_MONTH.month,
			dateKey: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
			label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
		};
	});
}

export function getScheduleForDay(year: number, month: number, day: number) {
	return COMPLIANCE_CALENDAR_SCHEDULE.filter(
		(item) => item.year === year && item.month === month && item.day === day
	);
}

export function getScheduleForWeek() {
	const days = buildComplianceWeekDays();
	return days.map((d) => ({
		...d,
		items: getScheduleForDay(d.year, d.month, d.day),
	}));
}

export type CalendarListGroup = {
	key: string;
	label: string;
	items: CalendarScheduleItem[];
};

export function getScheduleListGroups(): CalendarListGroup[] {
	const mayItems = COMPLIANCE_CALENDAR_SCHEDULE.filter(
		(item) => item.year === 2025 && item.month === 4
	);
	const groups = new Map<string, CalendarScheduleItem[]>();

	for (const item of mayItems) {
		const date = new Date(item.year, item.month, item.day);
		const key = `${item.year}-${item.month}-${item.day}`;
		const label = date.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		});
		const existing = groups.get(key);
		if (existing) {
			existing.push(item);
		} else {
			groups.set(key, [item]);
		}
	}

	return Array.from(groups.entries())
		.sort(([a], [b]) => {
			const [ay, am, ad] = a.split("-").map(Number);
			const [by, bm, bd] = b.split("-").map(Number);
			return new Date(ay!, am!, ad!).getTime() - new Date(by!, bm!, bd!).getTime();
		})
		.map(([key, items]) => ({
			key,
			label: new Date(items[0]!.year, items[0]!.month, items[0]!.day).toLocaleDateString(
				"en-US",
				{ weekday: "long", month: "long", day: "numeric", year: "numeric" }
			),
			items,
		}));
}

export const COMPLIANCE_CALENDAR_WEEK_LABEL = "May 11 – 17, 2025";

export type UpcomingDeadline = {
	id: string;
	month: string;
	day: number;
	title: string;
	program: Exclude<ComplianceProgramKey, "overdue">;
	obligationType: string;
	badge: string;
	badgeTone: "overdue" | "warning" | "info";
	dotColor: string;
	obligationId: string;
};

export const COMPLIANCE_UPCOMING_DEADLINES: UpcomingDeadline[] = [
	{
		id: "ud-1",
		month: "MAY",
		day: 15,
		title: "EDGE Server Truncation File (Q2 2025)",
		program: "cms-edge",
		obligationType: "Data Submission",
		badge: "Overdue",
		badgeTone: "overdue",
		dotColor: COMPLIANCE_PROGRAM_COLORS["cms-edge"],
		obligationId: "ob-001",
	},
	{
		id: "ud-2",
		month: "MAY",
		day: 20,
		title: "Medicare Risk Adjustment Data Extract",
		program: "medicare",
		obligationType: "Data Submission",
		badge: "2 days",
		badgeTone: "warning",
		dotColor: COMPLIANCE_PROGRAM_COLORS.medicare,
		obligationId: "ob-002",
	},
	{
		id: "ud-3",
		month: "MAY",
		day: 22,
		title: "Medicaid Encounter Batch Submission",
		program: "medicaid",
		obligationType: "Data Submission",
		badge: "4 days",
		badgeTone: "info",
		dotColor: COMPLIANCE_PROGRAM_COLORS.medicaid,
		obligationId: "ob-003",
	},
	{
		id: "ud-4",
		month: "MAY",
		day: 25,
		title: "HEDIS Measure Submission (MY 2025)",
		program: "quality",
		obligationType: "Data Submission",
		badge: "7 days",
		badgeTone: "info",
		dotColor: COMPLIANCE_PROGRAM_COLORS.quality,
		obligationId: "ob-004",
	},
	{
		id: "ud-5",
		month: "MAY",
		day: 28,
		title: "CMS EDGE Audit Response",
		program: "cms-edge",
		obligationType: "Audit",
		badge: "10 days",
		badgeTone: "info",
		dotColor: COMPLIANCE_PROGRAM_COLORS["cms-edge"],
		obligationId: "ob-005",
	},
];

export function complianceProgramPillClass(program: Exclude<ComplianceProgramKey, "overdue">) {
	switch (program) {
		case "cms-edge":
			return "border-sky-200 bg-sky-50 text-sky-800";
		case "medicaid":
			return "border-emerald-200 bg-emerald-50 text-emerald-800";
		case "medicare":
			return "border-orange-200 bg-orange-50 text-orange-800";
		case "quality":
			return "border-violet-200 bg-violet-50 text-violet-800";
		case "other":
			return "border-teal-200 bg-teal-50 text-teal-800";
	}
}

export function complianceStatusPillClass(status: ObligationStatus) {
	switch (status) {
		case "Overdue":
			return "border-red-200 bg-red-50 text-red-700";
		case "At Risk":
			return "border-amber-200 bg-amber-50 text-amber-800";
		case "Upcoming":
			return "border-sky-200 bg-sky-50 text-sky-800";
		case "Completed":
			return "border-emerald-200 bg-emerald-50 text-emerald-800";
	}
}

export type ObligationDetail = ComplianceObligationRow & {
	reportingPeriod: string;
	regulatoryAgency: string;
	internalDueDate: string;
	priority: "High" | "Medium" | "Low";
	regulatoryReference: string;
	lastUpdated: string;
	description: string;
	notes: string;
	relatedSubmission: string;
	latestResponse: string;
	openIssues: string;
	documents: {
		id: string;
		title: string;
		meta: string;
		iconTone: string;
	}[];
	activity: {
		id: string;
		timestamp: string;
		action: string;
		actor: string;
	}[];
};

const OBLIGATION_DETAILS: Record<string, ObligationDetail> = {
	"ob-001": {
		...COMPLIANCE_OBLIGATIONS[0]!,
		reportingPeriod: "Q2 2025 (Apr 1 – Jun 30, 2025)",
		regulatoryAgency: "Centers for Medicare & Medicaid Services (CMS)",
		internalDueDate: "05/10/2025",
		priority: "High",
		regulatoryReference: "EDGE Technical Guide v2.3 – Section 4.2.1",
		lastUpdated: "05/16/2025 9:12 AM",
		description:
			"Submit EDGE Server Truncation File for Q2 2025 to ensure complete and accurate claims and encounter data reporting to CMS.",
		notes:
			"Ensure all applicable members and encounters are included. File must pass CMS validation.",
		relatedSubmission: "EDGE_Q2_2025_Truncation",
		latestResponse: "Received 05/15/2025",
		openIssues: "1 open issue",
		documents: [
			{
				id: "d1",
				title: "Q2 EDGE Truncation File",
				meta: "Submission • Submitted 05/14/2025",
				iconTone: "bg-sky-100 text-sky-700",
			},
			{
				id: "d2",
				title: "Validation Report",
				meta: "Validation • Completed 05/15/2025",
				iconTone: "bg-emerald-100 text-emerald-700",
			},
			{
				id: "d3",
				title: "CMS Response (ACK)",
				meta: "Response • Received 05/15/2025",
				iconTone: "bg-violet-100 text-violet-700",
			},
			{
				id: "d4",
				title: "Approval Evidence",
				meta: "Evidence • Completed 05/10/2025",
				iconTone: "bg-orange-100 text-orange-700",
			},
		],
		activity: [
			{
				id: "a1",
				timestamp: "05/16/2025\n9:12 AM",
				action: "Status updated to Overdue",
				actor: "System",
			},
			{
				id: "a2",
				timestamp: "05/15/2025\n3:45 PM",
				action: "CMS response received",
				actor: "System",
			},
			{
				id: "a3",
				timestamp: "05/14/2025\n11:20 AM",
				action: "File submitted to CMS",
				actor: "Sarah L.",
			},
			{
				id: "a4",
				timestamp: "05/10/2025\n2:30 PM",
				action: "Internal review completed",
				actor: "Michael P.",
			},
		],
	},
};

export function getObligationDetail(id: string): ObligationDetail | undefined {
	if (OBLIGATION_DETAILS[id]) return OBLIGATION_DETAILS[id];
	const row = COMPLIANCE_OBLIGATIONS.find((o) => o.id === id);
	if (!row) return undefined;
	return {
		...row,
		reportingPeriod: "Q2 2025",
		regulatoryAgency: COMPLIANCE_PROGRAM_LABELS[row.program],
		internalDueDate: row.dueDate,
		priority: row.status === "At Risk" ? "High" : "Medium",
		regulatoryReference: "Regulatory reference pending",
		lastUpdated: "05/14/2025 8:00 AM",
		description: `Complete ${row.obligationType.toLowerCase()} for ${row.title}.`,
		notes: "No additional notes.",
		relatedSubmission: "—",
		latestResponse: "—",
		openIssues: "0 open issues",
		documents: [],
		activity: [
			{
				id: "a1",
				timestamp: "05/14/2025\n8:00 AM",
				action: "Obligation created",
				actor: "System",
			},
		],
	};
}

export function getObligationRow(id: string) {
	return COMPLIANCE_OBLIGATIONS.find((o) => o.id === id);
}
