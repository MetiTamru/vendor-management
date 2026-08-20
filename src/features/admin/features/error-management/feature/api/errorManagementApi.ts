import { withMockOrRemote } from "@/lib/mock-mode";
import { vendorCoreApi } from "@/lib/vendor-core/api";
import type {
	ErrorRecordDto,
	InboundFileDto,
	ValidationResultDto,
	VendorDto,
} from "@/lib/vendor-core/types";

import { FILE_RUNS, type FileRun } from "../../../file-management/mock-data";

export async function listErrorManagementFileRuns(): Promise<FileRun[]> {
	return withMockOrRemote(
		() => FILE_RUNS,
		async () => [],
		[]
	);
}

export async function listErrorRecords(
	status?: string
): Promise<ErrorRecordDto[]> {
	const page = await vendorCoreApi.listErrors(
		status && status !== "all" ? { status } : undefined
	);
	return page.results ?? [];
}

export async function listErrorValidationResults(params?: {
	inbound_file_id?: string;
	search?: string;
}): Promise<ValidationResultDto[]> {
	const page = await vendorCoreApi.listValidationResults(params);
	return page.results ?? [];
}

export async function listErrorInboundFiles(params?: {
	stage?: string;
	vendor_id?: string;
}): Promise<InboundFileDto[]> {
	const page = await vendorCoreApi.listInboundFiles(params);
	return page.results ?? [];
}

export async function listErrorVendors(): Promise<VendorDto[]> {
	const page = await vendorCoreApi.listVendors();
	return page.results ?? [];
}
