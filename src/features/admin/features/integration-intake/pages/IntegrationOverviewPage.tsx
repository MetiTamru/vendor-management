"use client";

import { useMemo, useState } from "react";

import {
	AlertTriangle,
	Cable,
	Clock3,
	FileStack,
	Pencil,
	Play,
	Plus,
	ServerCrash,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { VendorCoreGate } from "@/components/vendor-core/VendorCoreGate";
import {
	VendorCoreErrorBanner,
	VendorCoreLiveChrome,
	VendorCoreLoadingRow,
} from "@/components/vendor-core/VendorCoreLiveChrome";
import {
	IntakeJobFormDialog,
	type IntakeJobFormValues,
} from "@/features/admin/features/integration-intake/components/IntakeJobFormDialog";
import {
	useCreateIntakeJob,
	useInvalidateVendorCore,
	useRunIntakeJob,
	useUpdateIntakeJob,
	useVendorCoreConnections,
	useVendorCoreErrors,
	useVendorCoreJobRuns,
	useVendorCoreJobs,
	useVendorCoreMonitoring,
	useVendorCoreVendors,
} from "@/features/admin/features/integration-intake/feature/queries/useIntegrationIntakeQuery";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import { isVendorCoreLive } from "@/lib/vendor-core/client";
import type { IntakeJobDto } from "@/lib/vendor-core/types";

function StatCard({
	title,
	value,
	hint,
	icon: Icon,
}: {
	title: string;
	value: string | number;
	hint?: string;
	icon: typeof Cable;
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon className="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-semibold tracking-tight">{value}</div>
				{hint ? (
					<p className="mt-1 text-xs text-muted-foreground">{hint}</p>
				) : null}
			</CardContent>
		</Card>
	);
}

function valuesToBody(values: IntakeJobFormValues): Record<string, unknown> {
	return {
		name: values.name,
		vendor: values.vendor,
		connection: values.connection,
		file_type: values.file_type,
		filename_pattern: values.filename_pattern,
		schedule_cron: values.schedule_cron,
		schedule_timezone: values.schedule_timezone,
		status: values.status,
	};
}

function IntegrationOverviewBody() {
	const invalidate = useInvalidateVendorCore();
	const monitoringQ = useVendorCoreMonitoring();
	const connectionsQ = useVendorCoreConnections();
	const jobsQ = useVendorCoreJobs();
	const runsQ = useVendorCoreJobRuns();
	const errorsQ = useVendorCoreErrors("open");
	const vendorsQ = useVendorCoreVendors();
	const createJob = useCreateIntakeJob();
	const updateJob = useUpdateIntakeJob();
	const runJob = useRunIntakeJob();

	const [formOpen, setFormOpen] = useState(false);
	const [editingJob, setEditingJob] = useState<IntakeJobDto | null>(null);
	const [formError, setFormError] = useState<string | null>(null);
	const [queuedByJob, setQueuedByJob] = useState<Record<string, string>>({});

	const monitoring = monitoringQ.data ?? null;
	const connections = connectionsQ.data ?? [];
	const jobs = jobsQ.data ?? [];
	const jobRuns = runsQ.data ?? [];
	const errors = errorsQ.data ?? [];
	const vendors = vendorsQ.data ?? [];

	const loading =
		monitoringQ.isLoading ||
		connectionsQ.isLoading ||
		jobsQ.isLoading ||
		runsQ.isLoading ||
		errorsQ.isLoading;
	const error =
		monitoringQ.error?.message ||
		connectionsQ.error?.message ||
		jobsQ.error?.message ||
		runsQ.error?.message ||
		errorsQ.error?.message ||
		null;

	const stageTotal = useMemo(() => {
		if (!monitoring) return 0;
		return monitoring.inbound_file_stages.reduce((sum, s) => sum + s.count, 0);
	}, [monitoring]);

	function openCreate() {
		setEditingJob(null);
		setFormError(null);
		setFormOpen(true);
	}

	function openEdit(job: IntakeJobDto) {
		setEditingJob(job);
		setFormError(null);
		setFormOpen(true);
	}

	async function onSubmitJob(values: IntakeJobFormValues) {
		setFormError(null);
		try {
			const body = valuesToBody(values);
			if (editingJob) {
				await updateJob.mutateAsync({ id: editingJob.id, body });
				toast.success("Intake job updated");
			} else {
				await createJob.mutateAsync(body);
				toast.success("Intake job created");
			}
			setFormOpen(false);
		} catch (err) {
			setFormError(err instanceof Error ? err.message : "Save failed");
		}
	}

	async function onRun(id: string) {
		try {
			const result = await runJob.mutateAsync(id);
			setQueuedByJob((current) => ({
				...current,
				[id]: result.task_id ?? "queued",
			}));
			toast.success(`Job queued (${result.task_id ?? "ok"})`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Job run failed");
		}
	}

	return (
		<VendorCoreLiveChrome
			title="Integration & File Intake"
			subtitle="Live vendor-core connections, intake jobs, and processing"
			onRefresh={() => void invalidate()}
			refreshing={loading}
		>
			{error ? <VendorCoreErrorBanner message={error} /> : null}
			{loading && !jobs.length && !connections.length ? (
				<VendorCoreLoadingRow />
			) : null}

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					title="Connections"
					value={connections.length}
					hint={`${connections.filter((c) => c.status === "active").length} active`}
					icon={Cable}
				/>
				<StatCard
					title="Active jobs"
					value={monitoring?.active_jobs.length ?? jobs.length}
					hint="Scheduled / enabled intake jobs"
					icon={Clock3}
				/>
				<StatCard
					title="Inbound files"
					value={stageTotal}
					hint="All stages in warehouse"
					icon={FileStack}
				/>
				<StatCard
					title="Open errors"
					value={errors.length}
					hint="Retryable and blocking"
					icon={AlertTriangle}
				/>
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">File stages</CardTitle>
					</CardHeader>
					<CardContent>
						{monitoring?.inbound_file_stages?.length ? (
							<ul className="space-y-2">
								{monitoring.inbound_file_stages.map((s) => (
									<li
										key={s.stage}
										className="flex items-center justify-between text-sm"
									>
										<span className="capitalize text-muted-foreground">
											{s.stage.replaceAll("_", " ")}
										</span>
										<span className="font-medium">{s.count}</span>
									</li>
								))}
							</ul>
						) : (
							<p className="text-sm text-muted-foreground">
								No file stage data yet.
							</p>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Recent job runs</CardTitle>
					</CardHeader>
					<CardContent className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Job</TableHead>
									<TableHead>Stage</TableHead>
									<TableHead>Processed</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{jobRuns.slice(0, 8).map((run) => {
									const jobName =
										jobs.find((j) => j.id === run.job_id)?.name ||
										(typeof run.job === "object" ? run.job.name : undefined) ||
										run.job_id.slice(0, 8);
									return (
										<TableRow key={run.id}>
											<TableCell className="font-medium">{jobName}</TableCell>
											<TableCell>
												<StatusBadge status={run.stage} />
											</TableCell>
											<TableCell>
												{run.files_processed}/{run.files_found}
											</TableCell>
										</TableRow>
									);
								})}
								{!jobRuns.length ? (
									<TableRow>
										<TableCell colSpan={3} className="text-muted-foreground">
											No runs yet — trigger an intake job below.
										</TableCell>
									</TableRow>
								) : null}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Connections</CardTitle>
				</CardHeader>
				<CardContent className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Method</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Health</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{connections.map((c) => (
								<TableRow key={c.id}>
									<TableCell className="font-medium">{c.name}</TableCell>
									<TableCell>{c.method}</TableCell>
									<TableCell>
										<StatusBadge status={c.status} />
									</TableCell>
									<TableCell className="text-xs text-muted-foreground">
										{c.health?.current_status ?? "—"}
										{c.health?.last_error ? (
											<span className="block text-destructive">
												{c.health.last_error}
											</span>
										) : null}
									</TableCell>
								</TableRow>
							))}
							{!connections.length ? (
								<TableRow>
									<TableCell colSpan={4} className="text-muted-foreground">
										No connections configured.
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0">
					<CardTitle className="text-base">Intake jobs</CardTitle>
					<Button size="sm" onClick={openCreate}>
						<Plus />
						Create job
					</Button>
				</CardHeader>
				<CardContent className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Schedule</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{jobs.map((job) => (
								<TableRow key={job.id}>
									<TableCell className="font-medium">{job.name}</TableCell>
									<TableCell>{job.file_type}</TableCell>
									<TableCell className="text-xs">
										{job.schedule_cron || "—"}{" "}
										<span className="text-muted-foreground">
											{job.schedule_timezone}
										</span>
									</TableCell>
									<TableCell>
										<div className="flex flex-col gap-1">
											<StatusBadge status={job.status} />
											{queuedByJob[job.id] ? (
												<span className="text-[11px] text-muted-foreground">
													Queued {queuedByJob[job.id]?.slice(0, 8)}
												</span>
											) : null}
										</div>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() => openEdit(job)}
											>
												<Pencil />
												Edit
											</Button>
											<Button
												size="sm"
												onClick={() => void onRun(job.id)}
												disabled={
													runJob.isPending && runJob.variables === job.id
												}
											>
												<Play />
												Run
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
							{!jobs.length ? (
								<TableRow>
									<TableCell colSpan={5} className="text-muted-foreground">
										No intake jobs configured.
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base flex items-center gap-2">
						<ServerCrash className="size-4" />
						Open errors
					</CardTitle>
				</CardHeader>
				<CardContent className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Category</TableHead>
								<TableHead>Code</TableHead>
								<TableHead>Message</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{errors.map((err) => (
								<TableRow key={err.id}>
									<TableCell>{err.category}</TableCell>
									<TableCell className="font-mono text-xs">
										{err.code}
									</TableCell>
									<TableCell className="max-w-md truncate text-sm">
										{err.business_explanation || err.technical_message}
									</TableCell>
								</TableRow>
							))}
							{!errors.length ? (
								<TableRow>
									<TableCell colSpan={3} className="text-muted-foreground">
										No open errors.
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<IntakeJobFormDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				job={editingJob}
				vendors={vendors}
				connections={connections}
				saving={createJob.isPending || updateJob.isPending}
				error={formError}
				onSubmit={onSubmitJob}
			/>
		</VendorCoreLiveChrome>
	);
}

export function IntegrationOverviewPage() {
	if (!isVendorCoreLive()) {
		return (
			<div className="space-y-4 p-6">
				<h1 className="text-2xl font-semibold tracking-tight">
					Integration & File Intake
				</h1>
				<p className="text-sm text-muted-foreground">
					Set <code>NEXT_PUBLIC_USE_MOCK=false</code> to load live vendor-core
					data.
				</p>
			</div>
		);
	}

	return (
		<VendorCoreGate title="Integration & File Intake">
			<IntegrationOverviewBody />
		</VendorCoreGate>
	);
}
