import { withMockOrRemote } from "@/lib/mock-mode";
import { vendorCoreApi } from "@/lib/vendor-core/api";
import type { ClaimLineDto } from "@/lib/vendor-core/types";
import type { ProgramFileType } from "@/types/UI/system.types";

import {
	CLAIM_EXCEPTIONS,
	CLAIM_LINES,
	CLAIM_RESPONSES,
	CLAIM_VENDOR_FILES,
	REJECT_REASON_CATALOG,
	SHOWCASE_CLAIM_DETAIL,
	SUBMISSION_BATCHES,
	applyClaimReviews,
	buildClaimDetailFromLine,
	claimVendorsForComparison,
	claimsForBatch,
	claimsForFile,
	claimsForResponse,
	displayClaimStatus,
	downloadTextFile,
	exceptionsForProgram,
	exportRowsAsCsv,
	filesForProgram,
	formatCount,
	formatCurrency,
	getClaimDetail,
	getClaimResponse,
	getSubmissionBatch,
	getVendorFile,
	responsesForProgram,
	vendorPerformanceForProgram,
} from "../../mock-data";

export {
	REJECT_REASON_CATALOG,
	SHOWCASE_CLAIM_DETAIL,
	applyClaimReviews,
	buildClaimDetailFromLine,
	claimVendorsForComparison,
	claimsForBatch,
	claimsForFile,
	claimsForResponse,
	displayClaimStatus,
	exceptionsForProgram,
	exportRowsAsCsv,
	filesForProgram,
	formatCount,
	formatCurrency,
	getClaimDetail,
	getClaimResponse,
	getSubmissionBatch,
	getVendorFile,
	responsesForProgram,
	vendorPerformanceForProgram,
	downloadTextFile,
};
export type {
	ClaimDetail,
	ClaimException,
	ClaimFileStatus,
	ClaimLine,
	ClaimResponse,
	ClaimVendorFile,
	MfcReviewStatus,
	RejectReason,
	SubmissionBatch,
	VendorPerformanceRow,
} from "../../mock-data";

export async function listClaimVendorFiles() {
	return withMockOrRemote(
		() => CLAIM_VENDOR_FILES,
		async () => [],
		[]
	);
}

export async function listClaimResponses() {
	return withMockOrRemote(
		() => CLAIM_RESPONSES,
		async () => [],
		[]
	);
}

export async function listClaimExceptions() {
	return withMockOrRemote(
		() => CLAIM_EXCEPTIONS,
		async () => [],
		[]
	);
}

export async function listClaimLines() {
	return withMockOrRemote(
		() => CLAIM_LINES,
		async () => [],
		[]
	);
}

export async function listSubmissionBatches() {
	return withMockOrRemote(
		() => SUBMISSION_BATCHES,
		async () => [],
		[]
	);
}

export async function listClaimLinesLive(): Promise<ClaimLineDto[]> {
	const page = await vendorCoreApi.listClaimLines();
	return page.results ?? [];
}

export async function seedClaimLines(body?: {
	vendor_id?: string;
	force?: boolean;
}) {
	return vendorCoreApi.seedClaimLines(body);
}

export async function createClaimLine(body: Record<string, unknown>) {
	return vendorCoreApi.createClaimLine(body);
}

export async function updateClaimLine(
	id: string,
	body: Record<string, unknown>
) {
	return vendorCoreApi.updateClaimLine(id, body);
}

export async function deleteClaimLine(id: string) {
	return vendorCoreApi.deleteClaimLine(id);
}

export async function hardDeleteClaimLine(id: string) {
	return vendorCoreApi.hardDeleteClaimLine(id);
}

export async function restoreClaimLine(id: string) {
	return vendorCoreApi.restoreClaimLine(id);
}

export async function getProgramFiles(
	program: ProgramFileType,
	direction: "inbound" | "outbound"
) {
	const files = await listClaimVendorFiles();
	return filesForProgram(program, direction);
}

export async function getProgramResponses(program: ProgramFileType) {
	const files = await listClaimVendorFiles();
	return responsesForProgram(program);
}

export async function getProgramExceptions(program: ProgramFileType) {
	const files = await listClaimVendorFiles();
	return exceptionsForProgram(program);
}

export async function getProgramVendorPerformance(program: ProgramFileType) {
	const files = await listClaimVendorFiles();
	return vendorPerformanceForProgram(program);
}
