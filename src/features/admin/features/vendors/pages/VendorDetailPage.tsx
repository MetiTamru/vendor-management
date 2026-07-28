"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

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
	Server,
	Send,
	Upload,
	User,
	XCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
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
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
					"text-sm font-semibold",
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
			<span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
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
			<span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
				Success
			</span>
		);
	if (bucket === "failed")
		return (
			<span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
				Failed
			</span>
		);
	if (bucket === "warning")
		return (
			<span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900">
				Warning
			</span>
		);
	if (bucket === "in_progress")
		return (
			<span className="inline-flex rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-800">
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
		<div className="flex items-start gap-3 rounded-lg px-1 py-1.5">
			{Icon ? (
				<div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
					<Icon className="size-4" />
				</div>
			) : null}
			<div className="min-w-0">
				<p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
					{label}
				</p>
				<div className="mt-0.5 text-sm font-medium break-words">{value ?? "—"}</div>
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
	const successful30 = Math.max(summary.successful * 14, summary.successful || 0);
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
		? VENDOR_TREND_BY_ID[vendor.id] ?? VENDOR_TREND_BY_ID["vnd-1"]
		: [];

	const vendorAlerts = useMemo(
		() =>
			vendor
				? VENDOR_ALERTS.filter((a) => a.vendorId === vendor.id)
				: [],
		[vendor]
	);

	const lastRun = runs[0];
	const primary = vendor?.contacts.find((c) => c.isPrimary) ?? vendor?.contacts[0];
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
			<div className="space-y-6">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-40 w-full rounded-xl" />
				<Skeleton className="h-96 w-full rounded-xl" />
			</div>
		);
	}

	if (error || !vendor || !integration) {
		return (
			<div className="space-y-4">
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
		<div className="space-y-5">
			{/* Header card */}
			<div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div className="flex min-w-0 items-center gap-4">
						<div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-sm">
							{initials(displayName)}
						</div>
						<div className="min-w-0">
							<div className="flex flex-wrap items-center gap-2.5">
								<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
									{displayName}
								</h1>
								<ActiveStatusPill status={vendor.status} />
							</div>
						</div>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							className="h-9"
							onClick={() => toast.message("Vendor editor opens here in production")}
						>
							<Pencil className="mr-1.5 size-3.5" />
							Edit Vendor
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm" className="h-9">
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
									<Link href="/admin/file-monitoring">View file monitoring</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/admin/processing-logs">View processing logs</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/admin/vendors/invite">Invite contact</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Metadata ribbon */}
				<div className="mt-4 grid gap-x-6 gap-y-2 border-t border-border/50 pt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
					<MetaItem label="Time Zone" value={integration.timezone} icon={Clock3} />
					<MetaItem
						label="Created On"
						value={formatDate(vendor.createdAt)}
						icon={Calendar}
					/>
					<MetaItem label="Created By" value={integration.createdBy} icon={User} />
					<MetaItem
						label="Last Updated"
						value={formatDate(vendor.updatedAt)}
						icon={Calendar}
					/>
					<div className="flex items-start gap-3 rounded-lg px-1 py-1.5">
						<div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
							<CheckCircle2 className="size-4" />
						</div>
						<div>
							<p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
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
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
						<div
							key={k.label}
							className="rounded-xl border border-border/50 bg-card p-4 shadow-sm"
						>
							<div className="flex items-start justify-between gap-2">
								<div className="min-w-0">
									<p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
										{k.label}
									</p>
									<p className="mt-2 truncate text-xl font-semibold tabular-nums tracking-tight">
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
										"flex size-9 shrink-0 items-center justify-center rounded-lg",
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
							"shrink-0 border-b-2 px-3 pb-3 text-sm font-medium whitespace-nowrap",
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
					<div className="grid gap-4 xl:grid-cols-12">
					<div className="space-y-4 xl:col-span-8">
						<Card className="bg-card">
							<CardHeader className="pb-3">
								<CardTitle className="text-base">Recent File Activity</CardTitle>
							</CardHeader>
							<CardContent className="px-0 pb-0">
								<div className="w-full border-t border-border/50">
									<Table className="min-w-[860px]">
										<TableHeader>
											<TableRow className="hover:bg-transparent">
												<TableHead className="pl-4 sm:pl-6">File Type</TableHead>
												<TableHead>File Name</TableHead>
												<TableHead>Frequency</TableHead>
												<TableHead>Status</TableHead>
												<TableHead className="text-right">Records</TableHead>
												<TableHead>Received</TableHead>
												<TableHead>Processed</TableHead>
												<TableHead>Duration</TableHead>
												<TableHead className="pr-4 text-right sm:pr-6">
													Actions
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{runs.length === 0 ? (
												<TableRow>
													<TableCell
														colSpan={9}
														className="h-20 text-center text-muted-foreground"
													>
														No file activity for this vendor yet.
													</TableCell>
												</TableRow>
											) : (
												runs.map((run) => (
													<TableRow key={run.id} className="hover:bg-muted/30">
														<TableCell className="pl-4 font-medium sm:pl-6">
															{run.fileType}
														</TableCell>
														<TableCell className="max-w-[140px] truncate font-mono text-xs">
															{run.fileName ?? "—"}
														</TableCell>
														<TableCell className="text-muted-foreground">
															{run.frequency}
														</TableCell>
														<TableCell>
															<ActivityStatus status={run.status} />
														</TableCell>
														<TableCell className="text-right tabular-nums">
															{run.records ?? "—"}
														</TableCell>
														<TableCell className="tabular-nums text-muted-foreground">
															{run.receivedAt?.slice(11, 16) ?? "—"}
														</TableCell>
														<TableCell className="tabular-nums text-muted-foreground">
															{run.completedAt?.slice(11, 16) ?? "—"}
														</TableCell>
														<TableCell className="tabular-nums text-muted-foreground">
															{run.duration ?? "—"}
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
								</div>
								<div className="border-t border-border/50 px-4 py-3 sm:px-6">
									<button
										type="button"
										className="text-sm font-medium text-primary hover:underline"
										onClick={() => setTab("File History")}
									>
										View All File History →
									</button>
								</div>
							</CardContent>
						</Card>

						<div className="grid gap-4 lg:grid-cols-2">
							<Card className="bg-card">
								<CardHeader className="pb-2">
									<CardTitle className="text-base">File Type Summary</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex items-center gap-4">
										<div className="relative h-40 w-40 shrink-0 sm:h-44 sm:w-44">
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
														innerRadius={48}
														outerRadius={70}
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
												<span className="text-lg font-semibold tabular-nums leading-none">
													{totalFiles30}
												</span>
												<span className="mt-1 text-[10px] font-medium text-muted-foreground">
													Total Files
												</span>
											</div>
										</div>
										<ul className="min-w-0 flex-1 space-y-2">
											{fileTypePie.map((item) => (
												<li
													key={item.name}
													className="flex items-center justify-between gap-3 text-sm"
												>
													<span className="flex min-w-0 items-center gap-2">
														<span
															className="size-2.5 shrink-0 rounded-full"
															style={{ backgroundColor: item.color }}
														/>
														<span className="truncate">{item.name}</span>
													</span>
													<span className="shrink-0 tabular-nums text-muted-foreground">
														{item.value}{" "}
														<span className="text-xs">({item.pct}%)</span>
													</span>
												</li>
											))}
										</ul>
									</div>
								</CardContent>
							</Card>

							<Card id="trend" className="bg-card">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<div>
										<CardTitle className="text-base">Processing Trend</CardTitle>
									</div>
									<Select value={trendRange} onValueChange={setTrendRange}>
										<SelectTrigger className="h-8 w-[120px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="7">Last 7 Days</SelectItem>
											<SelectItem value="14">Last 14 Days</SelectItem>
										</SelectContent>
									</Select>
								</CardHeader>
								<CardContent className="h-52 pt-2">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={trend}>
											<CartesianGrid strokeDasharray="3 3" className="stroke-border" />
											<XAxis dataKey="day" tick={{ fontSize: 10 }} />
											<YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
											<Tooltip />
											<Legend />
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
								</CardContent>
							</Card>
						</div>
					</div>

					<div className="space-y-4 xl:col-span-4">
						<Card className="bg-card">
							<CardHeader className="border-b border-border/50 pb-4">
								<div className="flex items-start justify-between gap-3">
									<div>
										<CardTitle className="text-lg font-semibold tracking-tight">
											Vendor Details
										</CardTitle>
									</div>
									<div className="rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
										{formatVendorCode(vendor.id)}
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-3 text-sm">
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
									["File Transmission Method", integration.transmissionMethod],
									["Encryption", integration.encryption],
									["File Format", integration.fileFormats.join(", ") || "—"],
									["Communication Protocol", integration.protocol],
									["Trading Partner ID", integration.tradingPartnerId],
									["Time Zone", integration.timezone],
								].map(([label, value]) => (
									<div
										key={label}
										className="flex items-start justify-between gap-3 border-b border-border/40 pb-2 last:border-0"
									>
										<span className="text-muted-foreground">{label}</span>
										<span className="max-w-[55%] text-right font-medium capitalize">
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
								<div className="rounded-lg border border-border/50 bg-muted/30 p-3">
									<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
										Notes
									</p>
									<p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
										{integration.notes}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
					</div>

					<Card className="bg-card">
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Quick Actions</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
												className="flex items-start gap-3 rounded-lg bg-muted/35 p-3 text-left transition-colors hover:bg-muted/55"
												onClick={action.onClick}
											>
												<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
													<Icon className="size-4" />
												</div>
												<div className="min-w-0">
													<p className="text-sm font-semibold">{action.label}</p>
													<p className="text-xs text-muted-foreground">
														Open related workflow
													</p>
												</div>
											</button>
										);
									}
									return (
										<Link
											key={action.label}
											href={action.href}
											className="flex items-start gap-3 rounded-lg bg-muted/35 p-3 text-left transition-colors hover:bg-muted/55"
										>
											<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
												<Icon className="size-4" />
											</div>
											<div className="min-w-0">
												<p className="text-sm font-semibold">{action.label}</p>
												<p className="text-xs text-muted-foreground">
													Open related workflow
												</p>
											</div>
										</Link>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</>
			)}

			{tab === "Accounts" && (
				<Card className="bg-card">
					<CardHeader className="pb-3">
						<CardTitle className="text-base">
							Accounts ({integration.accountsCount})
						</CardTitle>
					</CardHeader>
					<CardContent className="px-0 pb-0">
						<div className="border-t border-border/50">
							<Table>
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
					</CardContent>
				</Card>
			)}

			{tab === "File History" && (
				<Card className="bg-card">
					<CardHeader className="pb-3">
						<CardTitle className="text-base">File History</CardTitle>
					</CardHeader>
					<CardContent className="px-0 pb-0">
						<div className="border-t border-border/50">
							<Table className="min-w-[760px]">
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
																<Link
																	href={`/admin/file-monitoring/${run.id}`}
																>
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
					</CardContent>
				</Card>
			)}

			{tab === "Jobs" && (
				<Card className="bg-card">
					<CardHeader className="pb-3">
						<CardTitle className="text-base">
							Jobs ({integration.jobsCount})
						</CardTitle>
					</CardHeader>
					<CardContent className="px-0 pb-0">
						<div className="border-t border-border/50">
							<Table>
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
					</CardContent>
				</Card>
			)}

			{(tab === "File Configuration" || tab === "SFTP / PGP") && (
				<Card className="bg-card">
					<CardHeader className="pb-3">
						<CardTitle className="text-base">{tab}</CardTitle>
					</CardHeader>
					<CardContent className="px-0 pb-0">
						<div className="border-t border-border/50">
							<Table>
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
					</CardContent>
				</Card>
			)}

			{tab === "Processing Logs" && (
				<Card className="bg-card">
					<CardHeader className="pb-3">
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div>
								<CardTitle className="text-base">Processing Logs</CardTitle>
							</div>
							<Button asChild size="sm" variant="outline">
								<Link href="/admin/processing-logs">
									<ScrollText className="mr-1.5 size-3.5" />
									Open full viewer
								</Link>
							</Button>
						</div>
					</CardHeader>
					<CardContent className="px-0 pb-0">
						<div className="border-t border-border/50">
							<Table className="min-w-[720px]">
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
													<Button variant="ghost" size="icon" className="size-8" asChild>
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
					</CardContent>
				</Card>
			)}

			{tab === "Alerts" && (
				<Card id="alerts" className="bg-card">
					<CardHeader className="pb-3">
						<CardTitle className="text-base">
							Alerts ({vendorAlerts.length})
						</CardTitle>
					</CardHeader>
					<CardContent className="px-0 pb-0">
						<div className="border-t border-border/50">
							<Table>
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
					</CardContent>
				</Card>
			)}

			{tab === "Contacts" && (
				<Card className="bg-card">
					<CardHeader className="pb-3">
						<CardTitle className="text-base">Contacts</CardTitle>
					</CardHeader>
					<CardContent className="px-0 pb-0">
						<div className="border-t border-border/50">
							<Table>
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
					</CardContent>
				</Card>
			)}

			{tab === "Notes" && (
				<Card className="bg-card">
					<CardHeader className="pb-3">
						<CardTitle className="text-base">Notes</CardTitle>
					</CardHeader>
					<CardContent className="px-0 pb-0">
						<div className="border-t border-border/50">
							<Table>
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
					</CardContent>
				</Card>
			)}

			{tab === "Audit Trail" && (
				<Card className="bg-card">
					<CardHeader className="pb-3">
						<CardTitle className="text-base">Audit Trail</CardTitle>
					</CardHeader>
					<CardContent className="px-0 pb-0">
						<div className="border-t border-border/50">
							<Table>
								<TableHeader>
									<TableRow className="hover:bg-transparent">
										<TableHead className="pl-4 sm:pl-6">Action</TableHead>
										<TableHead>Actor</TableHead>
										<TableHead className="pr-4 sm:pr-6">When</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{(activities.length ? activities : []).slice(0, 10).map(
										(event) => (
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
										)
									)}
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
					</CardContent>
				</Card>
			)}
		</div>
	);
}
