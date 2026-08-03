export type ProviderStatus = "active" | "inactive" | "pending" | "termed";
export type NetworkStatus = "in_network" | "out_of_network" | "pending";
export type CredentialStatus = "complete" | "expiring" | "expired" | "pending";
export type ExceptionStatus = "open" | "in_progress" | "resolved";
export type FeedStatus = "active" | "warning" | "inactive";

export type ProviderSummary = {
	id: string;
	npi: string;
	name: string;
	credentials: string;
	specialty: string;
	subspecialty: string;
	taxId: string;
	upin: string;
	medicaidId: string;
	status: ProviderStatus;
	program: "MDH" | "DHCF" | "BHP";
	providerType: "Individual" | "Group" | "Facility";
	gender: "Male" | "Female" | "Other" | "Unknown";
	dob: string;
	yearsInPractice: number;
	practiceName: string;
	practiceAddress: string;
	practicePhone: string;
	enrollmentStatus: "enrolled" | "pending" | "terminated";
	enrollmentEffective: string;
	claims12m: number;
	encounters12m: number;
	billed12m: number;
	paid12m: number;
	rejectionRate: number;
	netPayment12m: number;
};

export type ProviderLocation = {
	id: string;
	name: string;
	address: string;
	phone: string;
	status: ProviderStatus;
	isPrimary: boolean;
};

export type NetworkParticipation = {
	id: string;
	networkPlan: string;
	payer: string;
	status: NetworkStatus;
	effectiveDate: string;
	endDate: string | null;
};

export type ProviderIdentifier = {
	id: string;
	label: string;
	value: string;
};

export type MonthlyVolume = {
	month: string;
	claims: number;
	encounters: number;
	rejectionRate: number;
	rejectionCount: number;
};

export type RejectionReason = {
	id: string;
	reason: string;
	count: number;
	pct: number;
};

export type VendorAssociation = {
	id: string;
	vendor: string;
	fileType: string;
	dataSent: string;
	frequency: string;
	lastReceived: string;
	status: FeedStatus;
};

export type CredentialItem = {
	id: string;
	label: string;
	status: CredentialStatus;
};

export type ProviderException = {
	id: string;
	exceptionType: string;
	description: string;
	status: ExceptionStatus;
	dateIdentified: string;
};

export type ProviderDetail = ProviderSummary & {
	stateLicense: string;
	deaNumber: string;
	locations: ProviderLocation[];
	networks: NetworkParticipation[];
	identifiers: ProviderIdentifier[];
	monthlyVolume: MonthlyVolume[];
	rejectionReasons: RejectionReason[];
	vendors: VendorAssociation[];
	credentialing: CredentialItem[];
	exceptions: ProviderException[];
	claimsTrendPct: number;
	encountersTrendPct: number;
	billedTrendPct: number;
	paidTrendPct: number;
	rejectionTrendPct: number;
	netPaymentTrendPct: number;
	dataAsOf: string;
};

const SPECIALTIES = [
	["Internal Medicine", "Primary Care"],
	["Family Medicine", "Primary Care"],
	["Cardiology", "Interventional"],
	["Pediatrics", "General Pediatrics"],
	["Orthopedic Surgery", "Sports Medicine"],
	["Psychiatry", "Adult"],
	["OB/GYN", "General"],
	["Dermatology", "Medical"],
	["Neurology", "General"],
	["Emergency Medicine", "Emergency"],
] as const;

const PRACTICES = [
	"Smith Medical Group, LLC",
	"Capitol Health Associates",
	"District Care Partners",
	"Potomac Specialty Clinic",
	"Anacostia Family Practice",
	"Georgetown Medical Associates",
];

const NAMES = [
	["John", "Smith", "MD"],
	["Maria", "Garcia", "MD"],
	["James", "Williams", "DO"],
	["Aisha", "Hassan", "MD"],
	["Robert", "Johnson", "MD"],
	["Sofia", "Martinez", "NP"],
	["Daniel", "Brown", "MD"],
	["Fatima", "Ali", "MD"],
	["Michael", "Davis", "MD"],
	["Elena", "Nguyen", "DO"],
	["David", "Wilson", "MD"],
	["Amara", "Bekele", "MD"],
	["Christopher", "Anderson", "PA"],
	["Nia", "Okoro", "MD"],
	["Anthony", "Thomas", "MD"],
	["Grace", "Lee", "MD"],
	["Kevin", "Jackson", "DO"],
	["Hannah", "Patel", "MD"],
	["Brian", "White", "MD"],
	["Olivia", "Kim", "MD"],
	["Samuel", "Reed", "MD"],
	["Chloe", "Bennett", "NP"],
	["Ethan", "Carter", "MD"],
	["Isabella", "Wright", "MD"],
];

