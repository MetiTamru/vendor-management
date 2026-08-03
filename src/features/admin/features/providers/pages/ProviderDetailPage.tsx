"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";

import {
	Activity,
	ArrowDownRight,
	ArrowUpRight,
	BadgeCheck,
	Building2,
	CheckCircle2,
	ChevronDown,
	ClipboardList,
	Download,
	FileWarning,
	IdCard,
	MapPin,
	Network,
	Printer,
	Receipt,
	TrendingDown,
	Users,
} from "lucide-react";
import {
	Area,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ComposedChart,
	Legend,
	Line,
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	displayProviderName,
	formatCompact,
	formatCurrency,
	formatDate,
	getProvider,
	initials,
	type CredentialStatus,
	type ExceptionStatus,
	type FeedStatus,
	type NetworkStatus,
	type ProviderStatus,
} from "@/features/admin/features/providers/mock-data";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const TABS = [
	{ id: "Overview", icon: Activity },
	{ id: "Demographics", icon: Users },
	{ id: "Identifiers", icon: IdCard },
	{ id: "Enrollment", icon: BadgeCheck },
	{ id: "Network Participation", icon: Network },
	{ id: "Locations", icon: MapPin },
	{ id: "Claims & Encounters", icon: Receipt },
	{ id: "Rejection Trends", icon: TrendingDown },
	{ id: "Vendors / Sources", icon: Building2 },
	{ id: "Credentialing & Exceptions", icon: ClipboardList },
] as const;

type TabId = (typeof TABS)[number]["id"];

function StatusPill({ status }: { status: ProviderStatus }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
				status === "active" && "bg-emerald-100 text-emerald-800",
				status === "pending" && "bg-amber-100 text-amber-900",
				status === "inactive" && "bg-slate-100 text-slate-700",
				status === "termed" && "bg-red-100 text-red-800"
			)}
		>
			{status}
		</span>
	);
}

function NetworkPill({ status }: { status: NetworkStatus }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
				status === "in_network" && "bg-emerald-100 text-emerald-800",
				status === "out_of_network" && "bg-red-100 text-red-800",
				status === "pending" && "bg-amber-100 text-amber-900"
			)}
		>
			{status === "in_network"
				? "In-Network"
				: status === "out_of_network"
					? "Out-of-Network"
					: "Pending"}
		</span>
	);
}

function FeedPill({ status }: { status: FeedStatus }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
				status === "active" && "bg-emerald-100 text-emerald-800",
				status === "warning" && "bg-amber-100 text-amber-900",
				status === "inactive" && "bg-slate-100 text-slate-700"
			)}
		>
			{status}
		</span>
	);
}

function ExceptionPill({ status }: { status: ExceptionStatus }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
				status === "open" && "bg-amber-100 text-amber-900",
				status === "in_progress" && "bg-sky-100 text-sky-900",
				status === "resolved" && "bg-emerald-100 text-emerald-800"
			)}
		>
			{status.replace("_", " ")}
		</span>
	);
}

function Panel({
	title,
	action,
	children,
	className,
}: {
	title: string;
	action?: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<section
			className={cn(
				"flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card",
				className
			)}
		>
			<div className="flex items-center justify-between gap-2 border-b border-border/40 px-3 py-2">
				<h3 className="text-sm font-medium">{title}</h3>
				{action}
			</div>
			<div className="min-h-0 flex-1 p-3">{children}</div>
		</section>
	);
}

function ViewLink({ label, onClick }: { label: string; onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="mt-2 text-xs font-medium text-primary hover:underline"
		>
			{label} →
		</button>
	);
}

function Trend({ value }: { value: number }) {
	const up = value >= 0;
	const Icon = up ? ArrowUpRight : ArrowDownRight;
	return (
		<span
			className={cn(
				"inline-flex items-center gap-0.5 text-[11px] font-medium tabular-nums",
				up ? "text-emerald-700" : "text-red-700"
			)}
		>
			<Icon className="size-3.5" />
			{up ? "+" : ""}
			{value}%
		</span>
	);
}

