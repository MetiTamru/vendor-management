import type { ApiComplianceProgramPageDto } from "../dto/complianceProgramDto";
import type { ComplianceProgramPageModel } from "../types/complianceProgramModel";

export function toComplianceProgramPageModel(
	dto: ApiComplianceProgramPageDto
): ComplianceProgramPageModel {
	return dto;
}
