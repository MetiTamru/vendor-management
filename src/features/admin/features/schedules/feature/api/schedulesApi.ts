import { withMockOrRemote } from "@/lib/mock-mode";
import { vendorCoreApi } from "@/lib/vendor-core/api";
import type {
	ConnectionDto,
	IntakeJobDto,
	IntakeJobRunDto,
	VendorDto,
} from "@/lib/vendor-core/types";

import {
	FILE_RUNS,
	type FileRun,
	type ProcessStatus,
	displayRunStatus,
} from "../../../file-management/mock-data";

export { displayRunStatus };
export type { FileRun, ProcessStatus };

export async function listScheduleFileRuns(): Promise<FileRun[]> {
	return withMockOrRemote(
		() => FILE_RUNS,
		async () => [],
		[]
	);
}

export async function listIntakeJobs(
	vendorId?: string
): Promise<IntakeJobDto[]> {
	const page = await vendorCoreApi.listIntakeJobs(
		vendorId ? { vendor_id: vendorId } : undefined
	);
	return page.results ?? [];
}

export async function listScheduleVendors(): Promise<VendorDto[]> {
	const page = await vendorCoreApi.listVendors();
	return page.results ?? [];
}

export async function listScheduleConnections(
	vendorId?: string
): Promise<ConnectionDto[]> {
	const page = await vendorCoreApi.listConnections(
		vendorId ? { vendor_id: vendorId } : undefined
	);
	return page.results ?? [];
}

export async function listIntakeJobRuns(params?: {
	job_id?: string;
	stage?: string;
}): Promise<IntakeJobRunDto[]> {
	const page = await vendorCoreApi.listIntakeJobRuns(params);
	return page.results ?? [];
}

export async function createIntakeJob(body: Record<string, unknown>) {
	return vendorCoreApi.createIntakeJob(body);
}

export async function updateIntakeJob(
	id: string,
	body: Record<string, unknown>
) {
	return vendorCoreApi.updateIntakeJob(id, body);
}

export async function runIntakeJob(id: string) {
	return vendorCoreApi.runIntakeJob(id);
}
