"use client";

import { useSearchParams } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";

import {
	Building2,
	Check,
	Copy,
	ExternalLink,
	Link2,
	Loader2,
	Mail,
	NotebookPen,
	Tags,
	UserPlus,
} from "lucide-react";
import { useLocale } from "next-intl";
import { toast } from "sonner";

import {
	AuthTextInput,
	authLabelClass,
	authOutlineButtonClass,
	authPrimaryButtonClass,
} from "@/components/auth/auth-field";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useInviteVendorMutation } from "@/features/shared/vms/queries";
import { Link, useRouter } from "@/i18n/navigation";
import { buildAcceptUrl } from "@/lib/auth/vendor-invites";
import { isMockEnabled } from "@/lib/mock-mode";
import { cn } from "@/lib/utils";
import { isVendorCoreLive } from "@/lib/vendor-core/client";

type InviteSuccess = {
	vendorId: string;
	legalName: string;
	email: string;
	token: string;
	expiresAt: string;
	acceptPath: string;
};

function formatExpiry(iso: string) {
	try {
		return new Intl.DateTimeFormat(undefined, {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(new Date(iso));
	} catch {
		return iso;
	}
}

function InviteStepper({ step }: { step: "compose" | "success" }) {
	const composeDone = step === "success";
	const composeActive = step === "compose";
	const shareActive = step === "success";

	return (
		<ol className="flex w-full max-w-md items-center">
			<li className="flex items-center gap-2.5">
				<span
					className={cn(
						"flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
						composeDone || composeActive
							? "bg-primary text-primary-foreground"
							: "border border-border bg-background text-muted-foreground"
					)}
					aria-current={composeActive ? "step" : undefined}
				>
					{composeDone ? (
						<Check className="size-3.5" strokeWidth={2.25} />
					) : (
						"1"
					)}
				</span>
				<span
					className={cn(
						"text-sm font-medium",
						composeActive || composeDone
							? "text-foreground"
							: "text-muted-foreground"
					)}
				>
					Compose
				</span>
			</li>

			<li
				aria-hidden
				className={cn(
					"mx-4 h-px flex-1",
					composeDone ? "bg-primary/50" : "bg-border"
				)}
			/>

			<li className="flex items-center gap-2.5">
				<span
					className={cn(
						"flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
						shareActive
							? "bg-primary text-primary-foreground"
							: "border border-border bg-background text-muted-foreground"
					)}
					aria-current={shareActive ? "step" : undefined}
				>
					2
				</span>
				<span
					className={cn(
						"text-sm font-medium",
						shareActive ? "text-foreground" : "text-muted-foreground"
					)}
				>
					Share
				</span>
			</li>
		</ol>
	);
}

const invitePrimaryButtonClass = cn(
	authPrimaryButtonClass,
	"inline-flex items-center justify-center gap-2"
);

export function VendorInvitePage() {
	const router = useRouter();
	const locale = useLocale();
	const searchParams = useSearchParams();
	const inviteVendor = useInviteVendorMutation();

	const prefill = useMemo(
		() => ({
			legalName: searchParams.get("legalName")?.trim() ?? "",
			email: searchParams.get("email")?.trim() ?? "",
			categories: searchParams.get("categories")?.trim() ?? "",
		}),
		[searchParams]
	);

	const [legalName, setLegalName] = useState(prefill.legalName);
	const [email, setEmail] = useState(prefill.email);
	const [confirmEmail, setConfirmEmail] = useState(prefill.email);
	const [categories, setCategories] = useState(prefill.categories);
	const [note, setNote] = useState("");
	const [fieldError, setFieldError] = useState<string | null>(null);
	const [success, setSuccess] = useState<InviteSuccess | null>(null);
	const [copied, setCopied] = useState(false);

	const deliveryNote = isMockEnabled()
		? "Email delivery is not connected in mock mode. Share the accept link below."
		: isVendorCoreLive()
			? "Vendor was created as a prospect. Email delivery is not connected — share this accept link."
			: "Share the accept link below. Email delivery is not connected yet.";

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setFieldError(null);

		const name = legalName.trim();
		const mail = email.trim().toLowerCase();
		const mailConfirm = confirmEmail.trim().toLowerCase();

		if (!name) {
			setFieldError("Legal name is required.");
			return;
		}
		if (!mail || !mail.includes("@")) {
			setFieldError("Enter a valid contact email.");
			return;
		}
		if (mail !== mailConfirm) {
			setFieldError("Email addresses do not match.");
			return;
		}

		try {
			const result = await inviteVendor.mutateAsync({
				legalName: name,
				email: mail,
				categories: categories
					.split(",")
					.map((item) => item.trim())
					.filter(Boolean),
				note: note.trim() || undefined,
			});

			setSuccess({
				vendorId: result.vendor.id,
				legalName: result.vendor.legalName,
				email: mail,
				token: result.invite.token,
				expiresAt: result.invite.expiresAt,
				acceptPath: result.invite.acceptPath,
			});
			toast.success("Invite created", {
				description: "Copy the accept link to share with the contact.",
			});
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to create invite"
			);
		}
	}

	async function copyLink() {
		if (!success) return;
		const url = buildAcceptUrl(locale, success.token);
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			toast.success("Accept link copied");
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("Could not copy link");
		}
	}

	function resetCompose() {
		setSuccess(null);
		setLegalName("");
		setEmail("");
		setConfirmEmail("");
		setCategories("");
		setNote("");
		setFieldError(null);
		setCopied(false);
	}

	const step = success ? "success" : "compose";

	return (
		<div className="space-y-5">
			<div className="space-y-3 border-b border-border pb-4">
				<div className="min-w-0 space-y-1">
					<nav className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
						<Link href="/admin/vendors" className="hover:text-foreground">
							Vendors
						</Link>
						<span className="text-border">/</span>
						<span className="text-foreground">Invite</span>
					</nav>
					<h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
						{success ? "Invite created" : "Invite vendor"}
					</h1>
				</div>
				<InviteStepper step={step} />
			</div>

			{success ? (
				<div className="max-w-2xl space-y-4">
					<div className="overflow-hidden border border-border bg-card">
						{/* Status bar */}
						<div className="flex items-center gap-3 border-b border-border px-4 py-3.5 sm:px-5">
							<span className="flex size-8 shrink-0 items-center justify-center bg-primary text-primary-foreground">
								<Check className="size-4" strokeWidth={2.25} />
							</span>
							<div className="min-w-0">
								<p className="text-sm font-semibold tracking-tight text-foreground">
									Invite ready to share
								</p>
								<p className="text-xs text-muted-foreground">{deliveryNote}</p>
							</div>
						</div>

						{/* Details */}
						<div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
							<div className="px-4 py-4 sm:px-5">
								<p className={authLabelClass}>Organization</p>
								<p className="mt-2 truncate text-sm font-semibold tracking-tight">
									{success.legalName}
								</p>
							</div>
							<div className="px-4 py-4 sm:px-5">
								<p className={authLabelClass}>Contact</p>
								<p className="mt-2 truncate text-sm font-semibold tracking-tight">
									{success.email}
								</p>
							</div>
							<div className="px-4 py-4 sm:px-5">
								<p className={authLabelClass}>Expires</p>
								<p className="mt-2 text-sm font-semibold tracking-tight">
									{formatExpiry(success.expiresAt)}
								</p>
							</div>
						</div>

						{/* Accept link */}
						<div className="space-y-2.5 border-t border-border px-4 py-4 sm:px-5">
							<p className={authLabelClass}>Accept link</p>
							<div className="flex items-stretch border border-border">
								<code className="min-w-0 flex-1 truncate bg-background px-3.5 py-3.5 font-mono text-[11px] leading-none text-foreground/75">
									{buildAcceptUrl(locale, success.token)}
								</code>
								<button
									type="button"
									onClick={copyLink}
									className={cn(
										"inline-flex shrink-0 items-center gap-2 border-l border-border px-4 text-xs font-semibold tracking-wide uppercase transition-colors",
										copied
											? "bg-primary text-primary-foreground"
											: "bg-muted/40 text-foreground hover:bg-muted"
									)}
									aria-label="Copy accept link"
								>
									{copied ? (
										<Check className="size-3.5" strokeWidth={2.25} />
									) : (
										<Copy className="size-3.5" strokeWidth={1.75} />
									)}
									{copied ? "Copied" : "Copy"}
								</button>
							</div>
						</div>
					</div>

					<div className="flex flex-wrap gap-2">
						<Button
							type="button"
							className={cn(invitePrimaryButtonClass, "w-auto min-w-[11rem]")}
							onClick={copyLink}
						>
							<Link2 className="size-4" strokeWidth={1.75} />
							{copied ? "Link copied" : "Copy accept link"}
						</Button>
						<Button
							type="button"
							variant="outline"
							className="h-auto rounded-sm px-4 py-3.5 shadow-none"
							asChild
						>
							<Link href={`/admin/vendors/${success.vendorId}`}>
								Open vendor
								<ExternalLink className="ml-1.5 size-3.5 opacity-60" />
							</Link>
						</Button>
						<Button
							type="button"
							variant="outline"
							className="h-auto rounded-sm px-4 py-3.5 shadow-none"
							onClick={resetCompose}
						>
							Invite another
						</Button>
						<Button
							type="button"
							variant="ghost"
							className="h-auto rounded-sm px-4 py-3.5"
							asChild
						>
							<Link href="/admin/vendors">Back to vendors</Link>
						</Button>
					</div>
				</div>
			) : (
				<form onSubmit={submit} className="max-w-2xl space-y-4">
					<div className="space-y-4 border border-border bg-card p-4 sm:p-5">
						<div className="space-y-1.5">
							<label htmlFor="invite-legal-name" className={authLabelClass}>
								Legal name
							</label>
							<AuthTextInput
								id="invite-legal-name"
								icon={Building2}
								required
								value={legalName}
								onChange={(event) => setLegalName(event.target.value)}
								placeholder="Acme Health Clearinghouse"
								autoComplete="organization"
							/>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-1.5">
								<label htmlFor="invite-email" className={authLabelClass}>
									Contact email
								</label>
								<AuthTextInput
									id="invite-email"
									icon={Mail}
									type="email"
									required
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									placeholder="ops@supplier.com"
									autoComplete="email"
								/>
							</div>
							<div className="space-y-1.5">
								<label
									htmlFor="invite-email-confirm"
									className={authLabelClass}
								>
									Confirm email
								</label>
								<AuthTextInput
									id="invite-email-confirm"
									icon={Mail}
									type="email"
									required
									value={confirmEmail}
									onChange={(event) => setConfirmEmail(event.target.value)}
									placeholder="ops@supplier.com"
									autoComplete="email"
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<label htmlFor="invite-categories" className={authLabelClass}>
								Categories
							</label>
							<AuthTextInput
								id="invite-categories"
								icon={Tags}
								placeholder="Clearinghouse, PBM, Eligibility"
								value={categories}
								onChange={(event) => setCategories(event.target.value)}
							/>
						</div>

						<div className="space-y-1.5">
							<label htmlFor="invite-note" className={authLabelClass}>
								Internal note
							</label>
							<div className="relative">
								<span className="pointer-events-none absolute top-3.5 left-0 flex w-11 items-center justify-center text-muted-foreground">
									<NotebookPen className="size-[1.05rem]" strokeWidth={1.75} />
								</span>
								<Textarea
									id="invite-note"
									value={note}
									onChange={(event) => setNote(event.target.value)}
									placeholder="Optional note for your team"
									rows={3}
									className={cn(
										"min-h-[5.5rem] rounded-md border border-foreground/15 bg-background py-3 pl-12 pr-3 text-sm shadow-none",
										"placeholder:text-muted-foreground/70",
										"transition-[border-color,box-shadow] duration-150",
										"hover:border-foreground/25",
										"focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"
									)}
								/>
							</div>
						</div>

						{fieldError ? (
							<p className="text-sm text-destructive">{fieldError}</p>
						) : null}
					</div>

					<div className="flex flex-wrap gap-2">
						<Button
							type="submit"
							disabled={inviteVendor.isPending}
							className={cn(invitePrimaryButtonClass, "w-auto min-w-[11rem]")}
						>
							{inviteVendor.isPending ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									Creating…
								</>
							) : (
								<>
									<UserPlus className="size-4" strokeWidth={1.75} />
									Create invite
								</>
							)}
						</Button>
						<Button
							type="button"
							variant="outline"
							className={cn(authOutlineButtonClass, "w-auto")}
							onClick={() => router.push("/admin/vendors")}
						>
							Cancel
						</Button>
					</div>
				</form>
			)}
		</div>
	);
}
