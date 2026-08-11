export { MEDICARE_REPORTING_TABS } from "@/features/admin/features/claim-encounter/program-reporting/mock-data";

export type MedicarePartDSubmissionStatus = "Accepted" | "Rejected" | "Pending";

export type MedicarePartDSubmissionType = "Regular" | "Backfill" | "Original" | "Replacement" | "Delete";

export type MedicarePartDResponseStatus = "Processed" | "Processed with Errors" | "Pending";

export type MedicarePartDErrorSeverity = "Critical" | "High" | "Medium" | "Low";

export type MedicarePartDReconciliationStatus = "In Review" | "Reconciled" | "Pending";

export type MedicarePartDComplianceStatus = "Compliant" | "At Risk" | "In Progress";

export const MEDICARE_PART_D_KPIS = {
	submitted: 24,
	submittedDelta: 9,
	accepted: 20,
	acceptedDelta: 8,
	rejected: 3,
	rejectedDelta: -1,
	pending: 1,
	pendingDelta: 0,
	lastCmsResponseAt: "Jun 21, 2027 02:15 PM",
	lastCmsResponseFile: "PDE_RESP_06212027.xml",
	lastCmsResponseStatus: "Processed with Errors" as MedicarePartDResponseStatus,
};

export const MEDICARE_PART_D_SUBMISSION_STATUS_STYLES: Record<
	MedicarePartDSubmissionStatus,
	string
> = {
	Accepted: "border-emerald-200 bg-emerald-50 text-emerald-700",
	Rejected: "border-red-200 bg-red-50 text-red-700",
	Pending: "border-amber-200 bg-amber-50 text-amber-800",
};

export const MEDICARE_PART_D_RESPONSE_STATUS_STYLES: Record<
	MedicarePartDResponseStatus,
	string
> = {
	Processed: "border-emerald-200 bg-emerald-50 text-emerald-700",
	"Processed with Errors": "border-red-200 bg-red-50 text-red-700",
	Pending: "border-amber-200 bg-amber-50 text-amber-800",
};

export const MEDICARE_PART_D_ERROR_SEVERITY_STYLES: Record<MedicarePartDErrorSeverity, string> = {
	Critical: "text-red-600 font-semibold",
	High: "text-orange-600 font-semibold",
	Medium: "text-violet-600 font-medium",
	Low: "text-sky-600 font-medium",
};

export const MEDICARE_PART_D_RECONCILIATION_STATUS_STYLES: Record<
	MedicarePartDReconciliationStatus,
	string
> = {
	"In Review": "border-amber-200 bg-amber-50 text-amber-800",
	Reconciled: "border-emerald-200 bg-emerald-50 text-emerald-700",
	Pending: "border-sky-200 bg-sky-50 text-sky-800",
};

export const MEDICARE_PART_D_COMPLIANCE_STATUS_STYLES: Record<MedicarePartDComplianceStatus, string> = {
	Compliant: "border-emerald-200 bg-emerald-50 text-emerald-700",
	"At Risk": "border-amber-200 bg-amber-50 text-amber-800",
	"In Progress": "border-sky-200 bg-sky-50 text-sky-800",
};

export const MEDICARE_PART_D_ERROR_SEVERITY_FILTER = ["All", "Critical", "High", "Medium", "Low"] as const;

export const MEDICARE_PART_D_ERROR_TYPE_FILTER = [
	"All",
	"Data Validation",
	"Format Error",
	"Business Rule",
] as const;

