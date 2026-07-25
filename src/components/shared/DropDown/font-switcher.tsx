"use client";

import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settings-store";

export function FontSwitcher() {
	const fontFamily = useSettingsStore((state) => state.fontFamily);
	const updateSettings = useSettingsStore((state) => state.updateSettings);

	const toggleFont = () => {
		updateSettings({
			fontFamily: fontFamily === "geist" ? "poppins" : "geist",
		});
	};

	return (
		<Button onClick={toggleFont}>
			Switch to {fontFamily === "geist" ? "Poppins" : "Geist"}
		</Button>
	);
}
