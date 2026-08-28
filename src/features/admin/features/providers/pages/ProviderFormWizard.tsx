"use client";

import { type ReactNode, useMemo, useState } from "react";

import {
	BadgeCheck,
	Building2,
	Check,
	ChevronLeft,
	ChevronRight,
	ClipboardList,
	GraduationCap,
	IdCard,
	Loader2,
	MapPin,
	Stethoscope,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	TAXONOMY_LABELS,
	parseNameParts,
} from "@/features/admin/features/providers/live-providers";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type {
	ProviderDto,
	ProviderIdentifierDto,
	ProviderProfileDto,
	ProviderProfileUpdateInput,
	ProviderRosterDto,
} from "@/lib/vendor-core/types";

export const PROVIDER_WIZARD_STEPS = [
	{
		id: "identity",
		title: "Identity",
		hint: "NPI, name & demographics",
		icon: IdCard,
	},
	{
		id: "practice",
		title: "Practice",
		hint: "Specialty, taxonomy & program",
		icon: Stethoscope,
	},
	{
		id: "contact",
		title: "Contact",
		hint: "Phone, email & addresses",
		icon: MapPin,
	},
	{
		id: "enrollment",
		title: "Enrollment",
		hint: "License, roster & identifiers",
		icon: Building2,
	},
	{
		id: "credentials",
		title: "Credentials",
		hint: "Education & certifications",
		icon: GraduationCap,
	},
	{
		id: "review",
		title: "Review",
		hint: "Confirm & save",
		icon: ClipboardList,
	},
] as const;

export type ProviderWizardStepId = (typeof PROVIDER_WIZARD_STEPS)[number]["id"];

export type ProviderWizardStatus = "active" | "pending" | "inactive" | "termed";

export type ProviderWizardGender = "male" | "female" | "other" | "unknown";
export type ProviderWizardProgram = "MDH" | "DHCF" | "BHP";
export type ProviderWizardEnrollmentStatus =
	| "enrolled"
	| "pending"
	| "terminated";

export type ProviderWizardValues = {
	npi: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	suffix: string;
	credentials: string;
	gender: ProviderWizardGender;
	dob: string;
	entity_type: string;
	taxonomy: string;
	specialty: string;
	subspecialty: string;
	practice: string;
	program: ProviderWizardProgram;
	accepting_new_patients: boolean;
	email: string;
	phone: string;
	fax: string;
	practice_address_line1: string;
	practice_address_line2: string;
	practice_city: string;
	practice_state: string;
	practice_postal_code: string;
	mailing_address: string;
	website: string;
	board_certification: string;
	medical_school: string;
	graduation_year: string;
	years_in_practice: string;
	tax_id: string;
	upin: string;
	medicaid_id: string;
	state_license: string;
	dea: string;
	roster_file_id: string;
	effective_date: string;
	enrollment_status: ProviderWizardEnrollmentStatus;
	status: ProviderWizardStatus;
};

export const EMPTY_PROVIDER_WIZARD: ProviderWizardValues = {
	npi: "",
	first_name: "",
	middle_name: "",
	last_name: "",
	suffix: "",
	credentials: "",
	gender: "unknown",
	dob: "",
	entity_type: "1",
	taxonomy: "",
	specialty: "",
	subspecialty: "",
	practice: "",
	program: "DHCF",
	accepting_new_patients: true,
	email: "",
	phone: "",
	fax: "",
	practice_address_line1: "",
	practice_address_line2: "",
	practice_city: "",
	practice_state: "",
	practice_postal_code: "",
	mailing_address: "",
	website: "",
	board_certification: "",
	medical_school: "",
	graduation_year: "",
	years_in_practice: "",
	tax_id: "",
	upin: "",
	medicaid_id: "",
	state_license: "",
	dea: "",
	roster_file_id: "",
	effective_date: "",
	enrollment_status: "pending",
	status: "active",
};

const ENTITY_LABELS: Record<string, string> = {
	"1": "Individual",
	"2": "Group",
	"3": "Facility",
};

const STATUS_LABELS: Record<ProviderWizardStatus, string> = {
	active: "Active",
	pending: "Pending",
	inactive: "Inactive",
	termed: "Termed",
};

const ENROLLMENT_STATUS_LABELS: Record<ProviderWizardEnrollmentStatus, string> =
	{
		enrolled: "Enrolled",
		pending: "Pending",
		terminated: "Terminated",
	};

const GENDER_LABELS: Record<ProviderWizardGender, string> = {
	male: "Male",
	female: "Female",
	other: "Other",
	unknown: "Unknown",
};

const PROGRAM_LABELS: Record<ProviderWizardProgram, string> = {
	MDH: "MDH",
	DHCF: "DHCF",
	BHP: "BHP",
};

function parseOptionalInt(value: string): number | null {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const parsed = Number(trimmed);
	return Number.isFinite(parsed) ? parsed : null;
}

/** Directory display name sent to provider create/update. */
export function composeProviderName(
	values: Pick<
		ProviderWizardValues,
		"first_name" | "middle_name" | "last_name" | "suffix" | "credentials"
	>
): string {
	const first = values.first_name.trim();
	const last = values.last_name.trim();
	const middle = values.middle_name.trim();
	const suffix = values.suffix.trim();
	const cred = values.credentials.trim();

	let display = "";
	if (last && first) {
		display = middle ? `${last}, ${first} ${middle}` : `${last}, ${first}`;
	} else {
		display = [first, middle, last].filter(Boolean).join(" ");
	}

	const tail = [suffix, cred].filter(Boolean).join(", ");
	if (tail) display = display ? `${display}, ${tail}` : tail;
	return display;
}