const PROGRAMS: Array<"MDH" | "DHCF" | "BHP"> = ["MDH", "DHCF", "BHP"];
const MONTHS = [
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
];

function buildSummaries(): ProviderSummary[] {
	return NAMES.map(([first, last, cred], i) => {
		const [specialty, subspecialty] = SPECIALTIES[i % SPECIALTIES.length]!;
		const program = PROGRAMS[i % 3]!;
		const status: ProviderStatus =
			i % 11 === 0 ? "termed" : i % 9 === 0 ? "pending" : i % 7 === 0 ? "inactive" : "active";
		const claims = 4200 + ((i * 317) % 6000);
		const encounters = Math.round(claims * 0.84);
		const billed = 1_800_000 + i * 95_000 + ((i * 12345) % 400_000);
		const paid = Math.round(billed * 0.755);
		const rejectionRate = 4.2 + ((i * 0.37) % 5);
		return {
			id: `prov-${i + 1}`,
			npi: String(1000000000 + i * 1117 + 234567890).slice(0, 10),
			name: `${first} ${last}`,
			credentials: cred,
			specialty,
			subspecialty,
			taxId: `${12 + (i % 80)}-${1000000 + i * 137}`.slice(0, 10),
			upin: `A${String(10000 + i * 17).slice(0, 5)}`,
			medicaidId: `DC-MD-${String(240000 + i).padStart(6, "0")}`,
			status,
			program,
			providerType: i % 8 === 0 ? "Group" : "Individual",
			gender: i % 2 === 0 ? "Male" : "Female",
			dob: `19${60 + (i % 25)}-${String((i % 12) + 1).padStart(2, "0")}-${String(10 + (i % 18)).padStart(2, "0")}`,
			yearsInPractice: 8 + (i % 25),
			practiceName: PRACTICES[i % PRACTICES.length]!,
			practiceAddress: `${100 + i * 11} ${["K St NW", "M St NE", "Connecticut Ave", "Georgia Ave"][i % 4]}, Washington, DC 200${10 + (i % 40)}`,
			practicePhone: `(202) ${555 + (i % 40)}-${2000 + ((i * 13) % 7000)}`,
			enrollmentStatus:
				status === "termed" ? "terminated" : status === "pending" ? "pending" : "enrolled",
			enrollmentEffective: `202${i % 4}-0${(i % 8) + 1}-15`,
			claims12m: claims,
			encounters12m: encounters,
			billed12m: billed,
			paid12m: paid,
			rejectionRate: Math.round(rejectionRate * 100) / 100,
			netPayment12m: Math.round(paid * 0.89),
		};
	});
}

export const PROVIDER_SUMMARIES: ProviderSummary[] = buildSummaries();

// Match mockup hero provider
(() => {
	const john = PROVIDER_SUMMARIES[0]!;
	john.name = "John Smith";
	john.credentials = "MD";
	john.specialty = "Internal Medicine";
	john.subspecialty = "Primary Care";
	john.npi = "1234567890";
	john.taxId = "12-3456789";
	john.upin = "A12345";
	john.medicaidId = "DC-MD-88421";
	john.status = "active";
	john.program = "DHCF";
	john.providerType = "Individual";
	john.gender = "Male";
	john.dob = "1972-04-18";
	john.yearsInPractice = 18;
	john.practiceName = "Smith Medical Group, LLC";
	john.practiceAddress = "1842 K Street NW, Suite 400, Washington, DC 20006";
	john.practicePhone = "(202) 555-0198";
	john.enrollmentStatus = "enrolled";
	john.enrollmentEffective = "2022-01-15";
	john.claims12m = 8432;
	john.encounters12m = 7103;
	john.billed12m = 4238512.45;
	john.paid12m = 3204551.32;
	john.rejectionRate = 6.72;
	john.netPayment12m = 2856422.18;
})();

