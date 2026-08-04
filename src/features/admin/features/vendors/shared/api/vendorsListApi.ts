import { apiClient } from "@/lib/api/client";

import { vendorsEndpoints } from "../../vendors-endpoints";
import type { ApiVendorsRecordDto } from "../dto/vendorsRecordDto";

export { vendorsEndpoints };

export type VendorsListResponse = {
	results?: ApiVendorsRecordDto[] | null;
	count?: number | null;
};

export async function listVendorsRecords(params?: Record<string, string>) {
	return apiClient<VendorsListResponse>(vendorsEndpoints.list(), { params });
}

export async function getVendorsRecord(id: string) {
	return apiClient<ApiVendorsRecordDto>(vendorsEndpoints.detail(id));
}
