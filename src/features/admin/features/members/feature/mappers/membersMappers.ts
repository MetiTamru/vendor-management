import type { MembersCreateDto, MembersUpdateDto } from "../dto/membersDto";
import type { MembersModel } from "../types/membersModel";

export { toMembersModel } from "../../shared/mappers/membersMappers";

export {
	buildAccumulatorSummaryForMember,
	mapAccumulators,
	mapAccumulatorSummary,
	mapAccumulatorFileRowToTransaction,
	mapPharmacyClaimRowToTransaction,
	mergeRecentAccumulatorTransactions,
} from "@/features/admin/features/members/map-member-core";

export function toMembersCreateDto(
	model: Pick<MembersModel, "name">
): MembersCreateDto {
	return { name: model.name };
}

export function toMembersUpdateDto(
	model: Partial<Pick<MembersModel, "name">>
): MembersUpdateDto {
	return {
		...(model.name != null ? { name: model.name } : {}),
	};
}
