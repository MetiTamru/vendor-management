import { vendorCoreFetch } from "@/lib/vendor-core/client";
import type {
	ConnectionDto,
	ErrorRecordDto,
	InboundFileDto,
	IntakeJobDto,
	MonitoringDashboardDto,
	PaginatedResult,
	VendorDto,
} from "@/lib/vendor-core/types";

export const vendorCoreEndpoints = {
	vendors: "/api/v1/vendors/",
	connections: "/api/v1/connections/",
	connectionTest: (id: string) => `/api/v1/connections/${id}/test/`,
	intakeJobs: "/api/v1/intake-jobs/",
	intakeJobRun: (id: string) => `/api/v1/intake-jobs/${id}/run/`,
	inboundFiles: "/api/v1/inbound-files/",
	monitoring: "/api/v1/monitoring/",
	errors: "/api/v1/errors/",
	errorRetry: (id: string) => `/api/v1/errors/${id}/retry/`,
	routingRules: "/api/v1/routing-rules/",
	audit: "/api/v1/audit/",
} as const;

export const vendorCoreApi = {
	listVendors: (params?: { status?: string; search?: string }) =>
		vendorCoreFetch<PaginatedResult<VendorDto>>(vendorCoreEndpoints.vendors, {
			params,
		}),

	listConnections: (params?: {
		method?: string;
		status?: string;
		vendor_id?: string;
	}) =>
		vendorCoreFetch<PaginatedResult<ConnectionDto>>(
			vendorCoreEndpoints.connections,
			{ params }
		),

	testConnection: (id: string) =>
		vendorCoreFetch<Record<string, unknown>>(
			vendorCoreEndpoints.connectionTest(id),
			{ method: "POST" }
		),

	listIntakeJobs: (params?: { status?: string; vendor_id?: string }) =>
		vendorCoreFetch<PaginatedResult<IntakeJobDto>>(
			vendorCoreEndpoints.intakeJobs,
			{ params }
		),

	runIntakeJob: (id: string) =>
		vendorCoreFetch<{ task_id: string; job_id: string }>(
			vendorCoreEndpoints.intakeJobRun(id),
			{ method: "POST" }
		),

	listInboundFiles: (params?: { stage?: string; vendor_id?: string }) =>
		vendorCoreFetch<PaginatedResult<InboundFileDto>>(
			vendorCoreEndpoints.inboundFiles,
			{ params }
		),

	getMonitoring: () =>
		vendorCoreFetch<MonitoringDashboardDto>(vendorCoreEndpoints.monitoring),

	listErrors: (params?: { status?: string; category?: string }) =>
		vendorCoreFetch<PaginatedResult<ErrorRecordDto>>(
			vendorCoreEndpoints.errors,
			{ params }
		),

	retryError: (id: string) =>
		vendorCoreFetch<ErrorRecordDto>(vendorCoreEndpoints.errorRetry(id), {
			method: "POST",
		}),
};
