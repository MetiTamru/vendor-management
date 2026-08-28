"use client";

import type { ReactNode } from "react";

import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";

import { ConfirmDialogProvider } from "@/components/confirm-dialog";
import { Toaster } from "@/components/ui/sonner";
import { VendorCoreSessionProvider } from "@/components/vendor-core/VendorCoreGate";
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
					<AnalyticsProvider>
						<NextIntlClientProvider
							locale={locale}
							messages={messages}
							timeZone={defaultTimeZone}
						>
							{/* Must sit under NextIntl — session provider uses useLocale / usePathname */}
							<VendorCoreSessionProvider>
								<PermissionProvider>
									<LoadingProvider>
										<ConfirmDialogProvider>
											{children}
											<Toaster position="bottom-right" />
										</ConfirmDialogProvider>
									</LoadingProvider>
								</PermissionProvider>
							</VendorCoreSessionProvider>
						</NextIntlClientProvider>
					</AnalyticsProvider>
				</SettingsProvider>
			</QueryProviders>
		</NetworkProvider>
	);
}