function metaString(
	metadata: Record<string, unknown> | null | undefined,
	key: string
): string {
	const value = metadata?.[key];
	return typeof value === "string" ? value : "";
}

function identifierField(
	identifiers: ProviderIdentifierDto[] | undefined,
	label: string
): string {
	const hit = identifiers?.find(
		(row) => row.label.trim().toLowerCase() === label.toLowerCase()
	);
	return hit?.value?.trim() ?? "";
}

export function valuesFromProviderDto(
	dto: ProviderDto,
	fallbackRosterId = "",
	extras?: {
		profile?: ProviderProfileDto | null;
		identifiers?: ProviderIdentifierDto[];
	}
): ProviderWizardValues {
	const profile = extras?.profile;
	const identifiers = extras?.identifiers;
	const parts = parseNameParts(dto.name);
	const metadata = dto.metadata ?? {};
	const fallbackName = parts.displayName.trim().split(/\s+/).filter(Boolean);
	const firstFallback = fallbackName[0] ?? "";
	const lastFallback =
		fallbackName.length > 1 ? fallbackName[fallbackName.length - 1]! : "";
	const middleFallback =
		fallbackName.length > 2 ? fallbackName.slice(1, -1).join(" ") : "";

	const gender = (profile?.gender ?? "unknown").toLowerCase();
	const enrollment = (profile?.enrollment_status ?? "pending").toLowerCase();
	const program = (profile?.program ?? "DHCF").toUpperCase();

	return {
		npi: dto.npi ?? "",
		first_name: profile?.first_name?.trim() || firstFallback,
		middle_name: profile?.middle_name?.trim() || middleFallback,
		last_name: profile?.last_name?.trim() || lastFallback,
		suffix: profile?.suffix?.trim() ?? "",
		credentials: profile?.credentials?.trim() || parts.credentials,
		gender: ["male", "female", "other", "unknown"].includes(gender)
			? (gender as ProviderWizardGender)
			: "unknown",
		dob: profile?.dob?.slice(0, 10) ?? "",
		entity_type: dto.entity_type || "1",
		taxonomy: dto.taxonomy ?? "",
		specialty: profile?.specialty?.trim() || metaString(metadata, "specialty"),
		subspecialty: profile?.subspecialty?.trim() ?? "",
		practice:
			profile?.practice_name?.trim() || metaString(metadata, "practice"),
		program: ["MDH", "DHCF", "BHP"].includes(program)
			? (program as ProviderWizardProgram)
			: "DHCF",
		accepting_new_patients: profile?.accepting_new_patients ?? true,
		email: profile?.email?.trim() ?? "",
		phone: profile?.phone?.trim() ?? "",
		fax: profile?.fax?.trim() ?? "",
		practice_address_line1: profile?.practice_address_line1?.trim() ?? "",
		practice_address_line2: profile?.practice_address_line2?.trim() ?? "",
		practice_city: profile?.practice_city?.trim() ?? "",
		practice_state: profile?.practice_state?.trim() ?? "",
		practice_postal_code: profile?.practice_postal_code?.trim() ?? "",
		mailing_address: profile?.mailing_address?.trim() ?? "",
		website: profile?.website?.trim() ?? "",
		board_certification: profile?.board_certification?.trim() ?? "",
		medical_school: profile?.medical_school?.trim() ?? "",
		graduation_year:
			profile?.graduation_year != null ? String(profile.graduation_year) : "",
		years_in_practice:
			profile?.years_in_practice != null
				? String(profile.years_in_practice)
				: "",
		tax_id:
			identifierField(identifiers, "Tax ID") || metaString(metadata, "tax_id"),
		upin: identifierField(identifiers, "UPIN") || metaString(metadata, "upin"),
		medicaid_id:
			identifierField(identifiers, "Medicaid ID") ||
			metaString(metadata, "medicaid_id"),
		state_license:
			profile?.state_license?.trim() || metaString(metadata, "state_license"),
		dea: profile?.dea_number?.trim() || metaString(metadata, "dea"),
		roster_file_id: dto.roster_file_id || fallbackRosterId,
		effective_date:
			profile?.enrollment_effective?.slice(0, 10) ??
			dto.effective_date?.slice(0, 10) ??
			"",
		enrollment_status: ["enrolled", "pending", "terminated"].includes(
			enrollment
		)
			? (enrollment as ProviderWizardEnrollmentStatus)
			: "pending",
		status: ["active", "pending", "inactive", "termed"].includes(
			(dto.status ?? "").toLowerCase()
		)
			? (dto.status as ProviderWizardStatus)
			: "active",
	};
}

export function wizardValuesToPayload(values: ProviderWizardValues) {
	const metadata: Record<string, string> = {};
	if (values.specialty.trim()) metadata.specialty = values.specialty.trim();
	if (values.practice.trim()) metadata.practice = values.practice.trim();
	if (values.tax_id.trim()) metadata.tax_id = values.tax_id.trim();
	if (values.upin.trim()) metadata.upin = values.upin.trim();
	if (values.medicaid_id.trim())
		metadata.medicaid_id = values.medicaid_id.trim();
	if (values.state_license.trim())
		metadata.state_license = values.state_license.trim();
	if (values.dea.trim()) metadata.dea = values.dea.trim();

	const rosterId = values.roster_file_id.trim();
	const taxonomy = values.taxonomy.trim();
	const entityType = values.entity_type.trim();
	const effectiveDate = values.effective_date.trim();

	return {
		...(rosterId ? { roster_file_id: rosterId } : {}),
		npi: values.npi.trim(),
		name: composeProviderName(values),
		...(taxonomy ? { taxonomy } : {}),
		...(entityType ? { entity_type: entityType.slice(0, 8) } : {}),
		effective_date: effectiveDate || null,
		...(Object.keys(metadata).length > 0 ? { metadata } : {}),
		is_visible: true,
	};
}

