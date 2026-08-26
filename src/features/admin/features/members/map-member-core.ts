/**
 * Map vendor-core Member 360 (snake_case) → dashboard MemberSummary / MemberDetail.
 * Keep UI types unchanged; fill gaps with safe empty defaults.
 */
import type {
	AccumulatorRow,
	DependentRow,
	EligibilityExceptionRow,
	EligibilityHistoryRow,
	EligibilityStatus,
	ExceptionStatus,
	MemberAlert,
	MemberClaimRow,
	MemberDetail,
	MemberStatus,
	MemberSummary,
	OtherStatusRow,
	PlanHistoryRow,
	VendorSourceRow,
} from "@/features/admin/features/members/mock-data";
import type { MemberDetailDto, MemberListDto, MemberWriteBody } from "@/lib/vendor-core/types";

function str(v: unknown, fallback = ""): string {
	if (v == null) return fallback;
	return String(v);
}

function num(v: unknown, fallback = 0): number {
	if (typeof v === "number" && Number.isFinite(v)) return v;
	if (typeof v === "string" && v.trim() !== "") {
		const n = Number(v);
		return Number.isFinite(n) ? n : fallback;
	}
	return fallback;
}

function dateStr(v: unknown, fallback = "—"): string {
	if (v == null || v === "") return fallback;
	const s = String(v);
	return s.length >= 10 ? s.slice(0, 10) : s;
}

function mapGender(raw: string | undefined): MemberSummary["gender"] {
	const g = (raw || "").trim().toLowerCase();
	if (g === "m" || g === "male") return "Male";
	if (g === "f" || g === "female") return "Female";
	if (g === "other") return "Other";
	if (!g) return "Unknown";
	return "Unknown";
}

function mapMemberStatus(raw: string | undefined): MemberStatus {
	const s = (raw || "").trim().toLowerCase();
	if (s === "active" || s === "eligible") return "active";
	if (s === "pending") return "pending";
	if (s === "inactive" || s === "ineligible") return "inactive";
	if (s === "termed" || s === "terminated") return "termed";
	return "inactive";
}

function mapEligibilityLabel(
	raw: string | undefined
): MemberSummary["eligibilityLabel"] {
	const s = (raw || "").trim();
	if (s === "Active" || s === "Inactive" || s === "Pending" || s === "Termed") {
		return s;
	}
	const lower = s.toLowerCase();
	if (lower === "active" || lower === "eligible") return "Active";
	if (lower === "pending") return "Pending";
	if (lower === "inactive" || lower === "ineligible") return "Inactive";
	if (lower === "termed" || lower === "terminated") return "Termed";
	return undefined;
}

function mapEligibilityStatus(raw: string | undefined): EligibilityStatus {
	const s = (raw || "").trim().toLowerCase();
	if (s === "eligible" || s === "active") return "eligible";
	if (s === "pending") return "pending";
	if (s === "ineligible" || s === "inactive") return "ineligible";
	if (s === "termed" || s === "terminated") return "termed";
	return "ineligible";
}

function mapProgram(raw: string | undefined): MemberSummary["program"] {
	const p = (raw || "").trim().toUpperCase();
	if (p === "MDH" || p === "DHCF" || p === "BHP") return p;
	return "DHCF";
}

function mapClaimType(kind: string | undefined): MemberClaimRow["type"] {
	const k = (kind || "").toLowerCase();
	if (k === "pharmacy") return "Pharmacy";
	if (k === "dental") return "Dental";
	if (k === "vision") return "Vision";
	if (k === "encounter") return "Encounter";
	return "Medical";
}

function mapClaimStatus(raw: string | undefined): MemberClaimRow["status"] {
	const s = (raw || "").toLowerCase();
	if (s === "paid") return "paid";
	if (s === "denied") return "denied";
	if (s === "partial") return "partial";
	return "pending";
}

