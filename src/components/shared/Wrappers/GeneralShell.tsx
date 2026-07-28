import type { ReactNode } from "react";

export function GeneralShell({ children }: { children: ReactNode }) {
	return (
		<main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
			{children}
		</main>
	);
}
