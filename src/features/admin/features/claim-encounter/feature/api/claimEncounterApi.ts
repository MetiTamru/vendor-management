import { apiClient } from "@/lib/api/client";

import { claimEncounterEndpoints } from "../../claim-encounter-endpoints";
import type {
	ApiClaimEncounterDto,
	ClaimEncounterCreateDto,
	ClaimEncounterUpdateDto,
} from "../dto/claimEncounterDto";

export async function listClaimEncounter() {
	return apiClient<{ results?: ApiClaimEncounterDto[]; count?: number }>(
		claimEncounterEndpoints.list()
	);
}

export async function getClaimEncounter(id: string) {
	return apiClient<ApiClaimEncounterDto>(claimEncounterEndpoints.detail(id));
}

export async function createClaimEncounter(body: ClaimEncounterCreateDto) {
	return apiClient<ApiClaimEncounterDto>(claimEncounterEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateClaimEncounter(id: string, body: ClaimEncounterUpdateDto) {
	return apiClient<ApiClaimEncounterDto>(claimEncounterEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteClaimEncounter(id: string) {
	return apiClient<void>(claimEncounterEndpoints.delete(id), {
		method: "DELETE",
	});
}
