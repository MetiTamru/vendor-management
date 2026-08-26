import { isMockEnabled } from "@/lib/mock-mode";
import { vendorCoreApi } from "@/lib/vendor-core/api";
import type { VendorCoreBlobResult } from "@/lib/vendor-core/client";
import type {
	MemberCreateBody,
	MemberDetailDto,
	MemberListQuery,
	MemberWriteBody,
	ProviderDto,
	VendorDto,
} from "@/lib/vendor-core/types";

import {
	mapAccumulators,
	mapChangeEvents,
	mapClaims,
	mapEligibilityHistory,
	mapExceptions,
	mapFamilyLinks,
	mapFamilyLinkDetail,
	mapPlanHistory,
	mapSourceRecordList,
	memberDetailDtoToDetail,
	memberListDtoToSummary,
} from "../../map-member-core";
import {
	type AccumulatorRow,
	type DependentRow,
	type EligibilityExceptionRow,
	type EligibilityHistoryRow,
	type MemberClaimRow,
	type MemberDetail,
	type MemberSummary,
	type PlanHistoryRow,
	getMember,
	getMemberSummaries,
} from "../../mock-data";

export {
	displayName,
	formatCurrency,
	formatDate,
	getMember,
	maskSsn,
	memberAge,
} from "../../mock-data";
export type {
	ClaimStatus,
	EligibilityStatus,
	ExceptionStatus,
	MemberDetail,
	MemberStatus,
	MemberSummary,
} from "../../mock-data";

export type MemberSummariesPage = {
	results: MemberSummary[];
	count: number;
	limit: number;
	offset: number;
};

/** Map UI eligibility labels → backend `eligibility_status` raw values. */
export function eligibilityLabelToApi(
	label: string | undefined
): string | undefined {
	if (!label || label === "all") return undefined;
	const map: Record<string, string> = {
		Active: "active",
		Pending: "pending",
		Inactive: "inactive",
		Termed: "termed",
	};
	return map[label] ?? label.toLowerCase();
}

export function memberStatusLabelToApi(
	label: string | undefined
): string | undefined {
	if (!label || label === "all") return undefined;
	const map: Record<string, string> = {
		Active: "active",
		Pending: "pending",
		Inactive: "inactive",
		Termed: "termed",
	};
	return map[label] ?? label.toLowerCase();
}

export async function listMemberSummaries(
	filters?: MemberListQuery
): Promise<MemberSummary[]> {
	if (isMockEnabled()) return getMemberSummaries();
	const page = await vendorCoreApi.listMembers(filters);
	return (page.results ?? []).map(memberListDtoToSummary);
}

export async function listMemberSummariesPage(
	filters?: MemberListQuery
): Promise<MemberSummariesPage> {
	if (isMockEnabled()) {
		const all = getMemberSummaries();
		const limit = filters?.limit ?? 50;
		const offset = filters?.offset ?? 0;
		return {
			results: all.slice(offset, offset + limit),
			count: all.length,
			limit,
			offset,
		};
	}
	const page = await vendorCoreApi.listMembersPage(filters);
	return {
		results: (page.results ?? []).map(memberListDtoToSummary),
		count: page.count ?? page.results?.length ?? 0,
		limit: page.limit ?? filters?.limit ?? 50,
		offset: page.offset ?? filters?.offset ?? 0,
	};
}

export async function getMemberDetail(
	idOrMemberId: string
): Promise<MemberDetail | undefined> {
	if (isMockEnabled()) return getMember(idOrMemberId);
	try {
		const dto = await vendorCoreApi.getMember(idOrMemberId);
		return attachLivePcp(memberDetailDtoToDetail(dto), dto);
	} catch {
		const page = await vendorCoreApi.listMembersPage({
			cardholder_id: idOrMemberId,
			limit: 5,
			offset: 0,
		});
		const hit = page.results?.[0];
		if (!hit?.id) return undefined;
		const dto = await vendorCoreApi.getMember(String(hit.id));
		return attachLivePcp(memberDetailDtoToDetail(dto), dto);
	}
}

function needsPcpLookup(detail: MemberDetail): boolean {
	const name = detail.pcpName.trim();
	const npi = detail.pcpNpi.trim();
	return !name || name === "—" || !npi || npi === "—";
}

