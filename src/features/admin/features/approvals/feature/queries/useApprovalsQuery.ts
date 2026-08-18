"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";
import type { ApprovalRequestModel } from "@/features/shared/vms/types";

import {
	getApprovals,
	listApprovals,
	updateApprovals,
} from "../api/approvalsApi";
import { toApprovalsModel } from "../mappers/approvalsMappers";

const domain = "approvals";

export function useApprovalsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "list"),
		queryFn: async () => {
			const items = (await listApprovals()).map(toApprovalsModel);
			return { items, total: items.length };
		},
	});
}

export function useApprovalsDetailQuery(id: string | null | undefined) {
	return useQuery({
		queryKey: featureQueryKey(domain, "detail", id ?? ""),
		enabled: Boolean(id),
		queryFn: async () => toApprovalsModel(await getApprovals(String(id))),
	});
}

export function useApprovalMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			status,
		}: {
			id: string;
			status: ApprovalRequestModel["status"];
		}) => updateApprovals(id, status),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: featureQueryKey(domain) });
			queryClient.invalidateQueries({
				queryKey: featureQueryKey(domain, "detail", variables.id),
			});
		},
	});
}

export function useApprovalsList() {
	const query = useApprovalsQuery();
	return { ...query, approvals: query.data?.items ?? [] };
}
