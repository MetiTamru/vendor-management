export type MeasureTrend = "up" | "flat" | "down";

export type MeasureComparisonRow = {
	code: string;
	name: string;
	domain: string;
	complianceRate: number;
	target: number;
	percentile: number;
	gapToTarget: number;
	trend: MeasureTrend;
};

export type ComplianceBand = {
	label: string;
	range: string;
	count: number;
	pct: number;
	color: string;
};

export const MCR_FILTERS = {
	measurementYears: [
		{ value: "my-2025", label: "MY 2025 (Jan 1 – Dec 31, 2025)" },
		{ value: "my-2024", label: "MY 2024 (Jan 1 – Dec 31, 2024)" },
		{ value: "my-2023", label: "MY 2023 (Jan 1 – Dec 31, 2023)" },
	],
	plans: [
		{ value: "all", label: "All Plans" },
		{ value: "mdh", label: "MDH" },
		{ value: "dhcf", label: "DHCF" },
		{ value: "bhp", label: "BHP" },
	],
	linesOfBusiness: [
		{ value: "all", label: "All" },
		{ value: "medicaid", label: "Medicaid" },
		{ value: "medicare", label: "Medicare" },
		{ value: "commercial", label: "Commercial" },
	],
	measureSets: [
		{ value: "hedis", label: "HEDIS" },
		{ value: "stars", label: "Stars" },
		{ value: "custom", label: "Custom" },
	],
	domains: [
		{ value: "all", label: "All" },
		{ value: "effectiveness", label: "Effectiveness of Care" },
		{ value: "access", label: "Access / Availability of Care" },
		{ value: "experience", label: "Experience of Care" },
		{ value: "utilization", label: "Utilization" },
		{ value: "prevention", label: "Preventive Care" },
	],
} as const;

export const MCR_KPIS = {
	totalMeasures: { value: 72, hint: "HEDIS Measures" },
	averageCompliance: { value: 78.3, delta: 4.6 },
	meetingTarget: { value: 38, pct: 52.8, delta: 6 },
	belowTarget: { value: 34, pct: 47.2, delta: -5 },
	readyForSubmission: { value: 41, pct: 56.9, delta: 7 },
	dataSources: {
		value: 8,
		hint: "(FHIR, Claims, Enc, Labs, Rx)",
	},
} as const;

export const MCR_MEASURES: MeasureComparisonRow[] = [
	{
		code: "CBP",
		name: "Controlling High Blood Pressure",
		domain: "Effectiveness of Care",
		complianceRate: 77.8,
		target: 80,
		percentile: 68,
		gapToTarget: -2.2,
		trend: "up",
	},
	{
		code: "FUA",
		name: "Follow-Up After ED Visit for Mental Illness",
		domain: "Access / Availability of Care",
		complianceRate: 52.1,
		target: 70,
		percentile: 41,
		gapToTarget: -17.9,
		trend: "down",
	},
	{
		code: "CDC",
		name: "Comprehensive Diabetes Care",
		domain: "Effectiveness of Care",
		complianceRate: 71.4,
		target: 75,
		percentile: 55,
		gapToTarget: -3.6,
		trend: "flat",
	},
	{
		code: "COL",
		name: "Colorectal Cancer Screening",
		domain: "Preventive Care",
		complianceRate: 62.7,
		target: 80,
		percentile: 48,
		gapToTarget: -17.3,
		trend: "down",
	},
	{
		code: "BCS",
		name: "Breast Cancer Screening",
		domain: "Preventive Care",
		complianceRate: 68.2,
		target: 80,
		percentile: 52,
		gapToTarget: -11.8,
		trend: "up",
	},
	{
		code: "A1C",
		name: "Hemoglobin A1c Control (<8%)",
		domain: "Effectiveness of Care",
		complianceRate: 64.5,
		target: 75,
		percentile: 46,
		gapToTarget: -10.5,
		trend: "flat",
	},
	{
		code: "CCS",
		name: "Cervical Cancer Screening",
		domain: "Preventive Care",
		complianceRate: 81.6,
		target: 80,
		percentile: 74,
		gapToTarget: 1.6,
		trend: "up",
	},
	{
		code: "WCC",
		name: "Weight Assessment & Counseling for Children",
		domain: "Effectiveness of Care",
		complianceRate: 58.9,
		target: 70,
		percentile: 39,
		gapToTarget: -11.1,
		trend: "down",
	},
];