function mapExceptionStatus(raw: string | undefined): ExceptionStatus {
	const s = (raw || "").toLowerCase();
	if (s === "resolved") return "resolved";
	if (s === "in_progress" || s === "in-progress") return "in_progress";
	return "open";
}

function mapRelationship(
	code: string | undefined
): DependentRow["relationship"] {
	const c = (code || "").toLowerCase();
	if (c === "self" || c === "18" || c === "1") return "Self";
	if (c.includes("spouse") || c === "01" || c === "2") return "Spouse";
	if (c.includes("daughter") || c === "19") return "Daughter";
	if (c.includes("son") || c === "19s") return "Son";
	return "Other";
}

function mapComms(
	raw: string | undefined
): MemberDetail["communicationPreference"] {
	const s = (raw || "").toLowerCase();
	if (s === "email") return "Email";
	if (s === "mail") return "Mail";
	if (s === "sms" || s === "text") return "SMS";
	return "Phone";
}

export function memberListDtoToSummary(row: MemberListDto): MemberSummary {
	return {
		id: str(row.id),
		memberId: str(row.cardholder_id || row.reference_id || row.id).slice(0, 64),
		vendorId: str(row.vendor_id) || undefined,
		alternateId: str(row.alternate_id) || undefined,
		firstName: str(row.first_name, "—"),
		middleName: str(row.middle_name) || undefined,
		lastName: str(row.last_name, "—"),
		dob: dateStr(row.date_of_birth),
		gender: mapGender(row.gender),
		ssnLast4: str(row.ssn_last4, "****"),
		phone: str(row.phone, "—"),
		email: str(row.email),
		addressLine1: str(row.address_line1, "—"),
		addressLine2: str(row.address_line2) || undefined,
		city: str(row.city, "—"),
		state: str(row.state, "—"),
		zip: str(row.postal_code, "—"),
		status: mapMemberStatus(row.status),
		eligibilityLabel: mapEligibilityLabel(
			row.eligibility_label || row.eligibility_status
		),
		accountGroup: str(row.account_group || row.group_name) || undefined,
		program: mapProgram(row.program),
		planName: str(row.plan_name, "—"),
		planType: str(row.plan_type, "—"),
		lob: str(row.lob, "—"),
		pcpName: str(row.pcp_name, "—"),
		pcpNpi: str(row.pcp_npi, "—"),
		memberSince: dateStr(row.member_since),
		coverageEffectiveDate: row.coverage_effective_date
			? dateStr(row.coverage_effective_date)
			: undefined,
		lastClaimDate: row.last_claim_date ? dateStr(row.last_claim_date) : null,
		claimsYtd: num(row.claims_ytd),
		paidYtd: num(row.paid_ytd),
		vendorSource: str(row.vendor_source || row.source_system, "—"),
	};
}

export function mapEligibilityHistory(
	rows: Record<string, unknown>[] | undefined
): EligibilityHistoryRow[] {
	return (rows ?? []).map((r) => ({
		id: str(r.id),
		startDate: dateStr(r.start_date),
		endDate: r.end_date ? dateStr(r.end_date) : null,
		status: mapEligibilityStatus(str(r.status)),
		source: str(r.source, "—"),
		groupCaseId: str(r.group_case_id, "—"),
		reason: str(r.reason, "—"),
		verifiedBy: str(r.verified_by, "—"),
	}));
}

export function mapPlanHistory(
	rows: Record<string, unknown>[] | undefined
): PlanHistoryRow[] {
	return (rows ?? []).map((r) => ({
		id: str(r.id),
		planName: str(r.plan_name, "—"),
		planType: str(r.plan_type, "—"),
		planId: str(r.plan_id, "—"),
		carrier: str(r.carrier, "—"),
		startDate: dateStr(r.start_date),
		endDate: r.end_date ? dateStr(r.end_date) : null,
		changeReason: str(r.change_reason, "—"),
	}));
}

