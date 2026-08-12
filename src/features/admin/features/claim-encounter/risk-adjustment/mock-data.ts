export const RISK_ADJUSTMENT_TABS = [
	"Overview",
	"HCC Management",
	"Member Opportunities",
	"Coding Validation",
	"Submissions",
	"Audit & Reconciliation",
	"Documents",
] as const;

export type RiskAdjustmentTab = (typeof RISK_ADJUSTMENT_TABS)[number];

export const RISK_ADJUSTMENT_TAB_SLUGS: Record<RiskAdjustmentTab, string> = {
	Overview: "overview",
	"HCC Management": "hcc-management",
	"Member Opportunities": "member-opportunities",
	"Coding Validation": "coding-validation",
	Submissions: "submissions",
	"Audit & Reconciliation": "audit-reconciliation",
	Documents: "documents",
};

export const RISK_ADJUSTMENT_TAB_META: Record<
	RiskAdjustmentTab,
	{ title: string; description: string }
> = {
	Overview: {
		title: "Risk Adjustment Overview",
		description:
			"Summary of risk adjustment performance and impact for the selected program and measurement year.",
	},
	"HCC Management": {
		title: "HCC Management",
		description:
			"Manage HCC categories, capture performance, and associated member conditions for risk adjustment.",
	},
	"Member Opportunities": {
		title: "Member Opportunities",
		description:
			"Identify members with suspected or missing conditions to improve HCC capture and RAF impact.",
	},
	"Coding Validation": {
		title: "Coding Validation",
		description:
			"Validate diagnosis codes and documentation to ensure accurate HCC capture and submission.",
	},
	Submissions: {
		title: "Submissions",
		description:
			"Track risk adjustment submissions, file status, and payer responses.",
	},
	"Audit & Reconciliation": {
		title: "Audit & Reconciliation",
		description:
			"Manage audit requests, requests for validation (RFV), and reconciliation activities from payers and regulators.",
	},
	Documents: {
		title: "Documents",
		description:
			"Access and manage documents, policies, templates, reports, and supporting files.",
	},
};

export const RISK_ADJUSTMENT_KPIS = {
	rafScoreYtd: 1.234,
	rafScoreDelta: 0.058,
	rafScoreDeltaPct: 4.92,
	membersAssessed: 48_752,
	membersAssessedDelta: 2_346,
	membersAssessedDeltaPct: 5.05,
	hccsCaptured: 18_642,
	hccsCapturedDelta: 1_243,
	hccsCapturedDeltaPct: 7.16,
	potentialRafImpact: 0.152,
	potentialRafImpactDelta: 0.042,
	potentialRafImpactDeltaPct: 38.18,
	paymentImpactEst: 4_200_000,
	paymentImpactDelta: 1_100_000,
	paymentImpactDeltaPct: 35.42,
};

export const RISK_ADJUSTMENT_RAF_TREND = [
	{ month: "Jan", y2025: 1.052, y2024: 0.982 },
	{ month: "Feb", y2025: 1.068, y2024: 0.998 },
	{ month: "Mar", y2025: 1.092, y2024: 1.018 },
	{ month: "Apr", y2025: 1.118, y2024: 1.042 },
	{ month: "May", y2025: 1.142, y2024: 1.068 },
	{ month: "Jun", y2025: 1.168, y2024: 1.088 },
	{ month: "Jul", y2025: 1.192, y2024: 1.108 },
	{ month: "Aug", y2025: 1.208, y2024: 1.128 },
	{ month: "Sep", y2025: 1.218, y2024: 1.148 },
	{ month: "Oct", y2025: 1.226, y2024: 1.168 },
	{ month: "Nov", y2025: 1.23, y2024: 1.188 },
	{ month: "Dec", y2025: 1.234, y2024: 1.208 },
];

export const RISK_ADJUSTMENT_HCC_CATEGORIES = [
	{ name: "Circulatory System", value: 4_820, pct: 25.9, color: "#3b82f6" },
	{ name: "Endocrine/Metabolic", value: 3_940, pct: 21.1, color: "#22c55e" },
	{ name: "Respiratory System", value: 3_210, pct: 17.2, color: "#ef4444" },
	{ name: "Digestive System", value: 2_680, pct: 14.4, color: "#f97316" },
	{ name: "Musculoskeletal System", value: 2_150, pct: 11.5, color: "#8b5cf6" },
	{ name: "Other", value: 1_842, pct: 9.9, color: "#94a3b8" },
];

export const RISK_ADJUSTMENT_OPPORTUNITIES = [
	{
		id: "opp-1",
		title: "Members with Coding Gaps",
		count: 7_962,
		rafImpact: 0.152,
		pct: 16.3,
		color: "#ef4444",
		iconKey: "users" as const,
	},
	{
		id: "opp-2",
		title: "Documentation Incomplete",
		count: 7_142,
		rafImpact: 0.058,
		pct: 14.6,
		color: "#f97316",
		iconKey: "file" as const,
	},
	{
		id: "opp-3",
		title: "Conditions Not Captured",
		count: 12_184,
		rafImpact: 0.102,
		pct: 24.9,
		color: "#8b5cf6",
		iconKey: "clipboard" as const,
	},
	{
		id: "opp-4",
		title: "Pending Provider Reviews",
		count: 3_520,
		rafImpact: 0.028,
		pct: 7.2,
		color: "#3b82f6",
		iconKey: "stethoscope" as const,
	},
];

