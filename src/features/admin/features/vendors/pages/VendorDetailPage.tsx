"use client";

import { useParams } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import {
	AlertTriangle,
	ArrowLeft,
	Building2,
	Calendar,
	CheckCircle2,
	ChevronDown,
	Clock3,
	ExternalLink,
	FileText,
	Mail,
	MoreHorizontal,
	NotebookPen,
	Pencil,
	Phone,
	ScrollText,
	Send,
	Server,
	Upload,
	User,
	XCircle,
} from "lucide-react";
import {
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import {
	useActivitiesList,
	useContractsList,
	useDocumentsList,
	useUpdateVendorMutation,
	useVendor,
} from "@/features/shared/vms/queries";
import type { VendorStatus } from "@/features/shared/vms/types";
import { formatDate } from "@/features/shared/vms/utils";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import {
	VENDOR_ALERTS,
	VENDOR_TREND_BY_ID,
	getVendorIntegration,
	runBucket,
	runsForVendor,
	summarizeRuns,
} from "../vendor-integration-mock";

const TABS = [
	"Overview",
	"Accounts",
	"File History",
	"Jobs",
	"File Configuration",
	"SFTP / PGP",
	"Processing Logs",
	"Alerts",
	"Contacts",
	"Notes",
	"Audit Trail",
] as const;

type Tab = (typeof TABS)[number];

const STATUSES: VendorStatus[] = [
	"prospect",
	"invited",
	"onboarding",
	"under_review",
	"active",
	"suspended",
	"offboarded",
];

function formatVendorCode(id: string) {
	const digits = id.replace(/\D/g, "") || "0";
	return `VND-${digits.padStart(4, "0")}`;
}

function initials(name: string) {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 1)
		.map((p) => p[0]?.toUpperCase() ?? "")
		.join("");
}

function HealthIndicator({ health }: { health: string }) {
	const label =
		health === "healthy"
			? "Healthy"
			: health === "failed"
				? "Failed"
				: health === "warning"
					? "Warning"
					: "In Progress";
	const Icon =
		health === "healthy"
			? CheckCircle2
			: health === "failed"
				? XCircle
				: health === "warning"
					? AlertTriangle
					: Clock3;
	const tone =
		health === "healthy"
			? "emerald"
			: health === "failed"
				? "red"
				: health === "warning"
					? "amber"
					: "sky";

	return (
		<div className="flex items-center gap-1.5">
			<Icon
				className={cn(
					"size-4 shrink-0",
					tone === "emerald" && "text-emerald-600",
					tone === "amber" && "text-amber-600",
					tone === "red" && "text-red-600",
					tone === "sky" && "text-sky-600"
				)}
			/>
			<span
				className={cn(
					"text-xs font-medium",
					tone === "emerald" && "text-emerald-700",
					tone === "amber" && "text-amber-700",
					tone === "red" && "text-red-700",
					tone === "sky" && "text-sky-700"
				)}
			>
				{label}
			</span>
		</div>
	);
}

function ActiveStatusPill({ status }: { status: string }) {
	if (status === "active") {
		return (
			<span className="inline-flex items-center rounded-full bg-emerald-100 px-1.5 py-0 text-[10px] font-medium text-emerald-800">
				Active
			</span>
		);
	}
	return <StatusBadge status={status} />;
}

function ActivityStatus({ status }: { status: string }) {
	const bucket = runBucket(status as never);
	if (bucket === "success")
		return (
			<span className="inline-flex rounded-full bg-emerald-100 px-1.5 py-0 text-[10px] font-medium text-emerald-800">
				Success
			</span>
		);
	if (bucket === "failed")
		return (
			<span className="inline-flex rounded-full bg-red-100 px-1.5 py-0 text-[10px] font-medium text-red-800">
				Failed
			</span>
		);
	if (bucket === "warning")
		return (
			<span className="inline-flex rounded-full bg-amber-100 px-1.5 py-0 text-[10px] font-medium text-amber-900">
				Warning
			</span>
		);
	if (bucket === "in_progress")
		return (
			<span className="inline-flex rounded-full bg-sky-100 px-1.5 py-0 text-[10px] font-medium text-sky-800">
				In Progress
			</span>
		);
	return <StatusBadge status={status} />;
}

function MetaItem({
	label,
	value,
	icon: Icon,
}: {
	label: string;
	value: ReactNode;
	icon?: React.ComponentType<{ className?: string }>;
}) {
	return (
		<div className="flex items-start gap-2 py-0.5">
			{Icon ? (
				<div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/8 text-primary">
					<Icon className="size-3" />
				</div>
			) : null}
			<div className="min-w-0">
				<p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
					{label}
				</p>
				<div className="mt-0.5 text-xs font-normal break-words">
					{value ?? "—"}
				</div>
			</div>
		</div>
	);
}