export const MEDICARE_PART_D_SUBMISSIONS = [
	{
		id: "PDE-2027-0620",
		fileName: "PDE_06202027.xml",
		submissionType: "Regular" as MedicarePartDSubmissionType,
		pbp: "001",
		submittedOn: "Jun 20, 2027 04:12 PM",
		recordCount: 842_560,
		status: "Accepted" as MedicarePartDSubmissionStatus,
	},
	{
		id: "PDE-2027-0618",
		fileName: "PDE_06182027.xml",
		submissionType: "Regular" as MedicarePartDSubmissionType,
		pbp: "002",
		submittedOn: "Jun 18, 2027 11:08 AM",
		recordCount: 721_440,
		status: "Accepted" as MedicarePartDSubmissionStatus,
	},
	{
		id: "PDE-2027-0615",
		fileName: "PDE_06152027.xml",
		submissionType: "Backfill" as MedicarePartDSubmissionType,
		pbp: "001",
		submittedOn: "Jun 15, 2027 09:44 AM",
		recordCount: 12_840,
		status: "Rejected" as MedicarePartDSubmissionStatus,
	},
	{
		id: "PDE-2027-0612",
		fileName: "PDE_06122027.xml",
		submissionType: "Regular" as MedicarePartDSubmissionType,
		pbp: "003",
		submittedOn: "Jun 12, 2027 03:22 PM",
		recordCount: 598_220,
		status: "Accepted" as MedicarePartDSubmissionStatus,
	},
	{
		id: "PDE-2027-0608",
		fileName: "PDE_06082027.xml",
		submissionType: "Backfill" as MedicarePartDSubmissionType,
		pbp: "002",
		submittedOn: "Jun 08, 2027 08:55 AM",
		recordCount: 4_280,
		status: "Pending" as MedicarePartDSubmissionStatus,
	},
];

export const MEDICARE_PART_D_RESPONSES = [
	{
		id: "resp-1",
		responseFile: "PDE_RESP_06212027.xml",
		receivedOn: "Jun 21, 2027 02:15 PM",
		pdeSubmission: "PDE-2027-0620",
		status: "Processed with Errors" as MedicarePartDResponseStatus,
	},
	{
		id: "resp-2",
		responseFile: "PDE_RESP_06192027.xml",
		receivedOn: "Jun 19, 2027 10:02 AM",
		pdeSubmission: "PDE-2027-0618",
		status: "Processed" as MedicarePartDResponseStatus,
	},
	{
		id: "resp-3",
		responseFile: "PDE_RESP_06162027.xml",
		receivedOn: "Jun 16, 2027 08:48 AM",
		pdeSubmission: "PDE-2027-0615",
		status: "Processed with Errors" as MedicarePartDResponseStatus,
	},
	{
		id: "resp-4",
		responseFile: "PDE_RESP_06132027.xml",
		receivedOn: "Jun 13, 2027 04:30 PM",
		pdeSubmission: "PDE-2027-0612",
		status: "Processed" as MedicarePartDResponseStatus,
	},
	{
		id: "resp-5",
		responseFile: "PDE_RESP_06092027.xml",
		receivedOn: "Jun 09, 2027 11:20 AM",
		pdeSubmission: "PDE-2027-0608",
		status: "Pending" as MedicarePartDResponseStatus,
	},
];

export const MEDICARE_PART_D_VALIDATION_ERRORS = [
	{
		id: "err-1",
		code: "PDE-4012",
		description: "Invalid NDC code format on prescription drug event",
		errorType: "Data Validation",
		severity: "Critical" as MedicarePartDErrorSeverity,
		pdeSubmission: "PDE-2027-0615",
		recordsImpacted: 842,
	},
	{
		id: "err-2",
		code: "PDE-3088",
		description: "Service date outside plan enrollment period",
		errorType: "Business Rule",
		severity: "High" as MedicarePartDErrorSeverity,
		pdeSubmission: "PDE-2027-0615",
		recordsImpacted: 516,
	},
	{
		id: "err-3",
		code: "PDE-2056",
		description: "Missing beneficiary identifier on PDE record",
		errorType: "Data Validation",
		severity: "High" as MedicarePartDErrorSeverity,
		pdeSubmission: "PDE-2027-0620",
		recordsImpacted: 128,
	},
	{
		id: "err-4",
		code: "PDE-1124",
		description: "Duplicate PDE record detected within submission file",
		errorType: "Business Rule",
		severity: "Medium" as MedicarePartDErrorSeverity,
		pdeSubmission: "PDE-2027-0618",
		recordsImpacted: 64,
	},
	{
		id: "err-5",
		code: "PDE-0098",
		description: "Invalid quantity dispensed value",
		errorType: "Format Error",
		severity: "Low" as MedicarePartDErrorSeverity,
		pdeSubmission: "PDE-2027-0612",
		recordsImpacted: 22,
	},
];