export const RISK_ADJUSTMENT_SUBMISSIONS = [
	{
		id: "sub-1",
		type: "MA Initial Submission",
		status: "Accepted",
		statusStyle: "border-emerald-200 bg-emerald-50 text-emerald-800",
		lastSubmission: "May 15, 2025",
		records: 48_752,
		acceptanceRate: 98.7,
	},
	{
		id: "sub-2",
		type: "MA Mid-Year Update",
		status: "In Process",
		statusStyle: "border-amber-200 bg-amber-50 text-amber-800",
		lastSubmission: "Jul 15, 2025",
		records: 48_752,
		acceptanceRate: null,
	},
	{
		id: "sub-3",
		type: "Retrospective Risk Adjustment",
		status: "Pending",
		statusStyle: "border-sky-200 bg-sky-50 text-sky-800",
		lastSubmission: "Sep 15, 2025",
		records: null,
		acceptanceRate: null,
	},
];

export const RISK_ADJUSTMENT_AUDIT_ITEMS = [
	{ label: "RADV / Audit Requested", count: 3 },
	{ label: "Audit in Progress", count: 2 },
	{ label: "Open Audit Findings", count: 1 },
	{ label: "Reconciliations in Process", count: 2 },
	{ label: "Reconciliations Completed", count: 12 },
];

export const RISK_ADJUSTMENT_PROGRAM_INFO = {
	program: "Medicare Advantage",
	measurementYear: "2025",
	riskModel: "CMS-HCC V28",
	lob: "All",
	dataLastRefreshed: "05/12/2025 08:30 AM",
};

export const RISK_ADJUSTMENT_DATA_AS_OF = "05/12/2025 08:30 AM";

export type HccSummaryRow = {
	id: string;
	code: string;
	description: string;
	category: string;
	categoryTone: "purple" | "blue" | "green" | "red" | "orange";
	eligibleMembers: number;
	captured: number;
	capturedPct: number;
	notCaptured: number;
	notCapturedPct: number;
	docIssues: number;
	docIssuesPct: number;
	rafImpact: number;
	captureRate: number;
	status: "Review" | "Active";
};

export const HCC_SUMMARY_ROWS: HccSummaryRow[] = [
	{
		id: "hcc-37",
		code: "HCC 37",
		description: "Diabetes with Chronic Complications",
		category: "Endocrine/Metabolic",
		categoryTone: "purple",
		eligibleMembers: 1_245,
		captured: 1_080,
		capturedPct: 86.7,
		notCaptured: 165,
		notCapturedPct: 13.3,
		docIssues: 42,
		docIssuesPct: 3.4,
		rafImpact: 0.166,
		captureRate: 86.7,
		status: "Review",
	},
	{
		id: "hcc-226",
		code: "HCC 226",
		description: "Congestive Heart Failure",
		category: "Circulatory System",
		categoryTone: "blue",
		eligibleMembers: 980,
		captured: 876,
		capturedPct: 89.4,
		notCaptured: 104,
		notCapturedPct: 10.6,
		docIssues: 18,
		docIssuesPct: 1.8,
		rafImpact: 0.323,
		captureRate: 89.4,
		status: "Active",
	},
	{
		id: "hcc-280",
		code: "HCC 280",
		description: "Chronic Obstructive Pulmonary Disease",
		category: "Respiratory System",
		categoryTone: "red",
		eligibleMembers: 875,
		captured: 742,
		capturedPct: 84.8,
		notCaptured: 133,
		notCapturedPct: 15.2,
		docIssues: 28,
		docIssuesPct: 3.2,
		rafImpact: 0.328,
		captureRate: 84.8,
		status: "Active",
	},
	{
		id: "hcc-18",
		code: "HCC 18",
		description: "Diabetes without Complication",
		category: "Endocrine/Metabolic",
		categoryTone: "purple",
		eligibleMembers: 1_520,
		captured: 1_312,
		capturedPct: 86.3,
		notCaptured: 208,
		notCapturedPct: 13.7,
		docIssues: 35,
		docIssuesPct: 2.3,
		rafImpact: 0.104,
		captureRate: 86.3,
		status: "Active",
	},
	{
		id: "hcc-138",
		code: "HCC 138",
		description: "Chronic Kidney Disease, Stage 4",
		category: "Renal",
		categoryTone: "orange",
		eligibleMembers: 620,
		captured: 548,
		capturedPct: 88.4,
		notCaptured: 72,
		notCapturedPct: 11.6,
		docIssues: 14,
		docIssuesPct: 2.3,
		rafImpact: 0.237,
		captureRate: 88.4,
		status: "Active",
	},
];

export type HccMemberRow = {
	id: string;
	memberId: string;
	name: string;
	dob: string;
	status: "Captured" | "Identified" | "Not Captured";
	lastServiceDate: string;
	codingSource: string;
	rafImpact: number;
	docStatus: "Complete" | "Documentation Issue" | "Missing Documentation";
	action: "View Member" | "Review";
};