/** Profile fields persisted after create/update via profile API. */
export function wizardValuesToProfileUpdate(
	values: ProviderWizardValues
): ProviderProfileUpdateInput {
	const taxonomyLabel = values.taxonomy.trim()
		? (TAXONOMY_LABELS[values.taxonomy] ?? values.specialty.trim())
		: values.specialty.trim();

	return {
		first_name: values.first_name.trim() || undefined,
		middle_name: values.middle_name.trim() || undefined,
		last_name: values.last_name.trim() || undefined,
		suffix: values.suffix.trim() || undefined,
		credentials: values.credentials.trim() || undefined,
		gender: values.gender,
		dob: values.dob.trim() || null,
		email: values.email.trim() || undefined,
		fax: values.fax.trim() || undefined,
		phone: values.phone.trim() || undefined,
		specialty: values.specialty.trim() || undefined,
		subspecialty: values.subspecialty.trim() || undefined,
		taxonomy_description: taxonomyLabel || undefined,
		program: values.program,
		provider_type:
			values.entity_type === "2"
				? "Group"
				: values.entity_type === "3"
					? "Facility"
					: "Individual",
		enrollment_status: values.enrollment_status,
		enrollment_effective: values.effective_date.trim() || null,
		practice_name: values.practice.trim() || undefined,
		practice_address_line1: values.practice_address_line1.trim() || undefined,
		practice_address_line2: values.practice_address_line2.trim() || undefined,
		practice_city: values.practice_city.trim() || undefined,
		practice_state: values.practice_state.trim() || undefined,
		practice_postal_code: values.practice_postal_code.trim() || undefined,
		mailing_address: values.mailing_address.trim() || undefined,
		website: values.website.trim() || undefined,
		accepting_new_patients: values.accepting_new_patients,
		years_in_practice: parseOptionalInt(values.years_in_practice),
		board_certification: values.board_certification.trim() || undefined,
		medical_school: values.medical_school.trim() || undefined,
		graduation_year: parseOptionalInt(values.graduation_year),
		state_license: values.state_license.trim() || undefined,
		dea_number: values.dea.trim() || undefined,
	};
}

function stepIndex(id: ProviderWizardStepId) {
	return PROVIDER_WIZARD_STEPS.findIndex((step) => step.id === id);
}

