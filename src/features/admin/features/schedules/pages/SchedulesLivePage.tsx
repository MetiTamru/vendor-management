"use client";

import { useMemo, useState } from "react";

import { Pencil, Play, Plus, Search } from "lucide-react";
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
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import {
	useCreateIntakeJob,
	useInvalidateVendorCore,
	useRunIntakeJob,
	useUpdateIntakeJob,
	useVendorCoreConnections,
	useVendorCoreJobRuns,
	useVendorCoreJobs,
	useVendorCoreVendors,
} from "@/lib/vendor-core/hooks";
import type { IntakeJobDto } from "@/lib/vendor-core/types";
import { vendorLabel } from "@/lib/vendor-core/types";

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

function SchedulesLiveBody() {
	const invalidate = useInvalidateVendorCore();
	const jobsQ = useVendorCoreJobs();
	const vendorsQ = useVendorCoreVendors();
	const connectionsQ = useVendorCoreConnections();
	const createJob = useCreateIntakeJob();
	const updateJob = useUpdateIntakeJob();
	const runJob = useRunIntakeJob();
	const [tab, setTab] = useState<"jobs" | "runs">("jobs");
	const [stage, setStage] = useState("all");
	const [search, setSearch] = useState("");
	const [formOpen, setFormOpen] = useState(false);
	const [editingJob, setEditingJob] = useState<IntakeJobDto | null>(null);
	const [formError, setFormError] = useState<string | null>(null);
	const [queuedByJob, setQueuedByJob] = useState<Record<string, string>>({});

	const runsQ = useVendorCoreJobRuns(stage === "all" ? undefined : { stage });

	const nameById = useMemo(
		() => new Map((vendorsQ.data ?? []).map((v) => [v.id, v.name])),
		[vendorsQ.data]
	);

	const jobNameById = useMemo(
		() => new Map((jobsQ.data ?? []).map((j) => [j.id, j.name])),
		[jobsQ.data]
	);

	const jobs = useMemo(() => {
		const query = search.trim().toLowerCase();
		return (jobsQ.data ?? []).filter((j) => {
			if (!query) return true;
			return `${j.name} ${j.file_type} ${j.schedule_cron} ${vendorLabel(j.vendor, nameById)}`
				.toLowerCase()
				.includes(query);
		});
	}, [jobsQ.data, search, nameById]);

	const runs = useMemo(() => {
		const query = search.trim().toLowerCase();
		return (runsQ.data ?? []).filter((r) => {
			if (!query) return true;
			const jobName =
				(typeof r.job === "object" ? r.job.name : undefined) ||
				jobNameById.get(r.job_id) ||
				r.job_id;
			return `${jobName} ${r.trigger} ${r.stage} ${r.error_summary ?? ""}`
				.toLowerCase()
				.includes(query);
		});
	}, [runsQ.data, search, jobNameById]);

	const loading = tab === "jobs" ? jobsQ.isLoading : runsQ.isLoading;
	const error = tab === "jobs" ? jobsQ.error?.message : runsQ.error?.message;

	async function onRun(id: string) {
		try {
			const result = await runJob.mutateAsync(id);
			setQueuedByJob((current) => ({
				...current,
				[id]: result.task_id ?? "queued",
			}));
			toast.success(`Job queued (${result.task_id ?? "ok"})`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Run failed");
		}
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

	return (
		<VendorCoreLiveChrome
			title="Schedules"
			subtitle="Intake jobs and job runs from vendor-core"
			onRefresh={() => void invalidate()}
			refreshing={loading}
		>
			{error ? <VendorCoreErrorBanner message={error} /> : null}

			<div className="flex flex-wrap items-center gap-2">
				<div className="flex rounded-md border p-0.5">
					<button
						type="button"
						className={`rounded px-3 py-1.5 text-sm ${
							tab === "jobs" ? "bg-muted font-medium" : "text-muted-foreground"
						}`}
						onClick={() => setTab("jobs")}
					>
						Intake jobs
					</button>
					<button
						type="button"
						className={`rounded px-3 py-1.5 text-sm ${
							tab === "runs" ? "bg-muted font-medium" : "text-muted-foreground"
						}`}
						onClick={() => setTab("runs")}
					>
						Job runs
					</button>
				</div>
				<div className="relative max-w-sm flex-1">
					<Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
					<Input
						className="pl-9"
						placeholder={tab === "jobs" ? "Search jobs…" : "Search runs…"}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				{tab === "runs" ? (
					<Select value={stage} onValueChange={setStage}>
						<SelectTrigger className="w-[160px]">
							<SelectValue placeholder="Stage" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All stages</SelectItem>
							{[
								"queued",
								"connecting",
								"downloading",
								"validating",
								"parsing",
								"routing",
								"completed",
								"failed",
							].map((s) => (
								<SelectItem key={s} value={s}>
									{s}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				) : (
					<Button
						size="sm"
						onClick={() => {
							setEditingJob(null);
							setFormError(null);
							setFormOpen(true);
						}}
					>
						<Plus />
						Create job
					</Button>
				)}
			</div>

			{loading && !(tab === "jobs" ? jobsQ.data : runsQ.data) ? (
				<VendorCoreLoadingRow />
			) : tab === "jobs" ? (
				<div className="overflow-x-auto rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Vendor</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Pattern</TableHead>
								<TableHead>Schedule</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{jobs.map((job) => (
								<TableRow key={job.id}>
									<TableCell className="font-medium">{job.name}</TableCell>
									<TableCell>{vendorLabel(job.vendor, nameById)}</TableCell>
									<TableCell>{job.file_type}</TableCell>
									<TableCell className="max-w-[160px] truncate font-mono text-xs">
										{job.filename_pattern || "—"}
									</TableCell>
									<TableCell className="text-xs">
										{job.schedule_cron || "—"}
										{job.schedule_timezone ? (
											<span className="text-muted-foreground">
												{" "}
												{job.schedule_timezone}
											</span>
										) : null}
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
												onClick={() => {
													setEditingJob(job);
													setFormError(null);
													setFormOpen(true);
												}}
											>
												<Pencil />
												Edit
											</Button>
											<Button
												size="sm"
												disabled={
													runJob.isPending && runJob.variables === job.id
												}
												onClick={() => void onRun(job.id)}
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
									<TableCell colSpan={7} className="text-muted-foreground">
										No intake jobs configured.
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				</div>
			) : (
				<div className="overflow-x-auto rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Job</TableHead>
								<TableHead>Trigger</TableHead>
								<TableHead>Stage</TableHead>
								<TableHead>Files</TableHead>
								<TableHead>Started</TableHead>
								<TableHead>Error</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{runs.map((run) => {
								const jobName =
									(typeof run.job === "object" ? run.job.name : undefined) ||
									jobNameById.get(run.job_id) ||
									run.job_id.slice(0, 8);
								return (
									<TableRow key={run.id}>
										<TableCell className="font-medium">{jobName}</TableCell>
										<TableCell className="capitalize">{run.trigger}</TableCell>
										<TableCell>
											<StatusBadge status={run.stage} />
										</TableCell>
										<TableCell className="tabular-nums text-xs">
											{run.files_processed}/{run.files_found}
											{run.files_rejected ? (
												<span className="text-destructive">
													{" "}
													({run.files_rejected} rejected)
												</span>
											) : null}
										</TableCell>
										<TableCell className="text-xs tabular-nums text-muted-foreground">
											{run.started_at
												? new Date(run.started_at).toLocaleString()
												: "—"}
										</TableCell>
										<TableCell className="max-w-[240px] truncate text-xs text-destructive">
											{run.error_summary || "—"}
										</TableCell>
									</TableRow>
								);
							})}
							{!runs.length ? (
								<TableRow>
									<TableCell colSpan={6} className="text-muted-foreground">
										No intake job runs yet.
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				</div>
			)}

			<IntakeJobFormDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				job={editingJob}
				vendors={vendorsQ.data ?? []}
				connections={connectionsQ.data ?? []}
				saving={createJob.isPending || updateJob.isPending}
				error={formError}
				onSubmit={onSubmitJob}
			/>
		</VendorCoreLiveChrome>
	);
}

export function SchedulesLivePage() {
	return (
		<VendorCoreGate title="Schedules">
			<SchedulesLiveBody />
		</VendorCoreGate>
	);
}
