"use client";

import { useMemo } from "react";

import { useGroupUiStore } from "../store/group.ui-store";
import type { GroupModel } from "../types/group.types";
import { filterGroups } from "./filter-groups";

export function useGroupSearch(groups: GroupModel[]) {
	const search = useGroupUiStore((s) => s.search);
	const membershipMode = useGroupUiStore((s) => s.membershipMode);

	const filtered = useMemo(
		() => filterGroups(groups, { search, membershipMode }),
		[groups, search, membershipMode]
	);

	return { filtered, search, membershipMode };
}