export function ProviderFormWizard({
	mode,
	values,
	onChange,
	rosters,
	busy,
	error,
	onCancelHref,
	onSubmit,
}: {
	mode: "create" | "edit";
	values: ProviderWizardValues;
	onChange: (patch: Partial<ProviderWizardValues>) => void;
	rosters: ProviderRosterDto[];
	busy?: boolean;
	error?: string | null;
	onCancelHref: string;
	onSubmit: () => Promise<void>;
}) {
	const [step, setStep] = useState<ProviderWizardStepId>("identity");
	const current = stepIndex(step);
	const last = PROVIDER_WIZARD_STEPS.length - 1;

	const identityError = useMemo(() => {
		if (!values.first_name.trim() && !values.last_name.trim()) {
			return "First or last name is required.";
		}
		if (!/^\d{10}$/.test(values.npi.trim()))
			return "NPI must be exactly 10 digits.";
		return null;
	}, [values.first_name, values.last_name, values.npi]);

	const enrollmentError = useMemo(() => {
		if (!values.roster_file_id) return "Select a roster file.";
		return null;
	}, [values.roster_file_id]);

	function canAdvance() {
		if (step === "identity") return !identityError;
		if (step === "enrollment") return !enrollmentError;
		return true;
	}

	function goNext() {
		if (!canAdvance()) return;
		const next = PROVIDER_WIZARD_STEPS[current + 1];
		if (next) setStep(next.id);
	}

	function goBack() {
		const prev = PROVIDER_WIZARD_STEPS[current - 1];
		if (prev) setStep(prev.id);
	}

	function selectStep(index: number) {
		if (index <= current) setStep(PROVIDER_WIZARD_STEPS[index]!.id);
	}

	const progressPct = Math.round(
		((current + 1) / PROVIDER_WIZARD_STEPS.length) * 100
	);

	return (
		<div className="w-full space-y-5 pb-4 lg:space-y-6">
			<header className="rounded-lg border border-border/50 bg-card/60 px-4 py-4 sm:px-5">
				<div className="flex flex-wrap items-end justify-between gap-4">
					<div className="min-w-0 space-y-1.5">
						<p className="text-xs text-muted-foreground">
							<Link
								href="/admin/providers"
								className="transition-colors hover:text-foreground"
							>
								Providers
							</Link>
							<span className="mx-1.5 text-border/80">/</span>
							<span className="font-medium text-foreground">
								{mode === "create" ? "New provider" : "Edit provider"}
							</span>
						</p>
						<h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
							{mode === "create" ? "Create provider" : "Edit provider"}
						</h1>
						<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
							{mode === "create"
								? "Six-step flow: identity, practice, contact, enrollment, credentials, then review."
								: "Update the live provider record. Profile and identifiers sync after save."}
						</p>
					</div>
					<p className="text-xs tabular-nums text-muted-foreground">
						Step {current + 1} of {PROVIDER_WIZARD_STEPS.length}
					</p>
				</div>
			</header>

			<div className="lg:hidden">
				<WizardStepperHorizontal current={current} onSelect={selectStep} />
			</div>

			<div className="grid items-start gap-5 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-6">
				<aside className="hidden lg:sticky lg:top-4 lg:block">
					<WizardStepperVertical current={current} onSelect={selectStep} />
				</aside>

				<section className="flex min-h-140 flex-col overflow-hidden rounded-xl border border-border/50 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
					<div className="border-b border-border/40 px-6 py-5 sm:px-8 sm:py-6">
						<div className="mb-3 h-1 overflow-hidden rounded-full bg-muted lg:hidden">
							<div
								className="h-full rounded-full bg-primary transition-all"
								style={{ width: `${progressPct}%` }}
							/>
						</div>
						<div className="flex items-center gap-2.5">
							<span
								aria-hidden
								className="h-5 w-0.5 shrink-0 rounded-full bg-primary"
							/>
							<h2 className="text-lg font-semibold tracking-tight text-foreground">
								{PROVIDER_WIZARD_STEPS[current]?.title}
							</h2>
						</div>
					</div>

					<div className="flex-1 px-6 py-7 sm:px-8 sm:py-8">
						{step === "identity" ? (
							<IdentityStep values={values} onChange={onChange} />
						) : null}
						{step === "practice" ? (
							<PracticeStep values={values} onChange={onChange} />
						) : null}
						{step === "contact" ? (
							<ContactStep values={values} onChange={onChange} />
						) : null}
						{step === "enrollment" ? (
							<EnrollmentStep
								values={values}
								onChange={onChange}
								rosters={rosters}
							/>
						) : null}
						{step === "credentials" ? (
							<CredentialsStep values={values} onChange={onChange} />
						) : null}
						{step === "review" ? (
							<ReviewStep values={values} rosters={rosters} />
						) : null}
					</div>

					{error ? (
						<p className="border-t border-destructive/20 bg-destructive/5 px-6 py-3 text-sm text-destructive sm:px-8">
							{error}
						</p>
					) : null}

					<footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 px-6 py-4 sm:px-8">
						<Button
							asChild
							variant="ghost"
							className="px-0 text-muted-foreground"
						>
							<Link href={onCancelHref}>Cancel</Link>
						</Button>
						<div className="flex flex-wrap gap-2">
							<Button
								type="button"
								variant="outline"
								disabled={current === 0 || busy}
								onClick={goBack}
							>
								<ChevronLeft className="mr-1 size-4" />
								Back
							</Button>
							{current < last ? (
								<Button type="button" disabled={!canAdvance()} onClick={goNext}>
									Continue
									<ChevronRight className="ml-1 size-4" />
								</Button>
							) : (
								<Button
									type="button"
									disabled={
										busy || Boolean(identityError) || Boolean(enrollmentError)
									}
									onClick={() => void onSubmit()}
								>
									{busy ? (
										<Loader2 className="mr-2 size-4 animate-spin" />
									) : (
										<BadgeCheck className="mr-2 size-4" />
									)}
									{mode === "create" ? "Create provider" : "Save changes"}
								</Button>
							)}
						</div>
					</footer>
				</section>
			</div>
		</div>
	);
}

function stepMarkClass(done: boolean, active: boolean) {
	return cn(
		"relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
		done && "border-primary bg-primary text-primary-foreground",
		active &&
			"border-primary bg-primary text-primary-foreground shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]",
		!done && !active && "border-border bg-background text-muted-foreground"
	);
}

