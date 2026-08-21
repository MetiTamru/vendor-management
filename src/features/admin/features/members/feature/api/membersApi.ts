import { withMockOrRemote } from "@/lib/mock-mode";
import { vendorCoreApi } from "@/lib/vendor-core/api";
import type { MemberCoverageDto, VendorDto } from "@/lib/vendor-core/types";

import {
	type MemberDetail,
	type MemberSummary,
	getMember,
	getMemberSummaries,
} from "../../mock-data";
import { toMemberOverviewModel } from "../mappers/membersMappers";
import type { MemberOverviewModel } from "../types/membersModel";

export {
	displayName,
	formatCurrency,
	formatDate,
	getMember,
	maskSsn,
	memberAge,
} from "../../mock-data";
export type {
	AccumulatorRow,
	ClaimStatus,
	DependentRow,
	EligibilityStatus,
	ExceptionStatus,
	MemberDetail,
	MemberStatus,
	MemberSummary,
	OtherStatusRow,
} from "../../mock-data";

export type {
	MemberOverviewDto,
	MemberSummaryDto,
	MembersCreateDto,
	MembersUpdateDto,
} from "../dto/membersDto";

export async function listMemberSummaries() {
	return withMockOrRemote(
		() => getMemberSummaries(),
		async () => [] as MemberSummary[],
		[]
	);
}

export async function getMemberDetail(idOrMemberId: string) {
	return withMockOrRemote(
		() => getMember(idOrMemberId),
		async () => undefined,
		undefined
	);
}

/** Overview-shaped projection used by the member detail Overview tab. */
export async function getMemberOverview(
	idOrMemberId: string
): Promise<MemberOverviewModel | undefined> {
	const detail = await getMemberDetail(idOrMemberId);
	if (!detail) return undefined;
	return toMemberOverviewModel(toOverviewDto(detail));
}

function toOverviewDto(detail: MemberDetail): MemberOverviewModel {
	return {
		eligibilityStatus: detail.eligibilityStatus,
		coverageStart: detail.coverageStart,
		coverageEnd: detail.coverageEnd,
		planId: detail.planId,
		planCode: detail.planCode,
		benefitPackage: detail.benefitPackage,
		coverageLevelCode: detail.coverageLevelCode,
		coverageLevel: detail.coverageLevel,
		secondaryCoverage: detail.secondaryCoverage,
		statusEffectiveDate: detail.statusEffectiveDate,
		statusTermDate: detail.statusTermDate,
		enrollmentDate: detail.enrollmentDate,
		disenrollmentDate: detail.disenrollmentDate,
		lastEligibilityUpdate: detail.lastEligibilityUpdate,
		groupId: detail.groupId,
		groupName: detail.groupName,
		clientId: detail.clientId,
		accountType: detail.accountType,
		accountStatus: detail.accountStatus,
		memberType: detail.memberType,
		personCode: detail.personCode,
		relationshipCode: detail.relationshipCode,
		externalId: detail.externalId,
		employeeType: detail.employeeType,
		sourceSystem: detail.sourceSystem,
		sourceFileName: detail.sourceFileName,
		sourceFileReceived: detail.sourceFileReceived,
		recordStatus: detail.recordStatus,
		changeDetected: detail.changeDetected,
		dataAsOf: detail.dataAsOf,
		dependents: detail.dependents,
		claims: detail.claims,
		accumulators: detail.accumulators,
		otherStatuses: detail.otherStatuses,
	};
}

export async function listMemberCoverages(): Promise<MemberCoverageDto[]> {
	const page = await vendorCoreApi.listMemberCoverages();
	return page.results ?? [];
}

export async function listMemberVendors(): Promise<VendorDto[]> {
	const page = await vendorCoreApi.listVendors();
	return page.results ?? [];
}

export async function seedMemberCoverages(body?: {
	vendor_id?: string;
	force?: boolean;
}) {
	return vendorCoreApi.seedMemberCoverages(body);
}