export const HCC_37_MEMBERS: HccMemberRow[] = [
	{
		id: "m1",
		memberId: "M00012345",
		name: "Johnson, Robert",
		dob: "03/15/1958",
		status: "Captured",
		lastServiceDate: "04/12/2025",
		codingSource: "Professional",
		rafImpact: 0.166,
		docStatus: "Complete",
		action: "View Member",
	},
	{
		id: "m2",
		memberId: "M00023456",
		name: "Williams, Patricia",
		dob: "07/22/1962",
		status: "Identified",
		lastServiceDate: "03/28/2025",
		codingSource: "Facility",
		rafImpact: 0.166,
		docStatus: "Documentation Issue",
		action: "Review",
	},
	{
		id: "m3",
		memberId: "M00034567",
		name: "Brown, Michael",
		dob: "11/08/1955",
		status: "Not Captured",
		lastServiceDate: "02/15/2025",
		codingSource: "Professional",
		rafImpact: 0.166,
		docStatus: "Missing Documentation",
		action: "Review",
	},
	{
		id: "m4",
		memberId: "M00045678",
		name: "Davis, Jennifer",
		dob: "05/30/1960",
		status: "Captured",
		lastServiceDate: "04/05/2025",
		codingSource: "Professional",
		rafImpact: 0.166,
		docStatus: "Complete",
		action: "View Member",
	},
	{
		id: "m5",
		memberId: "M00056789",
		name: "Miller, James",
		dob: "09/14/1957",
		status: "Identified",
		lastServiceDate: "03/18/2025",
		codingSource: "Facility",
		rafImpact: 0.166,
		docStatus: "Documentation Issue",
		action: "Review",
	},
];

export const MEMBER_OPPORTUNITY_KPIS = {
	totalOpportunities: 7_962,
	potentialRafImpact: 0.152,
	paymentImpactEst: 4_200_000,
	highImpact: 1_245,
	documentationNeeded: 3_214,
	pendingProviderReview: 1_256,
};

export type MemberOpportunityRow = {
	id: string;
	memberId: string;
	name: string;
	dob: string;
	hcc: string;
	hccDescription: string;
	opportunityType: string;
	lastServiceDate: string;
	rafImpact: number;
	paymentImpact: number;
	status: "In Progress" | "Pending Review" | "New";
	assignedTo: string;
	codingSource: string;
};

export const MEMBER_OPPORTUNITY_ROWS: MemberOpportunityRow[] = [
	{
		id: "o1",
		memberId: "M00012345",
		name: "Johnson, Robert",
		dob: "03/15/1958",
		hcc: "HCC 37",
		hccDescription: "Diabetes with Chronic Complications",
		opportunityType: "Coding Gap",
		lastServiceDate: "04/12/2025",
		rafImpact: 0.166,
		paymentImpact: 4_650,
		status: "In Progress",
		assignedTo: "Sarah L.",
		codingSource: "Professional",
	},
	{
		id: "o2",
		memberId: "M00023456",
		name: "Williams, Patricia",
		dob: "07/22/1962",
		hcc: "HCC 226",
		hccDescription: "Congestive Heart Failure",
		opportunityType: "Documentation",
		lastServiceDate: "03/28/2025",
		rafImpact: 0.323,
		paymentImpact: 9_050,
		status: "Pending Review",
		assignedTo: "Michael T.",
		codingSource: "Facility",
	},
	{
		id: "o3",
		memberId: "M00034567",
		name: "Brown, Michael",
		dob: "11/08/1955",
		hcc: "HCC 280",
		hccDescription: "Chronic Obstructive Pulmonary Disease",
		opportunityType: "Condition Not Captured",
		lastServiceDate: "02/15/2025",
		rafImpact: 0.328,
		paymentImpact: 9_200,
		status: "New",
		assignedTo: "Unassigned",
		codingSource: "Professional",
	},
	{
		id: "o4",
		memberId: "M00045678",
		name: "Davis, Jennifer",
		dob: "05/30/1960",
		hcc: "HCC 18",
		hccDescription: "Diabetes without Complication",
		opportunityType: "Coding Gap",
		lastServiceDate: "04/05/2025",
		rafImpact: 0.104,
		paymentImpact: 2_920,
		status: "In Progress",
		assignedTo: "Sarah L.",
		codingSource: "Professional",
	},
	{
		id: "o5",
		memberId: "M00056789",
		name: "Miller, James",
		dob: "09/14/1957",
		hcc: "HCC 138",
		hccDescription: "Chronic Kidney Disease, Stage 4",
		opportunityType: "Documentation",
		lastServiceDate: "03/18/2025",
		rafImpact: 0.237,
		paymentImpact: 6_640,
		status: "Pending Review",
		assignedTo: "Michael T.",
		codingSource: "Facility",
	},
	{
		id: "o6",
		memberId: "M00067890",
		name: "Wilson, Linda",
		dob: "01/25/1963",
		hcc: "HCC 37",
		hccDescription: "Diabetes with Chronic Complications",
		opportunityType: "Condition Not Captured",
		lastServiceDate: "04/01/2025",
		rafImpact: 0.166,
		paymentImpact: 4_650,
		status: "New",
		assignedTo: "Unassigned",
		codingSource: "Professional",
	},
	{
		id: "o7",
		memberId: "M00078901",
		name: "Moore, David",
		dob: "12/03/1954",
		hcc: "HCC 226",
		hccDescription: "Congestive Heart Failure",
		opportunityType: "Coding Gap",
		lastServiceDate: "03/22/2025",
		rafImpact: 0.323,
		paymentImpact: 9_050,
		status: "In Progress",
		assignedTo: "Sarah L.",
		codingSource: "Facility",
	},
	{
		id: "o8",
		memberId: "M00089012",
		name: "Taylor, Susan",
		dob: "08/17/1961",
		hcc: "HCC 280",
		hccDescription: "Chronic Obstructive Pulmonary Disease",
		opportunityType: "Documentation",
		lastServiceDate: "02/28/2025",
		rafImpact: 0.328,
		paymentImpact: 9_200,
		status: "Pending Review",
		assignedTo: "Michael T.",
		codingSource: "Professional",
	},
	{
		id: "o9",
		memberId: "M00090123",
		name: "Anderson, Richard",
		dob: "06/09/1956",
		hcc: "HCC 18",
		hccDescription: "Diabetes without Complication",
		opportunityType: "Condition Not Captured",
		lastServiceDate: "04/08/2025",
		rafImpact: 0.104,
		paymentImpact: 2_920,
		status: "New",
		assignedTo: "Unassigned",
		codingSource: "Facility",
	},
	{
		id: "o10",
		memberId: "M00101234",
		name: "Thomas, Barbara",
		dob: "04/21/1959",
		hcc: "HCC 138",
		hccDescription: "Chronic Kidney Disease, Stage 4",
		opportunityType: "Coding Gap",
		lastServiceDate: "03/15/2025",
		rafImpact: 0.237,
		paymentImpact: 6_640,
		status: "In Progress",
		assignedTo: "Sarah L.",
		codingSource: "Professional",
	},
];

