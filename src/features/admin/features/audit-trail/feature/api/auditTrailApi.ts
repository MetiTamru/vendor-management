import { apiClient } from "@/lib/api/client";

import { auditTrailEndpoints } from "../../audit-trail-endpoints";
import type {
	ApiAuditTrailDto,
	AuditTrailCreateDto,
	AuditTrailUpdateDto,
} from "../dto/auditTrailDto";

export async function listAuditTrail() {
	return apiClient<{ results?: ApiAuditTrailDto[]; count?: number }>(
		auditTrailEndpoints.list()
	);
}

export async function getAuditTrail(id: string) {
	return apiClient<ApiAuditTrailDto>(auditTrailEndpoints.detail(id));
}

export async function createAuditTrail(body: AuditTrailCreateDto) {
	return apiClient<ApiAuditTrailDto>(auditTrailEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateAuditTrail(id: string, body: AuditTrailUpdateDto) {
	return apiClient<ApiAuditTrailDto>(auditTrailEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteAuditTrail(id: string) {
	return apiClient<void>(auditTrailEndpoints.delete(id), {
		method: "DELETE",
	});
}
