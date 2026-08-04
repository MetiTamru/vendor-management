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
	Download,
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { AuditTrailView } from "@/features/admin/features/audit-trail/components/AuditTrailView";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import {
	useContractsList,
	useUpdateVendorMutation,
	useVendor,
} from "@/features/shared/vms/queries";
import type { VendorStatus } from "@/features/shared/vms/types";
import { formatDate } from "@/features/shared/vms/utils";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useAdminModuleStore } from "@/stores/admin-module-store";

import { VendorAccountsTab } from "../components/VendorAccountsTab";
import { VendorConfigurationTab } from "../components/VendorConfigurationTab";
import { VendorNotesTab } from "../components/VendorNotesTab";
import { VendorOperationsTab } from "../components/VendorOperationsTab";
import {
	VENDOR_TREND_BY_ID,
	getVendorAccounts,
	getVendorIntegration,
	runBucket,
	runsForVendor,
} from "../vendor-integration-mock";

const TABS = [
	"Overview",
	"Operations",
	"Configuration",
	"Accounts",
	"Contacts",
	"Audit Trail",
	"Notes",
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
		<div className="flex items-start gap-2.5 rounded-lg border border-border/30 bg-gradient-to-br from-muted/40 to-transparent px-2.5 py-2">
			{Icon ? (
				<div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
					<Icon className="size-3.5" />
				</div>
			) : null}
			<div className="min-w-0">
				<p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
					{label}
				</p>
				<div className="mt-0.5 text-xs font-medium break-words text-foreground">
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

	const programFilter = useAdminModuleStore((s) => s.fileType);
	const runs = useMemo(
		() => (vendor ? runsForVendor(vendor.id, programFilter) : []),
		[vendor, programFilter]
	);

	const fileTypePie = useMemo(() => {
		if (runs.length === 0) return [];
		const counts = new Map<string, number>();
		for (const run of runs) {
			counts.set(run.fileType, (counts.get(run.fileType) ?? 0) + 1);
		}
		const colors = ["#13446c", "#059669", "#d97706", "#0284c7", "#7c3aed"];
		const rawTotal = runs.length;
		return Array.from(counts.entries()).map(([name, value], i) => ({
			name,
			value,
			pct: ((value / rawTotal) * 100).toFixed(1),
			color: colors[i % colors.length]!,
		}));
	}, [runs]);

	const totalFiles30 = fileTypePie.reduce((sum, item) => sum + item.value, 0);

	const trend = vendor
		? (VENDOR_TREND_BY_ID[vendor.id] ?? VENDOR_TREND_BY_ID["vnd-1"])
		: [];

	const accounts = useMemo(
		() => (vendor ? getVendorAccounts(vendor.id) : []),
		[vendor]
	);

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
		Accounts: accounts.length || integration.accountsCount,
		Contacts: vendor.contacts.length,
	};

	return (
		<div className="space-y-3">
			{/* Header */}
			<div className="space-y-3 rounded-xl border border-primary/15 bg-gradient-to-br from-primary/[0.05] via-card to-sky-500/[0.04] p-4 shadow-sm">
				<div className="flex flex-wrap items-start justify-between gap-2">
					<div className="flex min-w-0 items-center gap-2">
						<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground shadow-sm">
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
					<div className="flex items-start gap-2.5 rounded-lg border border-border/30 bg-gradient-to-br from-muted/40 to-transparent px-2.5 py-2">
						<div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
							<CheckCircle2 className="size-3.5" />
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

			{/* Tabs */}
			<nav
				className="grid w-full grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-7"
				aria-label="Vendor sections"
			>
				{TABS.map((item) => (
					<button
						key={item}
						type="button"
						onClick={() => setTab(item)}
						className={cn(
							"rounded-md border px-2 py-2 text-center text-xs font-medium transition-colors",
							tab === item
								? "border-primary/40 bg-primary/10 text-primary"
								: "border-border/60 bg-card text-muted-foreground hover:border-primary/25 hover:bg-primary/5 hover:text-foreground"
						)}
					>
						{item}
						{tabCounts[item] != null && (
							<span
								className={cn(
									"ml-1 text-xs font-normal",
									tab === item ? "text-primary/80" : "text-muted-foreground"
								)}
							>
								({tabCounts[item]})
							</span>
						)}
					</button>
				))}
			</nav>

			{tab === "Overview" && (
				<div className="min-w-0 space-y-5">
					<section className="overflow-hidden rounded-lg border border-border/60 bg-card">
						<div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 bg-gradient-to-r from-primary/[0.06] via-emerald-500/[0.04] to-transparent px-4 py-3">
							<div>
								<h2 className="text-sm font-medium">Recent File Activity</h2>
								<p className="mt-0.5 text-xs text-muted-foreground">
									Latest inbound and outbound file runs for this vendor.
								</p>
							</div>
							<button
								type="button"
								className="text-xs font-medium text-primary hover:underline"
								onClick={() => setTab("Operations")}
							>
								View all file history →
							</button>
						</div>
						<ScrollArea className="w-full">
							<div className="min-w-[900px]">
								<Table className="text-xs">
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="pl-4">File Type</TableHead>
											<TableHead>File Name</TableHead>
											<TableHead>Frequency</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="text-right">Records</TableHead>
											<TableHead>Received</TableHead>
											<TableHead>Processed</TableHead>
											<TableHead>Duration</TableHead>
											<TableHead className="pr-4 text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{runs.length === 0 ? (
											<TableRow>
												<TableCell
													colSpan={9}
													className="h-24 text-center text-muted-foreground"
												>
													No file activity for this vendor yet.
												</TableCell>
											</TableRow>
										) : (
											runs.slice(0, 6).map((run) => (
												<TableRow key={run.id} className="hover:bg-muted/30">
													<TableCell className="pl-4 font-medium">
														{run.fileType}
													</TableCell>
													<TableCell className="max-w-[220px] truncate font-mono text-[11px] text-muted-foreground">
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
													<TableCell className="pr-4 text-right">
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	variant="ghost"
																	size="icon"
																	className="size-8"
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
																	<Link
																		href={`/admin/file-monitoring/${run.id}/processing-logs`}
																	>
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
						</ScrollArea>
					</section>

					<div className="grid min-w-0 gap-4 lg:grid-cols-2">
						<section className="rounded-lg border border-border/60 bg-card">
							<div className="border-b border-border/50 bg-gradient-to-r from-primary/[0.06] via-sky-500/[0.04] to-transparent px-4 py-3">
								<h2 className="text-sm font-medium">File Type Summary</h2>
								<p className="mt-0.5 text-xs text-muted-foreground">
									Distribution of processed files over the last 30 days.
								</p>
							</div>
							<div className="flex items-center gap-5 p-4">
								<div className="relative h-36 w-36 shrink-0">
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={
													fileTypePie.length
														? fileTypePie
														: [{ name: "None", value: 1, color: "#e2e8f0" }]
												}
												dataKey="value"
												nameKey="name"
												innerRadius={40}
												outerRadius={62}
												paddingAngle={fileTypePie.length ? 2 : 0}
											>
												{(fileTypePie.length
													? fileTypePie
													: [{ name: "None", value: 1, color: "#e2e8f0" }]
												).map((entry) => (
													<Cell key={entry.name} fill={entry.color} />
												))}
											</Pie>
											{fileTypePie.length ? <Tooltip /> : null}
										</PieChart>
									</ResponsiveContainer>
									<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
										<span className="text-lg font-semibold tabular-nums leading-none">
											{totalFiles30}
										</span>
										<span className="mt-1 text-[10px] font-medium text-muted-foreground">
											Total
										</span>
									</div>
								</div>
								<ul className="min-w-0 flex-1 space-y-2.5">
									{fileTypePie.length === 0 ? (
										<li className="text-sm text-muted-foreground">
											No file types recorded yet.
										</li>
									) : (
										fileTypePie.map((item) => (
											<li
												key={item.name}
												className="flex items-center justify-between gap-3 text-sm"
											>
												<span className="flex min-w-0 items-center gap-2">
													<span
														className="size-2 shrink-0 rounded-full"
														style={{ backgroundColor: item.color }}
													/>
													<span className="truncate">{item.name}</span>
												</span>
												<span className="shrink-0 tabular-nums text-muted-foreground">
													{item.value}{" "}
													<span className="text-xs">({item.pct}%)</span>
												</span>
											</li>
										))
									)}
								</ul>
							</div>
						</section>

						<section
							id="trend"
							className="rounded-lg border border-border/60 bg-card"
						>
							<div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 bg-gradient-to-r from-emerald-500/[0.07] via-amber-500/[0.04] to-transparent px-4 py-3">
								<div>
									<h2 className="text-sm font-medium">Processing Trend</h2>
									<p className="mt-0.5 text-xs text-muted-foreground">
										Successful, warning, and failed runs over time.
									</p>
								</div>
								<Select value={trendRange} onValueChange={setTrendRange}>
									<SelectTrigger className="h-8 w-32 text-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="7">Last 7 Days</SelectItem>
										<SelectItem value="14">Last 14 Days</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="h-52 p-4 pt-2">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={trend}>
										<CartesianGrid
											strokeDasharray="3 3"
											className="stroke-border/50"
										/>
										<XAxis dataKey="day" tick={{ fontSize: 11 }} />
										<YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
										<Tooltip />
										<Legend wrapperStyle={{ fontSize: 11 }} />
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

					<div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
						<section className="rounded-lg border border-border/60 bg-card">
							<div className="flex items-center justify-between gap-2 border-b border-border/50 bg-gradient-to-r from-primary/[0.07] via-sky-500/[0.04] to-transparent px-4 py-3">
								<div>
									<h2 className="text-sm font-medium">Vendor Details</h2>
									<p className="mt-0.5 text-xs text-muted-foreground">
										Core profile and integration settings.
									</p>
								</div>
								<span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-medium text-primary">
									{formatVendorCode(vendor.id)}
								</span>
							</div>
							<div className="grid gap-x-8 gap-y-0 p-2 sm:grid-cols-2">
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
										className="flex items-start justify-between gap-3 border-b border-border/40 px-2 py-2.5 last:border-b sm:[&:nth-last-child(-n+2)]:border-b-0"
									>
										<span className="text-xs text-muted-foreground">
											{label}
										</span>
										<span className="max-w-[58%] text-right text-xs font-medium capitalize">
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
							</div>
							{integration.notes ? (
								<div className="border-t border-border/50 px-4 py-3">
									<p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
										Notes
									</p>
									<p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
										{integration.notes}
									</p>
								</div>
							) : null}
						</section>

						<section className="rounded-lg border border-border/60 bg-card">
							<div className="border-b border-border/50 bg-gradient-to-r from-sky-500/[0.08] via-primary/[0.04] to-transparent px-4 py-3">
								<h2 className="text-sm font-medium">Quick Actions</h2>
								<p className="mt-0.5 text-xs text-muted-foreground">
									Common tasks for this vendor.
								</p>
							</div>
							<div className="grid gap-2 p-4 sm:grid-cols-2">
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
										label: "Export Data",
										href: "#",
										icon: Download,
										onClick: () => {
											toast.success("Vendor data export started.");
										},
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
									const className =
										"flex items-center gap-3 rounded-lg border border-border/40 bg-gradient-to-br from-muted/30 to-transparent px-3 py-3 text-left transition-colors hover:border-primary/30 hover:from-primary/[0.06]";
									if (action.onClick) {
										return (
											<button
												key={action.label}
												type="button"
												className={className}
												onClick={action.onClick}
											>
												<div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
													<Icon className="size-4" />
												</div>
												<p className="text-sm font-medium">{action.label}</p>
											</button>
										);
									}
									return (
										<Link
											key={action.label}
											href={action.href}
											className={className}
										>
											<div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
												<Icon className="size-4" />
											</div>
											<p className="text-sm font-medium">{action.label}</p>
										</Link>
									);
								})}
							</div>
						</section>
					</div>
				</div>
			)}

			{tab === "Accounts" && <VendorAccountsTab accounts={accounts} />}

			{tab === "Operations" && (
				<VendorOperationsTab
					vendorId={vendor.id}
					vendorName={displayName}
					integration={integration}
					runs={runs}
				/>
			)}

			{tab === "Configuration" && (
				<VendorConfigurationTab
					vendorId={vendor.id}
					vendorName={displayName}
					integration={integration}
				/>
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
				<VendorNotesTab
					vendorName={displayName}
					integrationNotes={integration.notes}
				/>
			)}

			{tab === "Audit Trail" && (
				<AuditTrailView vendorId={vendor.id} vendorName={displayName} />
			)}
		</div>
	);
}