export const MCR_COMPLIANCE_DISTRIBUTION: ComplianceBand[] = [
	{
		label: "Excellent",
		range: "≥ 80%",
		count: 24,
		pct: 33.3,
		color: "#22c55e",
	},
	{
		label: "Good",
		range: "70% – 79%",
		count: 22,
		pct: 30.6,
		color: "#eab308",
	},
	{
		label: "Fair",
		range: "50% – 69%",
		count: 16,
		pct: 22.2,
		color: "#f97316",
	},
	{
		label: "Poor",
		range: "< 50%",
		count: 10,
		pct: 13.9,
		color: "#ef4444",
	},
];

export const MCR_TOP_GAPS = [
	{ code: "COL", gap: -17.3 },
	{ code: "BCS", gap: -11.8 },
	{ code: "CDC", gap: -11.4 },
	{ code: "A1C", gap: -10.5 },
	{ code: "FUA", gap: -9.8 },
] as const;

export const MCR_MEASURE_LIBRARY_HREF =
	"/admin/claim-encounter/regulatory/quality-performance/measure-library";

export type ReadinessStatus = "Ready" | "Needs Review" | "At Risk" | "Not Ready";
export type ComponentStatus = "pass" | "warn" | "fail";

export type ReadinessRow = {
	code: string;
	name: string;
	domain: string;
	score: number;
	status: ReadinessStatus;
	components: {
		dataAvailability: ComponentStatus;
		fhirResources: ComponentStatus;
		logicValidated: ComponentStatus;
		dataQuality: ComponentStatus;
		calculation: ComponentStatus;
		submissionConfig: ComponentStatus;
	};
	lastUpdated: string;
};

export const MCR_READINESS_ROWS: ReadinessRow[] = [
	{
		code: "CBP",
		name: "Controlling High Blood Pressure",
		domain: "Effectiveness of Care",
		score: 92,
		status: "Ready",
		components: {
			dataAvailability: "pass",
			fhirResources: "pass",
			logicValidated: "pass",
			dataQuality: "pass",
			calculation: "pass",
			submissionConfig: "pass",
		},
		lastUpdated: "Jul 30, 2025",
	},
	{
		code: "FUA",
		name: "Follow-Up After ED Visit for Mental Illness",
		domain: "Behavioral Health",
		score: 84,
		status: "Ready",
		components: {
			dataAvailability: "pass",
			fhirResources: "pass",
			logicValidated: "pass",
			dataQuality: "pass",
			calculation: "pass",
			submissionConfig: "pass",
		},
		lastUpdated: "Jul 30, 2025",
	},
	{
		code: "A1C",
		name: "Hemoglobin A1c Control (<8%)",
		domain: "Effectiveness of Care",
		score: 72,
		status: "Needs Review",
		components: {
			dataAvailability: "pass",
			fhirResources: "pass",
			logicValidated: "pass",
			dataQuality: "warn",
			calculation: "pass",
			submissionConfig: "pass",
		},
		lastUpdated: "Jul 29, 2025",
	},
	{
		code: "BCS",
		name: "Breast Cancer Screening",
		domain: "Preventive Care",
		score: 68,
		status: "Needs Review",
		components: {
			dataAvailability: "pass",
			fhirResources: "warn",
			logicValidated: "pass",
			dataQuality: "warn",
			calculation: "pass",
			submissionConfig: "pass",
		},
		lastUpdated: "Jul 28, 2025",
	},
	{
		code: "COL",
		name: "Colorectal Cancer Screening",
		domain: "Preventive Care",
		score: 45,
		status: "At Risk",
		components: {
			dataAvailability: "warn",
			fhirResources: "warn",
			logicValidated: "warn",
			dataQuality: "warn",
			calculation: "warn",
			submissionConfig: "fail",
		},
		lastUpdated: "Jul 27, 2025",
	},
	{
		code: "WCC",
		name: "Weight Assessment & Counseling for Children",
		domain: "Care Coordination",
		score: 38,
		status: "Not Ready",
		components: {
			dataAvailability: "warn",
			fhirResources: "fail",
			logicValidated: "warn",
			dataQuality: "fail",
			calculation: "warn",
			submissionConfig: "fail",
		},
		lastUpdated: "Jul 26, 2025",
	},
];

export const MCR_READINESS_SUMMARY = [
	{ label: "Ready", count: 41, pct: 56.9, color: "#22c55e" },
	{ label: "Needs Review", count: 17, pct: 23.6, color: "#eab308" },
	{ label: "At Risk", count: 9, pct: 12.5, color: "#f97316" },
	{ label: "Not Ready", count: 5, pct: 6.9, color: "#ef4444" },
] as const;

export const MCR_READINESS_BY_DOMAIN = [
	{ domain: "Effectiveness of Care", score: 82 },
	{ domain: "Preventive Care", score: 75 },
	{ domain: "Behavioral Health", score: 68 },
	{ domain: "Care Coordination", score: 62 },
] as const;
