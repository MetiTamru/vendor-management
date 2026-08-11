export const MEDICAID_ENCOUNTER_KPIS = {
	acceptanceRate: 93.81,
	acceptanceDelta: 1.84,
	reportsSubmitted: 42,
	reportsAccepted: 31,
	reportsRejected: 7,
	responsesPending: 5,
	openIssues: 8,
};

export const MEDICAID_OVERVIEW_KPIS = {
	encounterFilesSubmitted: 128,
	encounterFilesDelta: 12.9,
	encountersSubmitted: 2_450_822,
	encountersDelta: 9.3,
	accepted: 2_340_915,
	acceptanceRate: 95.52,
	rejected: 76_512,
	rejectionRate: 3.12,
	pendingResponses: 33_395,
	pendingRate: 1.36,
	acceptanceRateDelta: 2.17,
};

export type MedicaidSubmissionStatus =
	| "Submitted"
	| "Acknowledged"
	| "Accepted"
	| "Rejected"
	| "Pending";

export type MedicaidExceptionStatus = "Open" | "In Review" | "Resolved";

export const MEDICAID_SUBMISSION_STATUS_STYLES: Record<
	MedicaidSubmissionStatus,
	string
> = {
	Submitted: "border-sky-200 bg-sky-50 text-sky-800",
	Acknowledged: "border-emerald-200 bg-emerald-50 text-emerald-700",
	Accepted: "border-emerald-300 bg-emerald-100 text-emerald-800",
	Rejected: "border-red-200 bg-red-50 text-red-700",
	Pending: "border-amber-200 bg-amber-50 text-amber-800",
};

export const MEDICAID_EXCEPTION_STATUS_STYLES: Record<
	MedicaidExceptionStatus,
	string
