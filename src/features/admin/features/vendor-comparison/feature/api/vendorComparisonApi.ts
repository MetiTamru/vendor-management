import { apiClient } from "@/lib/api/client";

import { vendorComparisonEndpoints } from "../../vendor-comparison-endpoints";
import type {
	ApiVendorComparisonDto,
	VendorComparisonCreateDto,
	VendorComparisonUpdateDto,
} from "../dto/vendorComparisonDto";

export async function listVendorComparison() {
	return apiClient<{ results?: ApiVendorComparisonDto[]; count?: number }>(
		vendorComparisonEndpoints.list()
	);
}

export async function getVendorComparison(id: string) {
	return apiClient<ApiVendorComparisonDto>(vendorComparisonEndpoints.detail(id));
}

export async function createVendorComparison(body: VendorComparisonCreateDto) {
	return apiClient<ApiVendorComparisonDto>(vendorComparisonEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateVendorComparison(id: string, body: VendorComparisonUpdateDto) {
	return apiClient<ApiVendorComparisonDto>(vendorComparisonEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteVendorComparison(id: string) {
	return apiClient<void>(vendorComparisonEndpoints.delete(id), {
		method: "DELETE",
	});
}
