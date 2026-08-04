import { apiClient } from "@/lib/api/client";

import { schedulesEndpoints } from "../../schedules-endpoints";
import type {
	ApiSchedulesDto,
	SchedulesCreateDto,
	SchedulesUpdateDto,
} from "../dto/schedulesDto";

export async function listSchedules() {
	return apiClient<{ results?: ApiSchedulesDto[]; count?: number }>(
		schedulesEndpoints.list()
	);
}

export async function getSchedules(id: string) {
	return apiClient<ApiSchedulesDto>(schedulesEndpoints.detail(id));
}

export async function createSchedules(body: SchedulesCreateDto) {
	return apiClient<ApiSchedulesDto>(schedulesEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateSchedules(id: string, body: SchedulesUpdateDto) {
	return apiClient<ApiSchedulesDto>(schedulesEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteSchedules(id: string) {
	return apiClient<void>(schedulesEndpoints.delete(id), {
		method: "DELETE",
	});
}
