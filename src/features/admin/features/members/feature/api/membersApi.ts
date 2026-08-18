import { vendorCoreApi } from "@/lib/vendor-core/api";
import type { MemberCoverageDto, VendorDto } from "@/lib/vendor-core/types";

import {
	MEMBER_SUMMARIES,
	getMember,
} from "../../mock-data";
import { withMockOrRemote } from "@/lib/mock-mode";

export {
	displayName,
	formatCurrency,
	formatDate,
	getMember,
	maskSsn,
	memberAge,
} from "../../mock-data";
export type {
	ClaimStatus,
	EligibilityStatus,
	ExceptionStatus,
	MemberDetail,
	MemberStatus,
	MemberSummary,
} from "../../mock-data";

export async function listMemberSummaries() {
	return withMockOrRemote(
		() => MEMBER_SUMMARIES,
		async () => [] as typeof MEMBER_SUMMARIES,
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
