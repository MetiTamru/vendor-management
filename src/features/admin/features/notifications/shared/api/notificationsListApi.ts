import { apiClient } from "@/lib/api/client";

import { notificationsEndpoints } from "../../notifications-endpoints";
import type { ApiNotificationsRecordDto } from "../dto/notificationsRecordDto";

export { notificationsEndpoints };

export type NotificationsListResponse = {
	results?: ApiNotificationsRecordDto[] | null;
	count?: number | null;
};

export async function listNotificationsRecords(
	params?: Record<string, string>
) {
	return apiClient<NotificationsListResponse>(notificationsEndpoints.list(), {
		params,
	});
}

export async function getNotificationsRecord(id: string) {
	return apiClient<ApiNotificationsRecordDto>(
		notificationsEndpoints.detail(id)
	);
}
