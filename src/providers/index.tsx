"use client";

import type { ReactNode } from "react";

import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";

import { Toaster } from "@/components/ui/sonner";
import { defaultTimeZone } from "@/i18n/config";
import { AnalyticsProvider } from "@/providers/analytics-provider";
import { LoadingProvider } from "@/providers/loading-provider";
import { NetworkProvider } from "@/providers/network-provider";
import { PermissionProvider } from "@/providers/permission-provider";
import QueryProviders from "@/providers/query-provider";
import { SettingsProvider } from "@/providers/settings-provider";

type ProvidersProps = {
	children: ReactNode;
	messages: AbstractIntlMessages;
	locale: string;
};

export function Providers({ children, messages, locale }: ProvidersProps) {
	return (
		<NetworkProvider>
			<QueryProviders>
				<SettingsProvider>
					<PermissionProvider>
						<AnalyticsProvider>
							<NextIntlClientProvider
								locale={locale}
								messages={messages}
								timeZone={defaultTimeZone}
							>
								<LoadingProvider>
									{children}
									<Toaster position="bottom-right" />
								</LoadingProvider>
							</NextIntlClientProvider>
						</AnalyticsProvider>
					</PermissionProvider>
				</SettingsProvider>
			</QueryProviders>
		</NetworkProvider>
	);
}