export type MemberOpportunityDetail = {
	id: string;
	memberId: string;
	name: string;
	dob: string;
	age: number;
	planLob: string;
	pcp: string;
	coverageStatus: "Active" | "Inactive";
	memberStatus: "Active" | "Inactive";
	hcc: string;
	hccDescription: string;
	opportunityType: string;
	riskModel: string;
	currentRaf: number;
	potentialRafImpact: number;
	paymentImpact: number;
	dateIdentified: string;
	lastServiceDate: string;
	codingSource: string;
	evidence: {
		diagnosisCode: string;
		diagnosisDescription: string;
		dateOfService: string;
		claimEncounter: string;
		renderingProvider: string;
		pos: string;
		evidenceSource: string;
		documentationAvailable: boolean;
	}[];
	supporting: {
		hccCategory: string;
		comorbidity: string;
		hierarchicalRule: string;
		complicationStatus: string;
		exclusion: string;
		documentationTypeNeeded: string;
		memberRiskScoreCurrent: number;
		previousRafImpact: number;
		fullRafScoreCurrent: number;
		potentialRafIncrease: number;
	};
	workflow: {
		status: "In Progress" | "Pending Review" | "New";
		priority: "High" | "Medium" | "Low";
		assignedTo: string;
		dueDate: string;
		notes: string;
		lastActivity: string;
	};
	checklist: { label: string; status: string; tone: "success" | "warning" | "neutral" }[];
	history: {
		firstIdentified: string;
		firstOpportunityType: string;
		opportunitiesAllTime: number;
		previouslySubmitted: string;
	};
};

const MEMBER_OPPORTUNITY_DETAILS: Record<string, MemberOpportunityDetail> = {
	o1: {
		id: "o1",
		memberId: "M00012345",
		name: "Johnson, Robert",
		dob: "08/14/1952",
		age: 72,
		planLob: "Medicare Advantage",
		pcp: "Sarah L. Thompson, MD",
		coverageStatus: "Active",
		memberStatus: "Active",
		hcc: "HCC 37",
		hccDescription: "Diabetes with Chronic Complications",
		opportunityType: "Coding Gap",
		riskModel: "CMS-HCC V28",
		currentRaf: 0,
		potentialRafImpact: 0.166,
		paymentImpact: 4_650,
		dateIdentified: "05/09/2025",
		lastServiceDate: "05/09/2025",
		codingSource: "Professional Claim",
		evidence: [
			{
				diagnosisCode: "E11.22",
				diagnosisDescription: "Type 2 diabetes mellitus with diabetic chronic kidney disease",
				dateOfService: "05/09/2025",
				claimEncounter: "CLM-20250509-784512",
				renderingProvider: "Sarah L. Thompson, MD",
				pos: "11",
				evidenceSource: "Professional Claim",
				documentationAvailable: true,
			},
		],
		supporting: {
			hccCategory: "Endocrine/Metabolic",
			comorbidity: "Diabetic Nephropathy",
			hierarchicalRule: "No higher HCC captured",
			complicationStatus: "Chronic",
			exclusion: "None",
			documentationTypeNeeded:
				"Provider progress notes or lab results supporting chronic complication",
			memberRiskScoreCurrent: 1.803,
			previousRafImpact: 0,
			fullRafScoreCurrent: 1.803,
			potentialRafIncrease: 0.166,
		},
		workflow: {
			status: "In Progress",
			priority: "High",
			assignedTo: "Sarah L.",
			dueDate: "05/23/2025",
			notes:
				"Member has diagnosis supporting HCC 37 based on 5/9/2025 visit. Need provider documentation to confirm chronic complication.",
			lastActivity: "05/12/2025 10:15 AM by Sarah L.",
		},
		checklist: [
			{ label: "Diagnosis Validated", status: "Yes", tone: "success" },
			{ label: "Documentation Reviewed", status: "In Review", tone: "warning" },
			{ label: "HCC Mapping Validated", status: "In Review", tone: "warning" },
			{ label: "Duplicate Checked", status: "Yes", tone: "success" },
			{ label: "Eligibility Validated", status: "Yes", tone: "success" },
			{ label: "Submission Eligibility", status: "Pending", tone: "neutral" },
		],
		history: {
			firstIdentified: "05/09/2025",
			firstOpportunityType: "Coding Gap",
			opportunitiesAllTime: 1,
			previouslySubmitted: "No",
		},
	},
};

