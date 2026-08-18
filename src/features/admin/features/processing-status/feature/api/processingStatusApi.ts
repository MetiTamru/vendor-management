import { vendorCoreApi } from "@/lib/vendor-core/api";
import type { MonitoringDashboardDto, ValidationResultDto } from "@/lib/vendor-core/types";

import { FILE_RUNS, type FileRun } from "../../../file-management/mock-data";
import { withMockOrRemote } from "@/lib/mock-mode";

export async function listProcessingStatusFileRuns(): Promise<FileRun[]> {
	return withMockOrRemote(() => FILE_RUNS, async () => [], []);
}

export async function getProcessingStatusMonitoring(): Promise<MonitoringDashboardDto> {
	return vendorCoreApi.getMonitoring();
}

export async function listProcessingStatusValidationResults(params?: {
	inbound_file_id?: string;
	search?: string;
}): Promise<ValidationResultDto[]> {
	const page = await vendorCoreApi.listValidationResults(params);
	return page.results ?? [];
}
