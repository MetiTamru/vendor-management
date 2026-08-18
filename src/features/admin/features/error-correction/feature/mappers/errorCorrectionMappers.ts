import type {
	ApiErrorReviewDto,
	ApiErrorSummaryDto,
} from "../dto/errorCorrectionDto";
import type {
	ErrorReviewModel,
	ErrorSummaryModel,
} from "../types/errorCorrectionModel";

export function toErrorSummaryModel(
	dto: ApiErrorSummaryDto
): ErrorSummaryModel {
	return dto;
}

export function toErrorReviewModel(dto: ApiErrorReviewDto): ErrorReviewModel {
	return dto;
}