export function getMemberOpportunityDetail(opportunityId: string) {
	return MEMBER_OPPORTUNITY_DETAILS[opportunityId] ?? null;
}

export const CODING_VALIDATION_KPIS = {
	totalForReview: 3_214,
	pendingValidation: 1_742,
	validated: 1_132,
	rejected: 278,
	documentationRequested: 62,
};

export type CodingValidationRow = {
	id: string;
	memberId: string;
	name: string;
	hcc: string;
	condition: string;
	dos: string;
	codingSource: string;
	riskScoreImpact: number;
	status: "Pending" | "In Review" | "Rejected" | "Documentation Requested";
	assignedTo: string;
};

export const CODING_VALIDATION_ROWS: CodingValidationRow[] = [
	{
		id: "cv1",
		memberId: "M00012345",
		name: "Johnson, Robert",
		hcc: "HCC 37",
		condition: "Diabetes with Chronic Complications",
		dos: "04/12/2025",
		codingSource: "Professional Claim",
		riskScoreImpact: 0.166,
		status: "Pending",
		assignedTo: "Sarah L.",
	},
	{
		id: "cv2",
		memberId: "M00023456",
		name: "Williams, Patricia",
		hcc: "HCC 226",
		condition: "Congestive Heart Failure",
		dos: "03/28/2025",
		codingSource: "Facility Claim",
		riskScoreImpact: 0.323,
		status: "In Review",
		assignedTo: "Michael T.",
	},
	{
		id: "cv3",
		memberId: "M00034567",
		name: "Brown, Michael",
		hcc: "HCC 280",
		condition: "Chronic Obstructive Pulmonary Disease",
		dos: "02/15/2025",
		codingSource: "Professional Claim",
		riskScoreImpact: 0.328,
		status: "Rejected",
		assignedTo: "Sarah L.",
	},
	{
		id: "cv4",
		memberId: "M00045678",
		name: "Davis, Jennifer",
		hcc: "HCC 18",
		condition: "Diabetes without Complication",
		dos: "04/05/2025",
		codingSource: "Professional Claim",
		riskScoreImpact: 0.104,
		status: "Documentation Requested",
		assignedTo: "Michael T.",
	},
	{
		id: "cv5",
		memberId: "M00056789",
		name: "Miller, James",
		hcc: "HCC 138",
		condition: "Chronic Kidney Disease, Stage 4",
		dos: "03/18/2025",
		codingSource: "Facility Claim",
		riskScoreImpact: 0.237,
		status: "Pending",
		assignedTo: "Unassigned",
	},
	{
		id: "cv6",
		memberId: "M00067890",
		name: "Wilson, Linda",
		hcc: "HCC 37",
		condition: "Diabetes with Chronic Complications",
		dos: "04/01/2025",
		codingSource: "Professional Claim",
		riskScoreImpact: 0.166,
		status: "In Review",
		assignedTo: "Sarah L.",
	},
	{
		id: "cv7",
		memberId: "M00078901",
		name: "Moore, David",
		hcc: "HCC 226",
		condition: "Congestive Heart Failure",
		dos: "03/22/2025",
		codingSource: "Facility Claim",
		riskScoreImpact: 0.323,
		status: "Pending",
		assignedTo: "Michael T.",
	},
	{
		id: "cv8",
		memberId: "M00089012",
		name: "Taylor, Susan",
		hcc: "HCC 280",
		condition: "Chronic Obstructive Pulmonary Disease",
		dos: "02/28/2025",
		codingSource: "Professional Claim",
		riskScoreImpact: 0.328,
		status: "Rejected",
		assignedTo: "Sarah L.",
	},
];

export const CODING_VALIDATION_DETAIL = {
	memberId: "M00012345",
	name: "Johnson, Robert",
	hcc: "HCC 37",
	condition: "Diabetes with Chronic Complications",
	dateIdentified: "04/15/2025",
	riskScoreImpact: 0.166,
	paymentImpact: 4_650,
	riskModel: "CMS-HCC V28",
	diagnosisCode: "E11.22",
	diagnosisDescription: "Type 2 diabetes mellitus with diabetic chronic kidney disease",
	provider: "Dr. Smith, Internal Medicine",
	placeOfService: "Office",
	claimEncounter: "CLM-2025-041234",
	documentationAvailable: true,
};

export const RA_SUBMISSION_KPIS = {
	total: 32,
	accepted: 22,
	acceptedPct: 68.8,
	acceptedPayment: 18_420_000,
	inProcess: 6,
	inProcessPct: 18.8,
	inProcessPayment: 4_910_000,
	rejected: 4,
	rejectedPct: 12.5,
	rejectedPayment: 1_080_000,
};

export type RaSubmissionRow = {
	id: string;
	submissionId: string;
	type: string;
	period: string;
	payer: string;
	submittedDate: string;
	records: number;
	status: "Accepted" | "In Process" | "Rejected";
	responseReceived: string | null;
	acceptanceRate: number | null;
	paymentImpact: number;
	paymentImpactLabel: string;
};

