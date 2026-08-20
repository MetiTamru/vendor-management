"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
	AuthTextInput,
	authLabelClass,
	authPrimaryButtonClass,
} from "@/components/auth/auth-field";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { isMockAuthEnabled } from "@/lib/auth/mock-auth";
import { AUTH_PATHS } from "@/lib/auth/paths";
import { isNestApiEnabled } from "@/lib/mock-mode";

type ForgetAuthClient = typeof authClient & {
	forgetPassword: (input: {
		email: string;
		redirectTo?: string;
	}) => Promise<{ error?: { message?: string } | null }>;
};

const forgotSchema = z.object({
	email: z.string().email("Enter a valid email"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordForm() {
	const locale = useLocale();
	const [isLoading, setIsLoading] = useState(false);
	const [sent, setSent] = useState(false);
	const mockAuth = isMockAuthEnabled();
	const nestLogin = isNestApiEnabled();

	const form = useForm<ForgotFormValues>({
		resolver: zodResolver(forgotSchema),
		defaultValues: { email: "" },
	});

	async function onSubmit(values: ForgotFormValues) {
		setIsLoading(true);
		try {
			if (mockAuth && !nestLogin) {
				setSent(true);
				toast.message("Reset email needs Nest auth enabled");
				return;
			}

			const client = authClient as ForgetAuthClient;
			const result = await client.forgetPassword({
				email: values.email,
				redirectTo: `${window.location.origin}/${locale}${AUTH_PATHS.resetPassword}`,
			});

			if (result.error) {
				toast.error(result.error.message ?? "Request failed");
				return;
			}

			setSent(true);
			toast.success("Check your email");
		} catch {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	}

	if (sent) {
		return (
			<div className="space-y-6">
				<p className="text-sm leading-relaxed text-muted-foreground">
					If an account exists for that email, reset instructions are on the
					way.
				</p>
				<Link
					href={AUTH_PATHS.login}
					className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary underline-offset-4 hover:underline"
				>
					Back to sign in
					<ArrowRight className="size-3.5" />
				</Link>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className={authLabelClass}>Email</FormLabel>
							<FormControl>
								<AuthTextInput
									icon={Mail}
									type="email"
									placeholder="you@company.com"
									autoComplete="email"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className={authPrimaryButtonClass}
					disabled={isLoading}
				>
					{isLoading ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							Sending…
						</>
					) : (
						<>
							Send reset link
							<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
						</>
					)}
				</Button>
				<p className="pt-1 text-center text-[13px] text-muted-foreground">
					<Link
						href={AUTH_PATHS.login}
						className="font-semibold text-primary underline-offset-4 hover:underline"
					>
						Back to sign in
					</Link>
				</p>
			</form>
		</Form>
	);
}
