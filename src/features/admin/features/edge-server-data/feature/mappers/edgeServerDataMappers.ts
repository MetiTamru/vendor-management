import { publishedDateLabel as labelForPublishedDate } from "../../mock-data";
import type {
	ApiEdgeServerDataDto,
	ApiHhsMasterDataDto,
} from "../dto/edgeServerDataDto";
import type {
	EdgeServerDataModel,
	HhsMasterDataModel,
} from "../types/edgeServerDataModel";

export function toEdgeServerDataModel(
	dto: ApiEdgeServerDataDto
): EdgeServerDataModel {
	return dto;
}

export function toHhsMasterDataModel(
	dto: ApiHhsMasterDataDto
): HhsMasterDataModel {
	return dto;
}

export function publishedDateLabel(value: string) {
	return labelForPublishedDate(value);
}
