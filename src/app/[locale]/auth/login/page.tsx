import { getTranslations } from "next-intl/server";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
	const t = await getTranslations("Auth");

	return (
		<div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
			<AuthCard title={t("loginTitle")} description={t("loginDescription")}>
				<LoginForm />
			</AuthCard>
		</div>
	);
}
