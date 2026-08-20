"use client";

import { useEffect, useState } from "react";

import { Monitor, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { type ThemeMode, useSettingsStore } from "@/stores/settings-store";

type ModeToggleProps = {
	className?: string;
	buttonClassName?: string;
};

export function ModeToggle({ className, buttonClassName }: ModeToggleProps) {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const updateSettings = useSettingsStore((state) => state.updateSettings);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	function selectTheme(next: ThemeMode) {
		setTheme(next);
		updateSettings({ theme: next });
	}

	const activeTheme = mounted ? (resolvedTheme ?? theme ?? "system") : "light";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className={cn(
						"relative size-9 shrink-0 border-border/70 bg-card shadow-sm",
						buttonClassName
					)}
					aria-label="Toggle theme"
				>
					{!mounted ? (
						<SunIcon className="size-4" />
					) : activeTheme === "dark" ? (
						<MoonIcon className="size-4" />
					) : (
						<SunIcon className="size-4" />
					)}
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className={className}>
				<DropdownMenuItem
					onClick={() => selectTheme("light")}
					className={cn(theme === "light" && "bg-accent")}
				>
					<SunIcon className="mr-2 size-4" />
					Light
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => selectTheme("dark")}
					className={cn(theme === "dark" && "bg-accent")}
				>
					<MoonIcon className="mr-2 size-4" />
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => selectTheme("system")}
					className={cn(theme === "system" && "bg-accent")}
				>
					<Monitor className="mr-2 size-4" />
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
