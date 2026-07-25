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
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { AUTH_PATHS } from "@/lib/auth/paths";

/** Better Auth client includes this at runtime; types may lag. */
type ForgetAuthClient = typeof authClient & {
	forgetPassword: (input: {
		email: string;
		redirectTo?: string;
	}) => Promise<{ error?: { message?: string } | null }>;
};

const forgotSchema = z.object({
	email: z.string().email("Invalid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [sent, setSent] = useState(false);

	const form = useForm<ForgotFormValues>({
		resolver: zodResolver(forgotSchema),
		defaultValues: { email: "" },
	});

	async function onSubmit(values: ForgotFormValues) {
		setIsLoading(true);
		try {
			const client = authClient as ForgetAuthClient;
			const result = await client.forgetPassword({
				email: values.email,
				redirectTo: `${window.location.origin}/auth/reset-password`,
			});

			if (result.error) {
				toast.error(result.error.message ?? "Request failed");
				return;
			}

			setSent(true);
			toast.success("Check your email for reset instructions");
		} catch {
			toast.error("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	}

	if (sent) {
		return (
			<p className="text-center text-sm text-muted-foreground">
				If an account exists for that email, you will receive reset instructions
				shortly.
			</p>
		);
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
				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? "Sending..." : "Send reset link"}
				</Button>
				<p className="text-center text-sm text-muted-foreground">
					<Link
						href={AUTH_PATHS.login}
						className="underline hover:text-foreground"
					>
						Back to sign in
					</Link>
				</p>
			</form>
		</Form>
	);
}
