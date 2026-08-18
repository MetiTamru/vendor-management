"use client";

import {
	useInvalidateVendorCore,
	useVendorCoreFeatureMutation,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";

import {
	createIntegrationIntakeJob,
	getIntegrationMonitoring,
	listIntegrationConnections,
	listIntegrationErrors,
	listIntegrationJobRuns,
	listIntegrationJobs,
	listIntegrationVendors,
	runIntegrationIntakeJob,
	updateIntegrationIntakeJob,
} from "../api/integrationIntakeApi";

const domain = "integration-intake";

export function useIntegrationMonitoringQuery() {
	return useVendorCoreFeatureQuery(domain, "monitoring", getIntegrationMonitoring);
}

export function useIntegrationConnectionsQuery(vendorId?: string) {
	return useVendorCoreFeatureQuery(
		domain,
		"connections",
		() => listIntegrationConnections(vendorId),
		true,
		[vendorId ?? "all"]
	);
}

export function useIntegrationJobsQuery(vendorId?: string) {
	return useVendorCoreFeatureQuery(
		domain,
		"jobs",
		() => listIntegrationJobs(vendorId),
		true,
		[vendorId ?? "all"]
	);
}

export function useIntegrationJobRunsQuery(params?: {
	job_id?: string;
	stage?: string;
}) {
	return useVendorCoreFeatureQuery(
		domain,
		"job-runs",
		() => listIntegrationJobRuns(params),
		true,
		[params ?? {}]
	);
}

export function useIntegrationErrorsQuery(status = "open", enabled = true) {
	return useVendorCoreFeatureQuery(
		domain,
		"errors",
		() => listIntegrationErrors(status),
		enabled,
		[status]
	);
}

export function useIntegrationVendorsQuery() {
	return useVendorCoreFeatureQuery(domain, "vendors", listIntegrationVendors);
}

export function useCreateIntegrationIntakeJobMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof createIntegrationIntakeJob>>,
		Record<string, unknown>
	>(domain, {
		mutationFn: (body) => createIntegrationIntakeJob(body),
	});
}

export function useUpdateIntegrationIntakeJobMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof updateIntegrationIntakeJob>>,
		{ id: string; body: Record<string, unknown> }
	>(domain, {
		mutationFn: ({ id, body }) => updateIntegrationIntakeJob(id, body),
	});
}

export function useRunIntegrationIntakeJobMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof runIntegrationIntakeJob>>,
		string
	>(domain, {
		mutationFn: (id) => runIntegrationIntakeJob(id),
	});
}

export const useVendorCoreMonitoring = useIntegrationMonitoringQuery;
export const useVendorCoreConnections = useIntegrationConnectionsQuery;
export const useVendorCoreJobs = useIntegrationJobsQuery;
export const useVendorCoreJobRuns = useIntegrationJobRunsQuery;
export const useVendorCoreErrors = useIntegrationErrorsQuery;
export const useVendorCoreVendors = useIntegrationVendorsQuery;
export const useCreateIntakeJob = useCreateIntegrationIntakeJobMutation;
export const useUpdateIntakeJob = useUpdateIntegrationIntakeJobMutation;
export const useRunIntakeJob = useRunIntegrationIntakeJobMutation;

export { useInvalidateVendorCore };

export const useIntegrationIntakeQuery = useIntegrationMonitoringQuery;
export const useIntegrationIntakeDetailQuery = useIntegrationMonitoringQuery;
