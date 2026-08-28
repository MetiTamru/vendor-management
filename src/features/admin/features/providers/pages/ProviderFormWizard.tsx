"use client";

import { type ReactNode, useMemo, useState } from "react";

import {
	BadgeCheck,
	Building2,
	Check,
	ChevronLeft,
	ChevronRight,
	ClipboardList,
	IdCard,
	Loader2,
	Stethoscope,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	TAXONOMY_LABELS,
	parseNameParts,
} from "@/features/admin/features/providers/live-providers";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { ProviderDto, ProviderRosterDto } from "@/lib/vendor-core/types";

export const PROVIDER_WIZARD_STEPS = [
	{
		id: "identity",
		title: "Identity",
		hint: "Name, NPI, type",
		icon: IdCard,
	},
	{
		id: "practice",
		title: "Practice",
		hint: "Specialty & taxonomy",
		icon: Stethoscope,
	},
	{
		id: "enrollment",
		title: "Enrollment",
		hint: "Roster, IDs & status",
		icon: Building2,
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

export type ProviderWizardValues = {
	npi: string;
	name: string;
	credentials: string;
	entity_type: string;
	taxonomy: string;
	specialty: string;
	practice: string;
	tax_id: string;
	upin: string;
	medicaid_id: string;
	state_license: string;
	dea: string;
	roster_file_id: string;
	effective_date: string;
	status: ProviderWizardStatus;
};

export const EMPTY_PROVIDER_WIZARD: ProviderWizardValues = {
	npi: "",
	name: "",
	credentials: "",
	entity_type: "1",
	taxonomy: "",
	specialty: "",
	practice: "",
	tax_id: "",
	upin: "",
	medicaid_id: "",
	state_license: "",
	dea: "",
	roster_file_id: "",
	effective_date: "",
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

function metaString(
	metadata: Record<string, unknown> | null | undefined,
	key: string
): string {
	const value = metadata?.[key];
	return typeof value === "string" ? value : "";
}

export function valuesFromProviderDto(
	dto: ProviderDto,
	fallbackRosterId = ""
): ProviderWizardValues {
	const parts = parseNameParts(dto.name);
	const metadata = dto.metadata ?? {};
	return {
		npi: dto.npi ?? "",
		name: parts.displayName,
		credentials: parts.credentials,
		entity_type: dto.entity_type || "1",
		taxonomy: dto.taxonomy ?? "",
		specialty: metaString(metadata, "specialty"),
		practice: metaString(metadata, "practice"),
		tax_id: metaString(metadata, "tax_id"),
		upin: metaString(metadata, "upin"),
		medicaid_id: metaString(metadata, "medicaid_id"),
		state_license: metaString(metadata, "state_license"),
		dea: metaString(metadata, "dea"),
		roster_file_id: dto.roster_file_id || fallbackRosterId,
		effective_date: dto.effective_date ?? "",
		status: ["active", "pending", "inactive", "termed"].includes(
			(dto.status ?? "").toLowerCase()
		)
			? (dto.status as ProviderWizardStatus)
			: "active",
	};
}

export function composeProviderName(name: string, credentials: string): string {
	const trimmed = name.trim();
	const cred = credentials.trim();
	if (!cred) return trimmed;
	if (trimmed.toLowerCase().endsWith(cred.toLowerCase())) return trimmed;
	return `${trimmed}, ${cred}`;
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
		name: composeProviderName(values.name, values.credentials),
		...(taxonomy ? { taxonomy } : {}),
		...(entityType ? { entity_type: entityType.slice(0, 8) } : {}),
		effective_date: effectiveDate || null,
		...(Object.keys(metadata).length > 0 ? { metadata } : {}),
		is_visible: true,
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
		if (!values.name.trim()) return "Provider name is required.";
		if (!/^\d{10}$/.test(values.npi.trim()))
			return "NPI must be exactly 10 digits.";
		return null;
	}, [values.name, values.npi]);

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
								? "Walk through identity, practice, and enrollment, then confirm before saving to vendor-core."
								: "Update the live provider record. Status changes apply after the profile is saved."}
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
						{step === "enrollment" ? (
							<EnrollmentStep
								values={values}
								onChange={onChange}
								rosters={rosters}
							/>
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
	const directoryName = composeProviderName(values.name, values.credentials);

	return (
		<div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
			<div className="grid gap-5 sm:grid-cols-2">
				<Field
					label="Display name"
					required
					className="sm:col-span-2"
					hint="Legal or directory name. Credentials can be added separately."
				>
					<Input
						value={values.name}
						onChange={(e) => onChange({ name: e.target.value })}
						placeholder="Nguyen, Ava"
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
				<Field label="Entity type" required className="sm:col-span-2">
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
							Credentials
						</span>
						<span className="text-xs font-semibold text-foreground">
							{values.credentials || "—"}
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
			<Field label="Practice / organization">
				<Input
					value={values.practice}
					onChange={(e) => onChange({ practice: e.target.value })}
					placeholder="Capitol Primary Care"
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
				<Field label="Effective date">
					<Input
						type="date"
						value={values.effective_date}
						onChange={(e) => onChange({ effective_date: e.target.value })}
						className="h-11"
					/>
				</Field>
				<Field label="Status">
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
					Optional identifiers
				</p>
				<div className="grid gap-5 sm:grid-cols-2">
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
					<Field label="Medicaid ID">
						<Input
							value={values.medicaid_id}
							onChange={(e) => onChange({ medicaid_id: e.target.value })}
							className="h-11 font-mono"
						/>
					</Field>
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
				</div>
			</div>
		</div>
	);
}

function ReviewStep({
	values,
	rosters,
}: {
	values: ProviderWizardValues;
	rosters: ProviderRosterDto[];
}) {
	const roster = rosters.find((row) => row.id === values.roster_file_id);
	const rows: Array<{ label: string; value: string }> = [
		{
			label: "Name",
			value: composeProviderName(values.name, values.credentials) || "—",
		},
		{ label: "NPI", value: values.npi || "—" },
		{
			label: "Entity type",
			value: ENTITY_LABELS[values.entity_type] ?? values.entity_type,
		},
		{
			label: "Taxonomy",
			value: values.taxonomy
				? `${TAXONOMY_LABELS[values.taxonomy] ?? "Custom"} · ${values.taxonomy}`
				: "—",
		},
		{ label: "Specialty", value: values.specialty || "—" },
		{ label: "Practice", value: values.practice || "—" },
		{
			label: "Roster",
			value:
				roster?.reference_id ??
				roster?.original_filename ??
				values.roster_file_id ??
				"—",
		},
		{ label: "Effective date", value: values.effective_date || "—" },
		{ label: "Status", value: STATUS_LABELS[values.status] },
		{ label: "Tax ID", value: values.tax_id || "—" },
		{ label: "UPIN", value: values.upin || "—" },
		{ label: "Medicaid ID", value: values.medicaid_id || "—" },
		{ label: "State license", value: values.state_license || "—" },
		{ label: "DEA", value: values.dea || "—" },
	];

	return (
		<div className="space-y-4">
			{[
				{
					title: "Identity",
					items: rows.slice(0, 3),
				},
				{
					title: "Practice",
					items: rows.slice(3, 6),
				},
				{
					title: "Enrollment",
					items: rows.slice(6),
				},
			].map((group) => (
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
								<span className="text-right text-sm font-semibold text-foreground">
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
