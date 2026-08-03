export type MemberStatus = "active" | "inactive" | "pending" | "termed";
export type EligibilityStatus =
	| "eligible"
	| "termed"
	| "pending"
	| "ineligible";
export type ClaimStatus = "paid" | "denied" | "pending" | "partial";
export type ExceptionStatus = "open" | "in_progress" | "resolved";

export type MemberSummary = {
	id: string;
	memberId: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	dob: string;
	gender: "Male" | "Female" | "Other" | "Unknown";
	ssnLast4: string;
	phone: string;
	email: string;
	addressLine1: string;
	addressLine2?: string;
	city: string;
	state: string;
	zip: string;
	status: MemberStatus;
	program: "MDH" | "DHCF" | "BHP";
	planName: string;
	planType: string;
	lob: string;
	pcpName: string;
	pcpNpi: string;
	memberSince: string;
	lastClaimDate: string | null;
	claimsYtd: number;
	paidYtd: number;
	vendorSource: string;
};

export type EligibilityHistoryRow = {
	id: string;
	startDate: string;
	endDate: string | null;
	status: EligibilityStatus;
	source: string;
	groupCaseId: string;
};

export type PlanHistoryRow = {
	id: string;
	planName: string;
	planType: string;
	startDate: string;
	endDate: string | null;
};

export type DependentRow = {
	id: string;
	name: string;
	relationship: "Self" | "Spouse" | "Daughter" | "Son" | "Other";
	dob: string;
	gender: string;
	coverageStatus: MemberStatus;
	memberId?: string;
};

export type MemberClaimRow = {
	id: string;
	dos: string;
	claimNumber: string;
	type: "Medical" | "Pharmacy" | "Dental" | "Vision" | "Encounter";
	provider: string;
	billed: number;
	paid: number;
	status: ClaimStatus;
};

export type AccumulatorRow = {
	id: string;
	label: string;
	individual: number;
	family: number;
	remaining: number;
	limit: number;
};

export type VendorSourceRow = {
	id: string;
	vendor: string;
	fileFeedType: string;
	lastReceived: string;
	status: "success" | "warning" | "failed";
};

export type EligibilityExceptionRow = {
	id: string;
	exceptionType: string;
	description: string;
	startDetected: string;
	status: ExceptionStatus;
	source: string;
	resolution: string;
};

export type MemberAlert = {
	id: string;
	severity: "warning" | "error" | "info";
	title: string;
	hrefLabel: string;
};

export type MemberDetail = MemberSummary & {
	eligibilityStatus: EligibilityStatus;
	coverageStart: string;
	coverageEnd: string | null;
	planId: string;
	alerts: MemberAlert[];
	eligibilityHistory: EligibilityHistoryRow[];
	planHistory: PlanHistoryRow[];
	dependents: DependentRow[];
	claims: MemberClaimRow[];
	encounters: MemberClaimRow[];
	accumulators: AccumulatorRow[];
	vendorHistory: VendorSourceRow[];
	exceptions: EligibilityExceptionRow[];
};

function money(n: number) {
	return n;
}

const FIRST = [
	"John",
	"Maria",
	"James",
	"Aisha",
	"Robert",
	"Sofia",
	"Daniel",
	"Fatima",
	"Michael",
	"Elena",
	"David",
	"Amara",
	"Christopher",
	"Nia",
	"Anthony",
	"Grace",
	"Kevin",
	"Hannah",
	"Brian",
	"Olivia",
];
const LAST = [
	"Doe",
	"Garcia",
	"Williams",
	"Hassan",
	"Johnson",
	"Martinez",
	"Brown",
	"Ali",
	"Davis",
	"Nguyen",
	"Wilson",
	"Bekele",
	"Anderson",
	"Okoro",
	"Thomas",
	"Lee",
	"Jackson",
	"Patel",
	"White",
	"Kim",
];
const PLANS = [
	"MedStar Family Choice DC",
	"AmeriHealth Caritas DC",
	"CareFirst Community Health",
	"UnitedHealthcare Community",
	"Kaiser Permanente Medicaid",
];
const VENDORS = ["UST", "CVS", "Avesis", "Beacon Health", "Cascade Net"];
const PROGRAMS: Array<"MDH" | "DHCF" | "BHP"> = ["MDH", "DHCF", "BHP"];

