"use client";

import { type ReactNode, useContext, useEffect, useState } from "react";

import {
	QueryClient,
	QueryClientProvider,
	onlineManager,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { isApiError } from "@/lib/api/errors";
import { NetworkContext } from "@/providers/network-provider";

function shouldRetryQuery(failureCount: number, error: unknown) {
	if (isApiError(error)) {
		if (error.status >= 400 && error.status < 500) {
			return error.status === 408 || error.status === 429;
		}
	}
	return failureCount < 2;
}

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
				retry: shouldRetryQuery,
				networkMode: "online",
			},
			mutations: {
				networkMode: "online",
				retry: false,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
	if (typeof window === "undefined") {
		return makeQueryClient();
	}
	if (!browserQueryClient) {
		browserQueryClient = makeQueryClient();
	}
	return browserQueryClient;
}

function OnlineManagerSync({ children }: { children: ReactNode }) {
	const { isOnline } = useContext(NetworkContext);

	useEffect(() => {
		onlineManager.setOnline(isOnline);
	}, [isOnline]);

	return children;
}

export default function QueryProviders({ children }: { children: ReactNode }) {
	const [queryClient] = useState(getQueryClient);

	return (
		<QueryClientProvider client={queryClient}>
			<OnlineManagerSync>
				{process.env.NODE_ENV === "development" ? (
					<ReactQueryDevtools
						initialIsOpen={false}
						buttonPosition="bottom-left"
					/>
				) : null}
				{children}
			</OnlineManagerSync>
		</QueryClientProvider>
	);
}
