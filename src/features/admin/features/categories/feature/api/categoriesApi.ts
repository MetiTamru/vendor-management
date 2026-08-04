import { apiClient } from "@/lib/api/client";

import { categoriesEndpoints } from "../../categories-endpoints";
import type {
	ApiCategoriesDto,
	CategoriesCreateDto,
	CategoriesUpdateDto,
} from "../dto/categoriesDto";

export async function listCategories() {
	return apiClient<{ results?: ApiCategoriesDto[]; count?: number }>(
		categoriesEndpoints.list()
	);
}

export async function getCategories(id: string) {
	return apiClient<ApiCategoriesDto>(categoriesEndpoints.detail(id));
}

export async function createCategories(body: CategoriesCreateDto) {
	return apiClient<ApiCategoriesDto>(categoriesEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateCategories(id: string, body: CategoriesUpdateDto) {
	return apiClient<ApiCategoriesDto>(categoriesEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteCategories(id: string) {
	return apiClient<void>(categoriesEndpoints.delete(id), {
		method: "DELETE",
	});
}
