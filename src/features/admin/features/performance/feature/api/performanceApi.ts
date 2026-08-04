import { apiClient } from "@/lib/api/client";

import { performanceEndpoints } from "../../performance-endpoints";
import type {
	ApiPerformanceDto,
	PerformanceCreateDto,
	PerformanceUpdateDto,
} from "../dto/performanceDto";

export async function listPerformance() {
	return apiClient<{ results?: ApiPerformanceDto[]; count?: number }>(
		performanceEndpoints.list()
	);
}

export async function getPerformance(id: string) {
	return apiClient<ApiPerformanceDto>(performanceEndpoints.detail(id));
}

export async function createPerformance(body: PerformanceCreateDto) {
	return apiClient<ApiPerformanceDto>(performanceEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updatePerformance(
	id: string,
	body: PerformanceUpdateDto
) {
	return apiClient<ApiPerformanceDto>(performanceEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deletePerformance(id: string) {
	return apiClient<void>(performanceEndpoints.delete(id), {
		method: "DELETE",
	});
}