export function mapDependents(
	rows: Record<string, unknown>[] | undefined
): DependentRow[] {
	return (rows ?? []).map((r) => ({
		id: str(r.id),
		name:
			[str(r.first_name), str(r.last_name)].filter(Boolean).join(" ") || "—",
		relationship: mapRelationship(str(r.relationship_code)),
		dob: dateStr(r.date_of_birth),
		gender: mapGender(str(r.gender)),
		coverageStatus: mapMemberStatus(str(r.status)),
		memberId: str(r.cardholder_id) || undefined,
		pcpName: str(r.pcp_name) || undefined,
		planName: str(r.plan_name) || undefined,
	}));
}

/** `GET …/family-links/list/` rows → household cards. */
export function mapFamilyLinks(
	rows: Record<string, unknown>[] | undefined
): DependentRow[] {
	return (rows ?? []).map((r) => {
		const code = str(r.relationship_code);
		const label = str(r.relationship_label);
		return {
			id: str(r.id),
			name:
				[str(r.dependent_first_name), str(r.dependent_last_name)]
					.filter(Boolean)
					.join(" ") || "—",
			relationship: mapRelationship(label || code),
			relationshipCode: code || undefined,
			relationshipLabel: label || undefined,
			dob: dateStr(r.dependent_date_of_birth),
			gender: "—",
			coverageStatus: mapMemberStatus(str(r.dependent_status)),
			memberId: str(r.dependent_cardholder_id) || undefined,
			dependentId: str(r.dependent_id) || undefined,
		};
	});
}

export type MemberFamilyLinkDetail = {
	id: string;
	subscriberId: string;
	dependentId: string;
	relationshipCode: string;
	relationshipLabel: string;
	dependentCardholderId: string;
	dependentFirstName: string;
	dependentLastName: string;
	dependentStatus: string;
	createdAt: string;
};

export function mapFamilyLinkDetail(
	row: Record<string, unknown>
): MemberFamilyLinkDetail {
	return {
		id: str(row.id),
		subscriberId: str(row.subscriber_id),
		dependentId: str(row.dependent_id),
		relationshipCode: str(row.relationship_code),
		relationshipLabel: str(row.relationship_label),
		dependentCardholderId: str(row.dependent_cardholder_id),
		dependentFirstName: str(row.dependent_first_name),
		dependentLastName: str(row.dependent_last_name),
		dependentStatus: str(row.dependent_status),
		createdAt: row.created_at ? String(row.created_at) : "—",
	};
}

export function mapClaims(
	rows: Record<string, unknown>[] | undefined
): MemberClaimRow[] {
	return (rows ?? []).map((r) => ({
		id: str(r.id),
		dos: dateStr(r.service_date),
		claimNumber: str(r.claim_number, "—"),
		type: mapClaimType(str(r.claim_kind)),
		provider: str(
			r.provider_name ||
				r.rendering_provider_name ||
				r.billing_provider_name,
			"—"
		),
		billed: num(r.billed_amount),
		paid: num(r.paid_amount),
		status: mapClaimStatus(str(r.status)),
	}));
}

export function mapAccumulators(
	rows: Record<string, unknown>[] | undefined
): AccumulatorRow[] {
	return (rows ?? []).map((r) => ({
		id: str(r.id),
		label: str(r.label, "—"),
		individual: num(r.individual),
		family: num(r.family),
		remaining: num(r.remaining),
		limit: num(r.limit),
	}));
}

export function mapVendorHistory(
	rows: Record<string, unknown>[] | undefined
): VendorSourceRow[] {
	return (rows ?? []).map((r) => {
		const st = str(r.status).toLowerCase();
		return {
			id: str(r.id),
			vendor: str(r.vendor, "—"),
			fileFeedType: str(r.file_feed_type, "Eligibility"),
			lastReceived: r.last_received ? String(r.last_received) : "—",
			status:
				st === "failed" ? "failed" : st === "warning" ? "warning" : "success",
			frequency: str(r.frequency, "—"),
			recordsProcessed: num(r.records_processed),
			direction:
				str(r.direction).toLowerCase() === "outbound" ? "Outbound" : "Inbound",
		};
	});
}

