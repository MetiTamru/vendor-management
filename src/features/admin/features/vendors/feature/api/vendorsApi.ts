import { apiClient } from "@/lib/api/client";

import { vendorsEndpoints } from "../../vendors-endpoints";
import type {
	ApiVendorsDto,
	VendorsCreateDto,
	VendorsUpdateDto,
} from "../dto/vendorsDto";

export async function listVendors() {
	return apiClient<{ results?: ApiVendorsDto[]; count?: number }>(
		vendorsEndpoints.list()
	);
}

export async function getVendors(id: string) {
	return apiClient<ApiVendorsDto>(vendorsEndpoints.detail(id));
}

export async function createVendors(body: VendorsCreateDto) {
	return apiClient<ApiVendorsDto>(vendorsEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateVendors(id: string, body: VendorsUpdateDto) {
	return apiClient<ApiVendorsDto>(vendorsEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteVendors(id: string) {
	return apiClient<void>(vendorsEndpoints.delete(id), {
		method: "DELETE",
	});
}
