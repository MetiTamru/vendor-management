import type {
	MemberOverviewDto,
	MemberSummaryDto,
	MembersCreateDto,
	MembersUpdateDto,
} from "../dto/membersDto";
import type {
	MemberOverviewModel,
	MemberSummaryModel,
	MembersModel,
} from "../types/membersModel";

export { toMembersModel } from "../../shared/mappers/membersMappers";

export function toMemberSummaryModel(row: MemberSummaryDto): MemberSummaryModel {
	return { ...row };
}

export function toMemberOverviewModel(
	row: MemberOverviewDto
): MemberOverviewModel {
	return {
		...row,
		dependents: row.dependents ?? [],
		claims: row.claims ?? [],
		accumulators: row.accumulators ?? [],
		otherStatuses: row.otherStatuses ?? [],
	};
}

export function displayMemberName(
	m: Pick<MemberSummaryModel, "firstName" | "middleName" | "lastName">
) {
	return [m.firstName, m.middleName, m.lastName].filter(Boolean).join(" ");
}

export function toMembersCreateDto(
	model: Pick<
		MemberSummaryModel,
		"memberId" | "firstName" | "lastName" | "program" | "planName"
	>
): MembersCreateDto {
	return {
		memberId: model.memberId,
		firstName: model.firstName,
		lastName: model.lastName,
		program: model.program,
		planName: model.planName,
	};
}

export function toMembersUpdateDto(
	model: Partial<
		Pick<
			MemberSummaryModel,
			| "memberId"
			| "firstName"
			| "lastName"
			| "program"
			| "planName"
			| "status"
			| "eligibilityLabel"
			| "accountGroup"
			| "alternateId"
		>
	>
): MembersUpdateDto {
	return {
		...(model.memberId != null ? { memberId: model.memberId } : {}),
		...(model.firstName != null ? { firstName: model.firstName } : {}),
		...(model.lastName != null ? { lastName: model.lastName } : {}),
		...(model.program != null ? { program: model.program } : {}),
		...(model.planName != null ? { planName: model.planName } : {}),
		...(model.status != null ? { status: model.status } : {}),
		...(model.eligibilityLabel != null
			? { eligibilityLabel: model.eligibilityLabel }
			: {}),
		...(model.accountGroup != null ? { accountGroup: model.accountGroup } : {}),
		...(model.alternateId != null ? { alternateId: model.alternateId } : {}),
	};
}

/** Scaffold helper: map summary → legacy { id, name } model. */
export function toLegacyMembersModel(row: MemberSummaryModel): MembersModel {
	return {
		id: row.id,
		name: displayMemberName(row),
	};
}
