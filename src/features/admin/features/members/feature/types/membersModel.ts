import type { FeatureListResult } from "@/features/admin/shared/feature-contract";

import type {
	AccumulatorDto,
	DependentDto,
	MemberClaimDto,
	MemberOverviewDto,
	MemberSummaryDto,
	OtherStatusDto,
} from "../dto/membersDto";

/** Domain models mirror transport for mock-backed members until vendor-core expands. */
export type MemberSummaryModel = MemberSummaryDto;
export type MemberOverviewModel = MemberOverviewDto;
export type DependentModel = DependentDto;
export type AccumulatorModel = AccumulatorDto;
export type MemberClaimModel = MemberClaimDto;
export type OtherStatusModel = OtherStatusDto;

/** @deprecated Prefer MemberSummaryModel — kept for scaffold compatibility. */
export type MembersModel = {
	id: string;
	name: string;
};

export type MembersListResult = FeatureListResult<MemberSummaryModel>;
