"use client";

import { useGroupUiStore } from "../store/group.ui-store";

export function useGroupTabs() {
	const activeTab = useGroupUiStore((s) => s.activeTab);
	const setActiveTab = useGroupUiStore((s) => s.setActiveTab);

	return { activeTab, setActiveTab };
}
