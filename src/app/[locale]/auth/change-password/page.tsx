import { AuthCard } from "@/components/auth/auth-card";
import { AuthShell } from "@/components/auth/auth-shell";
import { ChangePasswordForm } from "@/components/auth/change-password-form";

export default function ChangePasswordPage() {
	return (
		<AuthShell>
			<AuthCard
				title="Set a new password"
				description="Required before accessing the dashboard."
			>
				<ChangePasswordForm />
			</AuthCard>
		</AuthShell>
	);
}
