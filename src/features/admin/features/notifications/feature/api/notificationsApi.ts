import { apiClient } from "@/lib/api/client";

import { notificationsEndpoints } from "../../notifications-endpoints";
import type {
	ApiNotificationsDto,
	NotificationsCreateDto,
	NotificationsUpdateDto,
} from "../dto/notificationsDto";

export async function listNotifications() {
	return apiClient<{ results?: ApiNotificationsDto[]; count?: number }>(
		notificationsEndpoints.list()
	);
}

export async function getNotifications(id: string) {
	return apiClient<ApiNotificationsDto>(notificationsEndpoints.detail(id));
}

export async function createNotifications(body: NotificationsCreateDto) {
	return apiClient<ApiNotificationsDto>(notificationsEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateNotifications(id: string, body: NotificationsUpdateDto) {
	return apiClient<ApiNotificationsDto>(notificationsEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteNotifications(id: string) {
	return apiClient<void>(notificationsEndpoints.delete(id), {
		method: "DELETE",
	});
}