function WizardStepperVertical({
	current,
	onSelect,
}: {
	current: number;
	onSelect: (index: number) => void;
}) {
	return (
		<nav
			aria-label="Provider form steps"
			className="rounded-2xl border border-border/50 bg-card p-3"
		>
			<ol className="space-y-0.5">
				{PROVIDER_WIZARD_STEPS.map((item, index) => {
					const Icon = item.icon;
					const done = index < current;
					const active = index === current;
					const last = index === PROVIDER_WIZARD_STEPS.length - 1;
					return (
						<li key={item.id}>
							<button
								type="button"
								disabled={index > current}
								onClick={() => onSelect(index)}
								className={cn(
									"relative flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left transition-colors",
									active && "bg-primary/5",
									index <= current && "hover:bg-muted/60",
									index > current && "cursor-default opacity-70"
								)}
							>
								<span className="relative flex flex-col items-center">
									<span className={stepMarkClass(done, active)}>
										{done ? (
											<Check className="size-4" strokeWidth={2.4} />
										) : (
											<Icon className="size-4" strokeWidth={2} />
										)}
									</span>
									{last ? null : (
										<span
											aria-hidden
											className={cn(
												"mt-1 h-6 w-px",
												index < current ? "bg-primary" : "bg-border"
											)}
										/>
									)}
								</span>
								<span className="min-w-0 pt-1">
									<p
										className={cn(
											"text-xs font-semibold",
											active || done
												? "text-foreground"
												: "text-muted-foreground"
										)}
									>
										{item.title}
									</p>
									<p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
										{item.hint}
									</p>
								</span>
							</button>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}

function WizardStepperHorizontal({
	current,
	onSelect,
}: {
	current: number;
	onSelect: (index: number) => void;
}) {
	return (
		<nav
			aria-label="Provider form steps"
			className="overflow-hidden rounded-2xl border border-border/50 bg-card px-3 py-4 sm:px-5"
		>
			<ol className="flex items-start">
				{PROVIDER_WIZARD_STEPS.map((item, index) => {
					const Icon = item.icon;
					const done = index < current;
					const active = index === current;
					return (
						<li key={item.id} className="flex min-w-0 flex-1 items-start">
							<button
								type="button"
								disabled={index > current}
								onClick={() => onSelect(index)}
								className="flex min-w-0 flex-col items-center gap-2 text-center disabled:cursor-default"
							>
								<span className={stepMarkClass(done, active)}>
									{done ? (
										<Check className="size-4" strokeWidth={2.4} />
									) : (
										<Icon className="size-4" strokeWidth={2} />
									)}
								</span>
								<span className="min-w-0">
									<p
										className={cn(
											"text-xs font-medium sm:text-sm",
											active || done
												? "text-foreground"
												: "text-muted-foreground"
										)}
									>
										{item.title}
									</p>
								</span>
							</button>
							{index < PROVIDER_WIZARD_STEPS.length - 1 ? (
								<span
									aria-hidden
									className={cn(
										"mx-2 mt-5 h-px min-w-4 flex-1",
										index < current
											? "bg-linear-to-r from-primary to-primary/40"
											: "bg-border"
									)}
								/>
							) : null}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}

function Field({
	label,
	hint,
	required,
	className,
	children,
}: {
	label: string;
	hint?: string;
	required?: boolean;
	className?: string;
	children: ReactNode;
}) {
	return (
		<label className={cn("grid gap-1.5", className)}>
			<span className="text-[11px] font-semibold tracking-[0.08em] text-foreground uppercase">
				{label}
				{required ? <span className="text-destructive"> *</span> : null}
			</span>
			{children}
			{hint ? (
				<span className="text-xs font-normal text-muted-foreground">
					{hint}
				</span>
			) : null}
		</label>
	);
}

function IdentityStep({
	values,
	onChange,
}: {
	values: ProviderWizardValues;
	onChange: (patch: Partial<ProviderWizardValues>) => void;
}) {
	const directoryName = composeProviderName(values);

	return (
		<div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
			<div className="grid gap-5 sm:grid-cols-2">
				<Field label="First name" required>
					<Input
						value={values.first_name}
						onChange={(e) => onChange({ first_name: e.target.value })}
						placeholder="Ava"
						className="h-11"
					/>
				</Field>
				<Field label="Last name" required>
					<Input
						value={values.last_name}
						onChange={(e) => onChange({ last_name: e.target.value })}
						placeholder="Nguyen"
						className="h-11"
					/>
				</Field>
				<Field label="Middle name">
					<Input
						value={values.middle_name}
						onChange={(e) => onChange({ middle_name: e.target.value })}
						placeholder="Marie"
						className="h-11"
					/>
				</Field>
				<Field label="Suffix" hint="Jr., III, etc.">
					<Input
						value={values.suffix}
						onChange={(e) => onChange({ suffix: e.target.value })}
						placeholder="Jr."
						className="h-11"
					/>
				</Field>
				<Field label="Credentials" hint="MD, DO, NP, PA…">
					<Input
						value={values.credentials}
						onChange={(e) => onChange({ credentials: e.target.value })}
						placeholder="MD"
						className="h-11"
					/>
				</Field>
				<Field
					label="NPI"
					required
					hint="National Provider Identifier, 10 digits."
				>
					<Input
						inputMode="numeric"
						maxLength={10}
						value={values.npi}
						onChange={(e) =>
							onChange({ npi: e.target.value.replace(/\D/g, "").slice(0, 10) })
						}
						placeholder="1679576722"
						className="h-11 font-mono"
					/>
				</Field>
				<Field label="Entity type" required>
					<Select
						value={values.entity_type}
						onValueChange={(entity_type) => onChange({ entity_type })}
					>
						<SelectTrigger className="h-11">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">Individual</SelectItem>
							<SelectItem value="2">Group</SelectItem>
							<SelectItem value="3">Facility</SelectItem>
						</SelectContent>
					</Select>
				</Field>
				<Field label="Gender">
					<Select
						value={values.gender}
						onValueChange={(gender) =>
							onChange({ gender: gender as ProviderWizardGender })
						}
					>
						<SelectTrigger className="h-11">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{(Object.keys(GENDER_LABELS) as ProviderWizardGender[]).map(
								(key) => (
									<SelectItem key={key} value={key}>
										{GENDER_LABELS[key]}
									</SelectItem>
								)
							)}
						</SelectContent>
					</Select>
				</Field>
				<Field label="Date of birth">
					<Input
						type="date"
						value={values.dob}
						onChange={(e) => onChange({ dob: e.target.value })}
						className="h-11"
					/>
				</Field>
			</div>
			<aside className="h-fit rounded-xl border border-border/60 bg-card p-4 shadow-sm">
				<div className="flex items-center gap-2">
					<span
						aria-hidden
						className="h-3.5 w-0.5 shrink-0 rounded-full bg-primary"
					/>
					<p className="text-[10px] font-bold tracking-[0.08em] text-foreground uppercase">
						Directory preview
					</p>
				</div>

				<div className="mt-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-3">
					<p className="truncate text-base font-semibold tracking-tight text-foreground">
						{directoryName || "Provider name"}
					</p>
					<p className="mt-1 font-mono text-xs text-muted-foreground">
						{values.npi || "NPI pending"}
					</p>
				</div>

				<div className="mt-3 space-y-1.5">
					<div className="flex items-center justify-between gap-3 rounded-md border border-border/50 px-2.5 py-2">
						<span className="text-[11px] font-medium text-muted-foreground">
							Entity type
						</span>
						<span className="text-xs font-semibold text-foreground">
							{ENTITY_LABELS[values.entity_type] ?? "Individual"}
						</span>
					</div>
					<div className="flex items-center justify-between gap-3 rounded-md border border-border/50 px-2.5 py-2">
						<span className="text-[11px] font-medium text-muted-foreground">
							Gender
						</span>
						<span className="text-xs font-semibold text-foreground">
							{GENDER_LABELS[values.gender]}
						</span>
					</div>
				</div>
			</aside>
		</div>
	);
}

function PracticeStep({
	values,
	onChange,
}: {
	values: ProviderWizardValues;
	onChange: (patch: Partial<ProviderWizardValues>) => void;
}) {
	const knownTaxonomy = Boolean(TAXONOMY_LABELS[values.taxonomy]);

	return (
		<div className="grid gap-5 sm:grid-cols-2">
			<Field label="Taxonomy" hint="NUCC provider taxonomy code.">
				<Select
					value={knownTaxonomy ? values.taxonomy : "custom"}
					onValueChange={(value) => {
						if (value === "custom") {
							onChange({ taxonomy: knownTaxonomy ? "" : values.taxonomy });
							return;
						}
						onChange({
							taxonomy: value,
							specialty: values.specialty || TAXONOMY_LABELS[value] || "",
						});
					}}
				>
					<SelectTrigger className="h-11">
						<SelectValue placeholder="Select taxonomy" />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(TAXONOMY_LABELS).map(([code, label]) => (
							<SelectItem key={code} value={code}>
								{label} · {code}
							</SelectItem>
						))}
						<SelectItem value="custom">Custom / other</SelectItem>
					</SelectContent>
				</Select>
			</Field>
			<Field
				label="Taxonomy code"
				hint="Override if the code is not in the list."
			>
				<Input
					value={values.taxonomy}
					onChange={(e) => onChange({ taxonomy: e.target.value })}
					placeholder="207R00000X"
					className="h-11 font-mono"
				/>
			</Field>
			<Field label="Specialty">
				<Input
					value={values.specialty}
					onChange={(e) => onChange({ specialty: e.target.value })}
					placeholder="Internal Medicine"
					className="h-11"
				/>
			</Field>
			<Field label="Practice / organization" className="sm:col-span-2">
				<Input
					value={values.practice}
					onChange={(e) => onChange({ practice: e.target.value })}
					placeholder="Capitol Primary Care"
					className="h-11"
				/>
			</Field>
			<Field label="Subspecialty">
				<Input
					value={values.subspecialty}
					onChange={(e) => onChange({ subspecialty: e.target.value })}
					placeholder="Interventional Cardiology"
					className="h-11"
				/>
			</Field>
			<Field label="Program">
				<Select
					value={values.program}
					onValueChange={(program) =>
						onChange({ program: program as ProviderWizardProgram })
					}
				>
					<SelectTrigger className="h-11">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{(Object.keys(PROGRAM_LABELS) as ProviderWizardProgram[]).map(
							(key) => (
								<SelectItem key={key} value={key}>
									{PROGRAM_LABELS[key]}
								</SelectItem>
							)
						)}
					</SelectContent>
				</Select>
			</Field>
			<div className="flex items-center gap-2 sm:col-span-2">
				<Checkbox
					id="accepting-patients"
					checked={values.accepting_new_patients}
					onCheckedChange={(checked) =>
						onChange({ accepting_new_patients: checked === true })
					}
				/>
				<label
					htmlFor="accepting-patients"
					className="text-sm font-medium text-foreground"
				>
					Accepting new patients
				</label>
			</div>
		</div>
	);
}

function ContactStep({
	values,
	onChange,
}: {
	values: ProviderWizardValues;
	onChange: (patch: Partial<ProviderWizardValues>) => void;
}) {
	return (
		<div className="space-y-6">
			<div className="grid gap-5 sm:grid-cols-2">
				<Field label="Email">
					<Input
						type="email"
						value={values.email}
						onChange={(e) => onChange({ email: e.target.value })}
						placeholder="provider@practice.org"
						className="h-11"
					/>
				</Field>
				<Field label="Phone">
					<Input
						value={values.phone}
						onChange={(e) => onChange({ phone: e.target.value })}
						placeholder="(202) 555-0100"
						className="h-11"
					/>
				</Field>
				<Field label="Fax">
					<Input
						value={values.fax}
						onChange={(e) => onChange({ fax: e.target.value })}
						placeholder="(202) 555-0101"
						className="h-11"
					/>
				</Field>
				<Field label="Website">
					<Input
						value={values.website}
						onChange={(e) => onChange({ website: e.target.value })}
						placeholder="https://practice.org"
						className="h-11"
					/>
				</Field>
			</div>

			<div>
				<p className="mb-3 text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
					Practice address
				</p>
				<div className="grid gap-5 sm:grid-cols-2">
					<Field label="Address line 1" className="sm:col-span-2">
						<Input
							value={values.practice_address_line1}
							onChange={(e) =>
								onChange({ practice_address_line1: e.target.value })
							}
							placeholder="123 Main St"
							className="h-11"
						/>
					</Field>
					<Field label="Address line 2" className="sm:col-span-2">
						<Input
							value={values.practice_address_line2}
							onChange={(e) =>
								onChange({ practice_address_line2: e.target.value })
							}
							placeholder="Suite 200"
							className="h-11"
						/>
					</Field>
					<Field label="City">
						<Input
							value={values.practice_city}
							onChange={(e) => onChange({ practice_city: e.target.value })}
							placeholder="Washington"
							className="h-11"
						/>
					</Field>
					<Field label="State">
						<Input
							value={values.practice_state}
							onChange={(e) => onChange({ practice_state: e.target.value })}
							placeholder="DC"
							className="h-11"
							maxLength={16}
						/>
					</Field>
					<Field label="Postal code">
						<Input
							value={values.practice_postal_code}
							onChange={(e) =>
								onChange({ practice_postal_code: e.target.value })
							}
							placeholder="20001"
							className="h-11"
						/>
					</Field>
				</div>
			</div>

			<Field label="Mailing address" hint="If different from practice address.">
				<Textarea
					value={values.mailing_address}
					onChange={(e) => onChange({ mailing_address: e.target.value })}
					placeholder="PO Box or alternate mailing address"
					rows={3}
				/>
			</Field>
		</div>
	);
}

function CredentialsStep({
	values,
	onChange,
}: {
	values: ProviderWizardValues;
	onChange: (patch: Partial<ProviderWizardValues>) => void;
}) {
	return (
		<div className="grid gap-5 sm:grid-cols-2">
			<Field label="Board certification" className="sm:col-span-2">
				<Input
					value={values.board_certification}
					onChange={(e) => onChange({ board_certification: e.target.value })}
					placeholder="American Board of Internal Medicine"
					className="h-11"
				/>
			</Field>
			<Field label="Medical school" className="sm:col-span-2">
				<Input
					value={values.medical_school}
					onChange={(e) => onChange({ medical_school: e.target.value })}
					placeholder="Georgetown University School of Medicine"
					className="h-11"
				/>
			</Field>
			<Field label="Graduation year">
				<Input
					inputMode="numeric"
					value={values.graduation_year}
					onChange={(e) =>
						onChange({
							graduation_year: e.target.value.replace(/\D/g, "").slice(0, 4),
						})
					}
					placeholder="2010"
					className="h-11"
				/>
			</Field>
			<Field label="Years in practice">
				<Input
					inputMode="numeric"
					value={values.years_in_practice}
					onChange={(e) =>
						onChange({
							years_in_practice: e.target.value.replace(/\D/g, "").slice(0, 2),
						})
					}
					placeholder="12"
					className="h-11"
				/>
			</Field>
		</div>
	);
}

function EnrollmentStep({
	values,
	onChange,
	rosters,
}: {
	values: ProviderWizardValues;
	onChange: (patch: Partial<ProviderWizardValues>) => void;
	rosters: ProviderRosterDto[];
}) {
	return (
		<div className="space-y-6">
			<div className="grid gap-5 sm:grid-cols-2">
				<Field
					label="Roster file"
					required
					hint="Providers belong to a roster import file."
					className="sm:col-span-2"
				>
					{rosters.length === 0 ? (
						<p className="rounded-lg border border-border/60 bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
							No roster files yet.{" "}
							<Link
								href="/admin/providers"
								className="font-medium text-foreground underline-offset-4 hover:underline"
							>
								Create one from the providers list
							</Link>
							, then return here.
						</p>
					) : (
						<Select
							value={values.roster_file_id}
							onValueChange={(roster_file_id) => onChange({ roster_file_id })}
						>
							<SelectTrigger className="h-11">
								<SelectValue placeholder="Select roster" />
							</SelectTrigger>
							<SelectContent>
								{rosters.map((roster) => (
									<SelectItem key={roster.id} value={roster.id}>
										{roster.reference_id ??
											roster.original_filename ??
											roster.id}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</Field>
				<Field label="Enrollment effective date">
					<Input
						type="date"
						value={values.effective_date}
						onChange={(e) => onChange({ effective_date: e.target.value })}
						className="h-11"
					/>
				</Field>
				<Field label="Enrollment status">
					<Select
						value={values.enrollment_status}
						onValueChange={(enrollment_status) =>
							onChange({
								enrollment_status:
									enrollment_status as ProviderWizardEnrollmentStatus,
							})
						}
					>
						<SelectTrigger className="h-11">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{(
								Object.keys(
									ENROLLMENT_STATUS_LABELS
								) as ProviderWizardEnrollmentStatus[]
							).map((key) => (
								<SelectItem key={key} value={key}>
									{ENROLLMENT_STATUS_LABELS[key]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
				<Field label="Provider status">
					<Select
						value={values.status}
						onValueChange={(status) =>
							onChange({ status: status as ProviderWizardStatus })
						}
					>
						<SelectTrigger className="h-11">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="active">Active</SelectItem>
							<SelectItem value="pending">Pending</SelectItem>
							<SelectItem value="inactive">Inactive</SelectItem>
							<SelectItem value="termed">Termed</SelectItem>
						</SelectContent>
					</Select>
				</Field>
			</div>

			<div>
				<p className="mb-3 text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
					Licenses & identifiers
				</p>
				<div className="grid gap-5 sm:grid-cols-2">
					<Field label="State license">
						<Input
							value={values.state_license}
							onChange={(e) => onChange({ state_license: e.target.value })}
							className="h-11 font-mono"
						/>
					</Field>
					<Field label="DEA number">
						<Input
							value={values.dea}
							onChange={(e) => onChange({ dea: e.target.value })}
							className="h-11 font-mono"
						/>
					</Field>
					<Field label="Tax ID">
						<Input
							value={values.tax_id}
							onChange={(e) => onChange({ tax_id: e.target.value })}
							className="h-11 font-mono"
						/>
					</Field>
					<Field label="UPIN">
						<Input
							value={values.upin}
							onChange={(e) => onChange({ upin: e.target.value })}
							className="h-11 font-mono"
						/>
					</Field>
					<Field label="Medicaid ID" className="sm:col-span-2">
						<Input
							value={values.medicaid_id}
							onChange={(e) => onChange({ medicaid_id: e.target.value })}
							className="h-11 font-mono"
						/>
					</Field>
				</div>
			</div>
		</div>
	);
}

function formatAddress(values: ProviderWizardValues): string {
	const line = [
		values.practice_address_line1,
		values.practice_address_line2,
		[values.practice_city, values.practice_state, values.practice_postal_code]
			.filter(Boolean)
			.join(" "),
	]
		.map((part) => part.trim())
		.filter(Boolean)
		.join(", ");
	return line || "—";
}

function ReviewStep({
	values,
	rosters,
}: {
	values: ProviderWizardValues;
	rosters: ProviderRosterDto[];
}) {
	const roster = rosters.find((row) => row.id === values.roster_file_id);
	const groups: Array<{
		title: string;
		items: Array<{ label: string; value: string }>;
	}> = [
		{
			title: "Identity",
			items: [
				{ label: "Name", value: composeProviderName(values) || "—" },
				{ label: "NPI", value: values.npi || "—" },
				{
					label: "Entity type",
					value: ENTITY_LABELS[values.entity_type] ?? values.entity_type,
				},
				{ label: "Gender", value: GENDER_LABELS[values.gender] },
				{ label: "Date of birth", value: values.dob || "—" },
			],
		},
		{
			title: "Practice",
			items: [
				{
					label: "Taxonomy",
					value: values.taxonomy
						? `${TAXONOMY_LABELS[values.taxonomy] ?? "Custom"} · ${values.taxonomy}`
						: "—",
				},
				{ label: "Specialty", value: values.specialty || "—" },
				{ label: "Subspecialty", value: values.subspecialty || "—" },
				{ label: "Practice", value: values.practice || "—" },
				{ label: "Program", value: PROGRAM_LABELS[values.program] },
				{
					label: "Accepting patients",
					value: values.accepting_new_patients ? "Yes" : "No",
				},
			],
		},
		{
			title: "Contact",
			items: [
				{ label: "Email", value: values.email || "—" },
				{ label: "Phone", value: values.phone || "—" },
				{ label: "Fax", value: values.fax || "—" },
				{ label: "Website", value: values.website || "—" },
				{ label: "Practice address", value: formatAddress(values) },
				{ label: "Mailing address", value: values.mailing_address || "—" },
			],
		},
		{
			title: "Credentials",
			items: [
				{
					label: "Board certification",
					value: values.board_certification || "—",
				},
				{ label: "Medical school", value: values.medical_school || "—" },
				{ label: "Graduation year", value: values.graduation_year || "—" },
				{
					label: "Years in practice",
					value: values.years_in_practice || "—",
				},
			],
		},
		{
			title: "Enrollment",
			items: [
				{
					label: "Roster",
					value:
						roster?.reference_id ??
						roster?.original_filename ??
						values.roster_file_id ??
						"—",
				},
				{ label: "Effective date", value: values.effective_date || "—" },
				{
					label: "Enrollment status",
					value: ENROLLMENT_STATUS_LABELS[values.enrollment_status],
				},
				{ label: "Provider status", value: STATUS_LABELS[values.status] },
				{ label: "State license", value: values.state_license || "—" },
				{ label: "DEA", value: values.dea || "—" },
				{ label: "Tax ID", value: values.tax_id || "—" },
				{ label: "UPIN", value: values.upin || "—" },
				{ label: "Medicaid ID", value: values.medicaid_id || "—" },
			],
		},
	];

	return (
		<div className="space-y-4">
			{groups.map((group) => (
				<section
					key={group.title}
					className="overflow-hidden rounded-lg border border-border/60 bg-card"
				>
					<div className="flex items-center gap-2 border-b border-border/40 px-3 py-2.5">
						<span
							aria-hidden
							className="h-3.5 w-0.5 shrink-0 rounded-full bg-primary"
						/>
						<p className="text-[11px] font-semibold tracking-[0.08em] text-foreground uppercase">
							{group.title}
						</p>
					</div>
					<div className="grid gap-x-6 gap-y-0 px-3 py-1 sm:grid-cols-2">
						{group.items.map((row) => (
							<div
								key={row.label}
								className="flex items-center justify-between gap-4 border-b border-border/30 py-2.5 last:border-b-0"
							>
								<span className="text-xs font-medium text-muted-foreground">
									{row.label}
								</span>
								<span className="max-w-[58%] text-right text-sm font-semibold text-foreground">
									{row.value}
								</span>
							</div>
						))}
					</div>
				</section>
			))}
		</div>
	);
}
