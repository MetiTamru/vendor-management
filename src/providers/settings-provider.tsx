"use client";

import { useEffect } from "react";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { useSettingsStore } from "@/stores/settings-store";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
	const { fontSize, theme, fontFamily } = useSettingsStore();

	useEffect(() => {
		const root = document.documentElement;

		root.classList.remove("text-sm", "text-base", "text-lg");
		root.classList.add(`text-${fontSize}`);

		const baseFontSize =
			fontSize === "small" ? 14 : fontSize === "medium" ? 16 : 18;

		root.style.setProperty(
			"--font-size-multiplier",
			fontSize === "small" ? "0.875" : fontSize === "medium" ? "1" : "1.125"
		);

		root.style.setProperty("--base-font-size", `${baseFontSize}px`);
		root.style.setProperty("--h1-size", `calc(${baseFontSize * 2}px)`);
		root.style.setProperty("--h2-size", `calc(${baseFontSize * 1.5}px)`);
		root.style.setProperty("--h3-size", `calc(${baseFontSize * 1.25}px)`);
		root.style.setProperty("--h4-size", `calc(${baseFontSize * 1.125}px)`);
		root.style.setProperty("--spacing-unit", `calc(${baseFontSize * 0.25}px)`);

		const fontVar =
			fontFamily === "geist" ? "--font-geist-sans" : "--font-poppins";
		root.style.setProperty("--font-sans", `var(${fontVar})`);
		root.style.setProperty("--font-primary", `var(${fontVar})`);
		root.classList.toggle("font-poppins", fontFamily === "poppins");
	}, [fontSize, fontFamily]);

	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme={theme}
			enableSystem={theme === "system"}
			disableTransitionOnChange
		>
			{children}
		</NextThemesProvider>
	);
}