export const MEDICARE_PART_D_RECONCILIATION = [
	{
		id: "rec-1",
		type: "PDE Monthly Reconciliation",
		pbp: "001",
		recordsSubmitted: 842_560,
		cmsAccepted: 831_240,
		variance: 11_320,
		status: "In Review" as MedicarePartDReconciliationStatus,
		lastReconciled: "Jun 22, 2027",
	},
	{
		id: "rec-2",
		type: "PDE Monthly Reconciliation",
		pbp: "002",
		recordsSubmitted: 721_440,
		cmsAccepted: 718_920,
		variance: 2_520,
		status: "Reconciled" as MedicarePartDReconciliationStatus,
		lastReconciled: "Jun 20, 2027",
	},
	{
		id: "rec-3",
		type: "Backfill Reconciliation",
		pbp: "001",
		recordsSubmitted: 12_840,
		cmsAccepted: 11_420,
		variance: 1_420,
		status: "In Review" as MedicarePartDReconciliationStatus,
		lastReconciled: "Jun 18, 2027",
	},
	{
		id: "rec-4",
		type: "PDE Monthly Reconciliation",
		pbp: "003",
		recordsSubmitted: 598_220,
		cmsAccepted: 596_880,
		variance: 1_340,
		status: "Reconciled" as MedicarePartDReconciliationStatus,
		lastReconciled: "Jun 15, 2027",
	},
	{
		id: "rec-5",
		type: "Quarterly True-Up",
		pbp: "002",
		recordsSubmitted: 4_280,
		cmsAccepted: 0,
		variance: 4_280,
		status: "Pending" as MedicarePartDReconciliationStatus,
		lastReconciled: "—",
	},
];

export const MEDICARE_PART_D_COMPLIANCE = [
	{
		id: "comp-1",
		requirement: "Monthly PDE Submission",
		description: "Submit all PDE records within CMS required timeframe",
		frequency: "Monthly",
		dueDate: "Jul 20, 2027",
		status: "Compliant" as MedicarePartDComplianceStatus,
	},
	{
		id: "comp-2",
		requirement: "CMS Response Review",
		description: "Review and resolve all CMS response file errors",
		frequency: "Monthly",
		dueDate: "Jul 25, 2027",
		status: "At Risk" as MedicarePartDComplianceStatus,
	},
	{
		id: "comp-3",
		requirement: "PDE Reconciliation",
		description: "Complete monthly PDE reconciliation per contract",
		frequency: "Monthly",
		dueDate: "Jul 31, 2027",
		status: "In Progress" as MedicarePartDComplianceStatus,
	},
	{
		id: "comp-4",
		requirement: "Formulary Compliance Attestation",
		description: "Submit formulary compliance attestation to CMS",
		frequency: "Quarterly",
		dueDate: "Aug 15, 2027",
		status: "Compliant" as MedicarePartDComplianceStatus,
	},
	{
		id: "comp-5",
		requirement: "DIR Reporting",
		description: "Direct and indirect remuneration reporting submission",
		frequency: "Quarterly",
		dueDate: "Aug 30, 2027",
		status: "In Progress" as MedicarePartDComplianceStatus,
	},
];

export const MEDICARE_PART_D_DOCUMENTS = [
	{
		id: "doc-1",
		name: "PDE_Submission_Guide_Q2_2027.pdf",
		documentType: "Submission Guide",
		reportingPeriod: "Q2 2027",
		uploadedOn: "Jun 01, 2027",
		size: "2.4 MB",
	},
	{
		id: "doc-2",
		name: "PDE_RESP_06212027.xml",
		documentType: "CMS Response",
		reportingPeriod: "Q2 2027",
		uploadedOn: "Jun 21, 2027",
		size: "18.6 MB",
	},
	{
		id: "doc-3",
		name: "PDE_Validation_Report_06202027.xlsx",
		documentType: "Validation Report",
		reportingPeriod: "Q2 2027",
		uploadedOn: "Jun 20, 2027",
		size: "840 KB",
	},
	{
		id: "doc-4",
		name: "PDE_Reconciliation_Summary_Jun2027.pdf",
		documentType: "Reconciliation",
		reportingPeriod: "Q2 2027",
		uploadedOn: "Jun 22, 2027",
		size: "1.1 MB",
	},
	{
		id: "doc-5",
		name: "Part_D_Compliance_Checklist_Q2.pdf",
		documentType: "Compliance",
		reportingPeriod: "Q2 2027",
		uploadedOn: "Jun 05, 2027",
		size: "520 KB",
	},
];
