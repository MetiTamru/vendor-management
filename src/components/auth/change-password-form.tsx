"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
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
import { useVendorCoreSessionOptional } from "@/components/vendor-core/VendorCoreGate";
import {
	VendorCoreApiError,
	vendorCoreChangePassword,
} from "@/lib/vendor-core/client";

const schema = z
	.object({
		current_password: z.string().min(1, "Current password is required"),
		new_password: z.string().min(8, "At least 8 characters"),
		confirm_password: z.string().min(8, "Confirm your new password"),
	})
	.refine((v) => v.new_password === v.confirm_password, {
		message: "Passwords do not match",
		path: ["confirm_password"],
	});

type FormValues = z.infer<typeof schema>;

export function ChangePasswordForm() {
	const locale = useLocale();
	const session = useVendorCoreSessionOptional();
	const [isLoading, setIsLoading] = useState(false);
	const [showNew, setShowNew] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			current_password: "",
			new_password: "",
			confirm_password: "",
		},
	});

	async function onSubmit(values: FormValues) {
		setIsLoading(true);
		try {
			await vendorCoreChangePassword({
				current_password: values.current_password,
				new_password: values.new_password,
			});
			await session?.refreshUser();
			toast.success("Password updated");
			window.location.assign(`/${locale}`);
		} catch (err) {
			toast.error(
				err instanceof VendorCoreApiError
					? err.message
					: "Could not update password"
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
				<p className="text-[13px] text-muted-foreground">
					Your account requires a new password before you can continue.
				</p>

				<FormField
					control={form.control}
					name="current_password"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className={authLabelClass}>Current password</FormLabel>
							<FormControl>
								<AuthTextInput
									icon={Lock}
									type="password"
									autoComplete="current-password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="new_password"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className={authLabelClass}>New password</FormLabel>
							<FormControl>
								<AuthTextInput
									icon={Lock}
									type={showNew ? "text" : "password"}
									autoComplete="new-password"
									trailing={
										<button
											type="button"
											onClick={() => setShowNew((v) => !v)}
											className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
											aria-label={showNew ? "Hide password" : "Show password"}
										>
											{showNew ? (
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
					name="confirm_password"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className={authLabelClass}>Confirm password</FormLabel>
							<FormControl>
								<AuthTextInput
									icon={Lock}
									type="password"
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
					className={authPrimaryButtonClass}
					disabled={isLoading}
				>
					{isLoading ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							Updating…
						</>
					) : (
						"Update password"
					)}
				</Button>
			</form>
		</Form>
	);
}
