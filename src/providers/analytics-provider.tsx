"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { Analytics } from "@vercel/analytics/react";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	useEffect(() => {
		// Hook point for custom page-view tracking keyed on pathname.
		void pathname;
	}, [pathname]);

	return (
		<>
			{children}
			<Analytics />
		</>
	);
}
