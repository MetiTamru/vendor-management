"use client";

import {
	useInvalidateVendorCore,
	useVendorCoreFeatureMutation,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";
import { featureQueryKey } from "@/features/admin/shared/feature-contract";
import { useQuery } from "@tanstack/react-query";

import {
	createIntakeJob,
	listIntakeJobRuns,
	listIntakeJobs,
	listScheduleConnections,
	listScheduleFileRuns,
	listScheduleVendors,
	runIntakeJob,
	updateIntakeJob,
} from "../api/schedulesApi";

const domain = "schedules";

export function useScheduleFileRunsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "file-runs"),
		queryFn: listScheduleFileRuns,
		staleTime: Infinity,
	});
}

export function useIntakeJobsQuery(vendorId?: string) {
	return useVendorCoreFeatureQuery(
		domain,
		"jobs",
		() => listIntakeJobs(vendorId),
		true,
		[vendorId ?? "all"]
	);
}

export function useScheduleVendorsQuery() {
	return useVendorCoreFeatureQuery(domain, "vendors", listScheduleVendors);
}

export function useScheduleConnectionsQuery(vendorId?: string) {
	return useVendorCoreFeatureQuery(
		domain,
		"connections",
		() => listScheduleConnections(vendorId),
		true,
		[vendorId ?? "all"]
	);
}

export function useIntakeJobRunsQuery(params?: {
	job_id?: string;
	stage?: string;
}) {
	return useVendorCoreFeatureQuery(
		domain,
		"job-runs",
		() => listIntakeJobRuns(params),
		true,
		[params ?? {}]
	);
}

export function useCreateIntakeJobMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof createIntakeJob>>,
		Record<string, unknown>
	>(domain, {
		mutationFn: (body) => createIntakeJob(body),
	});
}

export function useUpdateIntakeJobMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof updateIntakeJob>>,
		{ id: string; body: Record<string, unknown> }
	>(domain, {
		mutationFn: ({ id, body }) => updateIntakeJob(id, body),
	});
}

export function useRunIntakeJobMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof runIntakeJob>>,
		string
	>(domain, {
		mutationFn: (id) => runIntakeJob(id),
	});
}

export function useScheduleFileRunsList() {
	const query = useScheduleFileRunsQuery();
	return { ...query, fileRuns: query.data ?? [] };
}

export const useVendorCoreJobs = useIntakeJobsQuery;
export const useVendorCoreVendors = useScheduleVendorsQuery;
export const useVendorCoreConnections = useScheduleConnectionsQuery;
export const useVendorCoreJobRuns = useIntakeJobRunsQuery;
export const useCreateIntakeJob = useCreateIntakeJobMutation;
export const useUpdateIntakeJob = useUpdateIntakeJobMutation;
export const useRunIntakeJob = useRunIntakeJobMutation;

export { useInvalidateVendorCore };

export const useSchedulesQuery = useScheduleFileRunsQuery;
export const useSchedulesDetailQuery = useScheduleFileRunsQuery;
