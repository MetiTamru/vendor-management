"use client";

import { useMemo, useState } from "react";

import {
	AlertTriangle,
	ArrowUpRight,
	BadgeCheck,
	Building2,
	CalendarDays,
	ClipboardList,
	Download,
	FileText,
	Filter,
	Handshake,
	Inbox,
	Plus,
	RefreshCw,
	ShoppingCart,
	TrendingUp,
	Upload,
} from "lucide-react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import {
	useActivitiesList,
	useApprovalsList,
	useCertificatesList,
	useContractsList,
	useDocumentsList,
	useInvoicesList,
	usePurchaseOrdersList,
	useRfxList,
	useScorecardsList,
	useVendorsList,
} from "@/features/shared/vms/queries";
import { formatDate, formatMoney } from "@/features/shared/vms/utils";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const CHART_COLORS = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)",
];

const SPEND_TREND = [
	{ month: "Feb", spend: 42000, orders: 18 },
	{ month: "Mar", spend: 51000, orders: 22 },
	{ month: "Apr", spend: 48000, orders: 20 },
	{ month: "May", spend: 61000, orders: 27 },
	{ month: "Jun", spend: 58000, orders: 24 },
	{ month: "Jul", spend: 67000, orders: 29 },
];

const QUICK_ACTIONS = [
	{
		label: "Invite vendor",
		href: "/admin/vendors/invite",
		icon: Building2,
		hint: "Start onboarding",
	},
	{
		label: "Create RFX",
		href: "/admin/sourcing/create",
		icon: ClipboardList,
		hint: "RFI / RFP / RFQ",
	},
	{
		label: "New contract",
		href: "/admin/contracts/create",
		icon: Handshake,
		hint: "Draft agreement",
	},
	{
		label: "Create PO",
		href: "/admin/purchase-orders/create",
		icon: ShoppingCart,
		hint: "Issue purchase order",
	},
	{
		label: "Match invoices",
		href: "/admin/invoices/match",
		icon: FileText,
		hint: "AP exceptions",
	},
	{
		label: "Approvals inbox",
		href: "/admin/approvals",
		icon: Inbox,
		hint: "Pending decisions",
	},
] as const;

type RangeKey = "7d" | "30d" | "90d" | "ytd";

