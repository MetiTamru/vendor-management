import { apiClient } from "@/lib/api/client";

import { groupsEndpoints } from "../../groups-endpoints";
import type { ApiGroupsRecordDto } from "../dto/groupsRecordDto";

export { groupsEndpoints };

export type GroupsListResponse = {
	results?: ApiGroupsRecordDto[] | null;
	count?: number | null;
};

export async function listGroupsRecords(params?: Record<string, string>) {
	return apiClient<GroupsListResponse>(groupsEndpoints.list(), { params });
}

export async function getGroupsRecord(id: string) {
	return apiClient<ApiGroupsRecordDto>(groupsEndpoints.detail(id));
}
