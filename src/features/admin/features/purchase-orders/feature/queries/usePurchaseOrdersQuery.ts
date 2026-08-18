"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	createPurchaseOrders,
	getPurchaseOrders,
	listPurchaseOrders,
	updatePurchaseOrders,
} from "../api/purchaseOrdersApi";
import type {
	PurchaseOrdersCreateDto,
	PurchaseOrdersUpdateDto,
} from "../dto/purchaseOrdersDto";
import { toPurchaseOrdersModel } from "../mappers/purchaseOrdersMappers";

const domain = "purchase-orders";

export function usePurchaseOrdersQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "list"),
		queryFn: async () => {
			const items = (await listPurchaseOrders()).map(toPurchaseOrdersModel);
			return { items, total: items.length };
		},
	});
}

export function usePurchaseOrdersDetailQuery(id: string | null | undefined) {
	return useQuery({
		queryKey: featureQueryKey(domain, "detail", id ?? ""),
		enabled: Boolean(id),
		queryFn: async () =>
			toPurchaseOrdersModel(await getPurchaseOrders(String(id))),
	});
}

export function useCreatePurchaseOrdersMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: PurchaseOrdersCreateDto) => createPurchaseOrders(input),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: featureQueryKey(domain) }),
	});
}

export function useUpdatePurchaseOrdersMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			patch,
		}: {
			id: string;
			patch: PurchaseOrdersUpdateDto;
		}) => updatePurchaseOrders(id, patch),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: featureQueryKey(domain) });
			queryClient.invalidateQueries({
				queryKey: featureQueryKey(domain, "detail", variables.id),
			});
		},
	});
}

export function usePurchaseOrdersList() {
	const query = usePurchaseOrdersQuery();
	return {
		...query,
		purchaseOrders: query.data?.items ?? [],
		orders: query.data?.items ?? [],
	};
}

export function usePurchaseOrder(id: string | null | undefined) {
	const query = usePurchaseOrdersDetailQuery(id);
	return { ...query, purchaseOrder: query.data, order: query.data };
}

export const useCreatePoMutation = useCreatePurchaseOrdersMutation;
export const useUpdatePoMutation = useUpdatePurchaseOrdersMutation;