export const RA_SUBMISSION_ROWS: RaSubmissionRow[] = [
	{
		id: "s1",
		submissionId: "SUB-2025-0728-DX",
		type: "Diagnosis (HCC)",
		period: "Q3 2025",
		payer: "CMS",
		submittedDate: "07/28/2025",
		records: 48_752,
		status: "In Process",
		responseReceived: null,
		acceptanceRate: null,
		paymentImpact: 2_740_000,
		paymentImpactLabel: "$2.74M",
	},
	{
		id: "s2",
		submissionId: "SUB-2025-0715-ENC",
		type: "Encounter",
		period: "Q3 2025",
		payer: "CMS",
		submittedDate: "07/15/2025",
		records: 142_850,
		status: "Accepted",
		responseReceived: "07/18/2025",
		acceptanceRate: 98.7,
		paymentImpact: 5_420_000,
		paymentImpactLabel: "$5.42M",
	},
	{
		id: "s3",
		submissionId: "SUB-2025-0715-DX",
		type: "Diagnosis (HCC)",
		period: "Q2 2025",
		payer: "CMS",
		submittedDate: "07/15/2025",
		records: 48_752,
		status: "Accepted",
		responseReceived: "07/18/2025",
		acceptanceRate: 99.1,
		paymentImpact: 4_860_000,
		paymentImpactLabel: "$4.86M",
	},
	{
		id: "s4",
		submissionId: "SUB-2025-0415-DEMO",
		type: "Demographics",
		period: "Q1 2025",
		payer: "CMS",
		submittedDate: "04/15/2025",
		records: 48_752,
		status: "Accepted",
		responseReceived: "04/18/2025",
		acceptanceRate: 100,
		paymentImpact: 0,
		paymentImpactLabel: "—",
	},
	{
		id: "s5",
		submissionId: "SUB-2025-0415-ENC",
		type: "Encounter",
		period: "Q2 2025",
		payer: "CMS",
		submittedDate: "04/15/2025",
		records: 138_420,
		status: "Accepted",
		responseReceived: "04/20/2025",
		acceptanceRate: 97.2,
		paymentImpact: 3_280_000,
		paymentImpactLabel: "$3.28M",
	},
	{
		id: "s6",
		submissionId: "SUB-2025-0312-DX",
		type: "Diagnosis (HCC)",
		period: "Q1 2025",
		payer: "CMS",
		submittedDate: "03/12/2025",
		records: 48_752,
		status: "Rejected",
		responseReceived: "03/15/2025",
		acceptanceRate: 82.4,
		paymentImpact: -650_000,
		paymentImpactLabel: "($0.65M)",
	},
	{
		id: "s7",
		submissionId: "SUB-2024-1215-DX",
		type: "Diagnosis (HCC)",
		period: "Q4 2024",
		payer: "CMS",
		submittedDate: "12/15/2024",
		records: 47_890,
		status: "Accepted",
		responseReceived: "12/20/2024",
		acceptanceRate: 98.5,
		paymentImpact: 4_720_000,
		paymentImpactLabel: "$4.72M",
	},
	{
		id: "s8",
		submissionId: "SUB-2024-1015-ENC",
		type: "Encounter",
		period: "Q4 2024",
		payer: "CMS",
		submittedDate: "10/15/2024",
		records: 135_280,
		status: "Accepted",
		responseReceived: "10/22/2024",
		acceptanceRate: 96.8,
		paymentImpact: 2_950_000,
		paymentImpactLabel: "$2.95M",
	},
	{
		id: "s9",
		submissionId: "SUB-2024-0715-DX",
		type: "Diagnosis (HCC)",
		period: "Q3 2024",
		payer: "CMS",
		submittedDate: "07/15/2024",
		records: 47_450,
		status: "Accepted",
		responseReceived: "07/20/2024",
		acceptanceRate: 98.2,
		paymentImpact: 4_580_000,
		paymentImpactLabel: "$4.58M",
	},
	{
		id: "s10",
		submissionId: "SUB-2024-0415-DX",
		type: "Diagnosis (HCC)",
		period: "Q2 2024",
		payer: "CMS",
		submittedDate: "04/15/2024",
		records: 47_120,
		status: "Accepted",
		responseReceived: "04/22/2024",
		acceptanceRate: 97.9,
		paymentImpact: 4_350_000,
		paymentImpactLabel: "$4.35M",
	},
];

export const RA_SUBMISSION_DETAIL = {
	submissionId: "SUB-2025-0728-DX",
	type: "Diagnosis (HCC)",
	period: "Q3 2025",
	payer: "CMS",
	status: "In Process" as const,
	submittedDate: "07/28/2025",
	records: 48_752,
	riskModel: "CMS-HCC V28",
	groupType: "All",
	submittedBy: "J. Martinez",
	fileType: "Diagnosis (HCC)",
	program: "Medicare Advantage",
	paymentImpact: 2_740_000,
	rafImpact: 0.089,
	includedMembers: 48_752,
	steps: [
		{ label: "Received", date: "07/28/2025", state: "complete" as const },
		{ label: "Processing", sublabel: "In Progress", state: "active" as const },
		{ label: "Response", sublabel: "Pending", state: "pending" as const },
		{ label: "Complete", sublabel: "Pending", state: "pending" as const },
	],
};

