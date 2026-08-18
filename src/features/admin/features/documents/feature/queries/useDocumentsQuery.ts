"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	createDocuments,
	getDocuments,
	listDocuments,
	updateDocuments,
} from "../api/documentsApi";
import type {
	DocumentsCreateDto,
	DocumentsUpdateDto,
} from "../dto/documentsDto";
import { toDocumentsModel } from "../mappers/documentsMappers";

const domain = "documents";

export function useDocumentsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "list"),
		queryFn: async () => {
			const items = (await listDocuments()).map(toDocumentsModel);
			return { items, total: items.length };
		},
	});
}

export function useDocumentsDetailQuery(id: string | null | undefined) {
	return useQuery({
		queryKey: featureQueryKey(domain, "detail", id ?? ""),
		enabled: Boolean(id),
		queryFn: async () => toDocumentsModel(await getDocuments(String(id))),
	});
}

export function useCreateDocumentsMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: DocumentsCreateDto) => createDocuments(input),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: featureQueryKey(domain) }),
	});
}

export function useUpdateDocumentsMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, patch }: { id: string; patch: DocumentsUpdateDto }) =>
			updateDocuments(id, patch),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: featureQueryKey(domain) });
			queryClient.invalidateQueries({
				queryKey: featureQueryKey(domain, "detail", variables.id),
			});
		},
	});
}

export function useDocumentsList() {
	const query = useDocumentsQuery();
	return { ...query, documents: query.data?.items ?? [] };
}

export function useDocument(id: string | null | undefined) {
	const query = useDocumentsDetailQuery(id);
	return { ...query, document: query.data };
}

export const useCreateDocumentMutation = useCreateDocumentsMutation;
export const useUpdateDocumentMutation = useUpdateDocumentsMutation;