export function mapExceptions(
	rows: Record<string, unknown>[] | undefined
): EligibilityExceptionRow[] {
	return (rows ?? []).map((r) => ({
		id: str(r.id),
		exceptionType: str(r.exception_type, "—"),
		description: str(r.description, "—"),
		startDetected: r.start_detected ? String(r.start_detected) : "—",
		status: mapExceptionStatus(str(r.status)),
		source: str(r.source, "—"),
		resolution: str(r.resolution, "—"),
	}));
}

export function mapOtherStatuses(
	rows: Record<string, unknown>[] | undefined
): OtherStatusRow[] {
	return (rows ?? []).map((r) => ({
		id: str(r.id),
		slot: str(r.status_slot, "—"),
		status: str(r.status, "—"),
		detail: str(r.status_detail, "—"),
		effectiveStart: r.effective_start ? dateStr(r.effective_start) : null,
		effectiveEnd: r.effective_end ? dateStr(r.effective_end) : null,
	}));
}

export function mapChangeEvents(rows: Record<string, unknown>[] | undefined): {
	id: string;
	category: string;
	fieldName: string;
	oldValue: string;
	newValue: string;
	createdAt: string;
}[] {
	return (rows ?? []).map((r) => ({
		id: str(r.id),
		category: str(r.category, "—"),
		fieldName: str(r.field_name, "—"),
		oldValue: str(r.old_value, "—"),
		newValue: str(r.new_value, "—"),
		createdAt: r.created_at ? String(r.created_at) : "—",
	}));
}

export function mapSourceRecordList(
	rows: Record<string, unknown>[] | undefined
): {
	id: string;
	sourceSystem: string;
	originalFilename: string;
	fileReceivedAt: string;
	recordStatus: string;
	recordEffectiveDate: string;
	changeSummary: string;
}[] {
	return (rows ?? []).map((r) => ({
		id: str(r.id),
		sourceSystem: str(r.source_system, "—"),
		originalFilename: str(r.original_filename, "—"),
		fileReceivedAt: r.file_received_at ? String(r.file_received_at) : "—",
		recordStatus: str(r.record_status, "—"),
		recordEffectiveDate: dateStr(r.record_effective_date),
		changeSummary: str(r.change_summary, "—"),
	}));
}

export function mapAlerts(
	rows: Record<string, unknown>[] | undefined
): MemberAlert[] {
	return (rows ?? []).map((r) => {
		const sev = str(r.severity).toLowerCase();
		return {
			id: str(r.id),
			severity: sev === "error" ? "error" : sev === "info" ? "info" : "warning",
			title: str(r.title, "Alert"),
			hrefLabel: str(r.href_label, "View"),
		};
	});
}

