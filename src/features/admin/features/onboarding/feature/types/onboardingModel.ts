import type { OnboardingCaseModel } from "@/features/shared/vms/types";

export type OnboardingModel = OnboardingCaseModel;

export type OnboardingListResult = {
	items: OnboardingCaseModel[];
	total: number;
};