function pad(n: number, w = 8) {
	return String(n).padStart(w, "0");
}

function buildSummaries(): MemberSummary[] {
	const rows: MemberSummary[] = [];
	for (let i = 0; i < 28; i++) {
		const first = FIRST[i % FIRST.length]!;
		const last = LAST[i % LAST.length]!;
		const program = PROGRAMS[i % 3]!;
		const status: MemberStatus =
			i % 11 === 0
				? "termed"
				: i % 9 === 0
					? "pending"
					: i % 7 === 0
						? "inactive"
						: "active";
		const day = String(10 + (i % 18)).padStart(2, "0");
		rows.push({
			id: `mem-${i + 1}`,
			memberId: `MFC-${pad(2401000 + i, 7)}`,
			firstName: first,
			middleName: i === 0 ? "Michael" : undefined,
			lastName: last,
			dob: `19${70 + (i % 30)}-${String((i % 12) + 1).padStart(2, "0")}-${day}`,
			gender: i % 2 === 0 ? "Male" : "Female",
			ssnLast4: String(1000 + ((i * 37) % 9000)).slice(-4),
			phone: `(202) ${555 + (i % 40)}-${1000 + ((i * 11) % 9000)}`,
			email: `${first.toLowerCase()}.${last.toLowerCase()}@email.com`,
			addressLine1: `${100 + i * 7} ${["M St NW", "K St NE", "Rhode Island Ave", "Georgia Ave", "H St NE"][i % 5]}`,
			city: "Washington",
			state: "DC",
			zip: `200${10 + (i % 40)}`,
			status,
			program,
			planName: PLANS[i % PLANS.length]!,
			planType: "Medicaid",
			lob: i % 4 === 0 ? "Pharmacy" : "Medical",
			pcpName: [
				"Jane Smith, MD",
				"Omar Khalil, MD",
				"Lisa Chen, MD",
				"Marcus Reed, MD",
			][i % 4]!,
			pcpNpi: `1${pad(234567890 + i, 9)}`.slice(0, 10),
			memberSince: `20${10 + (i % 14)}-0${(i % 8) + 1}-15`,
			lastClaimDate: status === "pending" ? null : `2026-07-${day}`,
			claimsYtd: 2 + ((i * 3) % 18),
			paidYtd: money(1200 + i * 340 + ((i * 17) % 900)),
			vendorSource: VENDORS[i % VENDORS.length]!,
		});
	}
	// Override first member to match mockup
	const john = rows[0]!;
	john.firstName = "John";
	john.middleName = "Michael";
	john.lastName = "Doe";
	john.memberId = "MFC-2401842";
	john.dob = "1985-03-14";
	john.gender = "Male";
	john.ssnLast4 = "6789";
	john.phone = "(202) 555-0142";
	john.email = "john.doe@email.com";
	john.addressLine1 = "1842 Rhode Island Ave NW";
	john.addressLine2 = "Apt 4B";
	john.city = "Washington";
	john.state = "DC";
	john.zip = "20036";
	john.status = "active";
	john.program = "DHCF";
	john.planName = "MedStar Family Choice DC";
	john.planType = "Medicaid";
	john.lob = "Medical";
	john.pcpName = "Jane Smith, MD";
	john.pcpNpi = "1234567890";
	john.memberSince = "2019-06-01";
	john.lastClaimDate = "2026-07-22";
	john.claimsYtd = 14;
	john.paidYtd = 12840.5;
	john.vendorSource = "UST";
	return rows;
}

export const MEMBER_SUMMARIES: MemberSummary[] = buildSummaries();

