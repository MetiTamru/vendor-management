import type { ApiOnboardingRecordDto } from "../dto/onboardingRecordDto";
import type { OnboardingModel } from "../../feature/types/onboardingModel";

export function toOnboardingModel(
	row: ApiOnboardingRecordDto,
	index = 0
): OnboardingModel {
	const id = row.id != null ? String(row.id) : `onboarding-${index}`;
	const name =
		typeof row.name === "string" && row.name.length > 0 ? row.name : "—";
	return { id, name };
}
