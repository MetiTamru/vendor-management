import { apiClient } from "@/lib/api/client";

import { vendorComparisonEndpoints } from "../../vendor-comparison-endpoints";
import type { ApiVendorComparisonRecordDto } from "../dto/vendorComparisonRecordDto";

export { vendorComparisonEndpoints };

export type VendorComparisonListResponse = {
	results?: ApiVendorComparisonRecordDto[] | null;
	count?: number | null;
};

export async function listVendorComparisonRecords(params?: Record<string, string>) {
	return apiClient<VendorComparisonListResponse>(vendorComparisonEndpoints.list(), { params });
}

export async function getVendorComparisonRecord(id: string) {
	return apiClient<ApiVendorComparisonRecordDto>(vendorComparisonEndpoints.detail(id));
}
