"use client";

import {
	type UseMutationOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";

import { useVendorCoreSession } from "@/components/vendor-core/VendorCoreGate";
import { isMockEnabled } from "@/lib/mock-mode";
import { VendorCoreApiError } from "@/lib/vendor-core/client";

import { featureQueryKey } from "./feature-contract";

export function useVendorCoreFeatureQuery<T>(
	domain: string,
	scope: string,
	queryFn: () => Promise<T>,
	enabled = true,
	extraKeyParts: unknown[] = []
) {
	const session = useVendorCoreSession();
	const mock = isMockEnabled();

	/* eslint-disable @tanstack/query/exhaustive-deps -- wrapper: stable keys from callers */
	return useQuery({
		queryKey: featureQueryKey(domain, scope, ...extraKeyParts),
		enabled: enabled && (mock || (session.live && session.authed)),
		queryFn: async () => {
			try {
				return await queryFn();
			} catch (err) {
				if (
					err instanceof VendorCoreApiError &&
					(err.status === 401 || err.status === 403)
				) {
					session.markUnauthed();
				}
				throw err;
			}
		},
		staleTime: 15_000,
		refetchOnMount: "always",
	});
	/* eslint-enable @tanstack/query/exhaustive-deps */
}

export function useVendorCoreFeatureMutation<TData, TVariables>(
	domain: string,
	options: UseMutationOptions<TData, Error, TVariables>
) {
	const queryClient = useQueryClient();
	const { onSuccess, ...rest } = options;

	return useMutation({
		...rest,
		onSuccess: async (...args) => {
			await onSuccess?.(...args);
			await queryClient.invalidateQueries({
				queryKey: featureQueryKey(domain),
				refetchType: "active",
			});
		},
	});
}

/** Invalidates all admin feature-layer queries (replaces vendorCoreKeys.all). */
export function useInvalidateVendorCore() {
	const queryClient = useQueryClient();
	return () =>
		queryClient.invalidateQueries({ queryKey: ["admin", "feature"] });
}
