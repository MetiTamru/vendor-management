import { apiClient } from "@/lib/api/client";

import { categoriesEndpoints } from "../../categories-endpoints";
import type { ApiCategoriesRecordDto } from "../dto/categoriesRecordDto";

export { categoriesEndpoints };

export type CategoriesListResponse = {
	results?: ApiCategoriesRecordDto[] | null;
	count?: number | null;
};

export async function listCategoriesRecords(params?: Record<string, string>) {
	return apiClient<CategoriesListResponse>(categoriesEndpoints.list(), { params });
}

export async function getCategoriesRecord(id: string) {
	return apiClient<ApiCategoriesRecordDto>(categoriesEndpoints.detail(id));
}