export function DashboardPage() {
	const [range, setRange] = useState<RangeKey>("30d");
	const [refreshing, setRefreshing] = useState(false);

	const { vendors, isLoading: vLoad, refetch: refetchVendors } = useVendorsList();
	const {
		approvals,
		isLoading: aLoad,
		refetch: refetchApprovals,
	} = useApprovalsList();
	const { contracts, refetch: refetchContracts } = useContractsList();
	const { certificates, refetch: refetchCerts } = useCertificatesList();
	const { events, refetch: refetchRfx } = useRfxList();
	const { invoices, refetch: refetchInvoices } = useInvoicesList();
	const { orders, refetch: refetchPos } = usePurchaseOrdersList();
	const { scorecards } = useScorecardsList();
	const { documents } = useDocumentsList();
	const { activities } = useActivitiesList();

	async function handleRefresh() {
		setRefreshing(true);
		try {
			await Promise.all([
				refetchVendors(),
				refetchApprovals(),
				refetchContracts(),
				refetchCerts(),
				refetchRfx(),
				refetchInvoices(),
				refetchPos(),
			]);
		} finally {
			setTimeout(() => setRefreshing(false), 400);
		}
	}

	const metrics = useMemo(() => {
		const pendingApprovals = approvals.filter((a) => a.status === "pending");
		const activeVendors = vendors.filter((v) => v.status === "active");
		const onboarding = vendors.filter((v) =>
			["invited", "onboarding", "under_review"].includes(v.status)
		);
		const suspended = vendors.filter((v) =>
			["suspended", "offboarded"].includes(v.status)
		);
		const openRfx = events.filter((e) =>
			["published", "evaluating"].includes(e.status)
		);
		const exceptions = invoices.filter((i) => i.status === "exception");
		const openPos = orders.filter((o) =>
			["sent", "acknowledged", "partially_received"].includes(o.status)
		);
		const activeContracts = contracts.filter((c) => c.status === "active");
		const contractValue = activeContracts.reduce((s, c) => s + c.value, 0);
		const invoiceSpend = invoices.reduce((s, i) => s + i.amount, 0);
		const expiringCerts = certificates.filter((c) =>
			["expiring", "expired"].includes(c.status)
		);
		const avgScore =
			scorecards.length > 0
				? Math.round(
						scorecards.reduce((s, sc) => s + sc.overall, 0) / scorecards.length
					)
				: 0;

		const statusBreakdown = [
			{ name: "Active", value: activeVendors.length },
			{ name: "Onboarding", value: onboarding.length },
			{ name: "Invited", value: vendors.filter((v) => v.status === "invited").length },
			{
				name: "Review",
				value: vendors.filter((v) => v.status === "under_review").length,
			},
			{ name: "Suspended", value: suspended.length },
		].filter((d) => d.value > 0);

		const invoiceByStatus = [
			{
				name: "Matched",
				value: invoices.filter((i) => i.status === "matched").length,
			},
			{
				name: "Submitted",
				value: invoices.filter((i) => i.status === "submitted").length,
			},
			{ name: "Exception", value: exceptions.length },
			{
				name: "Paid",
				value: invoices.filter((i) => i.status === "paid").length,
			},
		].filter((d) => d.value > 0);

		const recentFiles = [...documents]
			.sort(
				(a, b) =>
					new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
			)
			.slice(0, 6);

		const recentActivity = [...activities]
			.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			)
			.slice(0, 6);

		return {
			pendingApprovals,
			activeVendors: activeVendors.length,
			onboarding: onboarding.length,
			totalVendors: vendors.length,
			openRfx: openRfx.length,
			exceptions: exceptions.length,
			openPos: openPos.length,
			activeContracts: activeContracts.length,
			contractValue,
			invoiceSpend,
			expiringCerts,
			avgScore,
			statusBreakdown,
			invoiceByStatus,
			renewingContracts: activeContracts.slice(0, 4),
			topScorecards: [...scorecards].sort((a, b) => b.overall - a.overall),
			recentFiles,
			recentActivity,
		};
	}, [
		approvals,
		vendors,
		events,
		invoices,
		orders,
		contracts,
		certificates,
		scorecards,
		documents,
		activities,
	]);

	if (vLoad || aLoad) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-14 w-full rounded-xl" />
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-24 rounded-xl" />
					))}
				</div>
				<Skeleton className="h-72 w-full rounded-xl" />
			</div>
		);
	}

	const kpis = [
		{
			label: "Active vendors",
			value: String(metrics.activeVendors),
			hint: `${metrics.onboarding} in pipeline`,
			href: "/admin/vendors",
			icon: Building2,
			tone: "bg-sky-100 text-sky-700",
		},
		{
			label: "Pending approvals",
			value: String(metrics.pendingApprovals.length),
			hint: "Needs decision",
			href: "/admin/approvals",
			icon: Inbox,
			tone: "bg-amber-100 text-amber-700",
		},
		{
			label: "Contract value",
			value: formatMoney(metrics.contractValue),
			hint: `${metrics.activeContracts} active`,
			href: "/admin/contracts",
			icon: Handshake,
			tone: "bg-emerald-100 text-emerald-700",
		},
		{
			label: "Invoice spend",
			value: formatMoney(metrics.invoiceSpend),
			hint: `${metrics.exceptions} exceptions`,
			href: "/admin/invoices",
			icon: TrendingUp,
			tone: "bg-violet-100 text-violet-700",
		},
		{
			label: "Open RFX",
			value: String(metrics.openRfx),
			hint: "Live sourcing",
			href: "/admin/sourcing",
			icon: ClipboardList,
			tone: "bg-rose-100 text-rose-700",
		},
	];

	const rangeLabel =
		range === "7d"
			? "Last 7 days"
			: range === "30d"
				? "Last 30 days"
				: range === "90d"
					? "Last 90 days"
					: "Year to date";

	return (
		<div className="space-y-6">
			{/* Toolbar */}
			<div className="flex flex-col gap-3 rounded-xl bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex min-w-0 flex-wrap items-center gap-2">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<CalendarDays className="size-4 text-primary" />
						<span className="hidden sm:inline">Period</span>
					</div>
					<Select
						value={range}
						onValueChange={(v) => setRange(v as RangeKey)}
					>
						<SelectTrigger className="h-9 w-[150px]">
							<SelectValue placeholder="Time range" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="7d">Last 7 days</SelectItem>
							<SelectItem value="30d">Last 30 days</SelectItem>
							<SelectItem value="90d">Last 90 days</SelectItem>
							<SelectItem value="ytd">Year to date</SelectItem>
						</SelectContent>
					</Select>
					<span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
						{rangeLabel}
					</span>
					<span className="hidden text-xs text-muted-foreground md:inline">
						{metrics.totalVendors} vendors · {metrics.activeContracts} contracts
					</span>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="h-9"
						onClick={handleRefresh}
						disabled={refreshing}
					>
						<RefreshCw
							className={cn("mr-1.5 size-3.5", refreshing && "animate-spin")}
						/>
						Refresh
					</Button>
					<Button variant="outline" size="sm" className="h-9" asChild>
						<Link href="/admin/reports">
							<Download className="mr-1.5 size-3.5" />
							Export
						</Link>
					</Button>
					<Button variant="outline" size="sm" className="h-9" asChild>
						<Link href="/admin/vendors">
							<Filter className="mr-1.5 size-3.5" />
							Filters
						</Link>
					</Button>
					<Button size="sm" className="h-9" asChild>
						<Link href="/admin/vendors/invite">
							<Plus className="mr-1.5 size-3.5" />
							Invite vendor
						</Link>
					</Button>
				</div>
			</div>

			{/* KPI grid — icon on the right */}
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
				{kpis.map((k) => {
					const Icon = k.icon;
					return (
						<Link
							key={k.label}
							href={k.href}
							className="group rounded-xl bg-card p-4 transition-all"
						>
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0">
									<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
										{k.label}
									</p>
									<p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">
										{k.value}
									</p>
									<p className="mt-1 text-xs text-muted-foreground">{k.hint}</p>
								</div>
								<div className="flex shrink-0 flex-col items-end gap-2">
									<div className={cn("flex size-10 items-center justify-center rounded-lg", k.tone)}>
										<Icon className="size-4" />
									</div>
									<ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
								</div>
							</div>
						</Link>
					);
				})}
			</div>

			{/* Charts row */}
			<div className="grid gap-4 lg:grid-cols-5">
				<Card className="lg:col-span-3">
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Spend & order volume</CardTitle>
					</CardHeader>
					<CardContent className="h-72 pt-2">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={SPEND_TREND}>
								<defs>
									<linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
										<stop
											offset="0%"
											stopColor="var(--chart-1)"
											stopOpacity={0.35}
										/>
										<stop
											offset="100%"
											stopColor="var(--chart-1)"
											stopOpacity={0.02}
										/>
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" className="stroke-border" />
								<XAxis
									dataKey="month"
									tickLine={false}
									axisLine={false}
									tick={{ fontSize: 12 }}
								/>
								<YAxis
									tickLine={false}
									axisLine={false}
									tick={{ fontSize: 12 }}
									tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
								/>
								<Tooltip
									formatter={(value, name) =>
										name === "spend"
											? [formatMoney(Number(value)), "Spend"]
											: [value, "Orders"]
									}
									contentStyle={{
										borderRadius: 8,
										border: "1px solid var(--border)",
										background: "var(--card)",
									}}
								/>
								<Area
									type="monotone"
									dataKey="spend"
									stroke="var(--chart-1)"
									fill="url(#spendFill)"
									strokeWidth={2}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card className="lg:col-span-2">
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Vendor status overview</CardTitle>
					</CardHeader>
					<CardContent className="flex h-72 flex-col items-center justify-center pt-2">
						<ResponsiveContainer width="100%" height="70%">
							<PieChart>
								<Pie
									data={metrics.statusBreakdown}
									dataKey="value"
									nameKey="name"
									innerRadius={52}
									outerRadius={78}
									paddingAngle={3}
								>
									{metrics.statusBreakdown.map((_, i) => (
										<Cell
											key={i}
											fill={CHART_COLORS[i % CHART_COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										borderRadius: 8,
										border: "1px solid var(--border)",
										background: "var(--card)",
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
						<div className="flex flex-wrap justify-center gap-3 text-xs">
							{metrics.statusBreakdown.map((d, i) => (
								<span key={d.name} className="flex items-center gap-1.5">
									<span
										className="size-2.5 rounded-full"
										style={{
											background: CHART_COLORS[i % CHART_COLORS.length],
										}}
									/>
									{d.name} ({d.value})
								</span>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent file activity + activity feed */}
			<div className="grid gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
						<div>
							<CardTitle className="text-base">Recent file activity</CardTitle>
						</div>
						<Button variant="ghost" size="sm" asChild>
							<Link href="/admin/documents">All files</Link>
						</Button>
					</CardHeader>
					<CardContent className="divide-y rounded-lg border">
						{metrics.recentFiles.map((doc) => (
							<div
								key={doc.id}
								className="flex items-center justify-between gap-3 px-3 py-3"
							>
								<div className="flex min-w-0 items-start gap-3">
									<div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
										<Upload className="size-3.5" />
									</div>
									<div className="min-w-0">
										<p className="truncate text-sm font-medium">{doc.name}</p>
										<p className="text-xs text-muted-foreground">
											{doc.vendorName} · {doc.type.replace(/_/g, " ")}
										</p>
									</div>
								</div>
								<div className="flex shrink-0 flex-col items-end gap-1">
									<StatusBadge status={doc.status} />
									<span className="text-[11px] text-muted-foreground">
										{formatDate(doc.uploadedAt)}
									</span>
								</div>
							</div>
						))}
						{metrics.recentFiles.length === 0 && (
							<p className="px-3 py-8 text-center text-sm text-muted-foreground">
								No recent file activity.
							</p>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
						<div>
							<CardTitle className="text-base">System activity</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="divide-y rounded-lg border">
						{metrics.recentActivity.map((act) => (
							<div key={act.id} className="px-3 py-3">
								<p className="text-sm font-medium">{act.action}</p>
								<p className="mt-0.5 text-xs text-muted-foreground">
									{act.actor} · {act.entityType.replace(/_/g, " ")} ·{" "}
									{formatDate(act.createdAt)}
								</p>
							</div>
						))}
						{metrics.recentActivity.length === 0 && (
							<p className="px-3 py-8 text-center text-sm text-muted-foreground">
								No recent activity.
							</p>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Quick access + invoice status */}
			<div className="grid gap-4 lg:grid-cols-5">
				<Card className="lg:col-span-3">
					<CardHeader className="pb-3">
						<CardTitle className="text-base">Quick access</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
							{QUICK_ACTIONS.map((action) => {
								const Icon = action.icon;
								return (
									<Link
										key={action.href}
										href={action.href}
										className="flex items-start gap-3 rounded-lg border bg-background/60 p-3 transition-colors hover:border-primary/40 hover:bg-primary/[0.04]"
									>
										<div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
											<Icon className="size-4" />
										</div>
										<div className="min-w-0">
											<p className="text-sm font-semibold">{action.label}</p>
											<p className="text-xs text-muted-foreground">
												{action.hint}
											</p>
										</div>
									</Link>
								);
							})}
						</div>
					</CardContent>
				</Card>

				<Card className="lg:col-span-2">
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Invoice workflow</CardTitle>
					</CardHeader>
					<CardContent className="h-56 pt-2">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={metrics.invoiceByStatus} layout="vertical">
								<CartesianGrid
									strokeDasharray="3 3"
									horizontal={false}
									className="stroke-border"
								/>
								<XAxis type="number" allowDecimals={false} hide />
								<YAxis
									type="category"
									dataKey="name"
									width={78}
									tickLine={false}
									axisLine={false}
									tick={{ fontSize: 12 }}
								/>
								<Tooltip
									contentStyle={{
										borderRadius: 8,
										border: "1px solid var(--border)",
										background: "var(--card)",
									}}
								/>
								<Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
									{metrics.invoiceByStatus.map((_, i) => (
										<Cell
											key={i}
											fill={CHART_COLORS[i % CHART_COLORS.length]}
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Action queues */}
			<div className="grid gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
						<div>
							<CardTitle className="text-base">Pending approvals</CardTitle>
						</div>
						<Button variant="ghost" size="sm" asChild>
							<Link href="/admin/approvals">View all</Link>
						</Button>
					</CardHeader>
					<CardContent className="space-y-0 divide-y rounded-lg border">
						{metrics.pendingApprovals.slice(0, 5).map((a) => (
							<div
								key={a.id}
								className="flex items-center justify-between gap-3 px-3 py-3"
							>
								<div className="min-w-0">
									<p className="truncate text-sm font-medium">{a.title}</p>
									<p className="text-xs text-muted-foreground">
										{a.vendorName} · {a.requestedBy}
									</p>
								</div>
								<StatusBadge status={a.type} />
							</div>
						))}
						{metrics.pendingApprovals.length === 0 && (
							<p className="px-3 py-8 text-center text-sm text-muted-foreground">
								No pending approvals.
							</p>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
						<div>
							<CardTitle className="text-base">Compliance & renewals</CardTitle>
						</div>
						<Button variant="ghost" size="sm" asChild>
							<Link href="/admin/compliance">Compliance</Link>
						</Button>
					</CardHeader>
					<CardContent className="space-y-0 divide-y rounded-lg border">
						{metrics.expiringCerts.map((c) => (
							<div
								key={c.id}
								className="flex items-center justify-between gap-3 px-3 py-3"
							>
								<div className="min-w-0">
									<p className="truncate text-sm font-medium">{c.name}</p>
									<p className="text-xs text-muted-foreground">
										{c.vendorName} · expires {c.expiresAt}
									</p>
								</div>
								<StatusBadge status={c.status} />
							</div>
						))}
						{metrics.renewingContracts.map((c) => (
							<div
								key={c.id}
								className="flex items-center justify-between gap-3 px-3 py-3"
							>
								<div className="min-w-0">
									<p className="truncate text-sm font-medium">{c.title}</p>
									<p className="text-xs text-muted-foreground">
										Ends {c.endDate} · {formatMoney(c.value, c.currency)}
									</p>
								</div>
								<StatusBadge status="expiring" />
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			{/* Performance */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
					<div>
						<CardTitle className="text-base">Supplier performance</CardTitle>
					</div>
					<Button variant="ghost" size="sm" asChild>
						<Link href="/admin/performance">Scorecards</Link>
					</Button>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2">
						{metrics.topScorecards.map((sc) => (
							<div key={sc.id} className="rounded-lg border bg-muted/20 p-4">
								<div className="flex items-center justify-between gap-3">
									<div>
										<p className="font-semibold">{sc.vendorName}</p>
										<p className="text-xs text-muted-foreground">
											Period {sc.period}
										</p>
									</div>
									<span className="text-2xl font-semibold tabular-nums text-primary">
										{sc.overall}
									</span>
								</div>
								<div className="mt-4 space-y-2.5">
									{[
										{ label: "OTIF", value: sc.otif },
										{ label: "Quality", value: sc.quality },
										{ label: "Responsiveness", value: sc.responsiveness },
										{ label: "Compliance", value: sc.compliance },
									].map((row) => (
										<div key={row.label} className="space-y-1">
											<div className="flex justify-between text-xs">
												<span className="text-muted-foreground">
													{row.label}
												</span>
												<span className="font-medium tabular-nums">
													{row.value}%
												</span>
											</div>
											<Progress value={row.value} className="h-1.5" />
										</div>
									))}
								</div>
							</div>
						))}
						{metrics.topScorecards.length === 0 && (
							<p className="text-sm text-muted-foreground md:col-span-2">
								No scorecards yet.
							</p>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
