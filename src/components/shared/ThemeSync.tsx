"use client";

import { useEffect } from "react";

import { useTheme } from "next-themes";

import { useSettingsStore } from "@/stores/settings-store";

/** Keeps next-themes in sync with persisted settings-store theme. */
export function ThemeSync() {
	const storeTheme = useSettingsStore((state) => state.theme);
	const { setTheme, theme } = useTheme();

	useEffect(() => {
		if (storeTheme && storeTheme !== theme) {
			setTheme(storeTheme);
		}
	}, [storeTheme, setTheme, theme]);

	return null;
}