> = {
	Open: "border-red-200 bg-red-50 text-red-700",
	"In Review": "border-amber-200 bg-amber-50 text-amber-800",
	Resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export const MEDICAID_OVERVIEW_RECENT_SUBMISSIONS = [
	{
		id: "sub-1",
		batch: "MED-2027-Q2-001",
		fileName: "DC_Encounter_Q2_2027_v3.dat",
		state: "DC",
		submittedDate: "Jul 18, 2027",
		status: "Submitted" as MedicaidSubmissionStatus,
		encounters: 512_840,
	},
	{
		id: "sub-2",
		batch: "MED-2027-Q2-002",
		fileName: "DC_Encounter_Q2_2027_v2.dat",
		state: "DC",
		submittedDate: "Jul 12, 2027",
		status: "Acknowledged" as MedicaidSubmissionStatus,
		encounters: 498_220,
	},
	{
		id: "sub-3",
		batch: "MED-2027-Q2-003",
		fileName: "MD_Encounter_Q2_2027_Final.dat",
		state: "MD",
		submittedDate: "Jul 08, 2027",
		status: "Accepted" as MedicaidSubmissionStatus,
		encounters: 421_560,
	},
	{
		id: "sub-4",
		batch: "MED-2027-Q2-004",
		fileName: "VA_Encounter_Q2_2027_v1.dat",
		state: "VA",
		submittedDate: "Jul 05, 2027",
		status: "Accepted" as MedicaidSubmissionStatus,
		encounters: 389_104,
	},
	{
		id: "sub-5",
		batch: "MED-2027-Q2-005",
		fileName: "DC_Encounter_Q2_2027_v1.dat",
		state: "DC",
		submittedDate: "Jun 28, 2027",
		status: "Acknowledged" as MedicaidSubmissionStatus,
		encounters: 628_098,
	},
];

export const MEDICAID_OVERVIEW_ACCEPTANCE_TREND = [
	{ month: "Jan 2027", rate: 92.4 },
	{ month: "Feb 2027", rate: 93.1 },
	{ month: "Mar 2027", rate: 93.8 },
	{ month: "Apr 2027", rate: 94.5 },
	{ month: "May 2027", rate: 95.0 },
	{ month: "Jun 2027", rate: 95.52 },
];

export const MEDICAID_OVERVIEW_REJECTION_DONUT = [
	{
		name: "Missing/Invalid Member ID",
		count: 22_840,
		color: "#13446c",
		pct: 29.8,
	},
	{
		name: "Invalid Diagnosis Code",
		count: 18_920,
		color: "#3b82f6",
		pct: 24.7,
	},
	{ name: "Provider Not Enrolled", count: 12_640, color: "#8b5cf6", pct: 16.5 },
	{ name: "Duplicate Encounter", count: 10_208, color: "#f59e0b", pct: 13.3 },
	{ name: "Other", count: 11_904, color: "#94a3b8", pct: 15.7 },
];

export const MEDICAID_OVERVIEW_RECENT_RESPONSES = [
	{
		id: "resp-1",
		file: "DC_Response_Q2_2027_001.rsp",
		state: "DC",
		receivedDate: "Jul 19, 2027",
		accepted: 498_120,
		rejected: 14_720,
		status: "Processed",
	},
	{
		id: "resp-2",
		file: "MD_Response_Q2_2027_Final.rsp",
		state: "MD",
		receivedDate: "Jul 10, 2027",
		accepted: 410_880,
		rejected: 10_680,
		status: "Processed",
	},
	{
		id: "resp-3",
		file: "VA_Response_Q2_2027_001.rsp",
		state: "VA",
		receivedDate: "Jul 06, 2027",
		accepted: 378_420,
		rejected: 10_684,
		status: "Processed",
	},
	{
		id: "resp-4",
		file: "DC_Response_Q2_2027_002.rsp",
		state: "DC",
		receivedDate: "Jun 30, 2027",
		accepted: 612_440,
		rejected: 15_658,
		status: "Processed",
	},
];

export const MEDICAID_OVERVIEW_EXCEPTIONS = [
	{
		id: "exc-1",
		code: "ME-1024",
		description: "Member ID not found in eligibility file",
		count: 842,
		status: "Open" as MedicaidExceptionStatus,
	},
	{
		id: "exc-2",
		code: "ME-2048",
		description: "Service date outside member eligibility period",
		count: 516,
		status: "Open" as MedicaidExceptionStatus,
	},
	{
		id: "exc-3",
		code: "PR-008",
		description: "Rendering provider NPI not on file",
		count: 384,
		status: "In Review" as MedicaidExceptionStatus,
	},
	{
		id: "exc-4",
		code: "EN-022",
		description: "Duplicate encounter record detected",
		count: 291,
		status: "In Review" as MedicaidExceptionStatus,
	},
];

export const MEDICAID_OVERVIEW_QUICK_ACTIONS = [
	{
		id: "qa-1",
		title: "Submit Encounter File",
		description: "Upload a new encounter batch for the current period",
	},
	{
		id: "qa-2",
		title: "View State Edits",
		description: "Review state-specific edit rules and thresholds",
	},
	{
		id: "qa-3",
		title: "Download Reports",
		description: "Export acceptance and rejection summary reports",
	},
	{
		id: "qa-4",
		title: "Request Resubmission",
		description: "Initiate a corrected file resubmission workflow",
	},
];

export const MEDICAID_ACCEPTANCE_TREND = [
	{ month: "Jan", rate: 91.2, prior: 89.8 },
	{ month: "Feb", rate: 92.1, prior: 90.5 },
	{ month: "Mar", rate: 91.8, prior: 91.0 },
	{ month: "Apr", rate: 93.0, prior: 91.4 },
	{ month: "May", rate: 93.4, prior: 92.1 },
	{ month: "Jun", rate: 93.81, prior: 92.0 },
];

export const MEDICAID_RATE_BY_REPORT_TYPE = [
	{ name: "Encounter File", rate: 96.2 },
	{ name: "Member Eligibility", rate: 94.8 },
	{ name: "Provider Data", rate: 92.5 },
	{ name: "Capitation Adj.", rate: 89.1 },
	{ name: "Pharmacy Recon.", rate: 87.4 },
];

export const MEDICAID_RATE_BY_PLAN = [
	{ name: "MFC-DC-100", rate: 95.1 },
	{ name: "MFC-DC-200", rate: 93.8 },
	{ name: "MFC-DC-300", rate: 92.4 },
	{ name: "QHP-Silver", rate: 91.2 },
	{ name: "BHP-Standard", rate: 90.6 },
];

export const MEDICAID_REPORTS_BY_TYPE = [
	{ name: "Encounter", value: 18, color: "#13446c" },
	{ name: "Eligibility", value: 10, color: "#3b82f6" },
	{ name: "Provider", value: 8, color: "#8b5cf6" },
	{ name: "Capitation", value: 4, color: "#f59e0b" },
	{ name: "Other", value: 2, color: "#94a3b8" },
];

export const MEDICAID_TOP_REJECTIONS = [
	{
		code: "ME-001",
		description: "Invalid member identifier",
		count: 12,
		pct: 28.6,
	},
	{
		code: "ME-014",
		description: "Service date outside eligibility",
		count: 9,
		pct: 21.4,
	},
	{
		code: "PR-008",
		description: "Provider NPI not on file",
		count: 7,
		pct: 16.7,
	},
	{
		code: "EN-022",
		description: "Duplicate encounter record",
		count: 6,
		pct: 14.3,
	},
	{
		code: "ME-031",
		description: "Missing procedure modifier",
		count: 4,
		pct: 9.5,
	},
];

export const MEDICAID_RATE_BY_MONTH = [
	{ month: "Jan 2027", rate: 91.2 },
	{ month: "Feb 2027", rate: 92.1 },
	{ month: "Mar 2027", rate: 91.8 },
	{ month: "Apr 2027", rate: 93.0 },
	{ month: "May 2027", rate: 93.4 },
	{ month: "Jun 2027", rate: 93.81 },
];

export const MEDICAID_SUMMARY_BY_TYPE = [
	{
		type: "Encounter File",
		submitted: 18,
		accepted: 17,
		rejected: 1,
		rate: 94.4,
	},
	{
		type: "Member Eligibility",
		submitted: 10,
		accepted: 9,
		rejected: 1,
		rate: 90.0,
	},
	{ type: "Provider Data", submitted: 8, accepted: 7, rejected: 1, rate: 87.5 },
	{
		type: "Capitation Adj.",
		submitted: 4,
		accepted: 4,
		rejected: 0,
		rate: 100.0,
	},
	{
		type: "Pharmacy Recon.",
		submitted: 2,
		accepted: 2,
		rejected: 0,
		rate: 100.0,
	},
];

export const MEDICAID_ENCOUNTER_TABS = [
	"Overview",
	"Submissions",
	"Responses",
	"Validation",
	"Acceptance Analytics",
	"Exception Management",
	"Audit",
	"Documents",
] as const;

// ——— Responses tab ———

export type MedicaidResponseFileStatus = "Processed" | "Pending" | "Failed";

export type MedicaidWarningStatus = "Open" | "In Review" | "Resolved";

export const MEDICAID_RESPONSE_STATUS_STYLES: Record<
	MedicaidResponseFileStatus,
	string
> = {
	Processed: "border-emerald-200 bg-emerald-50 text-emerald-700",
	Pending: "border-amber-200 bg-amber-50 text-amber-800",
	Failed: "border-red-200 bg-red-50 text-red-700",
};

export const MEDICAID_WARNING_STATUS_STYLES: Record<
	MedicaidWarningStatus,
	string
> = {
	Open: "border-red-200 bg-red-50 text-red-700",
	"In Review": "border-amber-200 bg-amber-50 text-amber-800",
	Resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export const MEDICAID_RESPONSE_KPIS = {
	filesReceived: 40,
	filesReceivedDelta: 12.5,
	totalReports: 42,
	accepted: 31,
	acceptanceRate: 73.81,
	errors: 7,
	errorRate: 16.67,
	warnings: 4,
	warningRate: 9.52,
	pending: 5,
};

export const MEDICAID_RESPONSE_FILES = [
	{
		id: "rsp-1",
		fileName: "DC_MMIS_Response_Q2_2027_001.rsp",
		reportType: "Encounter File",
		receivedAt: "Jul 19, 2027 09:14 AM",
		records: 512_840,
		accepted: 498_120,
		errors: 12_480,
		warnings: 2_240,
		status: "Processed" as MedicaidResponseFileStatus,
	},
	{
		id: "rsp-2",
		fileName: "MD_MMIS_Response_Q2_2027_Final.rsp",
		reportType: "Encounter File",
		receivedAt: "Jul 10, 2027 02:42 PM",
		records: 421_560,
		accepted: 410_880,
		errors: 8_920,
		warnings: 1_760,
		status: "Processed" as MedicaidResponseFileStatus,
	},
	{
		id: "rsp-3",
		fileName: "VA_MMIS_Response_Q2_2027_001.rsp",
		reportType: "Member Eligibility",
		receivedAt: "Jul 06, 2027 11:08 AM",
		records: 389_104,
		accepted: 378_420,
		errors: 8_284,
		warnings: 2_400,
		status: "Processed" as MedicaidResponseFileStatus,
	},
	{
		id: "rsp-4",
		fileName: "DC_MMIS_Response_Q2_2027_002.rsp",
		reportType: "Provider Data",
		receivedAt: "Jun 30, 2027 04:55 PM",
		records: 628_098,
		accepted: 612_440,
		errors: 12_658,
		warnings: 3_000,
		status: "Processed" as MedicaidResponseFileStatus,
	},
	{
		id: "rsp-5",
		fileName: "DC_MMIS_Response_Q2_2027_003.rsp",
		reportType: "Encounter File",
		receivedAt: "Jun 24, 2027 08:22 AM",
		records: 498_220,
		accepted: 0,
		errors: 0,
		warnings: 0,
		status: "Pending" as MedicaidResponseFileStatus,
	},
	{
		id: "rsp-6",
		fileName: "MD_MMIS_Response_Q2_2027_v2.rsp",
		reportType: "Capitation Adj.",
		receivedAt: "Jun 18, 2027 01:17 PM",
		records: 84_320,
		accepted: 0,
		errors: 84_320,
		warnings: 0,
		status: "Failed" as MedicaidResponseFileStatus,
	},
];

export const MEDICAID_RESPONSE_SUMMARY_TREND = [
	{ week: "Wk 1", accepted: 4, errors: 1, warnings: 0 },
	{ week: "Wk 2", accepted: 6, errors: 1, warnings: 1 },
	{ week: "Wk 3", accepted: 5, errors: 2, warnings: 0 },
	{ week: "Wk 4", accepted: 7, errors: 1, warnings: 1 },
	{ week: "Wk 5", accepted: 5, errors: 1, warnings: 1 },
	{ week: "Wk 6", accepted: 4, errors: 1, warnings: 1 },
];

export const MEDICAID_RESPONSES_BY_STATUS = [
	{ name: "Processed", count: 34, color: "#22c55e", pct: 85.0 },
	{ name: "Pending", count: 5, color: "#f59e0b", pct: 12.5 },
	{ name: "Failed", count: 1, color: "#ef4444", pct: 2.5 },
];

export const MEDICAID_TOP_ERROR_REASONS = [
	{
		code: "ME-1024",
		description: "Member ID not found in eligibility",
		count: 2840,
		pct: 32.4,
	},
	{
		code: "ME-2048",
		description: "Service date outside eligibility period",
		count: 1920,
		pct: 21.9,
	},
	{
		code: "PR-008",
		description: "Rendering provider NPI not on file",
		count: 1480,
		pct: 16.9,
	},
	{
		code: "EN-022",
		description: "Duplicate encounter record",
		count: 1120,
		pct: 12.8,
	},
	{
		code: "DX-014",
		description: "Invalid diagnosis code for age",
		count: 840,
		pct: 9.6,
	},
];

export const MEDICAID_RECENT_WARNINGS = [
	{
		id: "warn-1",
		code: "ME-3012",
		description: "Missing procedure modifier on claim line",
		count: 482,
		status: "Open" as MedicaidWarningStatus,
	},
	{
		id: "warn-2",
		code: "PR-0044",
		description: "Provider taxonomy code mismatch",
		count: 316,
		status: "In Review" as MedicaidWarningStatus,
	},
	{
		id: "warn-3",
		code: "EN-0088",
		description: "Place of service requires prior auth",
		count: 248,
		status: "Open" as MedicaidWarningStatus,
	},
	{
		id: "warn-4",
		code: "ME-0176",
		description: "Member gender inconsistent with service",
		count: 192,
		status: "In Review" as MedicaidWarningStatus,
	},
];

// ——— Audit tab ———

export const MEDICAID_AUDIT_KPIS = {
	auditsConducted: 22,
	auditsConductedDelta: 5,
	findingsIdentified: 74,
	findingsIdentifiedDelta: 9,
	criticalFindings: 16,
	criticalFindingsDelta: -1,
	resolvedFindings: 48,
	resolvedFindingsDelta: 11,
	openFindings: 26,
	openFindingsDelta: -4,
	correctiveActions: 36,
	correctiveActionsDelta: 6,
};

export type MedicaidAuditStatus = "Completed" | "In Progress" | "Scheduled";

export const MEDICAID_AUDIT_STATUS_STYLES: Record<MedicaidAuditStatus, string> =
	{
		Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
		"In Progress": "border-violet-200 bg-violet-50 text-violet-800",
		Scheduled: "border-sky-200 bg-sky-50 text-sky-800",
	};

export const MEDICAID_RECENT_AUDIT_ACTIVITIES = [
	{
		id: "AUD-2027-018",
		auditType: "Encounter Data Validation",
		reportType: "Encounter File",
		plan: "MFC-DC-100",
		auditPeriod: "Q2 2027",
		auditDate: "Jul 15, 2027",
		auditor: "State MMIS Review",
		status: "Completed" as MedicaidAuditStatus,
		findings: 12,
		criticalFindings: 2,
	},
	{
		id: "AUD-2027-017",
		auditType: "Eligibility Reconciliation",
		reportType: "Member Eligibility",
		plan: "MFC-DC-200",
		auditPeriod: "Q2 2027",
		auditDate: "Jul 12, 2027",
		auditor: "Internal Compliance",
		status: "Completed" as MedicaidAuditStatus,
		findings: 8,
		criticalFindings: 1,
	},
	{
		id: "AUD-2027-016",
		auditType: "Provider Enrollment Audit",
		reportType: "Provider Data",
		plan: "MFC-DC-100",
		auditPeriod: "Q2 2027",
		auditDate: "Jul 08, 2027",
		auditor: "State MMIS Review",
		status: "In Progress" as MedicaidAuditStatus,
		findings: 6,
		criticalFindings: 0,
	},
	{
		id: "AUD-2027-015",
		auditType: "Duplicate Encounter Review",
		reportType: "Encounter File",
		plan: "MFC-DC-300",
		auditPeriod: "Q1 2027",
		auditDate: "Apr 22, 2027",
		auditor: "Internal Compliance",
		status: "Completed" as MedicaidAuditStatus,
		findings: 14,
		criticalFindings: 3,
	},
	{
		id: "AUD-2027-014",
		auditType: "Capitation Accuracy Review",
		reportType: "Capitation Adj.",
		plan: "MFC-DC-200",
		auditPeriod: "Q1 2027",
		auditDate: "Apr 18, 2027",
		auditor: "External Auditor",
		status: "In Progress" as MedicaidAuditStatus,
		findings: 4,
		criticalFindings: 1,
	},
];

export const MEDICAID_FINDINGS_BY_SEVERITY = [
	{ name: "Critical", value: 16, color: "#ef4444", pct: 21.6 },
	{ name: "High", value: 22, color: "#f97316", pct: 29.7 },
	{ name: "Medium", value: 24, color: "#8b5cf6", pct: 32.4 },
	{ name: "Low", value: 12, color: "#3b82f6", pct: 16.2 },
];

export const MEDICAID_FINDINGS_TREND = [
	{ month: "Jan 2027", total: 58, critical: 14, high: 18 },
	{ month: "Feb 2027", total: 62, critical: 15, high: 19 },
	{ month: "Mar 2027", total: 68, critical: 17, high: 20 },
	{ month: "Apr 2027", total: 71, critical: 16, high: 21 },
	{ month: "May 2027", total: 73, critical: 15, high: 22 },
	{ month: "Jun 2027", total: 74, critical: 16, high: 22 },
];

export type MedicaidFindingSeverity = "Critical" | "High" | "Medium" | "Low";

export const MEDICAID_FINDING_SEVERITY_STYLES: Record<
	MedicaidFindingSeverity,
	string
> = {
	Critical: "text-red-600 font-semibold",
	High: "text-orange-600 font-semibold",
	Medium: "text-violet-600 font-medium",
	Low: "text-sky-600 font-medium",
};

export const MEDICAID_TOP_AUDIT_FINDINGS = [
	{
		category: "Invalid Member ID",
		description: "Member identifier not found in eligibility file",
		occurrences: 18,
		severity: "Critical" as MedicaidFindingSeverity,
	},
	{
		category: "Service Date Error",
		description: "Service date outside member eligibility period",
		occurrences: 14,
		severity: "High" as MedicaidFindingSeverity,
	},
	{
		category: "Provider Not Enrolled",
		description: "Rendering provider NPI not on state enrollment file",
		occurrences: 11,
		severity: "High" as MedicaidFindingSeverity,
	},
	{
		category: "Duplicate Encounter",
		description: "Duplicate encounter record within reporting period",
		occurrences: 9,
		severity: "Medium" as MedicaidFindingSeverity,
	},
	{
		category: "Missing Modifier",
		description: "Required procedure modifier not submitted",
		occurrences: 7,
		severity: "Medium" as MedicaidFindingSeverity,
	},
];

export const MEDICAID_CORRECTIVE_ACTIONS_SUMMARY = [
	{ status: "Completed", count: 18, pct: 50.0, color: "#22c55e" },
	{ status: "In Progress", count: 12, pct: 33.3, color: "#3b82f6" },
	{ status: "Pending", count: 6, pct: 16.7, color: "#f59e0b" },
];

export const MEDICAID_AUDIT_QUICK_ACTIONS = [
	{
		id: "aq-1",
		title: "View Audit Plan",
		description: "Review scheduled audits and scope for the reporting period",
	},
	{
		id: "aq-2",
		title: "Download Audit Report",
		description: "Export the latest audit summary and findings report",
	},
	{
		id: "aq-3",
		title: "View State Findings",
		description: "Review findings returned by state MMIS validation",
	},
	{
		id: "aq-4",
		title: "Create Corrective Action",
		description: "Open a new corrective action for an audit finding",
	},
	{
		id: "aq-5",
		title: "Track Corrective Actions",
		description: "Monitor open corrective actions and due dates",
	},
	{
		id: "aq-6",
		title: "Audit Calendar",
		description: "View upcoming audit milestones and deadlines",
	},
];

// ——— Documents tab ———

export const MEDICAID_DOCUMENT_KPIS = {
	totalDocuments: 1_248,
	totalDocumentsDelta: 8.4,
	submittedFiles: 512,
	submittedFilesDelta: 6.2,
	responseFiles: 398,
	responseFilesDelta: 10.1,
	reports: 256,
	reportsDelta: 7.3,
	auditDocuments: 62,
	auditDocumentsDelta: 12.5,
	otherDocuments: 20,
	otherDocumentsDelta: -2.1,
	storageUsedGb: 48.6,
	storageTotalGb: 200,
};

export type MedicaidDocumentType =
	| "Submitted File"
	| "Response File"
	| "Validation Report"
	| "Acceptance Report"
	| "Audit Document"
	| "Other Document";

export type MedicaidDocumentStatus =
	| "Submitted"
	| "Received"
	| "Complete"
	| "Reference";

export type MedicaidDocumentFileKind = "dat" | "rsp" | "pdf" | "xlsx" | "txt";

export const MEDICAID_DOCUMENT_TYPE_STYLES: Record<
	MedicaidDocumentType,
	string
> = {
	"Submitted File": "border-sky-200 bg-sky-50 text-sky-800",
	"Response File": "border-emerald-200 bg-emerald-50 text-emerald-700",
	"Validation Report": "border-violet-200 bg-violet-50 text-violet-800",
	"Acceptance Report": "border-amber-200 bg-amber-50 text-amber-800",
	"Audit Document": "border-teal-200 bg-teal-50 text-teal-800",
	"Other Document": "border-border bg-muted/50 text-muted-foreground",
};

export const MEDICAID_DOCUMENT_STATUS_STYLES: Record<
	MedicaidDocumentStatus,
	string
> = {
	Submitted: "border-sky-200 bg-sky-50 text-sky-800",
	Received: "border-emerald-200 bg-emerald-50 text-emerald-700",
	Complete: "border-violet-200 bg-violet-50 text-violet-800",
	Reference: "border-border bg-muted/50 text-muted-foreground",
};

export const MEDICAID_DOCUMENT_TYPES_FILTER = [
	"All Types",
	"Submitted File",
	"Response File",
	"Validation Report",
	"Acceptance Report",
	"Audit Document",
	"Other Document",
] as const;

export const MEDICAID_DOCUMENT_STATES_FILTER = [
	"All States",
	"DC",
	"MD",
	"VA",
] as const;

export const MEDICAID_DOCUMENT_VENDORS_FILTER = [
	"All Vendors",
	"AmeriHealth DC",
	"MedStar Family Choice",
	"CareFirst Community Health",
] as const;

export const MEDICAID_DOCUMENT_STATUSES_FILTER = [
	"All Statuses",
	"Submitted",
	"Received",
	"Complete",
	"Reference",
] as const;

export const MEDICAID_DOCUMENT_REPORTING_PERIODS_FILTER = [
	{ value: "q2-2027", label: "Q2 2027" },
	{ value: "q1-2027", label: "Q1 2027" },
	{ value: "q4-2026", label: "Q4 2026" },
] as const;

export type MedicaidDocumentRow = {
	id: string;
	name: string;
	fileKind: MedicaidDocumentFileKind;
	documentType: MedicaidDocumentType;
	reportingPeriod: string;
	state: string;
	vendor: string;
	uploadedOn: string;
	uploadedBy: string;
	status: MedicaidDocumentStatus;
	fileSize: string;
	description?: string;
};

export const MEDICAID_DOCUMENT_LIBRARY: MedicaidDocumentRow[] = [
	{
		id: "doc-1",
		name: "DC_Encounter_Q2_2027_Final.dat",
		fileKind: "dat",
		documentType: "Submitted File",
		reportingPeriod: "Q2 2027",
		state: "DC",
		vendor: "AmeriHealth DC",
		uploadedOn: "Jul 18, 2027 10:42 AM",
		uploadedBy: "System",
		status: "Submitted",
		fileSize: "18.4 MB",
		description:
			"Final encounter submission file for Q2 2027 reporting period.",
	},
	{
		id: "doc-2",
		name: "DC_Response_Q2_2027_001.rsp",
		fileKind: "rsp",
		documentType: "Response File",
		reportingPeriod: "Q2 2027",
		state: "DC",
		vendor: "AmeriHealth DC",
		uploadedOn: "Jul 19, 2027 09:14 AM",
		uploadedBy: "System",
		status: "Received",
		fileSize: "4.2 MB",
		description: "State MMIS response file for initial Q2 submission.",
	},
	{
		id: "doc-3",
		name: "DC_Validation_Report_Q2_2027.pdf",
		fileKind: "pdf",
		documentType: "Validation Report",
		reportingPeriod: "Q2 2027",
		state: "DC",
		vendor: "AmeriHealth DC",
		uploadedOn: "Jul 19, 2027 11:30 AM",
		uploadedBy: "John Smith",
		status: "Complete",
		fileSize: "1.8 MB",
	},
	{
		id: "doc-4",
		name: "DC_Acceptance_Summary_Q2_2027.pdf",
		fileKind: "pdf",
		documentType: "Acceptance Report",
		reportingPeriod: "Q2 2027",
		state: "DC",
		vendor: "AmeriHealth DC",
		uploadedOn: "Jul 20, 2027 02:15 PM",
		uploadedBy: "System",
		status: "Complete",
		fileSize: "892 KB",
	},
	{
		id: "doc-5",
		name: "MD_Encounter_Q2_2027_Final.dat",
		fileKind: "dat",
		documentType: "Submitted File",
		reportingPeriod: "Q2 2027",
		state: "MD",
		vendor: "MedStar Family Choice",
		uploadedOn: "Jul 08, 2027 03:22 PM",
		uploadedBy: "System",
		status: "Submitted",
		fileSize: "14.6 MB",
	},
	{
		id: "doc-6",
		name: "MD_Response_Q2_2027_Final.rsp",
		fileKind: "rsp",
		documentType: "Response File",
		reportingPeriod: "Q2 2027",
		state: "MD",
		vendor: "MedStar Family Choice",
		uploadedOn: "Jul 10, 2027 02:42 PM",
		uploadedBy: "System",
		status: "Received",
		fileSize: "3.8 MB",
	},
	{
		id: "doc-7",
		name: "Q2_2027_Encounter_Audit_Findings.pdf",
		fileKind: "pdf",
		documentType: "Audit Document",
		reportingPeriod: "Q2 2027",
		state: "DC",
		vendor: "AmeriHealth DC",
		uploadedOn: "Jul 22, 2027 09:00 AM",
		uploadedBy: "Jane Doe",
		status: "Reference",
		fileSize: "2.1 MB",
	},
	{
		id: "doc-8",
		name: "Provider_Enrollment_Support_Q2.xlsx",
		fileKind: "xlsx",
		documentType: "Other Document",
		reportingPeriod: "Q2 2027",
		state: "VA",
		vendor: "CareFirst Community Health",
		uploadedOn: "Jul 05, 2027 04:18 PM",
		uploadedBy: "Mike Johnson",
		status: "Reference",
		fileSize: "456 KB",
	},
	{
		id: "doc-9",
		name: "VA_Encounter_Q2_2027_v1.dat",
		fileKind: "dat",
		documentType: "Submitted File",
		reportingPeriod: "Q2 2027",
		state: "VA",
		vendor: "CareFirst Community Health",
		uploadedOn: "Jul 05, 2027 08:55 AM",
		uploadedBy: "System",
		status: "Submitted",
		fileSize: "11.2 MB",
	},
	{
		id: "doc-10",
		name: "VA_Validation_Errors_Q2_2027.txt",
		fileKind: "txt",
		documentType: "Validation Report",
		reportingPeriod: "Q2 2027",
		state: "VA",
		vendor: "CareFirst Community Health",
		uploadedOn: "Jul 06, 2027 11:08 AM",
		uploadedBy: "System",
		status: "Complete",
		fileSize: "128 KB",
	},
	{
		id: "doc-11",
		name: "DC_Correction_File_Q2_2027_v2.dat",
		fileKind: "dat",
		documentType: "Submitted File",
		reportingPeriod: "Q2 2027",
		state: "DC",
		vendor: "AmeriHealth DC",
		uploadedOn: "Jul 25, 2027 03:10 PM",
		uploadedBy: "System",
		status: "Submitted",
		fileSize: "16.8 MB",
	},
	{
		id: "doc-12",
		name: "State_Edit_Reference_Guide_Q2.pdf",
		fileKind: "pdf",
		documentType: "Other Document",
		reportingPeriod: "Q2 2027",
		state: "DC",
		vendor: "AmeriHealth DC",
		uploadedOn: "Jun 15, 2027 01:00 PM",
		uploadedBy: "Admin User",
		status: "Reference",
		fileSize: "3.4 MB",
	},
];

export const MEDICAID_DOCUMENT_CATEGORIES = [
	{
		id: "cat-submitted",
		title: "Submitted Files",
		count: 512,
		description: "EDI / 837 files submitted to the state.",
		documentType: "Submitted File" as MedicaidDocumentType,
	},
	{
		id: "cat-response",
		title: "Response Files",
		count: 398,
		description: "State MMIS response and acknowledgement files.",
		documentType: "Response File" as MedicaidDocumentType,
	},
	{
		id: "cat-validation",
		title: "Validation Reports",
		count: 142,
		description: "Pre- and post-submission validation outputs.",
		documentType: "Validation Report" as MedicaidDocumentType,
	},
	{
		id: "cat-audit",
		title: "Audit Documents",
		count: 62,
		description: "Audit findings, attestations, and compliance records.",
		documentType: "Audit Document" as MedicaidDocumentType,
	},
	{
		id: "cat-acceptance",
		title: "Acceptance Reports",
		count: 114,
		description: "State acceptance summaries and reconciliation reports.",
		documentType: "Acceptance Report" as MedicaidDocumentType,
	},
	{
		id: "cat-other",
		title: "Other Documents",
		count: 20,
		description: "Supporting materials and reference documentation.",
		documentType: "Other Document" as MedicaidDocumentType,
	},
];

export const MEDICAID_DOCUMENT_QUICK_ACTIONS = [
	{
		id: "dq-1",
		title: "Upload Document",
		description: "Upload new file or document",
	},
	{
		id: "dq-2",
		title: "Download Selected",
		description: "Download selected document(s)",
	},
	{
		id: "dq-3",
		title: "Share Document",
		description: "Share with team or vendor",
	},
	{
		id: "dq-4",
		title: "Move to Category",
		description: "Organize document library",
	},
];

export function filterMedicaidDocuments(
	rows: MedicaidDocumentRow[],
	query: string,
	filters: {
		documentType: string;
		state: string;
		vendor: string;
		status: string;
	}
): MedicaidDocumentRow[] {
	const q = query.trim().toLowerCase();
	return rows.filter((row) => {
		if (
			filters.documentType !== "All Types" &&
			row.documentType !== filters.documentType
		) {
			return false;
		}
		if (filters.state !== "All States" && row.state !== filters.state) {
			return false;
		}
		if (filters.vendor !== "All Vendors" && row.vendor !== filters.vendor) {
			return false;
		}
		if (filters.status !== "All Statuses" && row.status !== filters.status) {
			return false;
		}
		if (!q) return true;
		return (
			row.name.toLowerCase().includes(q) ||
			row.documentType.toLowerCase().includes(q) ||
			row.vendor.toLowerCase().includes(q) ||
			(row.description?.toLowerCase().includes(q) ?? false)
		);
	});
}

// ——— Exception Management tab ———

export const MEDICAID_EXCEPTION_KPIS = {
	total: 76_512,
	totalDelta: 3.12,
	critical: 8_425,
	criticalDelta: -2.4,
	warning: 18_234,
	warningDelta: 1.82,
	info: 49_853,
	infoDelta: 4.21,
	resolved: 32_106,
	resolvedDelta: 5.18,
	open: 44_406,
	openDelta: -2.77,
};

export type MedicaidExceptionSeverity = "Critical" | "Warning" | "Info";

export const MEDICAID_EXCEPTION_SEVERITY_STYLES: Record<
	MedicaidExceptionSeverity,
	string
> = {
	Critical: "border-red-200 bg-red-50 text-red-700",
	Warning: "border-amber-200 bg-amber-50 text-amber-800",
	Info: "border-sky-200 bg-sky-50 text-sky-800",
};

export const MEDICAID_EXCEPTIONS_BY_SEVERITY = [
	{ name: "Critical (Level 1)", value: 8_425, color: "#ef4444", pct: 11.0 },
	{ name: "Warning (Level 2)", value: 18_234, color: "#f97316", pct: 23.8 },
	{ name: "Info (Level 3)", value: 49_853, color: "#8b5cf6", pct: 65.2 },
];

export const MEDICAID_EXCEPTIONS_TREND = [
	{ week: "May 19–25", critical: 980, warning: 2_140, info: 5_820 },
	{ week: "May 26–Jun 1", critical: 1_020, warning: 2_280, info: 6_040 },
	{ week: "Jun 2–8", critical: 1_080, warning: 2_420, info: 6_280 },
	{ week: "Jun 9–15", critical: 1_120, warning: 2_560, info: 6_520 },
	{ week: "Jun 16–22", critical: 1_180, warning: 2_680, info: 6_740 },
	{ week: "Jun 23–29", critical: 1_240, warning: 2_820, info: 6_980 },
];

export const MEDICAID_TOP_EXCEPTION_REASONS = [
	{ reason: "Invalid / Missing Member ID", count: 12_840 },
	{ reason: "Missing / Invalid Provider ID", count: 9_620 },
	{ reason: "Duplicate Claim", count: 7_480 },
	{ reason: "Invalid Service Date", count: 6_240 },
	{ reason: "Missing Diagnosis Code", count: 5_180 },
	{ reason: "Invalid Procedure Code", count: 4_920 },
];

export const MEDICAID_EXCEPTIONS_BY_STATE = [
	{ state: "Maryland", count: 22_480, pct: 29.4 },
	{ state: "DC", count: 18_920, pct: 24.7 },
	{ state: "Virginia", count: 16_240, pct: 21.2 },
	{ state: "West Virginia", count: 10_872, pct: 14.2 },
	{ state: "Pennsylvania", count: 8_000, pct: 10.5 },
];

export type MedicaidExceptionDetailRow = {
	id: string;
	errorCode: string;
	description: string;
	severity: MedicaidExceptionSeverity;
	state: string;
	mco: string;
	vendor: string;
	submissionBatch: string;
	responseFile: string;
	encounterCount: number;
	firstOccurrence: string;
	lastOccurrence: string;
	status: MedicaidExceptionStatus;
};

export const MEDICAID_EXCEPTION_DETAILS: MedicaidExceptionDetailRow[] = [
	{
		id: "ex-1",
		errorCode: "CO-16",
		description: "Invalid / Missing Member ID",
		severity: "Critical",
		state: "Maryland",
		mco: "MedStar Family Choice",
		vendor: "Vendor A",
		submissionBatch: "MED-2027-Q2-001",
		responseFile: "MDC_RES_06272027_01.edi",
		encounterCount: 2_840,
		firstOccurrence: "Jun 02, 2027 08:14 AM",
		lastOccurrence: "Jun 28, 2027 04:22 PM",
		status: "Open",
	},
	{
		id: "ex-2",
		errorCode: "CD-97",
		description: "Missing / Invalid Provider ID",
		severity: "Critical",
		state: "DC",
		mco: "AmeriHealth DC",
		vendor: "Vendor B",
		submissionBatch: "MED-2027-Q2-002",
		responseFile: "DC_RES_06252027_02.edi",
		encounterCount: 1_920,
		firstOccurrence: "Jun 05, 2027 10:30 AM",
		lastOccurrence: "Jun 27, 2027 11:48 AM",
		status: "In Review",
	},
	{
		id: "ex-3",
		errorCode: "ME-1024",
		description: "Duplicate Claim",
		severity: "Warning",
		state: "Virginia",
		mco: "CareFirst Community Health",
		vendor: "Vendor C",
		submissionBatch: "MED-2027-Q2-003",
		responseFile: "VA_RES_06202027_01.edi",
		encounterCount: 1_480,
		firstOccurrence: "Jun 08, 2027 02:15 PM",
		lastOccurrence: "Jun 26, 2027 09:05 AM",
		status: "Open",
	},
	{
		id: "ex-4",
		errorCode: "ME-2048",
		description: "Invalid Service Date",
		severity: "Warning",
		state: "Maryland",
		mco: "MedStar Family Choice",
		vendor: "Vendor A",
		submissionBatch: "MED-2027-Q2-004",
		responseFile: "MDC_RES_06182027_03.edi",
		encounterCount: 980,
		firstOccurrence: "Jun 10, 2027 07:42 AM",
		lastOccurrence: "Jun 25, 2027 03:30 PM",
		status: "In Review",
	},
	{
		id: "ex-5",
		errorCode: "DX-014",
		description: "Missing Diagnosis Code",
		severity: "Info",
		state: "West Virginia",
		mco: "Highmark WV",
		vendor: "Vendor D",
		submissionBatch: "MED-2027-Q2-005",
		responseFile: "WV_RES_06152027_01.edi",
		encounterCount: 640,
		firstOccurrence: "Jun 12, 2027 11:20 AM",
		lastOccurrence: "Jun 24, 2027 08:55 AM",
		status: "Resolved",
	},
];

export const MEDICAID_EXCEPTION_SEVERITY_FILTER = [
	"All Severities",
	"Critical",
	"Warning",
	"Info",
] as const;

export const MEDICAID_EXCEPTION_STATUS_FILTER = [
	"All Statuses",
	"Open",
	"In Review",
	"Resolved",
] as const;

export function filterMedicaidExceptions(
	rows: MedicaidExceptionDetailRow[],
	query: string,
	filters: { severity: string; status: string }
): MedicaidExceptionDetailRow[] {
	const q = query.trim().toLowerCase();
	return rows.filter((row) => {
		if (
			filters.severity !== "All Severities" &&
			row.severity !== filters.severity
		) {
			return false;
		}
		if (filters.status !== "All Statuses" && row.status !== filters.status) {
			return false;
		}
		if (!q) return true;
		return (
			row.errorCode.toLowerCase().includes(q) ||
			row.description.toLowerCase().includes(q) ||
			row.responseFile.toLowerCase().includes(q) ||
			row.submissionBatch.toLowerCase().includes(q)
		);
	});
}

// ——— Validation tab ———

export const MEDICAID_INTERNAL_VALIDATION_SUMMARY = {
	filesValidated: 128,
	filesValidatedDelta: 10.12,
	passed: 112,
	passedPct: 87.5,
	warnings: 10,
	warningsPct: 7.81,
	errors: 6,
	errorsPct: 4.69,
};

export const MEDICAID_EXTERNAL_VALIDATION_SUMMARY = {
	filesValidated: 128,
	passed: 114,
	passedPct: 89.06,
	warnings: 8,
	warningsPct: 6.25,
	errors: 6,
	errorsPct: 4.69,
};

export type MedicaidInternalValidationStatus = "Passed" | "Failed";

export type MedicaidExternalValidationStatus = "Processed" | "On Hold";

export const MEDICAID_INTERNAL_VALIDATION_STATUS_STYLES: Record<
	MedicaidInternalValidationStatus,
	string
> = {
	Passed: "border-emerald-200 bg-emerald-50 text-emerald-700",
	Failed: "border-red-200 bg-red-50 text-red-700",
};

export const MEDICAID_EXTERNAL_VALIDATION_STATUS_STYLES: Record<
	MedicaidExternalValidationStatus,
	string
> = {
	Processed: "border-emerald-200 bg-emerald-50 text-emerald-700",
	"On Hold": "border-amber-200 bg-amber-50 text-amber-800",
};

export const MEDICAID_INTERNAL_VALIDATION_DETAILS = [
	{
		id: "iv-1",
		submissionBatch: "MED-2027-Q2-001",
		fileName: "MD_Encounter_Q2_2027_Final.dat",
		state: "Maryland",
		fileType: "Encounter File",
		records: 512_840,
		status: "Passed" as MedicaidInternalValidationStatus,
		passed: 498_120,
		warnings: 12_480,
		errors: 2_240,
		validatedOn: "Jul 18, 2027 10:42 AM",
	},
	{
		id: "iv-2",
		submissionBatch: "MED-2027-Q2-002",
		fileName: "MD_Eligibility_Q2_2027.dat",
		state: "Maryland",
		fileType: "Member Eligibility",
		records: 421_560,
		status: "Passed" as MedicaidInternalValidationStatus,
		passed: 410_880,
		warnings: 8_920,
		errors: 1_760,
		validatedOn: "Jul 12, 2027 03:22 PM",
	},
	{
		id: "iv-3",
		submissionBatch: "MED-2027-Q2-003",
		fileName: "MD_Provider_Q2_2027.dat",
		state: "Maryland",
		fileType: "Provider Data",
		records: 84_320,
		status: "Failed" as MedicaidInternalValidationStatus,
		passed: 72_104,
		warnings: 4_280,
		errors: 7_936,
		validatedOn: "Jul 08, 2027 09:18 AM",
	},
	{
		id: "iv-4",
		submissionBatch: "MED-2027-Q2-004",
		fileName: "MD_Encounter_Q2_2027_v2.dat",
		state: "Maryland",
		fileType: "Encounter File",
		records: 389_104,
		status: "Passed" as MedicaidInternalValidationStatus,
		passed: 378_420,
		warnings: 8_284,
		errors: 2_400,
		validatedOn: "Jul 05, 2027 08:55 AM",
	},
];

export const MEDICAID_EXTERNAL_VALIDATION_DETAILS = [
	{
		id: "ev-1",
		responseFileName: "MDC_RES_07192027_01.edi",
		submissionBatch: "MED-2027-Q2-001",
		state: "Maryland",
		responseReceived: "Jul 19, 2027 09:14 AM",
		records: 512_840,
		status: "Processed" as MedicaidExternalValidationStatus,
		accepted: 498_120,
		warnings: 12_480,
		rejected: 2_240,
	},
	{
		id: "ev-2",
		responseFileName: "MDC_RES_07122027_02.edi",
		submissionBatch: "MED-2027-Q2-002",
		state: "Maryland",
		responseReceived: "Jul 12, 2027 02:42 PM",
		records: 421_560,
		status: "Processed" as MedicaidExternalValidationStatus,
		accepted: 410_880,
		warnings: 8_920,
		rejected: 1_760,
	},
	{
		id: "ev-3",
		responseFileName: "MDC_RES_07082027_03.edi",
		submissionBatch: "MED-2027-Q2-003",
		state: "Maryland",
		responseReceived: "Jul 08, 2027 11:08 AM",
		records: 84_320,
		status: "On Hold" as MedicaidExternalValidationStatus,
		accepted: 72_104,
		warnings: 4_280,
		rejected: 7_936,
	},
	{
		id: "ev-4",
		responseFileName: "MDC_RES_07052027_04.edi",
		submissionBatch: "MED-2027-Q2-004",
		state: "Maryland",
		responseReceived: "Jul 05, 2027 04:55 PM",
		records: 389_104,
		status: "Processed" as MedicaidExternalValidationStatus,
		accepted: 378_420,
		warnings: 8_284,
		rejected: 2_400,
	},
];

export const MEDICAID_VALIDATION_TOP_ERROR_CODES = [
	{
		code: "E1001",
		description: "Missing / Invalid Member ID",
		count: 1_545,
		pct: 33.75,
	},
	{
		code: "E1004",
		description: "Missing / Invalid Provider ID",
		count: 982,
		pct: 21.45,
	},
	{ code: "E1024", description: "Duplicate Claim", count: 748, pct: 16.33 },
	{
		code: "E2048",
		description: "Invalid Service Date",
		count: 624,
		pct: 13.62,
	},
	{
		code: "E3012",
		description: "Missing Diagnosis Code",
		count: 518,
		pct: 11.31,
	},
];

export const MEDICAID_VALIDATION_TREND = [
	{ week: "May 19–25", passed: 86.2, warnings: 8.4, errors: 5.4 },
	{ week: "May 26–Jun 1", passed: 87.0, warnings: 7.9, errors: 5.1 },
	{ week: "Jun 2–8", passed: 87.4, warnings: 7.6, errors: 5.0 },
	{ week: "Jun 9–15", passed: 87.8, warnings: 7.4, errors: 4.8 },
	{ week: "Jun 16–22", passed: 88.1, warnings: 7.2, errors: 4.7 },
	{ week: "Jun 23–29", passed: 87.5, warnings: 7.8, errors: 4.7 },
];

export const MEDICAID_EXTERNAL_VALIDATION_TREND = [
	{ week: "May 19–25", passed: 87.8, warnings: 7.2, errors: 5.0 },
	{ week: "May 26–Jun 1", passed: 88.4, warnings: 6.8, errors: 4.8 },
	{ week: "Jun 2–8", passed: 88.9, warnings: 6.5, errors: 4.6 },
	{ week: "Jun 9–15", passed: 89.2, warnings: 6.2, errors: 4.6 },
	{ week: "Jun 16–22", passed: 89.5, warnings: 6.0, errors: 4.5 },
	{ week: "Jun 23–29", passed: 89.06, warnings: 6.25, errors: 4.69 },
];

export const MEDICAID_EXTERNAL_TOP_REJECTION_CODES = [
	{
		code: "R2001",
		description: "Member Not Eligible on Date of Service",
		count: 1_284,
		pct: 28.42,
	},
	{
		code: "R2015",
		description: "Provider Not Enrolled with State",
		count: 892,
		pct: 19.74,
	},
	{
		code: "R3042",
		description: "Duplicate Encounter Record",
		count: 648,
		pct: 14.34,
	},
	{
		code: "R4108",
		description: "Invalid Procedure / Revenue Code",
		count: 524,
		pct: 11.6,
	},
	{
		code: "R5021",
		description: "Missing Required Diagnosis",
		count: 412,
		pct: 9.12,
	},
];

export const MEDICAID_VALIDATION_TYPE_BREAKDOWN = [
	{ name: "Internal Passed", value: 112, color: "#22c55e", pct: 43.75 },
	{ name: "Internal Warnings", value: 10, color: "#f59e0b", pct: 3.91 },
	{ name: "Internal Errors", value: 6, color: "#ef4444", pct: 2.34 },
	{ name: "External Passed", value: 114, color: "#3b82f6", pct: 44.53 },
	{ name: "External Warnings", value: 8, color: "#f97316", pct: 3.13 },
	{ name: "External Errors", value: 6, color: "#dc2626", pct: 2.34 },
];

export const MEDICAID_VALIDATION_QUICK_ACTIONS = [
	{
		id: "vq-1",
		title: "View Validation Rules",
		description: "Review internal and state edit rules",
	},
	{
		id: "vq-2",
		title: "Download Internal Validation Report",
		description: "Export pre-submission validation results",
	},
	{
		id: "vq-3",
		title: "Download State Validation Report",
		description: "Export state MMIS validation response",
	},
	{
		id: "vq-4",
		title: "Revalidate File",
		description: "Re-run validation on selected submission file",
	},
];
