"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
	AuthTextInput,
	authLabelClass,
	authOutlineButtonClass,
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
import { clearDevSignedOutCookie } from "@/lib/auth/dev-session";
import { isMockAuthEnabled } from "@/lib/auth/mock-auth";
import { AUTH_PATHS } from "@/lib/auth/paths";
import { isNestApiEnabled } from "@/lib/mock-mode";

const loginSchema = z.object({
	email: z.string().email("Enter a valid work email"),
	password: z.string().min(8, "At least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
	const locale = useLocale();
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const mockAuth = isMockAuthEnabled();
	const nestLogin = isNestApiEnabled();

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	function enterDevSession() {
		clearDevSignedOutCookie();
		toast.success("Signed in");
		window.location.assign(`/${locale}`);
	}

	async function onSubmit(values: LoginFormValues) {
		setIsLoading(true);
		try {
			if (mockAuth && !nestLogin) {
				enterDevSession();
				return;
			}

			const result = await authClient.signIn.email({
				email: values.email,
				password: values.password,
			});

			if (result.error) {
				toast.error(result.error.message ?? "Sign in failed");
				return;
			}

			clearDevSignedOutCookie();
			toast.success("Signed in");
			window.location.assign(`/${locale}`);
		} catch {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
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
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<div className="flex items-center justify-between gap-2">
								<FormLabel className={authLabelClass}>Password</FormLabel>
								<Link
									href={AUTH_PATHS.forgotPassword}
									className="text-[12px] font-medium text-primary transition-colors hover:text-primary/80"
								>
									Forgot?
								</Link>
							</div>
							<FormControl>
								<AuthTextInput
									icon={Lock}
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									autoComplete="current-password"
									trailing={
										<button
											type="button"
											onClick={() => setShowPassword((v) => !v)}
											className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
											aria-label={
												showPassword ? "Hide password" : "Show password"
											}
										>
											{showPassword ? (
												<EyeOff className="size-4" strokeWidth={1.75} />
											) : (
												<Eye className="size-4" strokeWidth={1.75} />
											)}
										</button>
									}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="space-y-3 pt-2">
					<Button
						type="submit"
						className={authPrimaryButtonClass}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="size-4 animate-spin" />
								Signing in…
							</>
						) : (
							<>
								Sign in
								<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
							</>
						)}
					</Button>

					{mockAuth && !nestLogin ? (
						<Button
							type="button"
							variant="outline"
							className={authOutlineButtonClass}
							disabled={isLoading}
							onClick={enterDevSession}
						>
							Continue as Admin User
						</Button>
					) : null}
				</div>

				<div className="flex items-center gap-3 pt-3">
					<span className="h-px flex-1 bg-foreground/10" />
					<span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
						or
					</span>
					<span className="h-px flex-1 bg-foreground/10" />
				</div>

				<p className="text-center text-[13px] text-muted-foreground">
					No account?{" "}
					<Link
						href={AUTH_PATHS.signUp}
						className="font-semibold text-primary underline-offset-4 hover:underline"
					>
						Create one
					</Link>
				</p>
			</form>
		</Form>
	);
}
