import type { OnboardingCaseModel } from "@/features/shared/vms/types";

export type ApiOnboardingDto = OnboardingCaseModel;
export type OnboardingCreateDto = Omit<OnboardingCaseModel, "id" | "updatedAt">;
export type OnboardingUpdateDto = Partial<OnboardingCaseModel>;