export function memberDetailDtoToDetail(row: MemberDetailDto): MemberDetail {
	const base = memberListDtoToSummary(row);
	const elig = (row.eligibility ?? {}) as Record<string, unknown>;
	const plan = (row.plan_coverage ?? {}) as Record<string, unknown>;
	const group = (row.employment_group ?? {}) as Record<string, unknown>;
	const demo = (row.demographics ?? {}) as Record<string, unknown>;
	const latest = (row.latest_source ?? {}) as Record<string, unknown>;

	return {
		...base,
		eligibilityStatus: mapEligibilityStatus(str(elig.status)),
		coverageStart: dateStr(
			plan.coverage_effective_date ?? row.coverage_effective_date
		),
		coverageEnd: plan.coverage_term_date
			? dateStr(plan.coverage_term_date)
			: null,
		planId: str(plan.plan_code || plan.plan_name, "—"),
		planCode: str(plan.plan_code) || undefined,
		benefitPackage: str(plan.benefit_package) || undefined,
		coverageLevelCode: str(plan.coverage_level_code) || undefined,
		coverageLevel: str(plan.coverage_level) || undefined,
		secondaryCoverage: elig.secondary_coverage ? "Yes" : "No",
		statusEffectiveDate: elig.status_effective_date
			? dateStr(elig.status_effective_date)
			: undefined,
		statusTermDate: elig.status_term_date
			? dateStr(elig.status_term_date)
			: null,
		enrollmentDate: elig.enrollment_date
			? dateStr(elig.enrollment_date)
			: undefined,
		disenrollmentDate: elig.disenrollment_date
			? dateStr(elig.disenrollment_date)
			: null,
		lastEligibilityUpdate: row.last_eligibility_update
			? String(row.last_eligibility_update)
			: undefined,
		groupId: str(group.group_id) || undefined,
		groupName:
			str(group.group_name || row.group_name || row.account_group) || undefined,
		clientId: str(group.client_id) || undefined,
		accountType: str(group.account_type) || undefined,
		accountStatus:
			str(group.account_status).toLowerCase() === "inactive"
				? "Inactive"
				: str(group.account_status)
					? "Active"
					: undefined,
		memberType: str(group.member_type) || undefined,
		personCode: str(row.person_code) || undefined,
		relationshipCode: str(row.relationship_code) || undefined,
		externalId: str(row.external_id) || undefined,
		employeeType: str(group.employee_type) || undefined,
		sourceSystem: str(row.source_system || latest.source_system) || undefined,
		sourceFileName: str(latest.original_filename) || undefined,
		sourceFileReceived: latest.file_received_at
			? String(latest.file_received_at)
			: undefined,
		recordStatus: str(latest.record_status) || undefined,
		changeDetected: str(latest.change_summary) || undefined,
		preferredName: str(row.preferred_name || demo.preferred_name) || null,
		preferredLanguage: str(
			row.preferred_language || demo.preferred_language,
			"—"
		),
		race: str(row.race || demo.race, "—"),
		ethnicity: str(row.ethnicity || demo.ethnicity, "—"),
		communicationPreference: mapComms(
			str(row.communication_preference || demo.communication_preference)
		),
		emergencyContactName: str(
			row.emergency_contact_name || demo.emergency_contact_name,
			"—"
		),
		emergencyContactPhone: str(
			row.emergency_contact_phone || demo.emergency_contact_phone,
			"—"
		),
		emergencyContactRelation: str(
			row.emergency_contact_relation || demo.emergency_contact_relation,
			"—"
		),
		mailingAddressLine1: str(
			row.mailing_address_line1 || demo.mailing_address_line1,
			"—"
		),
		mailingAddressLine2:
			str(row.mailing_address_line2 || demo.mailing_address_line2) || undefined,
		mailingCity: str(row.mailing_city || demo.mailing_city, "—"),
		mailingState: str(row.mailing_state || demo.mailing_state, "—"),
		mailingZip: str(row.mailing_postal_code || demo.mailing_postal_code, "—"),
		dataAsOf: row.data_as_of
			? String(row.data_as_of)
			: row.updated_at
				? String(row.updated_at)
				: "—",
		alerts: mapAlerts(row.alerts),
		eligibilityHistory: mapEligibilityHistory(row.eligibility_history),
		planHistory: mapPlanHistory(row.plan_history),
		dependents: mapDependents(row.family_members),
		claims: mapClaims(row.claims),
		encounters: mapClaims(row.encounters),
		accumulators: mapAccumulators(row.accumulators),
		vendorHistory: mapVendorHistory(row.vendor_history),
		exceptions: mapExceptions(row.exceptions),
		otherStatuses: mapOtherStatuses(row.other_statuses),
	};
}

function dashToEmpty(v: string | undefined | null): string {
	if (!v || v === "—") return "";
	return v;
}

