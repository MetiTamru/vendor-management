"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	createContracts,
	getContracts,
	listContracts,
	updateContracts,
} from "../api/contractsApi";
import type {
	ContractsCreateDto,
	ContractsUpdateDto,
} from "../dto/contractsDto";
import { toContractsModel } from "../mappers/contractsMappers";

const domain = "contracts";

export function useContractsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "list"),
		queryFn: async () => {
			const items = (await listContracts()).map(toContractsModel);
			return { items, total: items.length };
		},
	});
}

export function useContractsDetailQuery(id: string | null | undefined) {
	return useQuery({
		queryKey: featureQueryKey(domain, "detail", id ?? ""),
		enabled: Boolean(id),
		queryFn: async () => toContractsModel(await getContracts(String(id))),
	});
}

export function useCreateContractsMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: ContractsCreateDto) => createContracts(input),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: featureQueryKey(domain) }),
	});
}

export function useUpdateContractsMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, patch }: { id: string; patch: ContractsUpdateDto }) =>
			updateContracts(id, patch),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: featureQueryKey(domain) });
			queryClient.invalidateQueries({
				queryKey: featureQueryKey(domain, "detail", variables.id),
			});
		},
	});
}

export function useContractsList(vendorId?: string) {
	const query = useContractsQuery();
	const items = query.data?.items ?? [];
	const contracts = vendorId
		? items.filter((contract) => contract.vendorId === vendorId)
		: items;
	return { ...query, contracts };
}

export function useContract(id: string | null | undefined) {
	const query = useContractsDetailQuery(id);
	return { ...query, contract: query.data };
}

export const useCreateContractMutation = useCreateContractsMutation;
export const useUpdateContractMutation = useUpdateContractsMutation;
