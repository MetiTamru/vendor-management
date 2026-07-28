import type { ReactNode } from "react";

export function GeneralShell({ children }: { children: ReactNode }) {
	return <main className="w-full flex-1 px-2 py-2 sm:px-3">{children}</main>;
}
