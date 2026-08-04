import { apiClient } from "@/lib/api/client";

import { onboardingEndpoints } from "../../onboarding-endpoints";
import type { ApiOnboardingRecordDto } from "../dto/onboardingRecordDto";

export { onboardingEndpoints };

export type OnboardingListResponse = {
	results?: ApiOnboardingRecordDto[] | null;
	count?: number | null;
};

export async function listOnboardingRecords(params?: Record<string, string>) {
	return apiClient<OnboardingListResponse>(onboardingEndpoints.list(), {
		params,
	});
}

export async function getOnboardingRecord(id: string) {
	return apiClient<ApiOnboardingRecordDto>(onboardingEndpoints.detail(id));
}