export const RA_AUDIT_KPIS = {
	total: 128,
	open: 68,
	openPct: 53.1,
	closed: 52,
	closedPct: 40.6,
	pendingPayer: 8,
	pendingPayerPct: 6.3,
	overdue: 11,
	overduePct: 8.6,
};

export type RaAuditRow = {
	id: string;
	caseId: string;
	caseType: string;
	payer: string;
	program: string;
	memberGroup: string;
	dateRequested: string;
	dueDate: string;
	dueDateOverdue?: boolean;
	status: "Open" | "In Review" | "Pending Payer" | "Closed";
	priority: "High" | "Medium" | "Low";
	assignedTo: string;
};

export const RA_AUDIT_ROWS: RaAuditRow[] = [
	{
		id: "a1",
		caseId: "AUD-2025-0715",
		caseType: "RAF Audit",
		payer: "CMS",
		program: "Medicare Advantage",
		memberGroup: "Group: 25 Members",
		dateRequested: "07/15/2025",
		dueDate: "08/14/2025",
		status: "Open",
		priority: "High",
		assignedTo: "Sarah L.",
	},
	{
		id: "a2",
		caseId: "AUD-2025-0620",
		caseType: "RADV Audit",
		payer: "CMS",
		program: "Medicare Advantage",
		memberGroup: "Group: 50 Members",
		dateRequested: "06/20/2025",
		dueDate: "07/20/2025",
		dueDateOverdue: true,
		status: "In Review",
		priority: "Medium",
		assignedTo: "Michael T.",
	},
	{
		id: "a3",
		caseId: "AUD-2025-0510",
		caseType: "RFV Request",
		payer: "CMS",
		program: "Medicare Advantage",
		memberGroup: "Member: M00012345",
		dateRequested: "05/10/2025",
		dueDate: "06/09/2025",
		dueDateOverdue: true,
		status: "Pending Payer",
		priority: "High",
		assignedTo: "Sarah L.",
	},
	{
		id: "a4",
		caseId: "AUD-2025-0405",
		caseType: "Reconciliation",
		payer: "CMS",
		program: "Medicare Advantage",
		memberGroup: "Group: All Members",
		dateRequested: "04/05/2025",
		dueDate: "05/05/2025",
		status: "Closed",
		priority: "Low",
		assignedTo: "Michael T.",
	},
	{
		id: "a5",
		caseId: "AUD-2025-0315",
		caseType: "RAF Audit",
		payer: "CMS",
		program: "Medicare Advantage",
		memberGroup: "Group: 15 Members",
		dateRequested: "03/15/2025",
		dueDate: "04/14/2025",
		status: "Closed",
		priority: "Medium",
		assignedTo: "Sarah L.",
	},
	{
		id: "a6",
		caseId: "AUD-2025-0220",
		caseType: "RADV Audit",
		payer: "CMS",
		program: "Medicare Advantage",
		memberGroup: "Group: 30 Members",
		dateRequested: "02/20/2025",
		dueDate: "03/22/2025",
		status: "In Review",
		priority: "High",
		assignedTo: "Unassigned",
	},
	{
		id: "a7",
		caseId: "AUD-2025-0110",
		caseType: "RFV Request",
		payer: "CMS",
		program: "Medicare Advantage",
		memberGroup: "Member: M00023456",
		dateRequested: "01/10/2025",
		dueDate: "02/09/2025",
		status: "Open",
		priority: "Medium",
		assignedTo: "Michael T.",
	},
	{
		id: "a8",
		caseId: "AUD-2024-1215",
		caseType: "Reconciliation",
		payer: "CMS",
		program: "Medicare Advantage",
		memberGroup: "Group: All Members",
		dateRequested: "12/15/2024",
		dueDate: "01/14/2025",
		status: "Closed",
		priority: "Low",
		assignedTo: "Sarah L.",
	},
	{
		id: "a9",
		caseId: "AUD-2024-1105",
		caseType: "RAF Audit",
		payer: "CMS",
		program: "Medicare Advantage",
		memberGroup: "Group: 20 Members",
		dateRequested: "11/05/2024",
		dueDate: "12/05/2024",
		status: "Closed",
		priority: "High",
		assignedTo: "Michael T.",
	},
	{
		id: "a10",
		caseId: "AUD-2024-0920",
		caseType: "RADV Audit",
		payer: "CMS",
		program: "Medicare Advantage",
		memberGroup: "Group: 40 Members",
		dateRequested: "09/20/2024",
		dueDate: "10/20/2024",
		status: "Closed",
		priority: "Medium",
		assignedTo: "Sarah L.",
	},
];

export const RA_AUDIT_DETAIL = {
	caseId: "AUD-2025-0715",
	caseType: "RAF Audit",
	payer: "CMS",
	status: "Open" as const,
	dateRequested: "07/15/2025",
	requestMethod: "EDGE Portal",
	dueDate: "08/14/2025",
	dueDaysRemaining: 29,
	priority: "High",
	program: "Medicare Advantage",
	assignedTo: "Sarah L.",
	measurementYear: "2025",
	lastUpdated: "07/28/2025 10:15 AM",
	scope: {
		members: 25,
		recordsRequested: 312,
		hccs: 15,
		timePeriod: "Q1–Q2 2025",
	},
	currentStage: "Documentation Collection",
	progressPct: 45,
	daysOpen: 1,
	nextSteps: [
		"Collect supporting documentation for 15 HCCs",
		"Review provider attestations for 25 members",
		"Prepare response package for CMS review",
	],
};

