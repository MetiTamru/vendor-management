import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { FontFamily, FontSize, SettingsState, ThemeMode } from "./types";

const defaultSettings: SettingsState = {
	fontSize: "medium",
	theme: "system",
	fontFamily: "geist",
};

interface SettingsStore extends SettingsState {
	updateSettings: (partial: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
	persist(
		(set) => ({
			...defaultSettings,
			updateSettings: (partial) => set((state) => ({ ...state, ...partial })),
		}),
		{
			name: "userSettings",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				fontSize: state.fontSize,
				theme: state.theme,
				fontFamily: state.fontFamily,
			}),
		}
	)
);

export type { FontSize, ThemeMode, FontFamily };
