import { create } from "zustand";

import type { GroupListFilters } from "../types/group.types";

type GroupUiState = GroupListFilters & {
	activeTab: "overview" | "members" | "characteristics";
	setSearch: (search: string) => void;
	setMembershipMode: (mode: GroupListFilters["membershipMode"]) => void;
	setActiveTab: (tab: GroupUiState["activeTab"]) => void;
	resetFilters: () => void;
};

const defaultFilters: GroupListFilters = {
	search: "",
	membershipMode: "all",
};

export const useGroupUiStore = create<GroupUiState>((set) => ({
	...defaultFilters,
	activeTab: "overview",
	setSearch: (search) => set({ search }),
	setMembershipMode: (membershipMode) => set({ membershipMode }),
	setActiveTab: (activeTab) => set({ activeTab }),
	resetFilters: () => set({ ...defaultFilters }),
}));