export const RA_DOCUMENT_KPIS = {
	total: 1_248,
	policies: 246,
	policiesPct: 19.7,
	templates: 312,
	templatesPct: 25.0,
	reports: 428,
	reportsPct: 34.3,
	other: 262,
	otherPct: 21.0,
};

export type RaDocumentRow = {
	id: string;
	name: string;
	fileType: "pdf" | "docx" | "xlsx";
	docType: string;
	category: string;
	program: string;
	measurementYear: string;
	uploadedBy: string;
	dateModified: string;
	size: string;
	tags: string[];
};

export const RA_DOCUMENT_ROWS: RaDocumentRow[] = [
	{
		id: "d1",
		name: "RAF Submission Guide 2025.pdf",
		fileType: "pdf",
		docType: "Policy / SOP",
		category: "Submission",
		program: "Medicare Advantage",
		measurementYear: "2025",
		uploadedBy: "Sarah L.",
		dateModified: "07/18/2025",
		size: "1.8 MB",
		tags: ["Submission", "RAF", "Guidance"],
	},
	{
		id: "d2",
		name: "HCC Coding Guidelines V28.docx",
		fileType: "docx",
		docType: "Reference",
		category: "Coding",
		program: "Medicare Advantage",
		measurementYear: "2025",
		uploadedBy: "Michael P.",
		dateModified: "07/15/2025",
		size: "2.4 MB",
		tags: ["Coding", "HCC", "V28"],
	},
	{
		id: "d3",
		name: "Q2 2025 RAF Performance Report.xlsx",
		fileType: "xlsx",
		docType: "Report",
		category: "Performance",
		program: "Medicare Advantage",
		measurementYear: "2025",
		uploadedBy: "Sarah L.",
		dateModified: "07/10/2025",
		size: "856 KB",
		tags: ["Report", "RAF", "Q2"],
	},
	{
		id: "d4",
		name: "Provider Attestation Template.docx",
		fileType: "docx",
		docType: "Template",
		category: "Audit",
		program: "Medicare Advantage",
		measurementYear: "2025",
		uploadedBy: "Michael P.",
		dateModified: "06/28/2025",
		size: "124 KB",
		tags: ["Template", "Audit", "Provider"],
	},
	{
		id: "d5",
		name: "CMS-HCC V28 Model Documentation.pdf",
		fileType: "pdf",
		docType: "Reference",
		category: "Risk Model",
		program: "Medicare Advantage",
		measurementYear: "2025",
		uploadedBy: "Sarah L.",
		dateModified: "06/15/2025",
		size: "4.2 MB",
		tags: ["Reference", "CMS", "V28"],
	},
	{
		id: "d6",
		name: "Gap Closure Workflow SOP.pdf",
		fileType: "pdf",
		docType: "Policy / SOP",
		category: "Operations",
		program: "Medicare Advantage",
		measurementYear: "2025",
		uploadedBy: "Michael P.",
		dateModified: "06/01/2025",
		size: "980 KB",
		tags: ["SOP", "Gap Closure"],
	},
	{
		id: "d7",
		name: "RADV Audit Response Template.docx",
		fileType: "docx",
		docType: "Template",
		category: "Audit",
		program: "Medicare Advantage",
		measurementYear: "2025",
		uploadedBy: "Sarah L.",
		dateModified: "05/20/2025",
		size: "156 KB",
		tags: ["Template", "RADV", "Audit"],
	},
	{
		id: "d8",
		name: "Q1 2025 Submission Summary.xlsx",
		fileType: "xlsx",
		docType: "Report",
		category: "Submission",
		program: "Medicare Advantage",
		measurementYear: "2025",
		uploadedBy: "Michael P.",
		dateModified: "05/15/2025",
		size: "642 KB",
		tags: ["Report", "Submission", "Q1"],
	},
	{
		id: "d9",
		name: "Member Outreach Script Template.docx",
		fileType: "docx",
		docType: "Template",
		category: "Operations",
		program: "Medicare Advantage",
		measurementYear: "2025",
		uploadedBy: "Sarah L.",
		dateModified: "05/01/2025",
		size: "88 KB",
		tags: ["Template", "Outreach"],
	},
	{
		id: "d10",
		name: "Risk Adjustment Policy Manual 2025.pdf",
		fileType: "pdf",
		docType: "Policy / SOP",
		category: "Policy",
		program: "Medicare Advantage",
		measurementYear: "2025",
		uploadedBy: "Michael P.",
		dateModified: "04/20/2025",
		size: "3.6 MB",
		tags: ["Policy", "Manual"],
	},
];

export const RA_DOCUMENT_DETAIL = {
	name: "RAF Submission Guide 2025.pdf",
	fileType: "pdf" as const,
	size: "1.8 MB",
	docType: "Policy / SOP",
	category: "Submission",
	subcategory: "RAF Guidance",
	program: "Medicare Advantage",
	measurementYear: "2025",
	tags: ["Submission", "RAF", "Guidance"],
	description:
		"Comprehensive guide for preparing and submitting RAF data files to CMS, including file format specifications, validation requirements, and submission timelines.",
	uploadedBy: "Sarah L.",
	dateUploaded: "07/18/2025",
	lastModified: "07/18/2025",
	version: "1.3",
	status: "Active",
	access: "Risk Adjustment Team",
};
