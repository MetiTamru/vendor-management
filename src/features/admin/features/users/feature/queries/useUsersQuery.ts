"use client";

import {
	useInvalidateVendorCore,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";

import {
	listVendorCoreLoginEvents,
	listVendorCoreUsers,
} from "../api/usersApi";
import { useUsersList } from "../../service/queries/user.query";

const domain = "users";

export { useUsersList };

export function useVendorCoreUsersQuery() {
	return useVendorCoreFeatureQuery(domain, "vendor-core-list", listVendorCoreUsers);
}

export function useVendorCoreLoginEventsQuery(
	scope: "all" | "me" | string = "all"
) {
	return useVendorCoreFeatureQuery(
		domain,
		"login-events",
		() => listVendorCoreLoginEvents(scope),
		true,
		[scope]
	);
}

export const useVendorCoreUsers = useVendorCoreUsersQuery;
export const useVendorCoreLoginEvents = useVendorCoreLoginEventsQuery;
export { useInvalidateVendorCore };

export function useUsersQuery() {
	const { users, isInitialLoading, error, refetch } = useUsersList();
	return {
		data: { items: users, total: users.length },
		isLoading: isInitialLoading,
		isError: Boolean(error),
		error,
		refetch,
	};
}

export function useUsersDetailQuery(id: string | null | undefined) {
	const { users, isInitialLoading, error, refetch } = useUsersList();
	const user = id ? users.find((item) => item.id === id) : undefined;
	return {
		data: user,
		isLoading: isInitialLoading,
		isError: Boolean(error),
		error,
		refetch,
		enabled: Boolean(id),
	};
}
