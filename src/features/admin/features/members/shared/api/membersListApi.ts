import { apiClient } from "@/lib/api/client";

import { membersEndpoints } from "../../members-endpoints";
import type { ApiMembersRecordDto } from "../dto/membersRecordDto";

export { membersEndpoints };

export type MembersListResponse = {
	results?: ApiMembersRecordDto[] | null;
	count?: number | null;
};

export async function listMembersRecords(params?: Record<string, string>) {
	return apiClient<MembersListResponse>(membersEndpoints.list(), { params });
}

export async function getMembersRecord(id: string) {
	return apiClient<ApiMembersRecordDto>(membersEndpoints.detail(id));
}
