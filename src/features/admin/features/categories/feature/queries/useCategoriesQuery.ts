"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import { getCategories, listCategories } from "../api/categoriesApi";
import { toCategoriesModel } from "../mappers/categoriesMappers";

const domain = "categories";

export function useCategoriesQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "list"),
		queryFn: async () => {
			const items = (await listCategories()).map(toCategoriesModel);
			return { items, total: items.length };
		},
	});
}

export function useCategoriesDetailQuery(id: string | null | undefined) {
	return useQuery({
		queryKey: featureQueryKey(domain, "detail", id ?? ""),
		enabled: Boolean(id),
		queryFn: async () => toCategoriesModel(await getCategories(String(id))),
	});
}

export function useCategoriesList() {
	const query = useCategoriesQuery();
	return { ...query, categories: query.data?.items ?? [] };
}
