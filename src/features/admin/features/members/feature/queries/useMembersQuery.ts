"use client";

import {
	useInvalidateVendorCore,
	useVendorCoreFeatureMutation,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";
import { isMockEnabled } from "@/lib/mock-mode";
import type { MemberListQuery } from "@/lib/vendor-core/types";

import { getMemberSummaries } from "../../mock-data";
import {
	createMemberAccumulator,
	createMemberClaim,
	createMemberException,
	getMemberDetail,
	getMemberSourceRecord,
	listMemberAccumulators,
	listMemberChangeEvents,
	listMemberClaims,
	listMemberCoverages,
	listMemberEligibilityHistory,
	listMemberExceptions,
	listMemberFamilyLinks,
	listMemberPlanHistory,
	listMemberSourceRecords,
	listMemberSummaries,
	listMemberSummariesPage,
	listMemberVendors,
} from "../api/membersApi";

const domain = "members";
const apiOnly = !isMockEnabled();

export function useMemberSummariesQuery(filters?: MemberListQuery) {
	return useVendorCoreFeatureQuery(
		domain,
		"summaries",
		() => listMemberSummaries(filters),
		true,
		[filters]
	);
}

export function useMemberSummariesPageQuery(
	filters: MemberListQuery | undefined,
	enabled = true
) {
	return useVendorCoreFeatureQuery(
		domain,
		"summaries-page",
		() => listMemberSummariesPage(filters),
		enabled,
		[filters]
	);
}

export function useMemberDetailQuery(memberId: string, enabled = true) {
	return useVendorCoreFeatureQuery(
		domain,
		"detail",
		() => getMemberDetail(memberId),
		enabled && Boolean(memberId),
		[memberId]
	);
}

export function useMemberEligibilityHistoryQuery(
	memberId: string,
	enabled = true
) {
	return useVendorCoreFeatureQuery(
		domain,
		"eligibility-history",
		() => listMemberEligibilityHistory(memberId),
		enabled && Boolean(memberId) && apiOnly,
		[memberId]
	);
}

export function useMemberPlanHistoryQuery(memberId: string, enabled = true) {
	return useVendorCoreFeatureQuery(
		domain,
		"plan-history",
		() => listMemberPlanHistory(memberId),
		enabled && Boolean(memberId) && apiOnly,
		[memberId]
	);
}

export function useMemberExceptionsQuery(memberId: string, enabled = true) {
	return useVendorCoreFeatureQuery(
		domain,
		"exceptions",
		() => listMemberExceptions(memberId),
		enabled && Boolean(memberId) && apiOnly,
		[memberId]
	);
}

export function useMemberAccumulatorsQuery(memberId: string, enabled = true) {
	return useVendorCoreFeatureQuery(
		domain,
		"accumulators",
		() => listMemberAccumulators(memberId),
		enabled && Boolean(memberId) && apiOnly,
		[memberId]
	);
}

export function useMemberClaimsQuery(
	memberId: string,
	claimKind?: string,
	enabled = true
) {
	return useVendorCoreFeatureQuery(
		domain,
		"claims",
		() => listMemberClaims(memberId, claimKind),
		enabled && Boolean(memberId) && apiOnly,
		[memberId, claimKind]
	);
}

export function useMemberChangeEventsQuery(memberId: string, enabled = true) {
	return useVendorCoreFeatureQuery(
		domain,
		"change-events",
		() => listMemberChangeEvents(memberId),
		enabled && Boolean(memberId) && apiOnly,
		[memberId]
	);
}

export function useMemberFamilyLinksQuery(memberId: string, enabled = true) {
	return useVendorCoreFeatureQuery(
		domain,
		"family-links",
		() => listMemberFamilyLinks(memberId),
		enabled && Boolean(memberId) && apiOnly,
		[memberId]
	);
}

export function useMemberSourceRecordsQuery(memberId: string, enabled = true) {
	return useVendorCoreFeatureQuery(
		domain,
		"source-records",
		() => listMemberSourceRecords(memberId),
		enabled && Boolean(memberId) && apiOnly,
		[memberId]
	);
}

export function useMemberSourceRecordQuery(
	memberId: string,
	recordId: string,
	enabled = true
) {
	return useVendorCoreFeatureQuery(
		domain,
		"source-record",
		() => getMemberSourceRecord(memberId, recordId),
		enabled && Boolean(memberId) && Boolean(recordId) && apiOnly,
		[memberId, recordId]
	);
}

export function useCreateMemberExceptionMutation(memberId: string) {
	return useVendorCoreFeatureMutation(domain, {
		mutationFn: (body: Parameters<typeof createMemberException>[1]) =>
			createMemberException(memberId, body),
	});
}

export function useCreateMemberAccumulatorMutation(memberId: string) {
	return useVendorCoreFeatureMutation(domain, {
		mutationFn: (body: Parameters<typeof createMemberAccumulator>[1]) =>
			createMemberAccumulator(memberId, body),
	});
}

export function useCreateMemberClaimMutation(memberId: string) {
	return useVendorCoreFeatureMutation(domain, {
		mutationFn: (body: Parameters<typeof createMemberClaim>[1]) =>
			createMemberClaim(memberId, body),
	});
}

export function useMemberCoveragesQuery() {
	return useVendorCoreFeatureQuery(
		domain,
		"coverages",
		listMemberCoverages,
		apiOnly
	);
}

export function useMemberVendorsQuery() {
	return useVendorCoreFeatureQuery(
		domain,
		"vendors",
		listMemberVendors,
		apiOnly
	);
}

export function useMemberSummariesList(filters?: MemberListQuery) {
	const query = useMemberSummariesQuery(filters);
	const members = isMockEnabled() ? getMemberSummaries() : (query.data ?? []);
	return { ...query, members };
}

export function useMemberCoveragesList() {
	const query = useMemberCoveragesQuery();
	return { ...query, coverages: query.data ?? [] };
}

export const useVendorCoreMemberCoverages = useMemberCoveragesQuery;
export const useVendorCoreVendors = useMemberVendorsQuery;

export { useInvalidateVendorCore };

export const useMembersQuery = useMemberSummariesQuery;
export const useMembersDetailQuery = useMemberDetailQuery;
