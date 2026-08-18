"use client";

import {
	useVendorCoreFeatureMutation,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";

import { createCredentials, listCredentials } from "../api/credentialsApi";
import type { CredentialsCreateDto } from "../dto/credentialsDto";
import { toCredentialsModel } from "../mappers/credentialsMappers";

const domain = "credentials";

export function useCredentialsQuery() {
	return useVendorCoreFeatureQuery(domain, "list", async () => {
		const items = (await listCredentials()).map(toCredentialsModel);
		return { items, total: items.length };
	});
}

export function useCreateCredentialsMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof createCredentials>>,
		CredentialsCreateDto
	>(domain, {
		mutationFn: (input) => createCredentials(input),
	});
}

export function useCredentialsList() {
	const query = useCredentialsQuery();
	return { ...query, credentials: query.data?.items ?? [] };
}

export const useCreateCredentialMutation = useCreateCredentialsMutation;
