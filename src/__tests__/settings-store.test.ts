import { useSettingsStore } from "@/stores/settings-store";

describe("settings store", () => {
	beforeEach(() => {
		useSettingsStore.setState({
			fontSize: "medium",
			theme: "system",
			fontFamily: "geist",
		});
	});

	it("updates settings partially", () => {
		useSettingsStore.getState().updateSettings({ fontSize: "large" });
		expect(useSettingsStore.getState().fontSize).toBe("large");
		expect(useSettingsStore.getState().theme).toBe("system");
	});

	it("toggles font family", () => {
		useSettingsStore.getState().updateSettings({ fontFamily: "poppins" });
		expect(useSettingsStore.getState().fontFamily).toBe("poppins");
	});
});