/** Prefill PATCH body from mapped Member 360 (core snake_case write shape). */
export function memberToWriteBody(member: MemberDetail): MemberWriteBody {
	return {
		cardholder_id: dashToEmpty(member.memberId),
		person_code: dashToEmpty(member.personCode),
		external_id: dashToEmpty(member.externalId),
		relationship_code: dashToEmpty(member.relationshipCode),
		first_name: dashToEmpty(member.firstName),
		middle_name: dashToEmpty(member.middleName),
		last_name: dashToEmpty(member.lastName),
		status: member.status,
		source_system: dashToEmpty(member.sourceSystem),
		program: member.program,
		lob: dashToEmpty(member.lob),
		plan_type: dashToEmpty(member.planType),
		pcp_name: dashToEmpty(member.pcpName),
		pcp_npi: dashToEmpty(member.pcpNpi),
		member_since: dashToEmpty(member.memberSince) || null,
		demographics: {
			date_of_birth: dashToEmpty(member.dob) || null,
			gender:
				member.gender === "Male"
					? "M"
					: member.gender === "Female"
						? "F"
						: member.gender === "Other"
							? "O"
							: "",
			ssn_last4: dashToEmpty(member.ssnLast4).replace(/\*/g, ""),
			alternate_id: dashToEmpty(member.alternateId),
			address_line1: dashToEmpty(member.addressLine1),
			address_line2: dashToEmpty(member.addressLine2),
			city: dashToEmpty(member.city),
			state: dashToEmpty(member.state),
			postal_code: dashToEmpty(member.zip),
			phone: dashToEmpty(member.phone),
			email: dashToEmpty(member.email),
			preferred_name: dashToEmpty(member.preferredName),
			preferred_language: dashToEmpty(member.preferredLanguage),
			race: dashToEmpty(member.race),
			ethnicity: dashToEmpty(member.ethnicity),
			communication_preference: String(
				member.communicationPreference ?? ""
			).toLowerCase(),
			emergency_contact_name: dashToEmpty(member.emergencyContactName),
			emergency_contact_phone: dashToEmpty(member.emergencyContactPhone),
			emergency_contact_relation: dashToEmpty(member.emergencyContactRelation),
			mailing_address_line1: dashToEmpty(member.mailingAddressLine1),
			mailing_address_line2: dashToEmpty(member.mailingAddressLine2),
			mailing_city: dashToEmpty(member.mailingCity),
			mailing_state: dashToEmpty(member.mailingState),
			mailing_postal_code: dashToEmpty(member.mailingZip),
		},
		eligibility: {
			status:
				member.eligibilityStatus === "eligible"
					? "active"
					: member.eligibilityStatus === "pending"
						? "pending"
						: member.eligibilityStatus === "termed"
							? "terminated"
							: "inactive",
			status_effective_date: dashToEmpty(member.statusEffectiveDate) || null,
			status_term_date: dashToEmpty(member.statusTermDate) || null,
			enrollment_date: dashToEmpty(member.enrollmentDate) || null,
			disenrollment_date: dashToEmpty(member.disenrollmentDate) || null,
			secondary_coverage: member.secondaryCoverage === "Yes",
		},
		plan_coverage: {
			plan_name: dashToEmpty(member.planName),
			plan_code: dashToEmpty(member.planCode),
			benefit_package: dashToEmpty(member.benefitPackage),
			coverage_level_code: dashToEmpty(member.coverageLevelCode),
			coverage_level: dashToEmpty(member.coverageLevel),
			coverage_effective_date: dashToEmpty(member.coverageStart) || null,
			coverage_term_date: dashToEmpty(member.coverageEnd) || null,
		},
		employment_group: {
			group_id: dashToEmpty(member.groupId),
			group_name: dashToEmpty(member.groupName),
			client_id: dashToEmpty(member.clientId),
			account_type: dashToEmpty(member.accountType),
			account_status: member.accountStatus?.toLowerCase(),
			member_type: dashToEmpty(member.memberType),
			employee_type: dashToEmpty(member.employeeType),
		},
	};
}
