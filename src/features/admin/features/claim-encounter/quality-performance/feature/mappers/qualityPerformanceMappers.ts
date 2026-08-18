import type { ApiQualityPerformancePlaceholderDto } from "../dto/qualityPerformanceDto";
import type { QualityPerformancePlaceholderModel } from "../types/qualityPerformanceModel";

export function toQualityPerformancePlaceholderModel(
	dto: ApiQualityPerformancePlaceholderDto
): QualityPerformancePlaceholderModel {
	return {
		slug: dto.slug as QualityPerformancePlaceholderModel["slug"],
		title: dto.title,
		description: dto.description,
	};
}
