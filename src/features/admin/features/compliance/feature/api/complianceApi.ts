import { apiClient } from "@/lib/api/client";

import { complianceEndpoints } from "../../compliance-endpoints";
import type {
	ApiComplianceDto,
	ComplianceCreateDto,
	ComplianceUpdateDto,
} from "../dto/complianceDto";

export async function listCompliance() {
	return apiClient<{ results?: ApiComplianceDto[]; count?: number }>(
		complianceEndpoints.list()
	);
}

export async function getCompliance(id: string) {
	return apiClient<ApiComplianceDto>(complianceEndpoints.detail(id));
}

export async function createCompliance(body: ComplianceCreateDto) {
	return apiClient<ApiComplianceDto>(complianceEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateCompliance(id: string, body: ComplianceUpdateDto) {
	return apiClient<ApiComplianceDto>(complianceEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteCompliance(id: string) {
	return apiClient<void>(complianceEndpoints.delete(id), {
		method: "DELETE",
	});
}