export function ProviderDetailPage({
	providerId: providerIdProp,
}: {
	providerId?: string;
}) {
	const params = useParams<{ providerId?: string | string[] }>();
	const raw = providerIdProp ?? params.providerId;
	const providerId = decodeURIComponent(
		Array.isArray(raw) ? (raw[0] ?? "") : String(raw ?? "")
	);
	const provider = useMemo(
		() => (providerId ? getProvider(providerId) : undefined),
		[providerId]
	);
	const [tab, setTab] = useState<TabId>("Overview");

	const credCounts = useMemo(() => {
		const counts: Record<CredentialStatus, number> = {
			complete: 0,
			expiring: 0,
			expired: 0,
			pending: 0,
		};
		if (!provider) return counts;
		for (const c of provider.credentialing) counts[c.status] += 1;
		return counts;
	}, [provider]);

	if (!provider) {
		return (
			<div className="space-y-3">
				<p className="text-sm text-destructive">Provider not found.</p>
				<Button asChild variant="outline" size="sm">
					<Link href="/admin/providers">Back to providers</Link>
				</Button>
			</div>
		);
	}

	const name = displayProviderName(provider);

	const credTotal =
		credCounts.complete +
		credCounts.expiring +
		credCounts.expired +
		credCounts.pending;
	const credPct = credTotal
		? Math.round((credCounts.complete / credTotal) * 100)
		: 0;

	const donutData = [
		{ name: "Complete", value: credCounts.complete, fill: "#059669" },
		{ name: "Expiring", value: credCounts.expiring, fill: "#f59e0b" },
		{ name: "Expired", value: credCounts.expired, fill: "#ef4444" },
		{ name: "Pending", value: credCounts.pending, fill: "#94a3b8" },
	].filter((d) => d.value > 0);

	const kpis = [
		{
			label: "Claims",
			value: formatCompact(provider.claims12m),
			trend: provider.claimsTrendPct,
			icon: Receipt,
		},
		{
			label: "Encounters",
			value: formatCompact(provider.encounters12m),
			trend: provider.encountersTrendPct,
			icon: Activity,
		},
		{
			label: "Total Billed",
			value: formatCurrency(provider.billed12m),
			trend: provider.billedTrendPct,
			icon: Receipt,
		},
		{
			label: "Total Paid",
			value: formatCurrency(provider.paid12m),
			trend: provider.paidTrendPct,
			icon: CheckCircle2,
		},
		{
			label: "Rejection Rate",
			value: `${provider.rejectionRate}%`,
			trend: provider.rejectionTrendPct,
			icon: FileWarning,
		},
		{
			label: "Net Payment",
			value: formatCurrency(provider.netPayment12m),
			trend: provider.netPaymentTrendPct,
			icon: TrendingDown,
		},
	];

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<p className="text-xs text-muted-foreground">
					<span className="text-foreground/70">Providers</span>
					<span className="mx-1.5">›</span>
					Provider Profile
				</p>
				<div className="flex flex-wrap gap-1.5">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-8 text-xs">
								Provider Summary
								<ChevronDown className="ml-1 size-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => toast.message("Opening provider summary…")}
							>
								One-page summary
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => toast.message("Opening enrollment packet…")}
							>
								Enrollment packet
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-8 text-xs">
								<Printer className="mr-1.5 size-3.5" />
								Print
								<ChevronDown className="ml-1 size-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => toast.success("Print profile")}>
								Print profile
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => toast.success("Print credentialing")}
							>
								Print credentialing
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="sm" className="h-8 text-xs">
								<Download className="mr-1.5 size-3.5" />
								Export
								<ChevronDown className="ml-1 size-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => toast.success("Exported CSV")}>
								Export CSV
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => toast.success("Exported PDF")}>
								Export PDF
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Hero */}
			<section className="rounded-lg border border-border/50 bg-card p-4">
				<div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr_0.9fr]">
					<div className="flex gap-3">
						<div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
							{initials(provider.name)}
						</div>
						<div className="min-w-0">
							<div className="flex flex-wrap items-center gap-2">
								<h1 className="text-xl font-semibold tracking-tight">{name}</h1>
								<StatusPill status={provider.status} />
							</div>
							<p className="mt-1 text-xs text-muted-foreground">
								Specialty:{" "}
								<span className="font-medium text-foreground">
									{provider.specialty}
								</span>
								{" · "}
								Subspecialty:{" "}
								<span className="font-medium text-foreground">
									{provider.subspecialty}
								</span>
							</p>
							<div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
								<p>
									<span className="text-muted-foreground">NPI:</span>{" "}
									<span className="font-mono font-medium">{provider.npi}</span>
								</p>
								<p>
									<span className="text-muted-foreground">Tax ID:</span>{" "}
									<span className="font-mono font-medium">{provider.taxId}</span>
								</p>
								<p>
									<span className="text-muted-foreground">UPIN:</span>{" "}
									<span className="font-mono font-medium">{provider.upin}</span>
								</p>
								<p>
									<span className="text-muted-foreground">Medicaid ID:</span>{" "}
									<span className="font-mono font-medium">
										{provider.medicaidId}
									</span>
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-1 text-xs">
						<p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
							Primary practice
						</p>
						<p className="font-medium">{provider.practiceName}</p>
						<p className="text-muted-foreground">{provider.practiceAddress}</p>
						<p className="text-muted-foreground">{provider.practicePhone}</p>
					</div>

					<div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-2">
						{[
							["Provider type", provider.providerType],
							["Gender", provider.gender],
							["Date of birth", formatDate(provider.dob)],
							["Years in practice", `${provider.yearsInPractice} years`],
						].map(([k, v]) => (
							<div key={k}>
								<p className="text-[10px] uppercase text-muted-foreground">{k}</p>
								<p className="font-medium">{v}</p>
							</div>
						))}
					</div>

					<div className="rounded-lg border border-border/50 bg-background/60 p-3 text-center">
						<p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
							Enrollment status
						</p>
						<span className="mx-auto mt-2 flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
							<CheckCircle2 className="size-7" />
						</span>
						<p className="mt-1.5 text-sm font-semibold capitalize text-emerald-800">
							{provider.enrollmentStatus === "enrolled"
								? "Enrolled"
								: provider.enrollmentStatus}
						</p>
						<p className="mt-1 text-[11px] text-muted-foreground">
							Effective {formatDate(provider.enrollmentEffective)}
						</p>
						<button
							type="button"
							className="mt-2 text-[11px] font-medium text-primary hover:underline"
							onClick={() => setTab("Enrollment")}
						>
							View enrollment details →
						</button>
					</div>
				</div>
			</section>

			{/* Tabs */}
			<nav className="overflow-x-auto border-b border-border/50">
				<div className="flex min-w-max gap-0">
					{TABS.map((item) => {
						const Icon = item.icon;
						return (
							<button
								key={item.id}
								type="button"
								onClick={() => setTab(item.id)}
								className={cn(
									"inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors",
									tab === item.id
										? "border-primary text-primary"
										: "border-transparent text-muted-foreground hover:text-foreground"
								)}
							>
								<Icon className="size-3.5" />
								{item.id}
							</button>
						);
					})}
				</div>
			</nav>

			{tab === "Overview" ? (
				<div className="space-y-3">
					{/* KPIs */}
					<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
						{kpis.map((k) => {
							const Icon = k.icon;
							return (
								<div
									key={k.label}
									className="rounded-lg border border-border/50 bg-card p-2.5"
								>
									<div className="flex items-start justify-between gap-2">
										<div className="min-w-0">
											<p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
												{k.label}
											</p>
											<p className="mt-1 truncate text-base font-semibold tabular-nums tracking-tight">
												{k.value}
											</p>
											<div className="mt-1">
												<Trend value={k.trend} />
											</div>
										</div>
										<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
											<Icon className="size-4" />
										</span>
									</div>
								</div>
							);
						})}
					</div>

					{/* Row 1 */}
					<div className="grid gap-3 lg:grid-cols-3">
						<Panel title="Provider Locations">
							<div className="-mx-1 overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="h-8 text-[10px]">Location</TableHead>
											<TableHead className="h-8 text-[10px]">Status</TableHead>
											<TableHead className="h-8 text-[10px]">Primary</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{provider.locations.map((loc) => (
											<TableRow key={loc.id}>
												<TableCell className="py-1.5">
													<p className="text-[11px] font-medium">{loc.name}</p>
													<p className="text-[10px] text-muted-foreground">
														{loc.address}
													</p>
													<p className="text-[10px] text-muted-foreground">
														{loc.phone}
													</p>
												</TableCell>
												<TableCell className="py-1.5">
													<StatusPill status={loc.status} />
												</TableCell>
												<TableCell className="py-1.5 text-[11px]">
													{loc.isPrimary ? "Yes" : "No"}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
							<ViewLink
								label={`View all locations (${provider.locations.length})`}
								onClick={() => setTab("Locations")}
							/>
						</Panel>

						<Panel title="Network Participation">
							<div className="-mx-1 overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="h-8 text-[10px]">Network</TableHead>
											<TableHead className="h-8 text-[10px]">Status</TableHead>
											<TableHead className="h-8 text-[10px]">Effective</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{provider.networks.slice(0, 5).map((n) => (
											<TableRow key={n.id}>
												<TableCell className="py-1.5">
													<p className="text-[11px] font-medium">
														{n.networkPlan}
													</p>
													<p className="text-[10px] text-muted-foreground">
														{n.payer}
													</p>
												</TableCell>
												<TableCell className="py-1.5">
													<NetworkPill status={n.status} />
												</TableCell>
												<TableCell className="py-1.5 text-[11px] tabular-nums">
													{formatDate(n.effectiveDate)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
							<ViewLink
								label={`View all networks (${provider.networks.length})`}
								onClick={() => setTab("Network Participation")}
							/>
						</Panel>

						<Panel title="Identifiers">
							<ul className="space-y-2">
								{provider.identifiers.map((id) => (
									<li
										key={id.id}
										className="flex items-center justify-between gap-2 rounded-md border border-border/40 px-2.5 py-1.5 text-xs"
									>
										<span className="text-muted-foreground">{id.label}</span>
										<span className="font-mono font-medium">{id.value}</span>
									</li>
								))}
							</ul>
							<ViewLink
								label="View all identifiers"
								onClick={() => setTab("Identifiers")}
							/>
						</Panel>
					</div>

					{/* Row 2 — charts */}
					<div className="grid gap-3 lg:grid-cols-3">
						<Panel title="Claims & Encounters Volume">
							<div className="h-[220px]">
								<ResponsiveContainer width="100%" height="100%">
									<ComposedChart data={provider.monthlyVolume}>
										<CartesianGrid strokeDasharray="3 3" vertical={false} />
										<XAxis dataKey="month" tick={{ fontSize: 10 }} />
										<YAxis tick={{ fontSize: 10 }} width={36} />
										<Tooltip />
										<Legend wrapperStyle={{ fontSize: 11 }} />
										<Bar
											dataKey="claims"
											name="Claims"
											fill="#13446c"
											radius={[3, 3, 0, 0]}
										/>
										<Line
											type="monotone"
											dataKey="encounters"
											name="Encounters"
											stroke="#059669"
											strokeWidth={2}
											dot={{ r: 3 }}
										/>
									</ComposedChart>
								</ResponsiveContainer>
							</div>
							<ViewLink
								label="View claims & encounters"
								onClick={() => setTab("Claims & Encounters")}
							/>
						</Panel>

						<Panel title="Rejection Trends">
							<div className="h-[220px]">
								<ResponsiveContainer width="100%" height="100%">
									<ComposedChart data={provider.monthlyVolume}>
										<CartesianGrid strokeDasharray="3 3" vertical={false} />
										<XAxis dataKey="month" tick={{ fontSize: 10 }} />
										<YAxis
											yAxisId="left"
											tick={{ fontSize: 10 }}
											width={28}
										/>
										<YAxis
											yAxisId="right"
											orientation="right"
											tick={{ fontSize: 10 }}
											width={32}
											unit="%"
										/>
										<Tooltip />
										<Legend wrapperStyle={{ fontSize: 11 }} />
										<Bar
											yAxisId="left"
											dataKey="rejectionCount"
											name="Rejection Count"
											fill="#fecaca"
											radius={[3, 3, 0, 0]}
										/>
										<Area
											yAxisId="right"
											type="monotone"
											dataKey="rejectionRate"
											name="Rejection Rate (%)"
											stroke="#ef4444"
											fill="#ef444422"
											strokeWidth={2}
										/>
									</ComposedChart>
								</ResponsiveContainer>
							</div>
							<ViewLink
								label="View rejection details"
								onClick={() => setTab("Rejection Trends")}
							/>
						</Panel>

						<Panel title="Top Rejection Reasons">
							<div className="-mx-1 overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="h-8 text-[10px]">Reason</TableHead>
											<TableHead className="h-8 text-right text-[10px]">
												Count
											</TableHead>
											<TableHead className="h-8 text-right text-[10px]">
												%
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{provider.rejectionReasons.map((r) => (
											<TableRow key={r.id}>
												<TableCell className="py-1.5 text-[11px]">
													{r.reason}
												</TableCell>
												<TableCell className="py-1.5 text-right text-[11px] tabular-nums">
													{r.count}
												</TableCell>
												<TableCell className="py-1.5 text-right text-[11px] tabular-nums">
													{r.pct}%
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
							<ViewLink
								label="View all rejection reasons"
								onClick={() => setTab("Rejection Trends")}
							/>
						</Panel>
					</div>

					{/* Row 3 */}
					<div className="grid gap-3 lg:grid-cols-3">
						<Panel title="Vendors / Source Associations">
							<div className="-mx-1 overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="h-8 text-[10px]">Vendor</TableHead>
											<TableHead className="h-8 text-[10px]">Feed</TableHead>
											<TableHead className="h-8 text-[10px]">Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{provider.vendors.map((v) => (
											<TableRow key={v.id}>
												<TableCell className="py-1.5">
													<p className="text-[11px] font-medium">{v.vendor}</p>
													<p className="text-[10px] text-muted-foreground">
														{v.frequency} · {v.lastReceived}
													</p>
												</TableCell>
												<TableCell className="py-1.5 text-[11px]">
													{v.fileType}
												</TableCell>
												<TableCell className="py-1.5">
													<FeedPill status={v.status} />
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
							<ViewLink
								label="View all vendors / sources"
								onClick={() => setTab("Vendors / Sources")}
							/>
						</Panel>

						<Panel title="Credentialing Summary">
							<div className="flex flex-col items-center gap-3 sm:flex-row">
								<div className="relative h-[160px] w-[160px] shrink-0">
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={donutData}
												dataKey="value"
												nameKey="name"
												innerRadius={48}
												outerRadius={68}
												paddingAngle={2}
											>
												{donutData.map((d) => (
													<Cell key={d.name} fill={d.fill} />
												))}
											</Pie>
										</PieChart>
									</ResponsiveContainer>
									<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
										<p className="text-lg font-semibold tabular-nums">
											{credPct}%
										</p>
										<p className="text-[10px] text-muted-foreground">
											Complete
										</p>
									</div>
								</div>
								<ul className="w-full space-y-1.5 text-xs">
									{[
										{
											label: "Complete",
											value: credCounts.complete,
											color: "bg-emerald-500",
										},
										{
											label: "Expiring",
											value: credCounts.expiring,
											color: "bg-amber-500",
										},
										{
											label: "Expired",
											value: credCounts.expired,
											color: "bg-red-500",
										},
										{
											label: "Pending",
											value: credCounts.pending,
											color: "bg-slate-400",
										},
									].map((row) => (
										<li
											key={row.label}
											className="flex items-center justify-between gap-2"
										>
											<span className="flex items-center gap-2">
												<span
													className={cn("size-2 rounded-full", row.color)}
												/>
												{row.label}
											</span>
											<span className="font-medium tabular-nums">
												{row.value}
											</span>
										</li>
									))}
								</ul>
							</div>
							<ViewLink
								label="View credentialing details"
								onClick={() => setTab("Credentialing & Exceptions")}
							/>
						</Panel>

						<Panel title="Credentialing & Enrollment Exceptions">
							{provider.exceptions.length === 0 ? (
								<p className="text-xs text-muted-foreground">
									No open exceptions.
								</p>
							) : (
								<div className="-mx-1 overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow className="hover:bg-transparent">
												<TableHead className="h-8 text-[10px]">Type</TableHead>
												<TableHead className="h-8 text-[10px]">
													Status
												</TableHead>
												<TableHead className="h-8 text-[10px]">Date</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{provider.exceptions.map((ex) => (
												<TableRow key={ex.id}>
													<TableCell className="py-1.5">
														<p className="text-[11px] font-medium text-amber-800">
															{ex.exceptionType}
														</p>
														<p className="text-[10px] text-muted-foreground">
															{ex.description}
														</p>
													</TableCell>
													<TableCell className="py-1.5">
														<ExceptionPill status={ex.status} />
													</TableCell>
													<TableCell className="py-1.5 text-[11px] tabular-nums">
														{formatDate(ex.dateIdentified)}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							)}
							<ViewLink
								label="View all exceptions"
								onClick={() => setTab("Credentialing & Exceptions")}
							/>
						</Panel>
					</div>

					<footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
						<p>All dates and times are displayed in Eastern Time (ET).</p>
						<p>Data as of {provider.dataAsOf}</p>
					</footer>
				</div>
			) : (
				<TabBody tab={tab} provider={provider} />
			)}
		</div>
	);
}

function TabBody({
	tab,
	provider,
}: {
	tab: TabId;
	provider: NonNullable<ReturnType<typeof getProvider>>;
}) {
	if (tab === "Demographics") {
		return (
			<Panel title="Demographics">
				<dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{[
						["Name", displayProviderName(provider)],
						["Provider type", provider.providerType],
						["Gender", provider.gender],
						["Date of birth", formatDate(provider.dob)],
						["Years in practice", String(provider.yearsInPractice)],
						["Specialty", provider.specialty],
						["Subspecialty", provider.subspecialty],
						["Program", provider.program],
						["Status", provider.status],
						["Practice", provider.practiceName],
						["Address", provider.practiceAddress],
						["Phone", provider.practicePhone],
					].map(([k, v]) => (
						<div
							key={k}
							className="rounded-md border border-border/40 px-3 py-2"
						>
							<dt className="text-[10px] uppercase text-muted-foreground">{k}</dt>
							<dd className="mt-0.5 text-sm font-medium">{v}</dd>
						</div>
					))}
				</dl>
			</Panel>
		);
	}

	if (tab === "Identifiers") {
		return (
			<Panel title="Identifiers">
				<ul className="grid gap-2 sm:grid-cols-2">
					{provider.identifiers.map((id) => (
						<li
							key={id.id}
							className="flex items-center justify-between rounded-md border border-border/40 px-3 py-2 text-sm"
						>
							<span className="text-muted-foreground">{id.label}</span>
							<span className="font-mono font-medium">{id.value}</span>
						</li>
					))}
				</ul>
			</Panel>
		);
	}

	if (tab === "Enrollment") {
		return (
			<Panel title="Enrollment">
				<div className="grid gap-3 sm:grid-cols-3">
					<div className="rounded-md border border-border/40 p-3">
						<p className="text-[10px] uppercase text-muted-foreground">Status</p>
						<p className="mt-1 text-sm font-semibold capitalize">
							{provider.enrollmentStatus}
						</p>
					</div>
					<div className="rounded-md border border-border/40 p-3">
						<p className="text-[10px] uppercase text-muted-foreground">
							Effective date
						</p>
						<p className="mt-1 text-sm font-semibold tabular-nums">
							{formatDate(provider.enrollmentEffective)}
						</p>
					</div>
					<div className="rounded-md border border-border/40 p-3">
						<p className="text-[10px] uppercase text-muted-foreground">Program</p>
						<p className="mt-1 text-sm font-semibold">{provider.program}</p>
					</div>
				</div>
			</Panel>
		);
	}

	if (tab === "Network Participation") {
		return (
			<Panel title="Network Participation">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Network / Plan</TableHead>
								<TableHead>Payer</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Effective</TableHead>
								<TableHead>End</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{provider.networks.map((n) => (
								<TableRow key={n.id}>
									<TableCell className="text-sm font-medium">
										{n.networkPlan}
									</TableCell>
									<TableCell className="text-sm">{n.payer}</TableCell>
									<TableCell>
										<NetworkPill status={n.status} />
									</TableCell>
									<TableCell className="tabular-nums text-sm">
										{formatDate(n.effectiveDate)}
									</TableCell>
									<TableCell className="tabular-nums text-sm">
										{formatDate(n.endDate)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Panel>
		);
	}

	if (tab === "Locations") {
		return (
			<Panel title="Locations">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Location</TableHead>
								<TableHead>Address</TableHead>
								<TableHead>Phone</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Primary</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{provider.locations.map((loc) => (
								<TableRow key={loc.id}>
									<TableCell className="text-sm font-medium">{loc.name}</TableCell>
									<TableCell className="text-sm">{loc.address}</TableCell>
									<TableCell className="text-sm">{loc.phone}</TableCell>
									<TableCell>
										<StatusPill status={loc.status} />
									</TableCell>
									<TableCell className="text-sm">
										{loc.isPrimary ? "Yes" : "No"}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Panel>
		);
	}

	if (tab === "Claims & Encounters") {
		return (
			<Panel title="Claims & Encounters Volume (12 months)">
				<div className="h-[320px]">
					<ResponsiveContainer width="100%" height="100%">
						<ComposedChart data={provider.monthlyVolume}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} />
							<XAxis dataKey="month" tick={{ fontSize: 11 }} />
							<YAxis tick={{ fontSize: 11 }} width={40} />
							<Tooltip />
							<Legend />
							<Bar dataKey="claims" name="Claims" fill="#13446c" radius={[4, 4, 0, 0]} />
							<Line
								type="monotone"
								dataKey="encounters"
								name="Encounters"
								stroke="#059669"
								strokeWidth={2}
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>
			</Panel>
		);
	}

	if (tab === "Rejection Trends") {
		return (
			<div className="grid gap-3 lg:grid-cols-2">
				<Panel title="Rejection Trends">
					<div className="h-[280px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={provider.monthlyVolume}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} />
								<XAxis dataKey="month" tick={{ fontSize: 11 }} />
								<YAxis tick={{ fontSize: 11 }} width={36} />
								<Tooltip />
								<Bar
									dataKey="rejectionCount"
									name="Rejections"
									fill="#ef4444"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</Panel>
				<Panel title="Rejection Reasons">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Reason</TableHead>
									<TableHead className="text-right">Count</TableHead>
									<TableHead className="text-right">% of total</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{provider.rejectionReasons.map((r) => (
									<TableRow key={r.id}>
										<TableCell className="text-sm">{r.reason}</TableCell>
										<TableCell className="text-right tabular-nums text-sm">
											{r.count}
										</TableCell>
										<TableCell className="text-right tabular-nums text-sm">
											{r.pct}%
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</Panel>
			</div>
		);
	}

	if (tab === "Vendors / Sources") {
		return (
			<Panel title="Vendors / Source Associations">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Vendor / Source</TableHead>
								<TableHead>File type</TableHead>
								<TableHead>Data sent</TableHead>
								<TableHead>Frequency</TableHead>
								<TableHead>Last received</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{provider.vendors.map((v) => (
								<TableRow key={v.id}>
									<TableCell className="text-sm font-medium">{v.vendor}</TableCell>
									<TableCell className="text-sm">{v.fileType}</TableCell>
									<TableCell className="text-sm">{v.dataSent}</TableCell>
									<TableCell className="text-sm">{v.frequency}</TableCell>
									<TableCell className="tabular-nums text-sm">
										{v.lastReceived}
									</TableCell>
									<TableCell>
										<FeedPill status={v.status} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Panel>
		);
	}

	return (
		<div className="grid gap-3 lg:grid-cols-2">
			<Panel title="Credentialing checklist">
				<ul className="space-y-1.5">
					{provider.credentialing.map((c) => (
						<li
							key={c.id}
							className="flex items-center justify-between rounded-md border border-border/40 px-2.5 py-1.5 text-xs"
						>
							<span>{c.label}</span>
							<span
								className={cn(
									"rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
									c.status === "complete" && "bg-emerald-100 text-emerald-800",
									c.status === "expiring" && "bg-amber-100 text-amber-900",
									c.status === "expired" && "bg-red-100 text-red-800",
									c.status === "pending" && "bg-slate-100 text-slate-700"
								)}
							>
								{c.status}
							</span>
						</li>
					))}
				</ul>
			</Panel>
			<Panel title="Exceptions">
				{provider.exceptions.length === 0 ? (
					<p className="text-xs text-muted-foreground">No exceptions.</p>
				) : (
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Type</TableHead>
									<TableHead>Description</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Identified</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{provider.exceptions.map((ex) => (
									<TableRow key={ex.id}>
										<TableCell className="text-sm font-medium text-amber-800">
											{ex.exceptionType}
										</TableCell>
										<TableCell className="text-sm">{ex.description}</TableCell>
										<TableCell>
											<ExceptionPill status={ex.status} />
										</TableCell>
										<TableCell className="tabular-nums text-sm">
											{formatDate(ex.dateIdentified)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</Panel>
		</div>
	);
}
