import { apiClient } from "@/lib/api/client";

import { approvalsEndpoints } from "../../approvals-endpoints";
import type {
	ApiApprovalsDto,
	ApprovalsCreateDto,
	ApprovalsUpdateDto,
} from "../dto/approvalsDto";

export async function listApprovals() {
	return apiClient<{ results?: ApiApprovalsDto[]; count?: number }>(
		approvalsEndpoints.list()
	);
}

export async function getApprovals(id: string) {
	return apiClient<ApiApprovalsDto>(approvalsEndpoints.detail(id));
}

export async function createApprovals(body: ApprovalsCreateDto) {
	return apiClient<ApiApprovalsDto>(approvalsEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateApprovals(id: string, body: ApprovalsUpdateDto) {
	return apiClient<ApiApprovalsDto>(approvalsEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteApprovals(id: string) {
	return apiClient<void>(approvalsEndpoints.delete(id), {
		method: "DELETE",
	});
}
