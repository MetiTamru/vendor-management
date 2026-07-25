"use client";

import LocaleSwitcher from "@/components/shared/DropDown/LocaleSwitcher";
import { ModeToggle } from "@/components/shared/DropDown/modeToggle";

export function HomeHeader() {
	return (
		<div className="flex items-center justify-end gap-2 p-4">
			<ModeToggle />
			<LocaleSwitcher />
		</div>
	);
}
