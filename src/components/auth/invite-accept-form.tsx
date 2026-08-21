"use client";

import { useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useState } from "react";

import {
	AlertTriangle,
	ArrowRight,
	Building2,
	CheckCircle2,
	KeyRound,
	Loader2,
	Lock,
	Mail,
} from "lucide-react";

import {
	AuthTextInput,
	authLabelClass,
	authPrimaryButtonClass,
} from "@/components/auth/auth-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/navigation";
import { AUTH_PATHS } from "@/lib/auth/paths";
import {
	type InviteResolveState,
	markInviteAccepted,
	resolveInviteToken,
} from "@/lib/auth/vendor-invites";

const labelClass = authLabelClass;

function InviteStateMessage({
	title,
	description,
	tone = "muted",
}: {
	title: string;
	description: string;
	tone?: "muted" | "danger";
}) {
	return (
		<div className="space-y-4">
			<div
				className={
					tone === "danger"
						? "flex items-start gap-2.5 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm"
						: "flex items-start gap-2.5 rounded-md border border-foreground/10 bg-muted/40 px-3 py-2.5 text-sm"
				}
			>
				<AlertTriangle
					className={
						tone === "danger"
							? "mt-0.5 size-4 shrink-0 text-destructive"
							: "mt-0.5 size-4 shrink-0 text-muted-foreground"
					}
					strokeWidth={1.75}
				/>
				<div className="space-y-1">
					<p className="font-medium text-foreground">{title}</p>
					<p className="text-muted-foreground">{description}</p>
				</div>
			</div>
			<p className="text-center text-[13px] text-muted-foreground">
				<Link
					href={AUTH_PATHS.login}
					className="font-semibold text-primary underline-offset-4 hover:underline"
				>
					Back to sign in
				</Link>
			</p>
		</div>
	);
}

/**
 * Accept vendor invitation — validates token against the local invite registry
 * (share-link flow until Nest email + accept API exist).
 */
export function InviteAcceptForm() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const router = useRouter();

	const [resolved, setResolved] = useState<InviteResolveState | null>(null);
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setResolved(resolveInviteToken(token));
	}, [token]);

	const invite = useMemo(() => {
		if (!resolved) return null;
		if (
			resolved.state === "valid" ||
			resolved.state === "expired" ||
			resolved.state === "accepted"
		) {
			return resolved.invite;
		}
		return null;
	}, [resolved]);

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		if (!token || resolved?.state !== "valid") {
			setError("This invitation is not valid.");
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
			const updated = markInviteAccepted(token);
			if (!updated || updated.status !== "accepted") {
				setError("Could not accept invitation. It may have expired.");
				setResolved(resolveInviteToken(token));
				return;
			}
			router.push(
				`${AUTH_PATHS.login}?invited=1&email=${encodeURIComponent(updated.email)}`
			);
		} catch {
			setError("Could not accept invitation.");
		} finally {
			setIsLoading(false);
		}
	}

	if (resolved === null) {
		return (
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<Loader2 className="size-4 animate-spin" />
				Checking invitation…
			</div>
		);
	}

	if (resolved.state === "missing") {
		return (
			<InviteStateMessage
				tone="danger"
				title="Missing invitation token"
				description="Open the full accept link from your invitation. The URL should include a token."
			/>
		);
	}

	if (resolved.state === "invalid") {
		return (
			<InviteStateMessage
				tone="danger"
				title="Invitation not found"
				description="This link is invalid or was created in a different browser. Ask your admin to copy the invite link again."
			/>
		);
	}

	if (resolved.state === "expired") {
		return (
			<InviteStateMessage
				tone="danger"
				title="Invitation expired"
				description={`The invite for ${resolved.invite.legalName} has expired. Ask your admin to create a new invite.`}
			/>
		);
	}

	if (resolved.state === "accepted") {
		return (
			<div className="space-y-6">
				<div className="flex items-start gap-2.5 rounded-md border border-emerald-500/25 bg-emerald-500/5 px-3 py-2.5 text-sm">
					<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
					<div className="space-y-1">
						<p className="font-medium text-foreground">Already accepted</p>
						<p className="text-muted-foreground">
							This invitation for {resolved.invite.legalName} was already used.
							Sign in with your account.
						</p>
					</div>
				</div>
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
			<div className="space-y-2 rounded-md border border-foreground/10 bg-muted/40 px-3 py-3">
				<div className="flex items-center gap-2 text-sm font-medium text-foreground">
					<Building2
						className="size-3.5 shrink-0 text-primary"
						strokeWidth={1.75}
					/>
					{invite?.legalName}
				</div>
				<div className="flex items-center gap-2 text-[12px] text-muted-foreground">
					<Mail className="size-3.5 shrink-0" strokeWidth={1.75} />
					{invite?.email}
				</div>
				<div className="flex items-center gap-2 text-[12px] text-muted-foreground">
					<KeyRound className="size-3.5 shrink-0" strokeWidth={1.75} />
					<span className="truncate font-mono text-foreground/80">
						{token?.slice(0, 18)}…
					</span>
				</div>
			</div>

			<p className="text-[13px] leading-relaxed text-muted-foreground">
				Set a password for your supplier account. Next you will sign in and
				continue onboarding.
			</p>

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
				disabled={isLoading}
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
