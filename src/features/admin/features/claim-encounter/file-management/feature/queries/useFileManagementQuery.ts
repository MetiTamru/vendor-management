"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	listSourceFiles,
	listIssuerFiles,
	listHhsFiles
} from "../api/file-managementApi";

const domain = "file-management";

export * from "../types/file-managementModel";
export function useFileManagementSourceFilesQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "sourceFiles"),
		queryFn: async () => {
			const items = await listSourceFiles();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useFileManagementSourceFilesList() {
	const query = useFileManagementSourceFilesQuery();
	return { ...query, sourceFiles: query.data?.items ?? [] };
}

export function useFileManagementIssuerFilesQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "issuerFiles"),
		queryFn: async () => {
			const items = await listIssuerFiles();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useFileManagementIssuerFilesList() {
	const query = useFileManagementIssuerFilesQuery();
	return { ...query, issuerFiles: query.data?.items ?? [] };
}

export function useFileManagementHhsFilesQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "hhsFiles"),
		queryFn: async () => {
			const items = await listHhsFiles();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useFileManagementHhsFilesList() {
	const query = useFileManagementHhsFilesQuery();
	return { ...query, hhsFiles: query.data?.items ?? [] };
}
