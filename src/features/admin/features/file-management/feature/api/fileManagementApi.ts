import { withMockOrRemote } from "@/lib/mock-mode";
import { vendorCoreApi } from "@/lib/vendor-core/api";
import type {
	InboundFileDto,
	MonitoringDashboardDto,
	ValidationResultDto,
	VendorDto,
} from "@/lib/vendor-core/types";

import {
	FILE_RUNS,
	type FileRun,
	type LogEntry,
	type ProcessStatus,
	type ValidationIssue,
	displayRunStatus,
	getFileRun,
	getValidationIssue,
	markFileRunReviewed,
} from "../../mock-data";

export {
	displayRunStatus,
	getFileRun,
	getValidationIssue,
	markFileRunReviewed,
};
export type { FileRun, LogEntry, ProcessStatus, ValidationIssue };

export async function listFileRuns(): Promise<FileRun[]> {
	return withMockOrRemote(
		() => FILE_RUNS,
		async () => [],
		[]
	);
}

export async function getFileRunById(id: string): Promise<FileRun | null> {
	return withMockOrRemote(
		() => getFileRun(id) ?? null,
		async () => null,
		null
	);
}

export async function listInboundFiles(params?: {
	stage?: string;
	vendor_id?: string;
}): Promise<InboundFileDto[]> {
	const page = await vendorCoreApi.listInboundFiles(params);
	return page.results ?? [];
}

export async function getInboundFile(id: string): Promise<InboundFileDto> {
	return vendorCoreApi.getInboundFile(id);
}

export async function listInboundFileVendors(): Promise<VendorDto[]> {
	const page = await vendorCoreApi.listVendors();
	return page.results ?? [];
}

export async function getMonitoring(): Promise<MonitoringDashboardDto> {
	return vendorCoreApi.getMonitoring();
}

export async function listValidationResults(params?: {
	inbound_file_id?: string;
	search?: string;
}): Promise<ValidationResultDto[]> {
	const page = await vendorCoreApi.listValidationResults(params);
	return page.results ?? [];
}

export async function listInboundFileEvents(inboundFileId: string) {
	return vendorCoreApi.listInboundFileEvents(inboundFileId);
}

export async function seedInboundFiles(body?: {
	vendor_id?: string;
	force?: boolean;
}) {
	return vendorCoreApi.seedInboundProcessing(body);
}

export async function reprocessInboundFile(id: string) {
	return vendorCoreApi.reprocessInboundFile(id);
}