function detailFor(summary: ProviderSummary): ProviderDetail {
	const isJohn = summary.id === "prov-1";
	const monthlyVolume: MonthlyVolume[] = MONTHS.map((month, i) => {
		const base = isJohn ? 620 : 280 + (summary.claims12m % 200);
		const claims = base + ((i * 37 + summary.claims12m) % 180);
		const encounters = Math.round(claims * (0.78 + (i % 5) * 0.02));
		const rejectionRate = isJohn
			? 5.2 + (i % 6) * 0.35 + (i === 10 ? 1.2 : 0)
			: 4 + (i % 5) * 0.5;
		return {
			month,
			claims,
			encounters,
			rejectionRate: Math.round(rejectionRate * 100) / 100,
			rejectionCount: Math.round((claims * rejectionRate) / 100),
		};
	});

	const rejectionReasons: RejectionReason[] = [
		{ id: "rr1", reason: "Invalid member ID", count: isJohn ? 184 : 42, pct: 22.4 },
		{ id: "rr2", reason: "Missing authorization", count: isJohn ? 156 : 38, pct: 19.0 },
		{ id: "rr3", reason: "Duplicate claim", count: isJohn ? 121 : 29, pct: 14.7 },
		{ id: "rr4", reason: "Coding / diagnosis error", count: isJohn ? 98 : 24, pct: 11.9 },
		{ id: "rr5", reason: "Timely filing", count: isJohn ? 76 : 18, pct: 9.2 },
	];

	return {
		...summary,
		stateLicense: `MD${34000 + Number(summary.id.replace(/\D/g, ""))}`,
		deaNumber: `BS${2000000 + Number(summary.id.replace(/\D/g, "")) * 17}`,
		claimsTrendPct: isJohn ? 12.4 : 8.1,
		encountersTrendPct: isJohn ? 10.8 : 7.4,
		billedTrendPct: isJohn ? 14.6 : 9.2,
		paidTrendPct: isJohn ? 13.1 : 8.8,
		rejectionTrendPct: isJohn ? -1.18 : -0.4,
		netPaymentTrendPct: isJohn ? 12.7 : 7.9,
		dataAsOf: "07/28/2026 08:30 AM ET",
		locations: [
			{
				id: "loc1",
				name: summary.practiceName,
				address: summary.practiceAddress,
				phone: summary.practicePhone,
				status: "active",
				isPrimary: true,
			},
			{
				id: "loc2",
				name: `${summary.name.split(" ")[1]} Satellite Clinic`,
				address: "900 New York Ave NW, Washington, DC 20001",
				phone: "(202) 555-0288",
				status: "active",
				isPrimary: false,
			},
			{
				id: "loc3",
				name: "Telehealth Location",
				address: "Virtual — DC Licensed",
				phone: summary.practicePhone,
				status: summary.status === "active" ? "active" : "inactive",
				isPrimary: false,
			},
		],
		networks: [
			{
				id: "n1",
				networkPlan: "MedStar Family Choice DC",
				payer: "MedStar",
				status: "in_network",
				effectiveDate: "2022-01-15",
				endDate: null,
			},
			{
				id: "n2",
				networkPlan: "AmeriHealth Caritas DC",
				payer: "AmeriHealth",
				status: "in_network",
				effectiveDate: "2021-07-01",
				endDate: null,
			},
			{
				id: "n3",
				networkPlan: "CareFirst Community",
				payer: "CareFirst",
				status: "in_network",
				effectiveDate: "2020-03-01",
				endDate: null,
			},
			{
				id: "n4",
				networkPlan: "UnitedHealthcare Community",
				payer: "UHC",
				status: "out_of_network",
				effectiveDate: "2019-01-01",
				endDate: "2023-12-31",
			},
			{
				id: "n5",
				networkPlan: "Kaiser Permanente Medicaid",
				payer: "Kaiser",
				status: "in_network",
				effectiveDate: "2023-06-01",
				endDate: null,
			},
			{
				id: "n6",
				networkPlan: "DC Healthy Families",
				payer: "DHCF",
				status: "pending",
				effectiveDate: "2026-08-01",
				endDate: null,
			},
		],
		identifiers: [
			{ id: "i1", label: "NPI", value: summary.npi },
			{ id: "i2", label: "Tax ID (TIN)", value: summary.taxId },
			{ id: "i3", label: "UPIN", value: summary.upin },
			{ id: "i4", label: "Medicaid ID", value: summary.medicaidId },
			{
				id: "i5",
				label: "State License",
				value: `MD${34000 + Number(summary.id.replace(/\D/g, ""))}`,
			},
			{
				id: "i6",
				label: "DEA Number",
				value: `BS${2000000 + Number(summary.id.replace(/\D/g, "")) * 17}`,
			},
		],
		monthlyVolume,
		rejectionReasons,
		vendors: [
			{
				id: "v1",
				vendor: "UST",
				fileType: "837 Professional",
				dataSent: "Claims",
				frequency: "Daily",
				lastReceived: "2026-07-28 06:14",
				status: "active",
			},
			{
				id: "v2",
				vendor: "Beacon Health",
				fileType: "837 Institutional",
				dataSent: "Claims",
				frequency: "Daily",
				lastReceived: "2026-07-27 18:02",
				status: "active",
			},
			{
				id: "v3",
				vendor: "Cascade Net",
				fileType: "837 Encounter",
				dataSent: "Encounters",
				frequency: "Weekly",
				lastReceived: "2026-07-25 09:41",
				status: "warning",
			},
			{
				id: "v4",
				vendor: "CVS",
				fileType: "NCPDP",
				dataSent: "Pharmacy",
				frequency: "Daily",
				lastReceived: "2026-07-28 07:05",
				status: "active",
			},
		],
		credentialing: [
			{ id: "c1", label: "Medical License", status: "complete" },
			{ id: "c2", label: "DEA Registration", status: "complete" },
			{ id: "c3", label: "Board Certification", status: "complete" },
			{ id: "c4", label: "Malpractice Insurance", status: "expiring" },
			{ id: "c5", label: "Hospital Privileges", status: "complete" },
			{ id: "c6", label: "CAQH Profile", status: "complete" },
			{ id: "c7", label: "Background Check", status: "complete" },
			{ id: "c8", label: "OIG Exclusion", status: "complete" },
			{ id: "c9", label: "NPI Verification", status: "complete" },
			{ id: "c10", label: "Education Verification", status: "complete" },
			{ id: "c11", label: "Work History", status: "complete" },
			{ id: "c12", label: "Peer References", status: "complete" },
			{ id: "c13", label: "CMS Opt-Out", status: "complete" },
			{ id: "c14", label: "CLIA Certificate", status: "complete" },
			{ id: "c15", label: "CPR Certification", status: "expiring" },
			{ id: "c16", label: "Immunization Record", status: "complete" },
		],
		exceptions: isJohn
			? [
					{
						id: "ex1",
						exceptionType: "Credential Expiring",
						description: "Malpractice insurance expires within 60 days",
						status: "open",
						dateIdentified: "2026-07-10",
					},
					{
						id: "ex2",
						exceptionType: "Network Pending",
						description: "DC Healthy Families participation pending payer response",
						status: "open",
						dateIdentified: "2026-06-22",
					},
					{
						id: "ex3",
						exceptionType: "Address Update",
						description: "Satellite clinic address pending NPPES sync",
						status: "in_progress",
						dateIdentified: "2026-07-01",
					},
				]
			: summary.status === "pending"
				? [
						{
							id: "ex1",
							exceptionType: "Enrollment Pending",
							description: "Initial credentialing packet incomplete",
							status: "open",
							dateIdentified: "2026-07-15",
						},
					]
				: [],
	};
}

export const PROVIDER_DETAILS: Record<string, ProviderDetail> = Object.fromEntries(
	PROVIDER_SUMMARIES.map((s) => [s.id, detailFor(s)])
);

export function displayProviderName(p: Pick<ProviderSummary, "name" | "credentials">) {
	return `${p.name}, ${p.credentials}`;
}

export function getProvider(idOrNpi: string): ProviderDetail | undefined {
	const decoded = decodeURIComponent(idOrNpi);
	const byId = PROVIDER_DETAILS[decoded];
	if (byId) return byId;
	const summary = PROVIDER_SUMMARIES.find(
		(p) => p.id === decoded || p.npi === decoded
	);
	return summary ? PROVIDER_DETAILS[summary.id] : undefined;
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
	if (iso.includes("/")) return iso;
	const [y, m, d] = iso.split("-");
	if (!y || !m || !d) return iso;
	return `${m}/${d}/${y}`;
}

export function formatCompact(value: number) {
	return value.toLocaleString("en-US");
}

export function initials(name: string) {
	const parts = name.trim().split(/\s+/);
	return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}