export function VendorDetailPage() {
	const params = useParams<{ id?: string; vendorId?: string }>();
	const vendorId = params.vendorId ?? params.id;
	const { vendor, isLoading, error } = useVendor(vendorId);
	const { documents } = useDocumentsList(vendorId);
	const { activities } = useActivitiesList(vendorId);
	const { contracts } = useContractsList(vendorId);
	const updateVendor = useUpdateVendorMutation();
	const [tab, setTab] = useState<Tab>("Overview");
	const [status, setStatus] = useState<VendorStatus>("prospect");
	const [trendRange, setTrendRange] = useState("7");

	useEffect(() => {
		if (vendor) setStatus(vendor.status);
	}, [vendor]);

	const integration = useMemo(
		() => (vendor ? getVendorIntegration(vendor.id) : null),
		[vendor]
	);

	const runs = useMemo(
		() => (vendor ? runsForVendor(vendor.id) : []),
		[vendor]
	);

	const summary = useMemo(() => summarizeRuns(runs), [runs]);

	const totalFiles30 = Math.max(summary.total * 15, summary.total || 12);
	const successful30 = Math.max(
		summary.successful * 14,
		summary.successful || 0
	);
	const warnings30 = Math.max(summary.warnings * 2, summary.warnings || 0);
	const failed30 = Math.max(summary.failed, 0);
	const successPct30 =
		totalFiles30 > 0
			? ((successful30 / totalFiles30) * 100).toFixed(1)
			: summary.successPct;
	const warningPct30 =
		totalFiles30 > 0
			? ((warnings30 / totalFiles30) * 100).toFixed(1)
			: summary.warningPct;
	const failedPct30 =
		totalFiles30 > 0
			? ((failed30 / totalFiles30) * 100).toFixed(1)
			: summary.failedPct;

	const fileTypePie = useMemo(() => {
		const counts = new Map<string, number>();
		for (const run of runs) {
			counts.set(run.fileType, (counts.get(run.fileType) ?? 0) + 1);
		}
		const colors = ["#13446c", "#059669", "#d97706", "#0284c7", "#7c3aed"];
		const rawTotal = runs.length || 1;
		const scale = totalFiles30 / rawTotal;
		return Array.from(counts.entries()).map(([name, value], i) => {
			const scaled = Math.max(1, Math.round(value * scale));
			return {
				name,
				value: scaled,
				pct: ((value / rawTotal) * 100).toFixed(1),
				color: colors[i % colors.length],
			};
		});
	}, [runs, totalFiles30]);

	const trend = vendor
		? (VENDOR_TREND_BY_ID[vendor.id] ?? VENDOR_TREND_BY_ID["vnd-1"])
		: [];

	const vendorAlerts = useMemo(
		() => (vendor ? VENDOR_ALERTS.filter((a) => a.vendorId === vendor.id) : []),
		[vendor]
	);

	const lastRun = runs[0];
	const primary =
		vendor?.contacts.find((c) => c.isPrimary) ?? vendor?.contacts[0];
	const displayName = vendor?.tradeName ?? vendor?.legalName ?? "Vendor";

	async function saveStatus() {
		if (!vendor) return;
		try {
			await updateVendor.mutateAsync({ id: vendor.id, patch: { status } });
			toast.success("Vendor status updated");
		} catch (mutationError) {
			toast.error(
				mutationError instanceof Error
					? mutationError.message
					: "Unable to update vendor"
			);
		}
	}

	if (isLoading) {
		return (
			<div className="space-y-3">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-40 w-full rounded-xl" />
				<Skeleton className="h-96 w-full rounded-xl" />
			</div>
		);
	}

	if (error || !vendor || !integration) {
		return (
			<div className="space-y-3">
				<Link
					href="/admin/vendors"
					className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="size-3.5" />
					Vendors
				</Link>
				<p className="text-sm text-destructive">
					{error?.message ?? "Vendor not found."}
				</p>
			</div>
		);
	}

	const tabCounts: Partial<Record<Tab, number>> = {
		Accounts: integration.accountsCount,
		Jobs: integration.jobsCount,
		Alerts: vendorAlerts.length || integration.alertsCount,
	};

	return (
		<div className="space-y-3">
			{/* Header */}
			<div className="space-y-3 border-b border-border/50 pb-3">
				<div className="flex flex-wrap items-start justify-between gap-2">
					<div className="flex min-w-0 items-center gap-2">
						<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
							{initials(displayName)}
						</div>
						<div className="min-w-0">
							<div className="flex flex-wrap items-center gap-2">
								<h1 className="text-base font-medium tracking-tight">
									{displayName}
								</h1>
								<ActiveStatusPill status={vendor.status} />
							</div>
						</div>
					</div>
					<div className="flex flex-wrap items-center gap-1.5">
						<Button
							variant="outline"
							size="sm"
							className="h-8 text-xs"
							onClick={() =>
								toast.message("Vendor editor opens here in production")
							}
						>
							<Pencil className="mr-1.5 size-3.5" />
							Edit Vendor
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm" className="h-8 text-xs">
									More Actions
									<ChevronDown className="ml-1.5 size-3.5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-52">
								<div className="px-2 py-1.5">
									<p className="mb-1 text-xs font-medium text-muted-foreground">
										Set status
									</p>
									<Select
										value={status}
										onValueChange={(v) => setStatus(v as VendorStatus)}
									>
										<SelectTrigger className="h-8 w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{STATUSES.map((s) => (
												<SelectItem key={s} value={s}>
													{s.replace(/_/g, " ")}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Button
										size="sm"
										className="mt-2 h-8 w-full"
										onClick={saveStatus}
										disabled={
											updateVendor.isPending || status === vendor.status
										}
									>
										Save status
									</Button>
								</div>
								<DropdownMenuItem asChild>
									<Link href="/admin/file-monitoring">
										View file monitoring
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/admin/processing-logs">
										View processing logs
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/admin/vendors/invite">Invite contact</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Metadata */}
				<div className="grid gap-x-3 gap-y-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
					<MetaItem
						label="Vendor Type"
						value={integration.vendorType}
						icon={Building2}
					/>
					<MetaItem
						label="Primary Contact"
						value={
							primary ? (
								<div>
									<p>{primary.name}</p>
									{primary.email ? (
										<p className="mt-0.5 text-xs font-normal text-muted-foreground">
											{primary.email}
										</p>
									) : null}
									{primary.phone ? (
										<p className="text-xs font-normal text-muted-foreground">
											{primary.phone}
										</p>
									) : null}
								</div>
							) : (
								"—"
							)
						}
						icon={User}
					/>
					<MetaItem label="Phone" value={primary?.phone ?? "—"} icon={Phone} />
					<MetaItem label="Email" value={primary?.email ?? "—"} icon={Mail} />
					<MetaItem
						label="SFTP Server"
						value={
							<span className="font-mono text-xs">{integration.sftpHost}</span>
						}
						icon={Server}
					/>
					<MetaItem
						label="Time Zone"
						value={integration.timezone}
						icon={Clock3}
					/>
					<MetaItem
						label="Created On"
						value={formatDate(vendor.createdAt)}
						icon={Calendar}
					/>
					<MetaItem
						label="Created By"
						value={integration.createdBy}
						icon={User}
					/>
					<MetaItem
						label="Last Updated"
						value={formatDate(vendor.updatedAt)}
						icon={Calendar}
					/>
					<div className="flex items-start gap-2 py-0.5">
						<div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/8 text-primary">
							<CheckCircle2 className="size-3" />
						</div>
						<div>
							<p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
								Health Indicator
							</p>
							<div className="mt-0.5">
								<HealthIndicator health={integration.health} />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Metrics ribbon */}
			<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
				{[
					{
						label: "Total Files (Last 30 Days)",
						value: String(totalFiles30),
						pct: null as string | null,
						hint: "View Trend →",
						href: "#trend",
						icon: FileText,
						tone: "text-primary bg-primary/10",
					},
					{
						label: "Successful",
						value: String(successful30),
						pct: `${successPct30}%`,
						hint: "View Details →",
						href: "#file-history",
						icon: CheckCircle2,
						tone: "text-emerald-700 bg-emerald-500/10",
					},
					{
						label: "Warnings",
						value: String(warnings30),
						pct: `${warningPct30}%`,
						hint: "View Details →",
						href: "#alerts",
						icon: AlertTriangle,
						tone: "text-amber-700 bg-amber-500/10",
					},
					{
						label: "Failed",
						value: String(failed30),
						pct: `${failedPct30}%`,
						hint: "View Details →",
						href: "#alerts",
						icon: XCircle,
						tone: "text-red-700 bg-red-500/10",
					},
					{
						label: "Avg. Processing Time",
						value: integration.avgProcessingTime,
						pct: null as string | null,
						hint: "View Trend →",
						href: "#trend",
						icon: Clock3,
						tone: "text-sky-700 bg-sky-500/10",
					},
					{
						label: "Last File Received",
						value: lastRun?.receivedAt
							? lastRun.receivedAt.slice(0, 16).replace("T", " ")
							: "—",
						pct: null as string | null,
						hint: lastRun?.fileType ?? "No recent file",
						href: lastRun ? `/admin/file-monitoring/${lastRun.id}` : "#",
						icon: Calendar,
						tone: "text-zinc-700 bg-zinc-500/10",
					},
				].map((k) => {
					const Icon = k.icon;
					return (
						<div key={k.label} className="rounded-lg bg-card p-2.5">
							<div className="flex items-start justify-between gap-2">
								<div className="min-w-0">
									<p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
										{k.label}
									</p>
									<p className="mt-1 truncate text-base font-medium tabular-nums tracking-tight">
										{k.value}
										{k.pct ? (
											<span className="ml-1 text-sm font-medium text-muted-foreground">
												({k.pct})
											</span>
										) : null}
									</p>
									{k.href.startsWith("/") ? (
										<Link
											href={k.href}
											className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
										>
											{k.hint}
										</Link>
									) : (
										<button
											type="button"
											className="mt-2 text-xs font-medium text-primary hover:underline"
											onClick={() => {
												if (k.href === "#file-history") setTab("File History");
												if (k.href === "#alerts") setTab("Alerts");
												if (k.href === "#trend") setTab("Overview");
											}}
										>
											{k.hint}
										</button>
									)}
								</div>
								<div
									className={cn(
										"flex size-8 shrink-0 items-center justify-center rounded-lg",
										k.tone
									)}
								>
									<Icon className="size-4" />
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Tabs */}
			<nav
				className="flex gap-1 overflow-x-auto border-b border-border/60"
				aria-label="Vendor sections"
			>
				{TABS.map((item) => (
					<button
						key={item}
						type="button"
						onClick={() => setTab(item)}
						className={cn(
							"shrink-0 border-b-2 px-2.5 pb-2 text-xs font-medium whitespace-nowrap",
							tab === item
								? "border-primary text-foreground"
								: "border-transparent text-muted-foreground hover:text-foreground"
						)}
					>
						{item}
						{tabCounts[item] != null && (
							<span className="ml-1 text-xs font-normal text-muted-foreground">
								({tabCounts[item]})
							</span>
						)}
					</button>
				))}
			</nav>

			{tab === "Overview" && (
				<>
					<div className="grid min-w-0 gap-2 xl:grid-cols-3">
						<div className="min-w-0 space-y-2 xl:col-span-2">
							<section className="min-w-0">
								<h2 className="mb-2 text-sm font-medium">
									Recent File Activity
								</h2>
								<div className="overflow-hidden rounded-lg border border-border/50">
									<Table
										className="table-fixed w-full text-xs"
										containerClassName="overflow-hidden"
									>
										<TableHeader>
											<TableRow className="hover:bg-transparent">
												<TableHead className="h-8 w-[13%] px-2 pl-3 font-normal">
													Type
												</TableHead>
												<TableHead className="h-8 w-[20%] px-1 font-normal">
													File Name
												</TableHead>
												<TableHead className="h-8 w-[9%] px-1 font-normal">
													Freq
												</TableHead>
												<TableHead className="h-8 w-[12%] px-1 font-normal">
													Status
												</TableHead>
												<TableHead className="h-8 w-[8%] px-1 text-right font-normal">
													Rec
												</TableHead>
												<TableHead className="h-8 w-[8%] px-1 font-normal">
													Recv
												</TableHead>
												<TableHead className="h-8 w-[8%] px-1 font-normal">
													Proc
												</TableHead>
												<TableHead className="h-8 w-[8%] px-1 font-normal">
													Dur
												</TableHead>
												<TableHead className="h-8 w-[8%] px-1 pr-3 text-right font-normal">
													Act
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{runs.length === 0 ? (
												<TableRow>
													<TableCell
														colSpan={9}
														className="h-16 text-center text-muted-foreground"
													>
														No file activity for this vendor yet.
													</TableCell>
												</TableRow>
											) : (
												runs.map((run) => (
													<TableRow key={run.id} className="hover:bg-muted/30">
														<TableCell className="truncate px-2 py-1.5 pl-3 font-medium">
															{run.fileType}
														</TableCell>
														<TableCell className="truncate px-1 py-1.5 font-mono text-[10px]">
															{run.fileName ?? "—"}
														</TableCell>
														<TableCell className="truncate px-1 py-1.5 text-muted-foreground">
															{run.frequency}
														</TableCell>
														<TableCell className="px-1 py-1.5">
															<ActivityStatus status={run.status} />
														</TableCell>
														<TableCell className="px-1 py-1.5 text-right tabular-nums">
															{run.records ?? "—"}
														</TableCell>
														<TableCell className="px-1 py-1.5 tabular-nums text-muted-foreground">
															{run.receivedAt?.slice(11, 16) ?? "—"}
														</TableCell>
														<TableCell className="px-1 py-1.5 tabular-nums text-muted-foreground">
															{run.completedAt?.slice(11, 16) ?? "—"}
														</TableCell>
														<TableCell className="px-1 py-1.5 tabular-nums text-muted-foreground">
															{run.duration ?? "—"}
														</TableCell>
														<TableCell className="px-1 py-1.5 pr-3 text-right">
															<DropdownMenu>
																<DropdownMenuTrigger asChild>
																	<Button
																		variant="ghost"
																		size="icon"
																		className="size-7"
																	>
																		<MoreHorizontal className="size-3.5" />
																	</Button>
																</DropdownMenuTrigger>
																<DropdownMenuContent align="end">
																	<DropdownMenuItem asChild>
																		<Link
																			href={`/admin/file-monitoring/${run.id}`}
																		>
																			View run detail
																		</Link>
																	</DropdownMenuItem>
																	{run.issues?.[0] ? (
																		<DropdownMenuItem asChild>
																			<Link
																				href={`/admin/file-monitoring/${run.id}/investigate/${run.issues[0].id}`}
																			>
																				Investigate
																			</Link>
																		</DropdownMenuItem>
																	) : null}
																	<DropdownMenuItem asChild>
																		<Link href="/admin/processing-logs">
																			Processing logs
																		</Link>
																	</DropdownMenuItem>
																</DropdownMenuContent>
															</DropdownMenu>
														</TableCell>
													</TableRow>
												))
											)}
										</TableBody>
									</Table>
									<div className="border-t border-border/50 px-3 py-1.5">
										<button
											type="button"
											className="text-xs font-medium text-primary hover:underline"
											onClick={() => setTab("File History")}
										>
											View All File History →
										</button>
									</div>
								</div>
							</section>

							<div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
								<section className="rounded-lg border border-border/50 p-3">
									<h2 className="mb-2 text-sm font-medium">
										File Type Summary
									</h2>
									<div className="flex items-start gap-3">
										<div className="relative h-20 w-20 shrink-0">
											<ResponsiveContainer width="100%" height="100%">
												<PieChart>
													<Pie
														data={
															fileTypePie.length
																? fileTypePie
																: [{ name: "None", value: 1, color: "#cbd5e1" }]
														}
														dataKey="value"
														nameKey="name"
														innerRadius={22}
														outerRadius={36}
														paddingAngle={2}
													>
														{(fileTypePie.length
															? fileTypePie
															: [{ name: "None", value: 1, color: "#cbd5e1" }]
														).map((entry) => (
															<Cell key={entry.name} fill={entry.color} />
														))}
													</Pie>
													<Tooltip />
												</PieChart>
											</ResponsiveContainer>
											<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
												<span className="text-sm font-semibold tabular-nums leading-none">
													{totalFiles30}
												</span>
												<span className="mt-0.5 text-[9px] font-medium text-muted-foreground">
													Total
												</span>
											</div>
										</div>
										<ul className="min-w-0 flex-1 space-y-1">
											{fileTypePie.map((item) => (
												<li
													key={item.name}
													className="flex items-center justify-between gap-2 text-[11px]"
												>
													<span className="flex min-w-0 items-center gap-1.5">
														<span
															className="size-1.5 shrink-0 rounded-full"
															style={{ backgroundColor: item.color }}
														/>
														<span className="truncate">{item.name}</span>
													</span>
													<span className="shrink-0 tabular-nums text-muted-foreground">
														{item.value}{" "}
														<span className="text-[10px]">({item.pct}%)</span>
													</span>
												</li>
											))}
										</ul>
									</div>
								</section>

								<section
									id="trend"
									className="rounded-lg border border-border/50 p-3"
								>
									<div className="mb-2 flex items-center justify-between gap-2">
										<h2 className="text-sm font-medium">Processing Trend</h2>
										<Select value={trendRange} onValueChange={setTrendRange}>
											<SelectTrigger className="h-7 w-28 text-xs">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="7">Last 7 Days</SelectItem>
												<SelectItem value="14">Last 14 Days</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="h-36">
										<ResponsiveContainer width="100%" height="100%">
											<LineChart data={trend}>
												<CartesianGrid
													strokeDasharray="3 3"
													className="stroke-border"
												/>
												<XAxis dataKey="day" tick={{ fontSize: 10 }} />
												<YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
												<Tooltip />
												<Legend wrapperStyle={{ fontSize: 10 }} />
												<Line
													type="monotone"
													dataKey="successful"
													name="Successful"
													stroke="#059669"
													strokeWidth={2}
													dot={false}
												/>
												<Line
													type="monotone"
													dataKey="warnings"
													name="Warnings"
													stroke="#d97706"
													strokeWidth={2}
													dot={false}
												/>
												<Line
													type="monotone"
													dataKey="failed"
													name="Failed"
													stroke="#dc2626"
													strokeWidth={2}
													dot={false}
												/>
											</LineChart>
										</ResponsiveContainer>
									</div>
								</section>
							</div>
						</div>

						<div className="min-w-0 space-y-2 xl:col-span-1">
							<section>
								<div className="mb-2 flex items-start justify-between gap-2">
									<h2 className="text-sm font-medium">Vendor Details</h2>
									<span className="text-[10px] font-medium text-primary">
										{formatVendorCode(vendor.id)}
									</span>
								</div>
								<div className="space-y-1.5 text-xs">
									{[
										["Vendor ID", formatVendorCode(vendor.id)],
										["Vendor Type", integration.vendorType],
										["Status", vendor.status.replace(/_/g, " ")],
										[
											"Contracts",
											contracts.length
												? `${contracts.length} active`
												: "None linked",
										],
										["SLA", `${integration.slaPercent.toFixed(2)}%`],
										[
											"File Transmission Method",
											integration.transmissionMethod,
										],
										["Encryption", integration.encryption],
										["File Format", integration.fileFormats.join(", ") || "—"],
										["Communication Protocol", integration.protocol],
										["Trading Partner ID", integration.tradingPartnerId],
										["Time Zone", integration.timezone],
									].map(([label, value]) => (
										<div
											key={label}
											className="flex items-start justify-between gap-2 border-b border-border/30 pb-1.5 last:border-0"
										>
											<span className="text-muted-foreground">{label}</span>
											<span className="max-w-[55%] text-right font-normal capitalize">
												{label === "Status" ? (
													<ActiveStatusPill status={vendor.status} />
												) : label === "Contracts" && contracts[0] ? (
													<Link
														href={`/admin/contracts/${contracts[0].id}`}
														className="inline-flex items-center gap-1 text-primary normal-case hover:underline"
													>
														View Document
														<ExternalLink className="size-3" />
													</Link>
												) : (
													value
												)}
											</span>
										</div>
									))}
									<div className="pt-1">
										<p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
											Notes
										</p>
										<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
											{integration.notes}
										</p>
									</div>
								</div>
							</section>
						</div>
					</div>

					<section>
						<h2 className="mb-2 text-sm font-medium">Quick Actions</h2>
						<div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
							{[
								{
									label: "Upload File",
									href: "/admin/file-monitoring",
									icon: Upload,
								},
								{
									label: "View Schedules",
									href: "/admin/schedules",
									icon: Calendar,
								},
								{
									label: "View Processing Logs",
									href: "/admin/processing-logs",
									icon: ScrollText,
								},
								{
									label: "Send Test File",
									href: "/admin/file-monitoring",
									icon: Send,
								},
								{
									label: "Add Note",
									href: "#",
									icon: NotebookPen,
									onClick: () => {
										setTab("Notes");
										toast.message("Switched to Notes tab");
									},
								},
							].map((action) => {
								const Icon = action.icon;
								if (action.onClick) {
									return (
										<button
											key={action.label}
											type="button"
											className="flex items-center gap-2 rounded-md border border-border/40 px-2 py-1.5 text-left transition-colors hover:bg-muted/40"
											onClick={action.onClick}
										>
											<div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
												<Icon className="size-3.5" />
											</div>
											<div className="min-w-0">
												<p className="text-xs font-medium">{action.label}</p>
											</div>
										</button>
									);
								}
								return (
									<Link
										key={action.label}
										href={action.href}
										className="flex items-center gap-2 rounded-md border border-border/40 px-2 py-1.5 text-left transition-colors hover:bg-muted/40"
									>
										<div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
											<Icon className="size-3.5" />
										</div>
										<div className="min-w-0">
											<p className="text-xs font-medium">{action.label}</p>
										</div>
									</Link>
								);
							})}
						</div>
					</section>
				</>
			)}

			{tab === "Accounts" && (
				<section className="min-w-0">
					<h2 className="mb-2 text-sm font-medium">
						Accounts ({integration.accountsCount})
					</h2>
					<div className="overflow-hidden rounded-lg border border-border/50">
						<Table className="text-xs">
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="pl-4 sm:pl-6">Account ID</TableHead>
									<TableHead>Time Zone</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="pr-4 text-right sm:pr-6">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{Array.from({ length: integration.accountsCount }).map(
									(_, i) => (
										<TableRow key={i} className="hover:bg-muted/30">
											<TableCell className="pl-4 font-mono text-xs font-medium sm:pl-6">
												{formatVendorCode(vendor.id)}-ACC-0{i + 1}
											</TableCell>
											<TableCell className="text-muted-foreground">
												{integration.timezone}
											</TableCell>
											<TableCell>
												<span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
													Active
												</span>
											</TableCell>
											<TableCell className="pr-4 text-right sm:pr-6">
												<Button variant="ghost" size="icon" className="size-8">
													<MoreHorizontal className="size-4" />
												</Button>
											</TableCell>
										</TableRow>
									)
								)}
								{integration.accountsCount === 0 && (
									<TableRow>
										<TableCell
											colSpan={4}
											className="h-20 text-center text-muted-foreground"
										>
											No accounts configured.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</section>
			)}

			{tab === "File History" && (
				<section className="min-w-0">
					<h2 className="mb-2 text-sm font-medium">File History</h2>
					<div className="overflow-hidden rounded-lg border border-border/50">
						<Table
							className="table-fixed w-full text-xs"
							containerClassName="overflow-hidden"
						>
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="pl-4 sm:pl-6">Run</TableHead>
									<TableHead>File Type</TableHead>
									<TableHead>File Name</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Records</TableHead>
									<TableHead className="text-right">Errors</TableHead>
									<TableHead>When</TableHead>
									<TableHead className="pr-4 text-right sm:pr-6">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{runs.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={8}
											className="h-20 text-center text-muted-foreground"
										>
											No file history for this vendor yet.
										</TableCell>
									</TableRow>
								) : (
									runs.map((run) => (
										<TableRow key={run.id} className="hover:bg-muted/30">
											<TableCell className="pl-4 sm:pl-6">
												<Link
													href={`/admin/file-monitoring/${run.id}`}
													className="font-mono text-xs text-primary hover:underline"
												>
													{run.runId}
												</Link>
											</TableCell>
											<TableCell className="font-medium">
												{run.fileType}
											</TableCell>
											<TableCell className="max-w-[160px] truncate font-mono text-xs">
												{run.fileName ?? "—"}
											</TableCell>
											<TableCell>
												<ActivityStatus status={run.status} />
											</TableCell>
											<TableCell className="text-right tabular-nums">
												{run.records ?? "—"}
											</TableCell>
											<TableCell
												className={cn(
													"text-right tabular-nums",
													run.errorCount > 0 && "text-red-700"
												)}
											>
												{run.errorCount}
											</TableCell>
											<TableCell className="text-muted-foreground">
												{run.startedAt ?? run.expectedAt}
											</TableCell>
											<TableCell className="pr-4 text-right sm:pr-6">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="size-8"
														>
															<MoreHorizontal className="size-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem asChild>
															<Link href={`/admin/file-monitoring/${run.id}`}>
																View run detail
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem asChild>
															<Link href="/admin/processing-logs">
																Processing logs
															</Link>
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</section>
			)}

			{tab === "Jobs" && (
				<section className="min-w-0">
					<h2 className="mb-2 text-sm font-medium">
						Jobs ({integration.jobsCount})
					</h2>
					<div className="overflow-hidden rounded-lg border border-border/50">
						<Table className="text-xs">
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="pl-4 sm:pl-6">Schedule ID</TableHead>
									<TableHead>File Type</TableHead>
									<TableHead>Frequency</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="pr-4 text-right sm:pr-6">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{runs.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="h-20 text-center text-muted-foreground"
										>
											No jobs configured.
										</TableCell>
									</TableRow>
								) : (
									runs.map((run) => (
										<TableRow key={run.id} className="hover:bg-muted/30">
											<TableCell className="pl-4 font-mono text-xs font-medium sm:pl-6">
												{run.scheduleId}
											</TableCell>
											<TableCell>{run.fileType}</TableCell>
											<TableCell className="text-muted-foreground">
												{run.frequency}
											</TableCell>
											<TableCell>
												<ActivityStatus status={run.status} />
											</TableCell>
											<TableCell className="pr-4 text-right sm:pr-6">
												<Button variant="ghost" size="icon" className="size-8">
													<MoreHorizontal className="size-4" />
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</section>
			)}

			{(tab === "File Configuration" || tab === "SFTP / PGP") && (
				<section className="min-w-0">
					<h2 className="mb-2 text-sm font-medium">{tab}</h2>
					<div className="overflow-hidden rounded-lg border border-border/50">
						<Table className="text-xs">
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="pl-4 sm:pl-6">Setting</TableHead>
									<TableHead className="pr-4 sm:pr-6">Value</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{[
									["Host", integration.sftpHost],
									["Protocol", integration.protocol],
									["Encryption", integration.encryption],
									["Formats", integration.fileFormats.join(", ") || "—"],
									["Trading Partner", integration.tradingPartnerId],
									["SLA", `${integration.slaPercent}%`],
									["Transmission", integration.transmissionMethod],
									["Time Zone", integration.timezone],
								].map(([label, value]) => (
									<TableRow key={label} className="hover:bg-muted/30">
										<TableCell className="pl-4 font-medium sm:pl-6">
											{label}
										</TableCell>
										<TableCell className="pr-4 font-mono text-xs sm:pr-6">
											{value}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</section>
			)}

			{tab === "Processing Logs" && (
				<section className="min-w-0">
					<div className="mb-2 flex flex-wrap items-start justify-between gap-2">
						<h2 className="text-sm font-medium">Processing Logs</h2>
						<Button asChild size="sm" variant="outline" className="h-7 text-xs">
							<Link href="/admin/processing-logs">
								<ScrollText className="mr-1.5 size-3.5" />
								Open full viewer
							</Link>
						</Button>
					</div>
					<div className="overflow-hidden rounded-lg border border-border/50">
						<Table
							className="table-fixed w-full text-xs"
							containerClassName="overflow-hidden"
						>
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="pl-4 sm:pl-6">Timestamp</TableHead>
									<TableHead>Level</TableHead>
									<TableHead>Run</TableHead>
									<TableHead>Message</TableHead>
									<TableHead className="pr-4 text-right sm:pr-6">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{runs.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="h-20 text-center text-muted-foreground"
										>
											No processing logs available.
										</TableCell>
									</TableRow>
								) : (
									runs.slice(0, 8).map((run) => (
										<TableRow key={run.id} className="hover:bg-muted/30">
											<TableCell className="pl-4 tabular-nums text-muted-foreground sm:pl-6">
												{run.startedAt ?? run.expectedAt ?? "—"}
											</TableCell>
											<TableCell>
												<ActivityStatus status={run.status} />
											</TableCell>
											<TableCell className="font-mono text-xs">
												{run.runId}
											</TableCell>
											<TableCell className="max-w-[280px] truncate">
												{run.fileType} · {run.fileName ?? "processing event"}
											</TableCell>
											<TableCell className="pr-4 text-right sm:pr-6">
												<Button
													variant="ghost"
													size="icon"
													className="size-8"
													asChild
												>
													<Link href={`/admin/file-monitoring/${run.id}`}>
														<MoreHorizontal className="size-4" />
													</Link>
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</section>
			)}

			{tab === "Alerts" && (
				<section id="alerts" className="min-w-0">
					<h2 className="mb-2 text-sm font-medium">
						Alerts ({vendorAlerts.length})
					</h2>
					<div className="overflow-hidden rounded-lg border border-border/50">
						<Table className="text-xs">
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="pl-4 sm:pl-6">Severity</TableHead>
									<TableHead>Alert</TableHead>
									<TableHead>When</TableHead>
									<TableHead className="pr-4 text-right sm:pr-6">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{vendorAlerts.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={4}
											className="h-20 text-center text-muted-foreground"
										>
											No active alerts.
										</TableCell>
									</TableRow>
								) : (
									vendorAlerts.map((alert) => (
										<TableRow key={alert.id} className="hover:bg-muted/30">
											<TableCell className="pl-4 sm:pl-6">
												{alert.severity === "error" ? (
													<span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700">
														<XCircle className="size-3.5" />
														Error
													</span>
												) : alert.severity === "warning" ? (
													<span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
														<AlertTriangle className="size-3.5" />
														Warning
													</span>
												) : (
													<span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-700">
														<CheckCircle2 className="size-3.5" />
														Info
													</span>
												)}
											</TableCell>
											<TableCell className="font-medium">
												{alert.title}
											</TableCell>
											<TableCell className="text-muted-foreground">
												{alert.when}
											</TableCell>
											<TableCell className="pr-4 text-right sm:pr-6">
												{alert.runId ? (
													<Button variant="ghost" size="sm" asChild>
														<Link
															href={`/admin/file-monitoring/${alert.runId}`}
														>
															Open
														</Link>
													</Button>
												) : (
													"—"
												)}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</section>
			)}

			{tab === "Contacts" && (
				<section className="min-w-0">
					<h2 className="mb-2 text-sm font-medium">Contacts</h2>
					<div className="overflow-hidden rounded-lg border border-border/50">
						<Table className="text-xs">
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="pl-4 sm:pl-6">Name</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Phone</TableHead>
									<TableHead className="pr-4 text-right sm:pr-6">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{vendor.contacts.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="h-20 text-center text-muted-foreground"
										>
											No contacts on file.
										</TableCell>
									</TableRow>
								) : (
									vendor.contacts.map((contact) => (
										<TableRow key={contact.id} className="hover:bg-muted/30">
											<TableCell className="pl-4 font-medium sm:pl-6">
												{contact.name}
												{contact.isPrimary && (
													<span className="ml-2 text-xs text-muted-foreground">
														Primary
													</span>
												)}
											</TableCell>
											<TableCell>{contact.role}</TableCell>
											<TableCell>{contact.email}</TableCell>
											<TableCell className="text-muted-foreground">
												{contact.phone ?? "—"}
											</TableCell>
											<TableCell className="pr-4 text-right sm:pr-6">
												<Button variant="ghost" size="icon" className="size-8">
													<MoreHorizontal className="size-4" />
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</section>
			)}

			{tab === "Notes" && (
				<section className="min-w-0">
					<h2 className="mb-2 text-sm font-medium">Notes</h2>
					<div className="overflow-hidden rounded-lg border border-border/50">
						<Table className="text-xs">
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="pl-4 sm:pl-6">Type</TableHead>
									<TableHead>Note</TableHead>
									<TableHead>Author</TableHead>
									<TableHead className="pr-4 sm:pr-6">Updated</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow className="hover:bg-muted/30">
									<TableCell className="pl-4 font-medium sm:pl-6">
										Integration
									</TableCell>
									<TableCell className="max-w-[420px] text-muted-foreground">
										{integration.notes}
									</TableCell>
									<TableCell>{integration.createdBy}</TableCell>
									<TableCell className="pr-4 text-muted-foreground sm:pr-6">
										{formatDate(vendor.updatedAt)}
									</TableCell>
								</TableRow>
								<TableRow className="hover:bg-muted/30">
									<TableCell className="pl-4 font-medium sm:pl-6">
										Company
									</TableCell>
									<TableCell className="max-w-[420px] text-muted-foreground">
										{vendor.description ?? "No company description provided."}
									</TableCell>
									<TableCell>System</TableCell>
									<TableCell className="pr-4 text-muted-foreground sm:pr-6">
										{formatDate(vendor.updatedAt)}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</section>
			)}

			{tab === "Audit Trail" && (
				<section className="min-w-0">
					<h2 className="mb-2 text-sm font-medium">Audit Trail</h2>
					<div className="overflow-hidden rounded-lg border border-border/50">
						<Table className="text-xs">
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="pl-4 sm:pl-6">Action</TableHead>
									<TableHead>Actor</TableHead>
									<TableHead className="pr-4 sm:pr-6">When</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{(activities.length ? activities : [])
									.slice(0, 10)
									.map((event) => (
										<TableRow key={event.id} className="hover:bg-muted/30">
											<TableCell className="pl-4 font-medium sm:pl-6">
												{event.action}
											</TableCell>
											<TableCell className="text-muted-foreground">
												{event.actor}
											</TableCell>
											<TableCell className="pr-4 text-muted-foreground sm:pr-6">
												{formatDate(event.createdAt)}
											</TableCell>
										</TableRow>
									))}
								{activities.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={3}
											className="h-20 text-center text-muted-foreground"
										>
											No audit events recorded yet. Document count:{" "}
											{documents.length}.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</section>
			)}
		</div>
	);
}
