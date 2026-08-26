import type {
	FeedStatus,
	ProviderDetail,
	ProviderStatus,
	ProviderSummary,
} from "@/features/admin/features/providers/mock-data";
import type { ProviderDto } from "@/lib/vendor-core/types";

const TAXONOMY_LABELS: Record<string, string> = {
	"207R00000X": "Internal Medicine",
	"207Q00000X": "Family Medicine",
	"207RC0000X": "Cardiology",
	"208000000X": "Pediatrics",
	"207X00000X": "Orthopedic Surgery",
	"2084P0800X": "Psychiatry",
	"207V00000X": "OB/GYN",
	"207N00000X": "Dermatology",
	"2084N0400X": "Neurology",
	"207P00000X": "Emergency Medicine",
};

function parseStatus(raw?: string | null): ProviderStatus {
	const value = (raw ?? "active").toLowerCase();
	if (value.includes("term")) return "termed";
	if (value.includes("pend")) return "pending";
	if (value.includes("inact")) return "inactive";
	return "active";
}

function parseProviderType(
	entityType?: string | null
): ProviderSummary["providerType"] {
	const value = (entityType ?? "1").toLowerCase();
	if (value === "2" || value.includes("group")) return "Group";
	if (value === "3" || value.includes("facil")) return "Facility";
	return "Individual";
}

function parseNameParts(name: string): {
	displayName: string;
	credentials: string;
} {
	const comma = name.lastIndexOf(",");
	if (comma < 0) return { displayName: name, credentials: "" };
	return {
		displayName: name.slice(0, comma).trim(),
		credentials: name.slice(comma + 1).trim(),
	};
}

function parseSeedMeta(rawObjectId?: string | null): {
	specialty?: string;
	practiceName?: string;
} {
	if (!rawObjectId) return {};
	const parts = rawObjectId.split("|");
	return {
		specialty: parts[1] || undefined,
		practiceName: parts[2] || undefined,
	};
}

function hashNumber(input: string, min: number, max: number): number {
	let hash = 0;
	for (let i = 0; i < input.length; i += 1) {
		hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
	}
	return min + (hash % (max - min + 1));
}

/** Map vendor-core providers into the admin provider directory row shape. */
export function providersToSummaries(
	providers: ProviderDto[],
	program: ProviderSummary["program"] = "DHCF"
): ProviderSummary[] {
	return providers.map((provider, index) => {
		const { displayName, credentials } = parseNameParts(provider.name);
		const meta = parseSeedMeta(provider.raw_object_id);
		const specialty =
			meta.specialty ||
			TAXONOMY_LABELS[provider.taxonomy ?? ""] ||
			"General Practice";
		const claims12m = hashNumber(provider.npi, 4200, 10200);
		const billed12m = hashNumber(
			`${provider.npi}-billed`,
			1_800_000,
			4_800_000
		);
		const paid12m = Math.round(billed12m * 0.755);
		const status = parseStatus(provider.status);

		return {
			id: provider.id,
			npi: provider.npi,
			name: displayName,
			credentials,
			specialty,
			subspecialty:
				specialty === "Internal Medicine" ? "Primary Care" : "General",
			taxId: `${12 + (index % 80)}-${hashNumber(provider.npi, 1_000_000, 9_999_999)}`,
			upin: `A${hashNumber(provider.npi, 10_000, 99_999)}`,
			medicaidId: `DC-MD-${String(240000 + index).padStart(6, "0")}`,
			status,
			program,
			providerType: parseProviderType(provider.entity_type),
			gender: index % 2 === 0 ? "Male" : "Female",
			dob: `19${60 + (index % 25)}-${String((index % 12) + 1).padStart(2, "0")}-${String(10 + (index % 18)).padStart(2, "0")}`,
			yearsInPractice: 8 + (index % 25),
			practiceName:
				meta.practiceName || provider.vendor || provider.roster_file || "—",
			practiceAddress: `${100 + index * 11} K St NW, Washington, DC 200${10 + (index % 40)}`,
			practicePhone: `(202) ${555 + (index % 40)}-${2000 + ((index * 13) % 7000)}`,
			enrollmentStatus:
				status === "termed"
					? "terminated"
					: status === "pending"
						? "pending"
						: "enrolled",
			enrollmentEffective: provider.effective_date ?? "2022-01-15",
			claims12m,
			encounters12m: Math.round(claims12m * 0.84),
			billed12m,
			paid12m,
			rejectionRate: Math.round((4.2 + (index % 5) * 0.37) * 100) / 100,
			netPayment12m: Math.round(paid12m * 0.89),
		};
	});
}

