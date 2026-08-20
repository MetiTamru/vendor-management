import { withMockOrRemote } from "@/lib/mock-mode";
import { vendorCoreApi } from "@/lib/vendor-core/api";
import type { InboundFileDto, VendorDto } from "@/lib/vendor-core/types";

import { FILE_RUNS, type FileRun } from "../../../file-management/mock-data";

export async function listFileHistoryFileRuns(): Promise<FileRun[]> {
	return withMockOrRemote(
		() => FILE_RUNS,
		async () => [],
		[]
	);
}

export async function listFileHistoryInboundFiles(params?: {
	stage?: string;
	vendor_id?: string;
}): Promise<InboundFileDto[]> {
	const page = await vendorCoreApi.listInboundFiles(params);
	return page.results ?? [];
}

export async function listFileHistoryVendors(): Promise<VendorDto[]> {
	const page = await vendorCoreApi.listVendors();
	return page.results ?? [];
}
