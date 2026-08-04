import { apiClient } from "@/lib/api/client";

import { onboardingEndpoints } from "../../onboarding-endpoints";
import type {
	ApiOnboardingDto,
	OnboardingCreateDto,
	OnboardingUpdateDto,
} from "../dto/onboardingDto";

export async function listOnboarding() {
	return apiClient<{ results?: ApiOnboardingDto[]; count?: number }>(
		onboardingEndpoints.list()
	);
}

export async function getOnboarding(id: string) {
	return apiClient<ApiOnboardingDto>(onboardingEndpoints.detail(id));
}

export async function createOnboarding(body: OnboardingCreateDto) {
	return apiClient<ApiOnboardingDto>(onboardingEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateOnboarding(id: string, body: OnboardingUpdateDto) {
	return apiClient<ApiOnboardingDto>(onboardingEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteOnboarding(id: string) {
	return apiClient<void>(onboardingEndpoints.delete(id), {
		method: "DELETE",
	});
}
