"use client";

import { useEffect, useMemo, useState } from "react";

import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { VendorCoreGate } from "@/components/vendor-core/VendorCoreGate";
import { useVendorCoreUsersQuery } from "@/features/admin/features/users/feature/queries/useUsersQuery";
import { Link, useRouter } from "@/i18n/navigation";
import { isMockEnabled } from "@/lib/mock-mode";
import { cn } from "@/lib/utils";

import { vendorTypeToApi } from "../feature/mappers/workQueueMappers";
import {
	useAssignMigrationCaseMutation,
	useCreateMigrationCaseMutation,
	useInvalidateVendorCore,
	useSetMigrationCaseStatusMutation,
	useWorkQueueRowsQuery,
} from "../feature/queries/useWorkQueueQuery";
import { workQueueErrorMessage } from "../feature/workQueueErrors";
import { SFTP_MILESTONE_DEFS } from "../progress-data";
import {
	MIGRATION_STATUS_LABEL,
	type MigrationStatus,
} from "../work-queue-types";

const FLAT_CARD_CLASS =
	"overflow-hidden rounded-sm bg-card shadow-[0_1px_3px_rgba(15,23,42,0.07),0_4px_12px_rgba(15,23,42,0.04)]";

const DRAFT_STORAGE_KEY = "work-queue-tpa-tpv-registration-draft";

const WAVE_OPTIONS = ["1", "2", "3", "4"] as const;

const SERVER_OPTIONS = ["New SFTP", "Legacy SFTP", "API Feed"] as const;

const REGISTRATION_MILESTONES = [
	...SFTP_MILESTONE_DEFS.map((m) => ({ key: m.key, label: m.label })),
	{ key: "edi_complete", label: "EDI Complete" },
] as const;

type MilestoneStatus = "not_started" | "in_progress" | "complete";

const MILESTONE_STATUS_LABEL: Record<MilestoneStatus, string> = {
	not_started: "Not Started",
	in_progress: "In Progress",
	complete: "Complete",
};

type RegistrationForm = {
	wave: string;
	name: string;
	vendorType: "TPA" | "TPV";
	serverType: string;
	email: string;
	sftpProgress: number;
	ediProgress: number;
	status: MigrationStatus;
	analystId: string;
	notes: string;
	milestones: Record<string, MilestoneStatus>;
};

const EMPTY_FORM: RegistrationForm = {
	wave: "",
	name: "",
	vendorType: "TPA",
	serverType: "",
	email: "",
	sftpProgress: 0,
	ediProgress: 0,
	status: "not_started",
	analystId: "",
	notes: "",
	milestones: Object.fromEntries(
		REGISTRATION_MILESTONES.map((m) => [
			m.key,
			"not_started" as MilestoneStatus,
		])
	),
};

const fieldClass =
	"h-9 rounded-sm border-border bg-background text-sm shadow-none hover:border-foreground/20 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15";

function FieldLabel({
	children,
	required,
}: {
	children: React.ReactNode;
	required?: boolean;
}) {
	return (
		<label className="mb-1.5 block text-xs font-medium text-foreground">
			{children}
			{required ? <span className="ml-0.5 text-destructive">*</span> : null}
		</label>
	);
}

function ProgressSliderField({
	label,
	value,
	onChange,
	required,
}: {
	label: string;
	value: number;
	onChange: (value: number) => void;
	required?: boolean;
}) {
	return (
		<div>
			<FieldLabel required={required}>{label}</FieldLabel>
			<div className="flex items-center gap-3 pt-1">
				<Slider
					value={[value]}
					min={0}
					max={100}
					step={1}
					onValueChange={(v) => onChange(v[0] ?? 0)}
					className="flex-1"
				/>
				<div className="flex shrink-0 items-center gap-1">
					<Input
						type="number"
						min={0}
						max={100}
						value={value}
						onChange={(e) => {
							const n = Number(e.target.value);
							onChange(Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0);
						}}
						className={cn(fieldClass, "h-8 w-14 px-2 text-center tabular-nums")}
					/>
					<span className="text-xs text-muted-foreground">%</span>
				</div>
			</div>
		</div>
	);
}

