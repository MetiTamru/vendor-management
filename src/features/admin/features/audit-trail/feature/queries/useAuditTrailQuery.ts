"use client";

import {
	useInvalidateVendorCore,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";

import { listAuditRecords } from "../api/auditTrailApi";

const domain = "audit-trail";

export function useAuditTrailQuery() {
	return useVendorCoreFeatureQuery(domain, "list", listAuditRecords);
}

export function useAuditTrailList() {
	const query = useAuditTrailQuery();
	return { ...query, auditRecords: query.data ?? [] };
}

export const useVendorCoreAudit = useAuditTrailQuery;
export const useAuditTrailDetailQuery = useAuditTrailQuery;

export { useInvalidateVendorCore };