async function attachLivePcp(
	detail: MemberDetail,
	dto: MemberDetailDto
): Promise<MemberDetail> {
	if (!needsPcpLookup(detail) && detail.pcpNpi.trim() !== "—") {
		return detail;
	}
	try {
		const page = await vendorCoreApi.listProviders();
		const providers = page.results ?? [];
		const match = matchProviderForMember(providers, dto, detail);
		if (!match) return detail;
		return {
			...detail,
			pcpName: match.name?.trim() || detail.pcpName,
			pcpNpi: match.npi?.trim() || detail.pcpNpi,
		};
	} catch {
		return detail;
	}
}

function matchProviderForMember(
	providers: ProviderDto[],
	dto: MemberDetailDto,
	detail: MemberDetail
): ProviderDto | undefined {
	const npi = (dto.pcp_npi || detail.pcpNpi || "").replace(/\D/g, "");
	if (npi && npi !== "") {
		const byNpi = providers.find(
			(p) => (p.npi || "").replace(/\D/g, "") === npi
		);
		if (byNpi) return byNpi;
	}
	const vendorId = dto.vendor_id;
	if (vendorId) {
		const byVendor = providers.find((p) => p.vendor_id === vendorId);
		if (byVendor) return byVendor;
	}
	return undefined;
}

export async function listMemberEligibilityHistory(
	memberId: string
): Promise<EligibilityHistoryRow[]> {
	if (isMockEnabled()) return getMember(memberId)?.eligibilityHistory ?? [];
	const page = await vendorCoreApi.listMemberEligibilityHistory(memberId);
	return mapEligibilityHistory(page.results as Record<string, unknown>[]);
}

export async function listMemberPlanHistory(
	memberId: string
): Promise<PlanHistoryRow[]> {
	if (isMockEnabled()) return getMember(memberId)?.planHistory ?? [];
	const page = await vendorCoreApi.listMemberPlanHistory(memberId);
	return mapPlanHistory(page.results as Record<string, unknown>[]);
}

export async function listMemberExceptions(
	memberId: string
): Promise<EligibilityExceptionRow[]> {
	if (isMockEnabled()) return getMember(memberId)?.exceptions ?? [];
	const page = await vendorCoreApi.listMemberExceptions(memberId);
	return mapExceptions(page.results as Record<string, unknown>[]);
}

export async function listMemberAccumulators(
	memberId: string
): Promise<AccumulatorRow[]> {
	if (isMockEnabled()) return getMember(memberId)?.accumulators ?? [];
	const page = await vendorCoreApi.listMemberAccumulators(memberId);
	return mapAccumulators(page.results as Record<string, unknown>[]);
}

export async function listMemberClaims(
	memberId: string,
	claimKind?: string
): Promise<MemberClaimRow[]> {
	if (isMockEnabled()) {
		const m = getMember(memberId);
		if (!m) return [];
		if (claimKind === "encounter") return m.encounters;
		return m.claims;
	}
	const page = await vendorCoreApi.listMemberClaims(
		memberId,
		claimKind ? { claim_kind: claimKind } : undefined
	);
	return mapClaims(page.results as Record<string, unknown>[]);
}

export async function listMemberChangeEvents(memberId: string) {
	if (isMockEnabled()) return [];
	const page = await vendorCoreApi.listMemberChangeEvents(memberId);
	return mapChangeEvents(page.results as Record<string, unknown>[]);
}

export async function listMemberSourceRecords(memberId: string) {
	if (isMockEnabled()) return [];
	const page = await vendorCoreApi.listMemberSourceRecords(memberId);
	return mapSourceRecordList(page.results as Record<string, unknown>[]);
}

export async function getMemberSourceRecord(
	memberId: string,
	recordId: string
): Promise<Record<string, unknown>> {
	if (isMockEnabled()) {
		return { id: recordId, message: "Mock mode — no source payload" };
	}
	return vendorCoreApi.getMemberSourceRecord(memberId, recordId);
}

export async function createMemberException(
	memberId: string,
	body: {
		exception_type?: string;
		description?: string;
		status?: string;
		source?: string;
		resolution?: string;
	}
): Promise<EligibilityExceptionRow> {
	if (isMockEnabled()) {
		return mapExceptions([
			{
				id: crypto.randomUUID(),
				exception_type: body.exception_type,
				description: body.description,
				status: body.status,
				source: body.source,
				resolution: body.resolution,
			},
		])[0]!;
	}
	const row = await vendorCoreApi.createMemberException(memberId, body);
	return mapExceptions([row as Record<string, unknown>])[0]!;
}

