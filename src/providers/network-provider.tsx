"use client";

import { createContext, useEffect, useState } from "react";

import { toast } from "sonner";

import { flushGroupSyncQueue } from "@/lib/offline/sync-worker";

export const NetworkContext = createContext({ isOnline: true });

export function NetworkProvider({ children }: { children: React.ReactNode }) {
	const [isOnline, setIsOnline] = useState(
		typeof navigator !== "undefined" ? navigator.onLine : true
	);

	useEffect(() => {
		const handleOnline = () => {
			setIsOnline(true);
			toast.success("Back online");
			void flushGroupSyncQueue();
		};

		const handleOffline = () => {
			setIsOnline(false);
			toast.error("No internet connection");
		};

		setIsOnline(navigator.onLine);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	return (
		<NetworkContext.Provider value={{ isOnline }}>
			{children}
		</NetworkContext.Provider>
	);
}
