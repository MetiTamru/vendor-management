"use client";

import {
	useInvalidateVendorCore,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";

import {
	getVendor,
	listVendorAccounts,
	listVendorConnections,
	listVendorInboundFiles,
	listVendorJobs,
	listVendors,
} from "../api/vendorsApi";

const domain = "vendors";

export function useVendorsQuery() {
	return useVendorCoreFeatureQuery(domain, "list", listVendors);
}

export function useVendorDetailQuery(id: string | null | undefined) {
	return useVendorCoreFeatureQuery(
		domain,
		"detail",
		() => getVendor(String(id)),
		Boolean(id),
		[id ?? ""]
	);
}

export function useVendorConnectionsQuery(vendorId?: string) {
	return useVendorCoreFeatureQuery(
		domain,
		"connections",
		() => listVendorConnections(vendorId),
		true,
		[vendorId ?? "all"]
	);
}

export function useVendorJobsQuery(vendorId?: string) {
	return useVendorCoreFeatureQuery(
		domain,
		"jobs",
		() => listVendorJobs(vendorId),
		true,
		[vendorId ?? "all"]
	);
}

export function useVendorAccountsQuery(vendorId?: string) {
	return useVendorCoreFeatureQuery(
		domain,
		"accounts",
		() => listVendorAccounts(vendorId),
		true,
		[vendorId ?? "all"]
	);
}

export function useVendorInboundFilesQuery(params?: {
	stage?: string;
	vendor_id?: string;
}) {
	return useVendorCoreFeatureQuery(
		domain,
		"inbound-files",
		() => listVendorInboundFiles(params),
		true,
		[params ?? {}]
	);
}

export function useVendorsList() {
	const query = useVendorsQuery();
	return { ...query, vendors: query.data ?? [] };
}

export function useVendor(id: string | null | undefined) {
	const query = useVendorDetailQuery(id);
	return { ...query, vendor: query.data };
}

/** Convenience aliases matching legacy vendor-core hook names. */
export const useVendorCoreVendors = useVendorsQuery;
export const useVendorCoreVendor = useVendorDetailQuery;
export const useVendorCoreConnections = useVendorConnectionsQuery;
export const useVendorCoreJobs = useVendorJobsQuery;
export const useVendorCoreAccounts = useVendorAccountsQuery;
export const useVendorCoreInboundFiles = useVendorInboundFilesQuery;

export const useVendorsDetailQuery = useVendorDetailQuery;

export { useInvalidateVendorCore };