export async function createMemberAccumulator(
	memberId: string,
	body: {
		label: string;
		individual?: number;
		family?: number;
		remaining?: number;
		limit?: number;
	}
): Promise<AccumulatorRow> {
	if (isMockEnabled()) {
		return mapAccumulators([
			{
				id: crypto.randomUUID(),
				label: body.label,
				individual: body.individual,
				family: body.family,
				remaining: body.remaining,
				limit: body.limit,
			},
		])[0]!;
	}
	const row = await vendorCoreApi.createMemberAccumulator(memberId, body);
	return mapAccumulators([row as Record<string, unknown>])[0]!;
}

export async function createMemberClaim(
	memberId: string,
	body: {
		service_date?: string;
		claim_number?: string;
		claim_kind?: string;
		provider_name?: string;
		billed_amount?: number;
		paid_amount?: number;
		status?: string;
	}
): Promise<MemberClaimRow> {
	if (isMockEnabled()) {
		return mapClaims([
			{
				id: crypto.randomUUID(),
				service_date: body.service_date,
				claim_number: body.claim_number,
				claim_kind: body.claim_kind,
				provider_name: body.provider_name,
				billed_amount: body.billed_amount,
				paid_amount: body.paid_amount,
				status: body.status,
			},
		])[0]!;
	}
	const row = await vendorCoreApi.createMemberClaim(memberId, body);
	return mapClaims([row as Record<string, unknown>])[0]!;
}

export async function updateMemberException(
	memberId: string,
	exceptionId: string,
	body: Record<string, unknown>
) {
	if (isMockEnabled()) {
		return mapExceptions([{ id: exceptionId, ...body }])[0]!;
	}
	const row = await vendorCoreApi.updateMemberException(
		memberId,
		exceptionId,
		body
	);
	return mapExceptions([row as Record<string, unknown>])[0]!;
}

export async function deleteMemberException(
	memberId: string,
	exceptionId: string
) {
	if (isMockEnabled()) return;
	await vendorCoreApi.deleteMemberException(memberId, exceptionId);
}

export async function updateMemberAccumulator(
	memberId: string,
	accumulatorId: string,
	body: Record<string, unknown>
) {
	if (isMockEnabled()) {
		return mapAccumulators([{ id: accumulatorId, ...body }])[0]!;
	}
	const row = await vendorCoreApi.updateMemberAccumulator(
		memberId,
		accumulatorId,
		body
	);
	return mapAccumulators([row as Record<string, unknown>])[0]!;
}

export async function deleteMemberAccumulator(
	memberId: string,
	accumulatorId: string
) {
	if (isMockEnabled()) return;
	await vendorCoreApi.deleteMemberAccumulator(memberId, accumulatorId);
}

export async function updateMemberClaim(
	memberId: string,
	claimId: string,
	body: Record<string, unknown>
) {
	if (isMockEnabled()) {
		return mapClaims([{ id: claimId, ...body }])[0]!;
	}
	const row = await vendorCoreApi.updateMemberClaim(memberId, claimId, body);
	return mapClaims([row as Record<string, unknown>])[0]!;
}

export async function deleteMemberClaim(memberId: string, claimId: string) {
	if (isMockEnabled()) return;
	await vendorCoreApi.deleteMemberClaim(memberId, claimId);
}

export async function createMember(body: MemberCreateBody | Record<string, unknown>) {
	if (isMockEnabled()) {
		const existing = getMemberSummaries()[0];
		if (!existing) throw new Error("No mock members");
		return getMember(existing.id)!;
	}
	const dto = await vendorCoreApi.createMember(body);
	return memberDetailDtoToDetail(dto);
}

export async function updateMember(
	id: string,
	body: MemberWriteBody | Record<string, unknown>
) {
	if (isMockEnabled()) {
		const member = getMember(id);
		if (!member) throw new Error("Member not found");
		return member;
	}
	const dto = await vendorCoreApi.updateMember(id, body);
	return memberDetailDtoToDetail(dto);
}

export async function deleteMember(id: string) {
	if (isMockEnabled()) return;
	await vendorCoreApi.deleteMember(id);
}

export async function hardDeleteMember(id: string) {
	if (isMockEnabled()) return;
	await vendorCoreApi.hardDeleteMember(id);
}

export async function restoreMember(id: string) {
	if (isMockEnabled()) {
		const member = getMember(id);
		if (!member) throw new Error("Member not found");
		return member;
	}
	const dto = await vendorCoreApi.restoreMember(id);
	return memberDetailDtoToDetail(dto);
}