function detailFor(summary: MemberSummary): MemberDetail {
	const isJohn = summary.id === "mem-1";
	return {
		...summary,
		eligibilityStatus: summary.status === "termed" ? "termed" : "eligible",
		coverageStart: isJohn
			? "2026-01-01"
			: `${summary.memberSince.slice(0, 4)}-01-01`,
		coverageEnd: summary.status === "termed" ? "2026-06-30" : null,
		planId: isJohn
			? "MFC-DC-MED-001"
			: `PLAN-${summary.program}-00${summary.id.slice(-1)}`,
		alerts: isJohn
			? [
					{
						id: "a1",
						severity: "warning",
						title: "1 Eligibility Exception",
						hrefLabel: "View details",
					},
					{
						id: "a2",
						severity: "warning",
						title: "2 Open Claim Denials",
						hrefLabel: "View details",
					},
					{
						id: "a3",
						severity: "info",
						title: "PCP attribution updated",
						hrefLabel: "View details",
					},
				]
			: summary.status === "pending"
				? [
						{
							id: "a1",
							severity: "warning",
							title: "Eligibility verification pending",
							hrefLabel: "View details",
						},
					]
				: [],
		eligibilityHistory: [
			{
				id: "eh1",
				startDate: isJohn ? "2026-01-01" : "2025-01-01",
				endDate: null,
				status: "eligible",
				source: "834 Eligibility",
				groupCaseId: isJohn ? "CASE-DC-88211" : `CASE-${summary.program}-100`,
			},
			{
				id: "eh2",
				startDate: "2024-01-01",
				endDate: "2025-12-31",
				status: "eligible",
				source: "834 Eligibility",
				groupCaseId: isJohn ? "CASE-DC-77102" : `CASE-${summary.program}-090`,
			},
			{
				id: "eh3",
				startDate: "2023-01-01",
				endDate: "2023-12-31",
				status: "termed",
				source: "Manual",
				groupCaseId: isJohn ? "CASE-DC-66001" : `CASE-${summary.program}-080`,
			},
		],
		planHistory: [
			{
				id: "ph1",
				planName: summary.planName,
				planType: summary.planType,
				startDate: isJohn ? "2024-01-01" : summary.memberSince,
				endDate: null,
			},
			{
				id: "ph2",
				planName: "Legacy Medicaid Plan",
				planType: "Medicaid",
				startDate: "2021-01-01",
				endDate: isJohn ? "2023-12-31" : "2023-12-31",
			},
		],
		dependents: isJohn
			? [
					{
						id: "d1",
						name: "John Michael Doe",
						relationship: "Self",
						dob: "1985-03-14",
						gender: "Male",
						coverageStatus: "active",
						memberId: summary.memberId,
					},
					{
						id: "d2",
						name: "Sarah Anne Doe",
						relationship: "Spouse",
						dob: "1987-09-02",
						gender: "Female",
						coverageStatus: "active",
						memberId: "MFC-2401843",
					},
					{
						id: "d3",
						name: "Emily Rose Doe",
						relationship: "Daughter",
						dob: "2014-05-21",
						gender: "Female",
						coverageStatus: "active",
						memberId: "MFC-2401844",
					},
					{
						id: "d4",
						name: "Noah James Doe",
						relationship: "Son",
						dob: "2018-11-08",
						gender: "Male",
						coverageStatus: "active",
						memberId: "MFC-2401845",
					},
				]
			: [
					{
						id: "d1",
						name: displayName(summary),
						relationship: "Self",
						dob: summary.dob,
						gender: summary.gender,
						coverageStatus: summary.status,
						memberId: summary.memberId,
					},
				],
		claims: [
			{
				id: "c1",
				dos: "2026-07-22",
				claimNumber: "CLM-9001842",
				type: "Medical",
				provider: "MedStar Washington Hospital",
				billed: 2450,
				paid: 1820.4,
				status: "paid",
			},
			{
				id: "c2",
				dos: "2026-06-14",
				claimNumber: "CLM-9001620",
				type: "Pharmacy",
				provider: "CVS Pharmacy #4421",
				billed: 186.5,
				paid: 42.1,
				status: "paid",
			},
			{
				id: "c3",
				dos: "2026-05-03",
				claimNumber: "CLM-9001401",
				type: "Medical",
				provider: "Jane Smith, MD",
				billed: 320,
				paid: 0,
				status: "denied",
			},
			{
				id: "c4",
				dos: "2026-04-18",
				claimNumber: "CLM-9001288",
				type: "Medical",
				provider: "Capital Radiology",
				billed: 980,
				paid: 640,
				status: "paid",
			},
			{
				id: "c5",
				dos: "2026-03-09",
				claimNumber: "CLM-9001102",
				type: "Pharmacy",
				provider: "Walgreens #201",
				billed: 64.2,
				paid: 0,
				status: "denied",
			},
		],
		encounters: [
			{
				id: "e1",
				dos: "2026-07-10",
				claimNumber: "ENC-550214",
				type: "Encounter",
				provider: "Community Health Center",
				billed: 0,
				paid: 0,
				status: "paid",
			},
			{
				id: "e2",
				dos: "2026-05-28",
				claimNumber: "ENC-550188",
				type: "Encounter",
				provider: "Jane Smith, MD",
				billed: 0,
				paid: 0,
				status: "paid",
			},
			{
				id: "e3",
				dos: "2026-04-02",
				claimNumber: "ENC-550144",
				type: "Encounter",
				provider: "Urgent Care NW",
				billed: 0,
				paid: 0,
				status: "pending",
			},
			{
				id: "e4",
				dos: "2026-02-19",
				claimNumber: "ENC-550101",
				type: "Encounter",
				provider: "Behavioral Health Partners",
				billed: 0,
				paid: 0,
				status: "paid",
			},
			{
				id: "e5",
				dos: "2026-01-08",
				claimNumber: "ENC-550066",
				type: "Encounter",
				provider: "Vision Care DC",
				billed: 0,
				paid: 0,
				status: "paid",
			},
		],
		accumulators: [
			{
				id: "ac1",
				label: "Deductible",
				individual: 250,
				family: 500,
				remaining: 0,
				limit: 250,
			},
			{
				id: "ac2",
				label: "Out of Pocket Max",
				individual: 1840,
				family: 3200,
				remaining: 1660,
				limit: 3500,
			},
			{
				id: "ac3",
				label: "Pharmacy Deductible",
				individual: 50,
				family: 100,
				remaining: 0,
				limit: 50,
			},
		],
		vendorHistory: [
			{
				id: "vh1",
				vendor: summary.vendorSource,
				fileFeedType: "834 Eligibility",
				lastReceived: "2026-07-28 06:14",
				status: "success",
			},
			{
				id: "vh2",
				vendor: "Beacon Health",
				fileFeedType: "837 Claims",
				lastReceived: "2026-07-27 18:02",
				status: "success",
			},
			{
				id: "vh3",
				vendor: "CVS",
				fileFeedType: "NCPDP Pharmacy",
				lastReceived: "2026-07-26 09:41",
				status: "warning",
			},
			{
				id: "vh4",
				vendor: "Avesis",
				fileFeedType: "837 Vision",
				lastReceived: "2026-07-20 11:05",
				status: "success",
			},
		],
		exceptions: buildExceptions(summary),
	};
}

