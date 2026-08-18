"use client";

import {
	useCreateGroupMutation,
	useDeleteGroupMutation,
	useUpdateGroupMutation,
} from "../../service/mutations/group.mutation";
import { useGroup, useGroupsList } from "../../service/queries/group.query";

export {
	useGroupsList,
	useGroup,
	useCreateGroupMutation,
	useUpdateGroupMutation,
	useDeleteGroupMutation,
};

export function useGroupsQuery() {
	const { groups, isInitialLoading, error, refetch } = useGroupsList();
	return {
		data: { items: groups, total: groups.length },
		isLoading: isInitialLoading,
		isError: Boolean(error),
		error,
		refetch,
	};
}

export function useGroupsDetailQuery(id: string | null | undefined) {
	const result = useGroup(id ?? undefined);
	return {
		...result,
		data: result.group,
		isError: Boolean(result.error),
	};
}
