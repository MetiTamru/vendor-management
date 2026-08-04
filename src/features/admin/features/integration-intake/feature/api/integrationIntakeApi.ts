import { apiClient } from "@/lib/api/client";

import { integrationIntakeEndpoints } from "../../integration-intake-endpoints";
import type {
	ApiIntegrationIntakeDto,
	IntegrationIntakeCreateDto,
	IntegrationIntakeUpdateDto,
} from "../dto/integrationIntakeDto";

export async function listIntegrationIntake() {
	return apiClient<{ results?: ApiIntegrationIntakeDto[]; count?: number }>(
		integrationIntakeEndpoints.list()
	);
}

export async function getIntegrationIntake(id: string) {
	return apiClient<ApiIntegrationIntakeDto>(
		integrationIntakeEndpoints.detail(id)
	);
}

export async function createIntegrationIntake(
	body: IntegrationIntakeCreateDto
) {
	return apiClient<ApiIntegrationIntakeDto>(
		integrationIntakeEndpoints.create(),
		{
			method: "POST",
			body: JSON.stringify(body),
		}
	);
}

export async function updateIntegrationIntake(
	id: string,
	body: IntegrationIntakeUpdateDto
) {
	return apiClient<ApiIntegrationIntakeDto>(
		integrationIntakeEndpoints.update(id),
		{
			method: "PATCH",
			body: JSON.stringify(body),
		}
	);
}

export async function deleteIntegrationIntake(id: string) {
	return apiClient<void>(integrationIntakeEndpoints.delete(id), {
		method: "DELETE",
	});
}
