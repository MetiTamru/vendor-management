"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2, Lock } from "lucide-react";
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
import { AUTH_PATHS } from "@/lib/auth/paths";

type ResetAuthClient = typeof authClient & {
	resetPassword: (input: {
		newPassword: string;
		token: string;
	}) => Promise<{ error?: { message?: string } | null }>;
};

const resetSchema = z
	.object({
		password: z.string().min(8, "At least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type ResetFormValues = z.infer<typeof resetSchema>;

const labelClass = authLabelClass;

export function ResetPasswordForm() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const [isLoading, setIsLoading] = useState(false);
	const [done, setDone] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<ResetFormValues>({
		resolver: zodResolver(resetSchema),
		defaultValues: { password: "", confirmPassword: "" },
	});

	async function onSubmit(values: ResetFormValues) {
		if (!token) {
			toast.error("This reset link is missing a token");
			return;
		}

		setIsLoading(true);
		try {
			const client = authClient as ResetAuthClient;
			const result = await client.resetPassword({
				newPassword: values.password,
				token,
			});

			if (result.error) {
				toast.error(result.error.message ?? "Reset failed");
				return;
			}

			setDone(true);
			toast.success("Password updated");
		} catch {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	}

	if (done) {
		return (
			<div className="space-y-6">
				<p className="text-sm leading-relaxed text-muted-foreground">
					Your password is updated. Sign in with the new one.
				</p>
				<Button asChild className={authPrimaryButtonClass}>
					<Link href={AUTH_PATHS.login}>
						Sign in
						<ArrowRight className="size-4" />
					</Link>
				</Button>
			</div>
		);
	}

	if (!token) {
		return (
			<div className="space-y-6">
				<p className="text-sm leading-relaxed text-muted-foreground">
					This reset link is invalid or incomplete. Request a new one.
				</p>
				<div className="flex flex-col gap-3">
					<Button asChild className={authPrimaryButtonClass}>
						<Link href={AUTH_PATHS.forgotPassword}>Request new link</Link>
					</Button>
					<Link
						href={AUTH_PATHS.login}
						className="text-center text-[13px] font-semibold text-primary underline-offset-4 hover:underline"
					>
						Back to sign in
					</Link>
				</div>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className={labelClass}>New password</FormLabel>
							<FormControl>
								<AuthTextInput
									icon={Lock}
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									autoComplete="new-password"
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
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className={labelClass}>Confirm password</FormLabel>
							<FormControl>
								<AuthTextInput
									icon={Lock}
									type="password"
									placeholder="••••••••"
									autoComplete="new-password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className={`${authPrimaryButtonClass} mt-1`}
					disabled={isLoading}
				>
					{isLoading ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							Updating…
						</>
					) : (
						<>
							Update password
							<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
						</>
					)}
				</Button>

				<p className="pt-2 text-center text-[13px] text-muted-foreground">
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