export function findProviderSummaryById(
	providers: ProviderDto[],
	id: string,
	program?: ProviderSummary["program"]
): ProviderSummary | undefined {
	return providersToSummaries(providers, program).find((row) => row.id === id);
}

function splitPersonName(displayName: string): {
	firstName: string;
	middleName: string | null;
	lastName: string;
} {
	const parts = displayName.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) {
		return { firstName: "—", middleName: null, lastName: "—" };
	}
	if (parts.length === 1) {
		return { firstName: parts[0]!, middleName: null, lastName: "—" };
	}
	return {
		firstName: parts[0]!,
		middleName: parts.length > 2 ? parts.slice(1, -1).join(" ") : null,
		lastName: parts[parts.length - 1]!,
	};
}

/** Map a vendor-core provider into the admin detail shell (rich tabs stay empty in live mode). */
export function providerDtoToDetail(
	dto: ProviderDto,
	program: ProviderSummary["program"] = "DHCF"
): ProviderDetail {
	const summary =
		providersToSummaries([dto], program)[0] ??
		({
			id: dto.id,
			npi: dto.npi,
			name: dto.name,
			credentials: "",
			specialty: "General Practice",
			subspecialty: "General",
			taxId: "—",
			upin: "—",
			medicaidId: "—",
			status: parseStatus(dto.status),
			program,
			providerType: parseProviderType(dto.entity_type),
			gender: "Unknown",
			dob: "—",
			yearsInPractice: 0,
			practiceName: dto.vendor ?? dto.roster_file ?? "—",
			practiceAddress: "—",
			practicePhone: "—",
			enrollmentStatus: "enrolled",
			enrollmentEffective: dto.effective_date ?? "—",
			claims12m: 0,
			encounters12m: 0,
			billed12m: 0,
			paid12m: 0,
			rejectionRate: 0,
			netPayment12m: 0,
		} satisfies ProviderSummary);
	const person = splitPersonName(summary.name);
	const taxonomyDescription =
		TAXONOMY_LABELS[dto.taxonomy ?? ""] ?? summary.specialty;

	return {
		...summary,
		...person,
		preferredName: null,
		suffix: summary.credentials || null,
		email: "—",
		fax: "—",
		preferredLanguage: "—",
		race: "—",
		ethnicity: "—",
		taxonomyCode: dto.taxonomy ?? "—",
		taxonomyDescription,
		boardCertification: "—",
		medicalSchool: "—",
		graduationYear: 0,
		acceptingNewPatients: true,
		mailingAddress: summary.practiceAddress,
		practiceCity: "Washington",
		practiceState: "DC",
		practiceZip: "20001",
		website: null,
		stateLicense: "—",
		deaNumber: "—",
		locations: [],
		networks: [],
		identifiers: [],
		monthlyVolume: [],
		rejectionReasons: [],
		recentClaims: [],
		recentEncounters: [],
		vendors: dto.vendor
			? [
					{
						id: dto.vendor_id ?? dto.id,
						vendor: String(dto.vendor),
						fileType: program,
						dataSent: "Provider roster",
						frequency: "—",
						lastReceived: dto.updated_at?.slice(0, 10) ?? "—",
						status: "active" satisfies FeedStatus,
					},
				]
			: [],
		credentialing: [],
		exceptions: [],
		claimsTrendPct: 0,
		encountersTrendPct: 0,
		billedTrendPct: 0,
		paidTrendPct: 0,
		rejectionTrendPct: 0,
		netPaymentTrendPct: 0,
		dataAsOf:
			dto.updated_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
	};
}
