/** Intentionally mock-backed analytics domain; no vendor-core route. */
import { withMockOrRemote } from "@/lib/mock-mode";

import * as mock from "../../mock-data";

export async function listHccSummary() {
	return withMockOrRemote(
		() => mock.HCC_SUMMARY_ROWS,
		async () => []
	);
}

export async function listMemberOpportunities() {
	return withMockOrRemote(
		() => mock.MEMBER_OPPORTUNITY_ROWS,
		async () => []
	);
}

export async function listCodingValidation() {
	return withMockOrRemote(
		() => mock.CODING_VALIDATION_ROWS,
		async () => []
	);
}

export async function listRaSubmissions() {
	return withMockOrRemote(
		() => mock.RA_SUBMISSION_ROWS,
		async () => []
	);
}

export async function listRaAudits() {
	return withMockOrRemote(
		() => mock.RA_AUDIT_ROWS,
		async () => []
	);
}

export async function listRaDocuments() {
	return withMockOrRemote(
		() => mock.RA_DOCUMENT_ROWS,
		async () => []
	);
}

export async function getMemberOpportunityDetail(
	...args: Parameters<typeof mock.getMemberOpportunityDetail>
) {
	return withMockOrRemote(
		() => mock.getMemberOpportunityDetail(...args),
		async () =>
			undefined as unknown as Awaited<
				ReturnType<typeof mock.getMemberOpportunityDetail>
			>
	);
}
