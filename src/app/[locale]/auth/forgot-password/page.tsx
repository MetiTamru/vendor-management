import { getTranslations } from "next-intl/server";

import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default async function ForgotPasswordPage() {
	const t = await getTranslations("Auth");

	return (
		<div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
			<AuthCard title={t("forgotTitle")} description={t("forgotDescription")}>
				<ForgotPasswordForm />
			</AuthCard>
		</div>
	);
}
