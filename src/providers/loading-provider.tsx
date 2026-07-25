"use client";

import Loader from "@/components/shared/loader/Loader";
import { useLoaderStore } from "@/stores/loader-store";

export function LoadingProvider({ children }: { children: React.ReactNode }) {
	const loading = useLoaderStore((state) => state.loading);

	return (
		<>
			{loading && <Loader />}
			{children}
		</>
	);
}
