import { apiClient } from "@/lib/api/client";

import { reportsEndpoints } from "../../reports-endpoints";
import type {
	ApiReportsDto,
	ReportsCreateDto,
	ReportsUpdateDto,
} from "../dto/reportsDto";

export async function listReports() {
	return apiClient<{ results?: ApiReportsDto[]; count?: number }>(
		reportsEndpoints.list()
	);
}

export async function getReports(id: string) {
	return apiClient<ApiReportsDto>(reportsEndpoints.detail(id));
}

export async function createReports(body: ReportsCreateDto) {
	return apiClient<ApiReportsDto>(reportsEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateReports(id: string, body: ReportsUpdateDto) {
	return apiClient<ApiReportsDto>(reportsEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteReports(id: string) {
	return apiClient<void>(reportsEndpoints.delete(id), {
		method: "DELETE",
	});
}
