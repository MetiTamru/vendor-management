import { getTranslations } from "next-intl/server";

import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default async function SignUpPage() {
	const t = await getTranslations("Auth");
	// update
	return (
		<div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
			<AuthCard title={t("signUpTitle")} description={t("signUpDescription")}>
				<SignUpForm />
			</AuthCard>
		</div>
	);
}
