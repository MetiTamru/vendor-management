"use client";

import { useContext, useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { NetworkContext } from "@/providers/network-provider";

export function OfflineBanner() {
	const { isOnline } = useContext(NetworkContext);
	const t = useTranslations("Admin");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Avoid hydration mismatch: only show after client mount once network
	// state has been synced from navigator.onLine.
	if (!mounted || isOnline) {
		return null;
	}

	return (
		<div
			role="status"
			className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-900 dark:text-amber-100"
		>
			{t("offline")}
		</div>
	);
}
