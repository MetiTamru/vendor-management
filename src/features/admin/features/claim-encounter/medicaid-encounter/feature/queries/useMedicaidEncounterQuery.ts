"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	listDocumentLibrary,
	listExceptionDetails,
	listResponseFiles,
} from "../api/medicaid-encounterApi";

const domain = "medicaid-encounter";

export * from "../types/medicaid-encounterModel";
export function useMedicaidEncounterDocumentLibraryQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "documentLibrary"),
		queryFn: async () => {
			const items = await listDocumentLibrary();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useMedicaidEncounterDocumentLibraryList() {
	const query = useMedicaidEncounterDocumentLibraryQuery();
	return { ...query, documentLibrary: query.data?.items ?? [] };
}

export function useMedicaidEncounterExceptionDetailsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "exceptionDetails"),
		queryFn: async () => {
			const items = await listExceptionDetails();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useMedicaidEncounterExceptionDetailsList() {
	const query = useMedicaidEncounterExceptionDetailsQuery();
	return { ...query, exceptionDetails: query.data?.items ?? [] };
}

export function useMedicaidEncounterResponseFilesQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "responseFiles"),
		queryFn: async () => {
			const items = await listResponseFiles();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useMedicaidEncounterResponseFilesList() {
	const query = useMedicaidEncounterResponseFilesQuery();
	return { ...query, responseFiles: query.data?.items ?? [] };
}
