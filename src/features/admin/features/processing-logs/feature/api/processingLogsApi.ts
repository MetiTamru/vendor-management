import { vendorCoreApi } from "@/lib/vendor-core/api";
import type {
	InboundFileDto,
	ValidationResultDto,
	VendorDto,
} from "@/lib/vendor-core/types";

import { FILE_RUNS, type FileRun } from "../../../file-management/mock-data";
import { withMockOrRemote } from "@/lib/mock-mode";

export async function listProcessingLogFileRuns(): Promise<FileRun[]> {
	return withMockOrRemote(() => FILE_RUNS, async () => [], []);
}

export async function listProcessingLogInboundFiles(params?: {
	stage?: string;
	vendor_id?: string;
}): Promise<InboundFileDto[]> {
	const page = await vendorCoreApi.listInboundFiles(params);
	return page.results ?? [];
}

export async function getProcessingLogInboundFile(id: string) {
	return vendorCoreApi.getInboundFile(id);
}

export async function listProcessingLogInboundFileEvents(inboundFileId: string) {
	return vendorCoreApi.listInboundFileEvents(inboundFileId);
}

export async function listProcessingLogValidationResults(params?: {
	inbound_file_id?: string;
	search?: string;
}): Promise<ValidationResultDto[]> {
	const page = await vendorCoreApi.listValidationResults(params);
	return page.results ?? [];
}

export async function listProcessingLogVendors(): Promise<VendorDto[]> {
	const page = await vendorCoreApi.listVendors();
	return page.results ?? [];
}
