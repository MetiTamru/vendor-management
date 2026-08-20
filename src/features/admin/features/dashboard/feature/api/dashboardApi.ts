import { withMockOrRemote } from "@/lib/mock-mode";
import { vendorCoreApi } from "@/lib/vendor-core/api";
import type { InboundFileDto } from "@/lib/vendor-core/types";

import { FILE_RUNS, type FileRun } from "../../../file-management/mock-data";

export async function listDashboardFileRuns(): Promise<FileRun[]> {
	return withMockOrRemote(
		() => FILE_RUNS,
		async () => [],
		[]
	);
}

export async function listDashboardInboundFiles(params?: {
	stage?: string;
	vendor_id?: string;
}): Promise<InboundFileDto[]> {
	const page = await vendorCoreApi.listInboundFiles(params);
	return page.results ?? [];
}
