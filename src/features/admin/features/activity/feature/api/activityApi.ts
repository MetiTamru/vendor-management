import { apiClient } from "@/lib/api/client";

import { activityEndpoints } from "../../activity-endpoints";
import type {
	ActivityCreateDto,
	ActivityUpdateDto,
	ApiActivityDto,
} from "../dto/activityDto";

export async function listActivity() {
	return apiClient<{ results?: ApiActivityDto[]; count?: number }>(
		activityEndpoints.list()
	);
}

export async function getActivity(id: string) {
	return apiClient<ApiActivityDto>(activityEndpoints.detail(id));
}

export async function createActivity(body: ActivityCreateDto) {
	return apiClient<ApiActivityDto>(activityEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateActivity(id: string, body: ActivityUpdateDto) {
	return apiClient<ApiActivityDto>(activityEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteActivity(id: string) {
	return apiClient<void>(activityEndpoints.delete(id), {
		method: "DELETE",
	});
}