export async function seedMembers(body?: Record<string, unknown>) {
	if (isMockEnabled()) return { created: 0, skipped: true };
	return vendorCoreApi.seedMembers(body);
}

export async function listMemberFamilyLinks(
	memberId: string
): Promise<DependentRow[]> {
	if (isMockEnabled()) return getMember(memberId)?.dependents ?? [];
	const page = await vendorCoreApi.listMemberFamilyLinks(memberId);
	return mapFamilyLinks(page.results as Record<string, unknown>[]);
}

export async function getMemberFamilyLink(memberId: string, linkId: string) {
	if (isMockEnabled()) {
		const dep = getMember(memberId)?.dependents.find((d) => d.id === linkId);
		if (!dep) throw new Error("Family link not found");
		return mapFamilyLinkDetail({
			id: dep.id,
			subscriber_id: memberId,
			dependent_id: dep.memberId ?? dep.id,
			relationship_code: dep.relationship,
			relationship_label: dep.relationship,
			dependent_cardholder_id: dep.memberId,
			dependent_first_name: dep.name.split(" ")[0],
			dependent_last_name: dep.name.split(" ").slice(1).join(" "),
			dependent_status: dep.coverageStatus,
			created_at: null,
		});
	}
	const row = await vendorCoreApi.getMemberFamilyLink(memberId, linkId);
	return mapFamilyLinkDetail(row);
}

export async function createMemberFamilyLink(
	memberId: string,
	body: {
		dependent_id: string;
		relationship_code?: string;
		relationship_label?: string;
	}
) {
	if (isMockEnabled()) return;
	await vendorCoreApi.createMemberFamilyLink(memberId, body);
}

export async function updateMemberFamilyLink(
	memberId: string,
	linkId: string,
	body: { relationship_code?: string; relationship_label?: string }
) {
	if (isMockEnabled()) return;
	await vendorCoreApi.updateMemberFamilyLink(memberId, linkId, body);
}

export async function deleteMemberFamilyLink(memberId: string, linkId: string) {
	if (isMockEnabled()) return;
	await vendorCoreApi.deleteMemberFamilyLink(memberId, linkId);
}

export async function syncMemberFamilyLinks(memberId: string) {
	if (isMockEnabled()) return;
	await vendorCoreApi.syncMemberFamilyLinks(memberId);
}

export async function transferMemberFamilyLink(
	memberId: string,
	linkId: string,
	body: { new_subscriber_id: string }
) {
	if (isMockEnabled()) return;
	await vendorCoreApi.transferMemberFamilyLink(memberId, linkId, body);
}

/** List filters for export (no pagination). */
export function memberListExportFilters(
	query: MemberListQuery
): MemberListQuery {
	const { limit: _l, offset: _o, ...filters } = query;
	return filters;
}

export async function exportMemberListCsv(
	filters: MemberListQuery
): Promise<VendorCoreBlobResult> {
	return vendorCoreApi.exportMemberListCsv(memberListExportFilters(filters));
}

export async function exportMemberDetailCsv(
	memberId: string
): Promise<VendorCoreBlobResult> {
	return vendorCoreApi.exportMemberDetailCsv(memberId);
}

export async function exportMemberDetailPdf(
	memberId: string,
	variant: "full" | "summary" = "full"
): Promise<VendorCoreBlobResult> {
	return vendorCoreApi.exportMemberDetailPdf(memberId, { variant });
}

export async function exportMemberPrintHtml(
	memberId: string
): Promise<VendorCoreBlobResult> {
	return vendorCoreApi.exportMemberPrintHtml(memberId);
}

export async function exportMemberDocumentPdf(
	memberId: string,
	document: "summary" | "eligibility-letter" | "coverage-card"
): Promise<VendorCoreBlobResult> {
	return vendorCoreApi.exportMemberDocumentPdf(memberId, document);
}

export async function listMemberCoverages() {
	const page = await vendorCoreApi.listMemberCoverages();
	return page.results ?? [];
}

export async function listMemberVendors(): Promise<VendorDto[]> {
	const page = await vendorCoreApi.listVendors();
	return page.results ?? [];
}

export async function seedMemberCoverages(_body?: {
	vendor_id?: string;
	force?: boolean;
}): Promise<{ created: number; skipped?: boolean }> {
	throw new Error(
		"Member coverage seed API is not available. Use backend: manage.py seed_demo_members"
	);
}
