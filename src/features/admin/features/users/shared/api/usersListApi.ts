import { apiClient } from "@/lib/api/client";

import { usersEndpoints } from "../../users-endpoints";
import type { ApiUsersRecordDto } from "../dto/usersRecordDto";

export { usersEndpoints };

export type UsersListResponse = {
	results?: ApiUsersRecordDto[] | null;
	count?: number | null;
};

export async function listUsersRecords(params?: Record<string, string>) {
	return apiClient<UsersListResponse>(usersEndpoints.list(), { params });
}

export async function getUsersRecord(id: string) {
	return apiClient<ApiUsersRecordDto>(usersEndpoints.detail(id));
}
