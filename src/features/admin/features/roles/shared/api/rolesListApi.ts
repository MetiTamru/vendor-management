import { apiClient } from "@/lib/api/client";

import { rolesEndpoints } from "../../roles-endpoints";
import type { ApiRolesRecordDto } from "../dto/rolesRecordDto";

export { rolesEndpoints };

export type RolesListResponse = {
	results?: ApiRolesRecordDto[] | null;
	count?: number | null;
};

export async function listRolesRecords(params?: Record<string, string>) {
	return apiClient<RolesListResponse>(rolesEndpoints.list(), { params });
}

export async function getRolesRecord(id: string) {
	return apiClient<ApiRolesRecordDto>(rolesEndpoints.detail(id));
}
