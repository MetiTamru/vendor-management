"use client";

import { useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import { ArrowRight, KeyRound, Loader2, Lock } from "lucide-react";

import {
	AuthTextInput,
	authLabelClass,
	authPrimaryButtonClass,
} from "@/components/auth/auth-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { AUTH_PATHS } from "@/lib/auth/paths";

const labelClass = authLabelClass;

/**
 * Accept vendor invitation — UI is wired; token validation hits API when invite
 * backend is available. Until then, a valid token + password marks acceptance locally.
 */
export function InviteAcceptForm() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [accepted, setAccepted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		if (!token) {
			setError("This invitation link is missing a token.");
			return;
		}
		if (password.length < 8) {
			setError("Password must be at least 8 characters.");
			return;
		}
		if (password !== confirm) {
			setError("Passwords do not match.");
			return;
		}

		setIsLoading(true);
		try {
			await new Promise((r) => setTimeout(r, 400));
			setAccepted(true);
		} catch {
			setError("Could not accept invitation.");
		} finally {
			setIsLoading(false);
		}
	}

	if (accepted) {
		return (
			<div className="space-y-6">
				<p className="text-sm leading-relaxed text-muted-foreground">
					Your supplier account is ready. Sign in to continue.
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

	return (
		<form onSubmit={submit} className="space-y-3">
			{!token ? (
				<p className="text-sm text-destructive">
					This invitation link is missing a token.
				</p>
			) : (
				<div className="flex items-center gap-2.5 rounded-md border border-foreground/10 bg-muted/40 px-3 py-2.5 text-[12px] text-muted-foreground">
					<KeyRound
						className="size-3.5 shrink-0 text-primary"
						strokeWidth={1.75}
					/>
					<span className="truncate font-mono text-foreground/80">
						{token.slice(0, 18)}…
					</span>
				</div>
			)}

			<div className="space-y-1.5">
				<Label htmlFor="invite-password" className={labelClass}>
					Password
				</Label>
				<AuthTextInput
					id="invite-password"
					icon={Lock}
					type="password"
					minLength={8}
					required
					autoComplete="new-password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					placeholder="••••••••"
				/>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="invite-confirm" className={labelClass}>
					Confirm password
				</Label>
				<AuthTextInput
					id="invite-confirm"
					icon={Lock}
					type="password"
					minLength={8}
					required
					autoComplete="new-password"
					value={confirm}
					onChange={(event) => setConfirm(event.target.value)}
					placeholder="••••••••"
				/>
			</div>

			{error ? <p className="text-sm text-destructive">{error}</p> : null}

			<Button
				type="submit"
				className={`${authPrimaryButtonClass} mt-1`}
				disabled={!token || isLoading}
			>
				{isLoading ? (
					<>
						<Loader2 className="size-4 animate-spin" />
						Accepting…
					</>
				) : (
					<>
						Accept invitation
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
	);
}
