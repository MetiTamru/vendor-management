import { Suspense } from "react";

import { getTranslations } from "next-intl/server";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ResetPasswordPage() {
	const t = await getTranslations("Auth");

	return (
		<AuthShell>
			<AuthCard title={t("resetTitle")} description={t("resetDescription")}>
				<Suspense fallback={<Skeleton className="h-40 w-full rounded-lg" />}>
					<ResetPasswordForm />
				</Suspense>
			</AuthCard>
		</AuthShell>
	);
}
