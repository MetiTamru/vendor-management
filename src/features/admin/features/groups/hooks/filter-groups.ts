import type { GroupListFilters, GroupModel } from "../types/group.types";

export function filterGroups(
	groups: GroupModel[],
	{ search, membershipMode }: GroupListFilters
): GroupModel[] {
	const term = search.trim().toLowerCase();
	return groups.filter((group) => {
		const matchesMode =
			membershipMode === "all" || group.membershipMode === membershipMode;
		const matchesSearch =
			!term ||
			group.name.toLowerCase().includes(term) ||
			(group.description?.toLowerCase().includes(term) ?? false);
		return matchesMode && matchesSearch;
	});
}
