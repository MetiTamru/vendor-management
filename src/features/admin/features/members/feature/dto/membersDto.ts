import type { ApiMembersRecordDto } from "../../shared/dto/membersRecordDto";

export type ApiMembersDto = ApiMembersRecordDto;

export type MembersCreateDto = {
	name: string;
};

export type MembersUpdateDto = Partial<MembersCreateDto>;

/** Wire / API DTOs for Member Accumulators tab (snake_case BE contract). */
export type {
	MemberAccumulatorAmountDto,
	MemberAccumulatorKpiDto,
	MemberAccumulatorSummaryDto as ApiMemberAccumulatorSummaryDto,
	MemberAccumulatorTableRowDto,
	MemberAccumulatorTransactionDto,
} from "@/lib/vendor-core/types";

/** Flat MemberAccumulator create body (legacy CRUD until nested write ships). */
export type MemberAccumulatorCreateBody = {
	label: string;
	individual?: number;
	family?: number;
	remaining?: number;
	limit?: number;
};

export type MemberAccumulatorUpdateBody = Partial<MemberAccumulatorCreateBody>;