function buildExceptions(summary: MemberSummary): EligibilityExceptionRow[] {
	const seq = Number(summary.id.replace(/\D/g, "")) || 1;
	const catalog: EligibilityExceptionRow[] = [
		{
			id: `${summary.id}-ex1`,
			exceptionType: "Coverage Gap",
			description: "Short eligibility gap detected between plan years",
			startDetected: "2026-01-02",
			status: "open",
			source: "834 Eligibility",
			resolution:
				"Pending case worker review — verify continuous coverage letter",
		},
		{
			id: `${summary.id}-ex2`,
			exceptionType: "Address Mismatch",
			description: "Mailing address differs from enrollment file",
			startDetected: "2026-06-15",
			status: "in_progress",
			source: "Manual",
			resolution: "Member contacted; awaiting updated proof of residence",
		},
		{
			id: `${summary.id}-ex3`,
			exceptionType: "Duplicate Enrollment",
			description:
				"Member appears under two active Medicaid IDs for the same period",
			startDetected: "2026-05-08",
			status: "open",
			source: "834 Eligibility",
			resolution: "Merge request submitted to enrollment ops",
		},
		{
			id: `${summary.id}-ex4`,
			exceptionType: "PCP Attribution Error",
			description: "Assigned PCP NPI does not match network roster",
			startDetected: "2026-07-12",
			status: "in_progress",
			source: "Provider Roster",
			resolution: "Roster sync in progress; temporary PCP assigned",
		},
		{
			id: `${summary.id}-ex5`,
			exceptionType: "SSN Verification Failed",
			description:
				"SSN check returned no match against SSA verification service",
			startDetected: "2026-04-21",
			status: "open",
			source: "Identity Service",
			resolution: "Awaiting corrected SSN documentation from member",
		},
		{
			id: `${summary.id}-ex6`,
			exceptionType: "Plan Code Invalid",
			description:
				"Inbound 834 plan code not mapped to an active benefit package",
			startDetected: "2026-03-30",
			status: "resolved",
			source: "834 Eligibility",
			resolution: "Mapped to replacement plan code effective 04/01/2026",
		},
		{
			id: `${summary.id}-ex7`,
			exceptionType: "Pending Verification",
			description: "New enrollment awaiting document verification",
			startDetected: "2026-07-01",
			status: "open",
			source: "834 Eligibility",
			resolution: "Waiting on identity documents",
		},
		{
			id: `${summary.id}-ex8`,
			exceptionType: "Date of Birth Conflict",
			description: "DOB on eligibility file conflicts with claims history",
			startDetected: "2026-06-28",
			status: "open",
			source: "Claims Crosswalk",
			resolution: "Case opened with enrollment to confirm legal DOB",
		},
	];

	if (summary.id === "mem-1") {
		return catalog.slice(0, 2);
	}
	if (summary.status === "pending") {
		return [catalog[6]!, catalog[4]!];
	}
	if (summary.status === "termed") {
		return [
			{
				...catalog[0]!,
				exceptionType: "Termed with Open Auth",
				description: "Coverage termed while prior authorization remains open",
				resolution: "Coordinate auth end-date with utilization management",
			},
			catalog[2]!,
		];
	}

	// Rotate 2–3 exceptions so every active/inactive member has data
	const start = (seq - 1) % (catalog.length - 2);
	const count = 2 + (seq % 2);
	return catalog.slice(start, start + count);
}

export const MEMBER_DETAILS: Record<string, MemberDetail> = Object.fromEntries(
	MEMBER_SUMMARIES.map((s) => [s.id, detailFor(s)])
);

export function displayName(
	m: Pick<MemberSummary, "firstName" | "middleName" | "lastName">
) {
	return [m.firstName, m.middleName, m.lastName].filter(Boolean).join(" ");
}

export function getMember(idOrMemberId: string): MemberDetail | undefined {
	const decoded = decodeURIComponent(idOrMemberId);
	const byId = MEMBER_DETAILS[decoded];
	if (byId) return byId;
	const summary = MEMBER_SUMMARIES.find(
		(m) => m.id === decoded || m.memberId === decoded
	);
	return summary ? MEMBER_DETAILS[summary.id] : undefined;
}

export function formatCurrency(value: number) {
	return value.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 2,
	});
}

export function formatDate(iso: string | null | undefined) {
	if (!iso) return "—";
	const [y, m, d] = iso.split("-");
	if (!y || !m || !d) return iso;
	return `${m}/${d}/${y}`;
}

export function maskSsn(last4: string) {
	return `***-**-${last4}`;
}
