import { isMockEnabled } from "@/lib/mock-mode";
import { vendorCoreApi } from "@/lib/vendor-core/api";
import type { VendorCoreBlobResult } from "@/lib/vendor-core/client";
import type { MemberListQuery, VendorDto } from "@/lib/vendor-core/types";

import {
	mapAccumulators,
	mapClaims,
	mapEligibilityHistory,
	mapExceptions,
	mapFamilyLinks,
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
		return memberDetailDtoToDetail(dto);
	} catch {
		const page = await vendorCoreApi.listMembersPage({
			cardholder_id: idOrMemberId,
			limit: 5,
			offset: 0,
		});
		const hit = page.results?.[0];
		if (!hit?.id) return undefined;
		const dto = await vendorCoreApi.getMember(String(hit.id));
		return memberDetailDtoToDetail(dto);
	}
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
	return page.results ?? [];
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
	const row = await vendorCoreApi.createMemberClaim(memberId, body);
	return mapClaims([row as Record<string, unknown>])[0]!;
}

export async function listMemberFamilyLinks(
	memberId: string
): Promise<DependentRow[]> {
	if (isMockEnabled()) return getMember(memberId)?.dependents ?? [];
	const page = await vendorCoreApi.listMemberFamilyLinks(memberId);
	return mapFamilyLinks(page.results as Record<string, unknown>[]);
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
