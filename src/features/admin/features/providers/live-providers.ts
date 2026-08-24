import type {
	FeedStatus,
	ProviderDetail,
	ProviderStatus,
	ProviderSummary,
} from "@/features/admin/features/providers/mock-data";
import type { ProviderDto, ProviderRosterRef } from "@/lib/vendor-core/types";

export const TAXONOMY_LABELS: Record<string, string> = {
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

export function parseNameParts(name: string): {
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

function metaString(
	metadata: Record<string, unknown> | null | undefined,
	key: string
): string | undefined {
	const value = metadata?.[key];
	return typeof value === "string" && value.trim() ? value.trim() : undefined;
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

function vendorLabel(provider: ProviderDto): string | undefined {
	const vendor = provider.vendor;
	if (vendor && typeof vendor === "object") {
		return vendor.legal_name || vendor.vendor_code;
	}
	if (typeof vendor === "string" && vendor.trim()) return vendor;
	const roster = provider.roster_file;
	if (roster && typeof roster === "object") {
		const nested = roster.vendor;
		if (nested && typeof nested === "object") {
			return nested.legal_name || nested.vendor_code;
		}
		if (typeof nested === "string" && nested.trim()) return nested;
	}
	return undefined;
}

function rosterRef(provider: ProviderDto): ProviderRosterRef | null {
	const roster = provider.roster_file;
	if (roster && typeof roster === "object") return roster;
	return null;
}

function dash(value?: string | null): string {
	const trimmed = value?.trim();
	return trimmed ? trimmed : "—";
}

function enrollmentFromStatus(
	status: ProviderStatus
): ProviderSummary["enrollmentStatus"] {
	if (status === "termed") return "terminated";
	if (status === "pending") return "pending";
	return "enrolled";
}

/** Map vendor-core providers into the admin provider directory row shape. */
export function providersToSummaries(
	providers: ProviderDto[],
	program: ProviderSummary["program"] = "DHCF"
): ProviderSummary[] {
	return providers.map((provider) => {
		const { displayName, credentials } = parseNameParts(provider.name);
		const seed = parseSeedMeta(provider.raw_object_id);
		const specialty =
			metaString(provider.metadata, "specialty") ||
			seed.specialty ||
			TAXONOMY_LABELS[provider.taxonomy ?? ""] ||
			"—";
		const practiceName =
			metaString(provider.metadata, "practice") ||
			seed.practiceName ||
			vendorLabel(provider) ||
			(typeof provider.roster_file === "object"
				? provider.roster_file?.original_filename
				: undefined) ||
			"—";
		const status = parseStatus(provider.status);
		const taxId = metaString(provider.metadata, "tax_id") ?? "—";
		const upin = metaString(provider.metadata, "upin") ?? "—";
		const medicaidId = metaString(provider.metadata, "medicaid_id") ?? "—";

		return {
			id: provider.id,
			npi: provider.npi,
			name: displayName,
			credentials,
			specialty,
			subspecialty: metaString(provider.metadata, "subspecialty") ?? "—",
			taxId,
			upin,
			medicaidId,
			status,
			program,
			providerType: parseProviderType(provider.entity_type),
			gender: "Unknown",
			dob: "—",
			yearsInPractice: 0,
			practiceName,
			practiceAddress: "—",
			practicePhone: "—",
			enrollmentStatus: enrollmentFromStatus(status),
			enrollmentEffective: provider.effective_date ?? "—",
			claims12m: 0,
			encounters12m: 0,
			billed12m: 0,
			paid12m: 0,
			rejectionRate: 0,
			netPayment12m: 0,
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

function identifierRows(provider: ProviderDto): ProviderDetail["identifiers"] {
	const rows: ProviderDetail["identifiers"] = [
		{ id: "npi", label: "NPI", value: dash(provider.npi) },
		{
			id: "reference",
			label: "Reference ID",
			value: dash(provider.reference_id),
		},
		{
			id: "taxonomy",
			label: "Taxonomy",
			value: dash(provider.taxonomy),
		},
		{
			id: "entity",
			label: "Entity type",
			value: dash(provider.entity_type),
		},
	];
	const extras: Array<[string, string]> = [
		["tax_id", "Tax ID"],
		["upin", "UPIN"],
		["medicaid_id", "Medicaid ID"],
		["state_license", "State license"],
		["dea", "DEA"],
	];
	for (const [key, label] of extras) {
		const value = metaString(provider.metadata, key);
		if (value) rows.push({ id: key, label, value });
	}
	return rows;
}

/** Map a vendor-core provider into the admin detail shell from live fields only. */
export function providerDtoToDetail(
	dto: ProviderDto,
	program: ProviderSummary["program"] = "DHCF"
): ProviderDetail {
	const summary = providersToSummaries([dto], program)[0]!;
	const person = splitPersonName(summary.name);
	const taxonomyDescription =
		TAXONOMY_LABELS[dto.taxonomy ?? ""] ?? summary.specialty;
	const roster = rosterRef(dto);
	const vendorName = vendorLabel(dto);
	const vendorId =
		dto.vendor_id ??
		(typeof dto.vendor === "object" ? dto.vendor?.id : undefined) ??
		roster?.vendor_id ??
		(typeof roster?.vendor === "object" ? roster.vendor?.id : undefined);

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
		taxonomyCode: dash(dto.taxonomy),
		taxonomyDescription,
		boardCertification: "—",
		medicalSchool: "—",
		graduationYear: 0,
		acceptingNewPatients: true,
		mailingAddress: "—",
		practiceCity: "—",
		practiceState: "—",
		practiceZip: "—",
		website: null,
		stateLicense: metaString(dto.metadata, "state_license") ?? "—",
		deaNumber: metaString(dto.metadata, "dea") ?? "—",
		locations:
			summary.practiceName !== "—"
				? [
						{
							id: `${dto.id}-practice`,
							name: summary.practiceName,
							address: "—",
							phone: "—",
							status: summary.status,
							isPrimary: true,
						},
					]
				: [],
		networks: [],
		identifiers: identifierRows(dto),
		monthlyVolume: [],
		rejectionReasons: [],
		recentClaims: [],
		recentEncounters: [],
		vendors:
			vendorName || roster
				? [
						{
							id: vendorId ?? dto.roster_file_id ?? dto.id,
							vendor: vendorName ?? "—",
							fileType: program,
							dataSent: "Provider roster",
							frequency: "—",
							lastReceived:
								roster?.received_at?.slice(0, 10) ??
								dto.updated_at?.slice(0, 10) ??
								"—",
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

export function isProviderUuid(value: string): boolean {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
		value
	);
}
