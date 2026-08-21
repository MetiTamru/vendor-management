"use client";

import {
	useInvalidateVendorCore,
	useVendorCoreFeatureMutation,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";
import { isMockEnabled } from "@/lib/mock-mode";

import { getMemberSummaries } from "../../mock-data";
import {
	listMemberCoverages,
	listMemberSummaries,
	listMemberVendors,
	getMemberDetail,
	getMemberOverview,
	seedMemberCoverages,
} from "../api/membersApi";

const domain = "members";
const liveOnly = !isMockEnabled();

export function useMemberSummariesQuery() {
	return useVendorCoreFeatureQuery(domain, "summaries", listMemberSummaries);
}

export function useMemberDetailQuery(id: string | undefined) {
	return useVendorCoreFeatureQuery(
		domain,
		"detail",
		() => getMemberDetail(id!),
		Boolean(id),
		[id]
	);
}

export function useMemberOverviewQuery(id: string | undefined) {
	return useVendorCoreFeatureQuery(
		domain,
		"overview",
		() => getMemberOverview(id!),
		Boolean(id),
		[id]
	);
}

export function useMemberCoveragesQuery() {
	return useVendorCoreFeatureQuery(
		domain,
		"coverages",
		listMemberCoverages,
		liveOnly
	);
}

export function useMemberVendorsQuery() {
	return useVendorCoreFeatureQuery(
		domain,
		"vendors",
		listMemberVendors,
		liveOnly
	);
}

export function useSeedMemberCoveragesMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof seedMemberCoverages>>,
		{ vendor_id?: string; force?: boolean } | undefined
	>(domain, {
		mutationFn: (body) => seedMemberCoverages(body),
	});
}

export function useMemberSummariesList() {
	const query = useMemberSummariesQuery();
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
