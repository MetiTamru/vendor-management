"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { AUTH_PATHS } from "@/lib/auth/paths";

const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	async function onSubmit(values: LoginFormValues) {
		setIsLoading(true);
		try {
			const result = await authClient.signIn.email({
				email: values.email,
				password: values.password,
			});

			if (result.error) {
				toast.error(result.error.message ?? "Sign in failed");
				return;
			}

			toast.success("Signed in successfully");
			router.push("/");
			router.refresh();
		} catch {
			toast.error("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									type="email"
									placeholder="you@example.com"
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
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="••••••••"
									autoComplete="current-password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? "Signing in..." : "Sign in"}
				</Button>
				<p className="text-center text-sm text-muted-foreground">
					<Link
						href={AUTH_PATHS.forgotPassword}
						className="underline hover:text-foreground"
					>
						Forgot password?
					</Link>
					{" · "}
					<Link
						href={AUTH_PATHS.signUp}
						className="underline hover:text-foreground"
					>
						Create account
					</Link>
				</p>
			</form>
		</Form>
	);
}
