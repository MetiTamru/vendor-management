"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	getMyWorkQueueDashboard,
	getTpaTpvDetail,
	listTpaTpvRows,
	listWorkQueueKpis,
	updateTpaTpvContacts,
	updateTpaTpvInfo,
	updateTpaTpvMigration,
} from "../api/myWorkQueueApi";
import type {
	MyWorkQueueListFiltersDto,
	TpaTpvContactsUpdateDto,
	TpaTpvInfoUpdateDto,
	TpaTpvMigrationUpdateDto,
} from "../dto/myWorkQueueDto";

const domain = "my-work-queue";

export function useWorkQueueKpisQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "kpis"),
		queryFn: listWorkQueueKpis,
		staleTime: 15_000,
	});
}

export function useTpaTpvRowsQuery(filters?: MyWorkQueueListFiltersDto) {
	return useQuery({
		queryKey: featureQueryKey(domain, "rows", filters ?? {}),
		queryFn: () => listTpaTpvRows(filters),
		staleTime: 15_000,
	});
}

export function useMyWorkQueueDashboardQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "dashboard"),
		queryFn: getMyWorkQueueDashboard,
		staleTime: 15_000,
	});
}

export function useTpaTpvDetailQuery(id: string | undefined) {
	return useQuery({
		queryKey: featureQueryKey(domain, "detail", id ?? ""),
		queryFn: () => getTpaTpvDetail(id!),
		enabled: Boolean(id),
	});
}

export function useTpaTpvRowsList(filters?: MyWorkQueueListFiltersDto) {
	const query = useTpaTpvRowsQuery(filters);
	return { ...query, rows: query.data?.items ?? [], total: query.data?.total ?? 0 };
}

export function useWorkQueueKpisList() {
	const query = useWorkQueueKpisQuery();
	return { ...query, kpis: query.data ?? [] };
}

function useInvalidateWorkQueue() {
	const queryClient = useQueryClient();
	return () =>
		queryClient.invalidateQueries({ queryKey: featureQueryKey(domain) });
}

export function useUpdateTpaTpvInfoMutation() {
	const invalidate = useInvalidateWorkQueue();
	return useMutation({
		mutationFn: ({ id, body }: { id: string; body: TpaTpvInfoUpdateDto }) =>
			updateTpaTpvInfo(id, body),
		onSuccess: () => invalidate(),
	});
}

export function useUpdateTpaTpvContactsMutation() {
	const invalidate = useInvalidateWorkQueue();
	return useMutation({
		mutationFn: ({
			id,
			body,
		}: {
			id: string;
			body: TpaTpvContactsUpdateDto;
		}) => updateTpaTpvContacts(id, body),
		onSuccess: () => invalidate(),
	});
}

export function useUpdateTpaTpvMigrationMutation() {
	const invalidate = useInvalidateWorkQueue();
	return useMutation({
		mutationFn: ({
			id,
			body,
		}: {
			id: string;
			body: TpaTpvMigrationUpdateDto;
		}) => updateTpaTpvMigration(id, body),
		onSuccess: () => invalidate(),
	});
}

export const useMyWorkQueueQuery = useMyWorkQueueDashboardQuery;
export const useMyWorkQueueDetailQuery = useTpaTpvDetailQuery;
