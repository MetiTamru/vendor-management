import type { OnboardingCaseModel } from "@/features/shared/vms/types";

import type { ApiOnboardingDto } from "../dto/onboardingDto";

/** VMS records already use the frontend model shape. */
export function toOnboardingModel(dto: ApiOnboardingDto): OnboardingCaseModel {
	return dto;
}