function WorkQueueCreateBody() {
	const router = useRouter();
	const useLive = !isMockEnabled();
	const invalidate = useInvalidateVendorCore();
	const createCase = useCreateMigrationCaseMutation();
	const assignCase = useAssignMigrationCaseMutation();
	const setStatus = useSetMigrationCaseStatusMutation();
	const rowsQ = useWorkQueueRowsQuery({ limit: 100, offset: 0 }, useLive);
	const usersQ = useVendorCoreUsersQuery();

	const [form, setForm] = useState<RegistrationForm>(EMPTY_FORM);
	const [busy, setBusy] = useState(false);

	const analysts = useMemo(() => {
		return (usersQ.data ?? [])
			.map((user) => {
				const label =
					user.full_name?.trim() ||
					[user.first_name, user.last_name].filter(Boolean).join(" ").trim() ||
					user.username?.trim() ||
					user.email?.trim() ||
					user.id;
				return { id: user.id, label };
			})
			.sort((a, b) => a.label.localeCompare(b.label));
	}, [usersQ.data]);

	const analystLabelsFromRows = useMemo(() => {
		const fromRows = (rowsQ.data ?? [])
			.map((r) => r.assignedAnalyst)
			.filter((name) => name && name !== "Unassigned");
		return Array.from(new Set(fromRows)).sort();
	}, [rowsQ.data]);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
			if (!raw) return;
			const parsed = JSON.parse(raw) as Partial<RegistrationForm>;
			setForm((prev) => ({
				...prev,
				...parsed,
				milestones: { ...prev.milestones, ...parsed.milestones },
			}));
		} catch {
			/* ignore corrupt draft */
		}
	}, []);

	function patch(next: Partial<RegistrationForm>) {
		setForm((prev) => ({ ...prev, ...next }));
	}

	function patchMilestone(key: string, status: MilestoneStatus) {
		setForm((prev) => ({
			...prev,
			milestones: { ...prev.milestones, [key]: status },
		}));
	}

	function validate(): string | null {
		if (!form.wave) return "Select a wave.";
		if (!form.name.trim()) return "Enter a TPA/TPV name.";
		if (!form.serverType) return "Select a server type.";
		if (!form.status) return "Select a migration status.";
		return null;
	}

	function buildPayload() {
		const prefix = form.vendorType === "TPV" ? "TPV" : "TPA";
		const code = `${prefix}-${Date.now().toString().slice(-6)}`;
		return {
			name: form.name.trim(),
			code,
			vendor_type: vendorTypeToApi(form.vendorType),
			wave: Number(form.wave) || 1,
			server_type: form.serverType,
			primary_email: form.email.trim(),
			notes: form.notes.trim(),
			assigned_to_id: form.analystId || null,
			metadata: {
				sftp_progress_percent: form.sftpProgress,
				edi_progress_percent: form.ediProgress,
				milestone_status: form.milestones,
			},
		};
	}

	function saveDraft() {
		try {
			localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form));
			toast.success("Draft saved locally");
		} catch {
			toast.error("Could not save draft");
		}
	}

	async function submit() {
		const error = validate();
		if (error) {
			toast.error(error);
			return;
		}

		setBusy(true);
		try {
			if (!useLive) {
				localStorage.removeItem(DRAFT_STORAGE_KEY);
				toast.success(`${form.name.trim()} registered (mock)`);
				router.push("/admin/my-work-queue");
				return;
			}

			const payload = buildPayload();
			const created = await createCase.mutateAsync(payload);

			if (form.analystId && created.id && !payload.assigned_to_id) {
				await assignCase.mutateAsync({
					id: created.id,
					assigned_to_id: form.analystId,
				});
			}

			if (form.status !== "not_started" && created.id) {
				await setStatus.mutateAsync({
					id: created.id,
					migration_status: form.status,
				});
			}

			localStorage.removeItem(DRAFT_STORAGE_KEY);
			invalidate();
			toast.success(`${created.name} registered`);
			router.push(`/admin/my-work-queue/${created.id}`);
		} catch (err) {
			toast.error(workQueueErrorMessage(err, "Registration failed"));
		} finally {
			setBusy(false);
		}
	}

	const pending =
		busy || createCase.isPending || assignCase.isPending || setStatus.isPending;

	return (
		<div className="mx-auto w-full max-w-6xl space-y-5 pb-10">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="min-w-0">
					<h1 className="text-2xl font-semibold tracking-tight text-foreground">
						Add TPV/TPA Registration
					</h1>
					<p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
						Register a new TPV/TPA to begin tracking migration and testing
						progress.
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					className="h-9 shrink-0 gap-1.5 rounded-sm border-border/50 bg-background px-3 text-xs font-medium shadow-none"
					asChild
				>
					<Link href="/admin/my-work-queue">
						<ArrowLeft className="size-3.5" />
						Back to TPA/TPV Tracking
					</Link>
				</Button>
			</div>

			<div className={cn(FLAT_CARD_CLASS, "p-5 sm:p-6")}>
				<div className="space-y-8">
					<section>
						<h2 className="text-sm font-semibold text-foreground">
							Registration Information
						</h2>
						<div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							<div>
								<FieldLabel required>Wave</FieldLabel>
								<Select
									value={form.wave}
									onValueChange={(v) => patch({ wave: v })}
								>
									<SelectTrigger className={fieldClass}>
										<SelectValue placeholder="Select wave" />
									</SelectTrigger>
									<SelectContent>
										{WAVE_OPTIONS.map((w) => (
											<SelectItem key={w} value={w}>
												Wave {w}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<FieldLabel required>Type</FieldLabel>
								<Select
									value={form.vendorType}
									onValueChange={(v) =>
										patch({ vendorType: v as RegistrationForm["vendorType"] })
									}
								>
									<SelectTrigger className={fieldClass}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="TPA">TPA</SelectItem>
										<SelectItem value="TPV">TPV</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<FieldLabel required>TPA/TPV name</FieldLabel>
								<Input
									value={form.name}
									onChange={(e) => patch({ name: e.target.value })}
									placeholder="Enter TPA/TPV name"
									className={fieldClass}
								/>
							</div>
							<div>
								<FieldLabel required>Server</FieldLabel>
								<Select
									value={form.serverType}
									onValueChange={(v) => patch({ serverType: v })}
								>
									<SelectTrigger className={fieldClass}>
										<SelectValue placeholder="Enter server or host" />
									</SelectTrigger>
									<SelectContent>
										{SERVER_OPTIONS.map((s) => (
											<SelectItem key={s} value={s}>
												{s}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<FieldLabel>Email</FieldLabel>
								<Input
									type="email"
									value={form.email}
									onChange={(e) => patch({ email: e.target.value })}
									placeholder="Enter contact email"
									className={fieldClass}
								/>
							</div>
							<div>
								<ProgressSliderField
									label="SFTP Progress"
									value={form.sftpProgress}
									onChange={(v) => patch({ sftpProgress: v })}
									required
								/>
							</div>
							<div>
								<ProgressSliderField
									label="EDI Progress"
									value={form.ediProgress}
									onChange={(v) => patch({ ediProgress: v })}
									required
								/>
							</div>
							<div>
								<FieldLabel required>Status</FieldLabel>
								<Select
									value={form.status}
									onValueChange={(v) => patch({ status: v as MigrationStatus })}
								>
									<SelectTrigger className={fieldClass}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{(
											Object.keys(MIGRATION_STATUS_LABEL) as MigrationStatus[]
										).map((key) => (
											<SelectItem key={key} value={key}>
												{MIGRATION_STATUS_LABEL[key]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<FieldLabel>Analyst</FieldLabel>
								<Select
									value={form.analystId || "__none__"}
									onValueChange={(v) =>
										patch({ analystId: v === "__none__" ? "" : v })
									}
								>
									<SelectTrigger className={fieldClass}>
										<SelectValue placeholder="Select analyst" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="__none__">Select analyst</SelectItem>
										{analysts.map((analyst) => (
											<SelectItem key={analyst.id} value={analyst.id}>
												{analyst.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{analystLabelsFromRows.length > 0 ? (
									<p className="mt-1 text-[11px] text-muted-foreground">
										Recently assigned:{" "}
										{analystLabelsFromRows.slice(0, 3).join(", ")}
									</p>
								) : null}
							</div>
							<div className="sm:col-span-2 lg:col-span-1">
								<FieldLabel>Notes</FieldLabel>
								<Textarea
									value={form.notes}
									onChange={(e) => patch({ notes: e.target.value })}
									placeholder="Enter any notes or additional information…"
									rows={4}
									className="min-h-[108px] resize-none rounded-sm border-border bg-background text-sm shadow-none"
								/>
							</div>
						</div>
					</section>

					<section className="border-t border-border/50 pt-6">
						<h2 className="text-sm font-semibold text-foreground">
							Milestone Status{" "}
							<span className="font-normal text-muted-foreground">
								(Optional)
							</span>
						</h2>
						<p className="mt-1 text-xs text-muted-foreground">
							Set initial milestone status for this TPV/TPA registration.
						</p>
						<div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
							{REGISTRATION_MILESTONES.map((milestone) => (
								<div key={milestone.key} className="min-w-0">
									<FieldLabel>{milestone.label}</FieldLabel>
									<Select
										value={form.milestones[milestone.key] ?? "not_started"}
										onValueChange={(v) =>
											patchMilestone(milestone.key, v as MilestoneStatus)
										}
									>
										<SelectTrigger className={cn(fieldClass, "text-xs")}>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{(
												Object.keys(MILESTONE_STATUS_LABEL) as MilestoneStatus[]
											).map((key) => (
												<SelectItem key={key} value={key}>
													{MILESTONE_STATUS_LABEL[key]}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							))}
						</div>
					</section>
				</div>

				<div className="mt-8 flex flex-wrap items-center justify-end gap-2 border-t border-border/50 pt-5">
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="h-9 rounded-sm border-border/50 bg-background px-4 text-xs shadow-none"
						disabled={pending}
						asChild
					>
						<Link href="/admin/my-work-queue">Cancel</Link>
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="h-9 rounded-sm border-border/50 bg-background px-4 text-xs shadow-none"
						disabled={pending}
						onClick={saveDraft}
					>
						Save Draft
					</Button>
					<Button
						type="button"
						size="sm"
						className="h-9 rounded-sm px-4 text-xs shadow-none"
						disabled={pending}
						onClick={() => void submit()}
					>
						Save &amp; Add
					</Button>
				</div>
			</div>
		</div>
	);
}

export function WorkQueueCreatePage() {
	if (!isMockEnabled()) {
		return (
			<VendorCoreGate title="Add TPA/TPV">
				<WorkQueueCreateBody />
			</VendorCoreGate>
		);
	}
	return <WorkQueueCreateBody />;
}
