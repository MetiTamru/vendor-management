export type FontSize = "small" | "medium" | "large";
export type ThemeMode = "light" | "dark" | "system";
export type FontFamily = "geist" | "poppins";

export interface SettingsState {
	fontSize: FontSize;
	theme: ThemeMode;
	fontFamily: FontFamily;
}
