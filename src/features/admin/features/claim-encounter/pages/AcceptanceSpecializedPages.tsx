"use client";

import { useMemo, useState } from "react";

import {
	Activity,
	AlertTriangle,
	ArrowDownRight,
	ArrowUpRight,
	Clock3,
	Download,
	FileWarning,
	ShieldCheck,
	TrendingUp,
	XCircle,
} from "lucide-react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import {
	ClaimKpiGrid,
	ClaimPageHeader,
} from "@/features/admin/features/claim-encounter/components/ClaimPageChrome";
import {
	exceptionsForProgram,
	filesForProgram,
	formatCount,
} from "@/features/admin/features/claim-encounter/mock-data";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useAdminModuleStore } from "@/stores/admin-module-store";

const COLORS = ["#dc2626", "#f59e0b", "#8b5cf6", "#0ea5e9", "#64748b"];

function AnalyticsFilters({
	vendor,
	setVendor,
	vendors,
}: {
	vendor: string;
	setVendor: (value: string) => void;
	vendors: string[];
}) {
	return (
		<div className="flex flex-wrap items-end gap-2">
			<div className="min-w-52 space-y-1">
				<label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
					Vendor
				</label>
				<Select value={vendor} onValueChange={setVendor}>
					<SelectTrigger className="h-9">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All vendors</SelectItem>
						{vendors.map((name) => (
							<SelectItem key={name} value={name}>
								{name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="min-w-44 space-y-1">
				<label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
					Date Range
				</label>
				<Select defaultValue="30">
					<SelectTrigger className="h-9">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="7">Last 7 days</SelectItem>
						<SelectItem value="30">Last 30 days</SelectItem>
						<SelectItem value="90">Last 90 days</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<Button className="h-9">Apply Filters</Button>
			<Button variant="ghost" className="h-9" onClick={() => setVendor("all")}>
				Clear
			</Button>
		</div>
	);
}

export function AcceptanceOverviewPage() {
	const program = useAdminModuleStore((state) => state.fileType);
	const files = useMemo(() => filesForProgram(program), [program]);
	const exceptions = useMemo(() => exceptionsForProgram(program), [program]);
	const summary = useMemo(() => {
		const submitted = files.reduce((sum, row) => sum + row.submitted, 0);
		const accepted = files.reduce((sum, row) => sum + row.accepted, 0);
		const rejected = files.reduce((sum, row) => sum + row.rejected, 0);
		const partial = files.reduce((sum, row) => sum + row.partial, 0);
		const rate = submitted ? Math.round((accepted / submitted) * 1000) / 10 : 0;
		const byVendor = Array.from(
			files
				.reduce((map, row) => {
					const current = map.get(row.vendor) ?? {
						vendor: row.vendor,
						submitted: 0,
						accepted: 0,
						rejected: 0,
					};
					current.submitted += row.submitted;
					current.accepted += row.accepted;
					current.rejected += row.rejected;
					map.set(row.vendor, current);
					return map;
				}, new Map<string, { vendor: string; submitted: number; accepted: number; rejected: number }>())
				.values()
		)
			.map((row) => ({
				...row,
				rate: row.submitted
					? Math.round((row.accepted / row.submitted) * 1000) / 10
					: 0,
			}))
			.sort((a, b) => b.rate - a.rate);
		return { submitted, accepted, rejected, partial, rate, byVendor };
	}, [files]);

	const outcome = [
		{ name: "Accepted", value: summary.accepted, fill: "#059669" },
		{ name: "Partial", value: summary.partial, fill: "#f59e0b" },
		{ name: "Rejected", value: summary.rejected, fill: "#dc2626" },
	];
	const quickLinks = [
		{
			title: "Acceptance",
			description:
				"Analyze accepted volume, payment outcomes and vendor rankings.",
			href: "/admin/claim-encounter/acceptance-analytics/acceptance",
			value: `${summary.rate}%`,
			tone: "text-emerald-700 bg-emerald-500/10",
		},
		{
			title: "Rejections",
			description:
				"Investigate rejection causes, severity and remediation performance.",
			href: "/admin/claim-encounter/acceptance-analytics/rejections",
			value: formatCount(summary.rejected),
			tone: "text-red-700 bg-red-500/10",
		},
		{
			title: "Completeness",
			description:
				"Monitor whether expected vendor encounter submissions were received.",
			href: "/admin/claim-encounter/acceptance-analytics/completeness",
			value: "92%",
			tone: "text-sky-700 bg-sky-500/10",
		},
		{
			title: "Trends",
			description:
				"Track longitudinal rates, volume, turnaround and forecasts.",
			href: "/admin/claim-encounter/acceptance-analytics/trends",
			value: "+3.4 pts",
			tone: "text-violet-700 bg-violet-500/10",
		},
	];

	return (
		<div className="space-y-4">
			<ClaimPageHeader
				title="Acceptance Analytics Overview"
				description={`Executive view of submission outcomes, data completeness and vendor performance · ${program}`}
				actions={
					<Button variant="outline" size="sm">
						<Download className="mr-1.5 size-3.5" />
						Export overview
					</Button>
				}
			/>
			<ClaimKpiGrid
				columns={5}
				items={[
					{
						label: "Submitted",
						value: formatCount(summary.submitted),
						hint: `${files.length} files analyzed`,
						icon: Activity,
						tone: "bg-primary/10 text-primary",
					},
					{
						label: "Acceptance Rate",
						value: `${summary.rate}%`,
						hint: `${formatCount(summary.accepted)} accepted`,
						icon: ShieldCheck,
						tone: "bg-emerald-500/10 text-emerald-700",
					},
					{
						label: "Rejected",
						value: formatCount(summary.rejected),
						hint: `${exceptions.length} diagnostic issues`,
						icon: XCircle,
						tone: "bg-red-500/10 text-red-700",
					},
					{
						label: "Completeness",
						value: "92%",
						hint: "Across active vendors",
						icon: FileWarning,
						tone: "bg-sky-500/10 text-sky-700",
					},
					{
						label: "Avg Turnaround",
						value: "18.4h",
						hint: "↓ 2.1h this month",
						icon: Clock3,
						tone: "bg-violet-500/10 text-violet-700",
					},
				]}
			/>

			<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
				{quickLinks.map((item) => (
					<Link
						key={item.title}
						href={item.href}
						className="rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md"
					>
						<div className="flex items-start justify-between gap-3">
							<div>
								<p className="text-sm font-semibold">{item.title}</p>
								<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
									{item.description}
								</p>
							</div>
							<span
								className={cn(
									"shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-semibold",
									item.tone
								)}
							>
								{item.value}
							</span>
						</div>
						<p className="mt-4 text-xs font-medium text-primary">
							Open analytics →
						</p>
					</Link>
				))}
			</div>

			<div className="grid gap-3 xl:grid-cols-5">
				<Card className="gap-1 py-2 xl:col-span-2">
					<CardHeader className="px-3 pb-0">
						<CardTitle className="text-sm">Outcome snapshot</CardTitle>
						<p className="text-[11px] text-muted-foreground">
							Current submitted volume disposition
						</p>
					</CardHeader>
					<CardContent className="h-72 px-3">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={outcome}
									dataKey="value"
									nameKey="name"
									innerRadius={58}
									outerRadius={92}
									paddingAngle={3}
								>
									{outcome.map((item) => (
										<Cell key={item.name} fill={item.fill} />
									))}
								</Pie>
								<Tooltip formatter={(value) => formatCount(Number(value))} />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
				<Card className="gap-0 py-0 xl:col-span-3">
					<CardHeader className="border-b border-border/60 px-4 py-3">
						<CardTitle className="text-sm">Vendor health at a glance</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Vendor</TableHead>
									<TableHead className="text-right">Submitted</TableHead>
									<TableHead className="text-right">Accepted</TableHead>
									<TableHead className="text-right">Rejected</TableHead>
									<TableHead>Acceptance</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{summary.byVendor.slice(0, 6).map((row) => (
									<TableRow key={row.vendor}>
										<TableCell className="font-medium">{row.vendor}</TableCell>
										<TableCell className="text-right tabular-nums">
											{formatCount(row.submitted)}
										</TableCell>
										<TableCell className="text-right tabular-nums text-emerald-700">
											{formatCount(row.accepted)}
										</TableCell>
										<TableCell className="text-right tabular-nums text-red-700">
											{formatCount(row.rejected)}
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<Progress
													value={row.rate}
													className="h-1.5 min-w-20"
													indicatorClassName={
														row.rate >= 95 ? "bg-emerald-500" : "bg-amber-500"
													}
												/>
												<span className="w-10 text-right text-xs font-semibold">
													{row.rate}%
												</span>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export function RejectionAnalyticsPage() {
	const program = useAdminModuleStore((state) => state.fileType);
	const [vendor, setVendor] = useState("all");
	const exceptions = useMemo(() => exceptionsForProgram(program), [program]);
	const vendors = useMemo(
		() => Array.from(new Set(exceptions.map((row) => row.vendor))).sort(),
		[exceptions]
	);
	const rows = useMemo(
		() => exceptions.filter((row) => vendor === "all" || row.vendor === vendor),
		[exceptions, vendor]
	);

	const analytics = useMemo(() => {
		const byCode = Array.from(
			rows
				.reduce((map, row) => {
					const current = map.get(row.code) ?? {
						code: row.code,
						category: row.category,
						count: 0,
						open: 0,
						vendors: new Set<string>(),
					};
					current.count += 1;
					current.open += row.status === "resolved" ? 0 : 1;
					current.vendors.add(row.vendor);
					map.set(row.code, current);
					return map;
				}, new Map<string, { code: string; category: string; count: number; open: number; vendors: Set<string> }>())
				.values()
		)
			.map((item) => ({ ...item, vendorCount: item.vendors.size }))
			.sort((a, b) => b.count - a.count);
		const byVendor = Array.from(
			rows
				.reduce((map, row) => {
					const current = map.get(row.vendor) ?? {
						vendor: row.vendor,
						rejected: 0,
						errors: 0,
						warnings: 0,
						resolved: 0,
					};
					current.rejected += 1;
					current.errors += row.severity === "error" ? 1 : 0;
					current.warnings += row.severity === "warning" ? 1 : 0;
					current.resolved += row.status === "resolved" ? 1 : 0;
					map.set(row.vendor, current);
					return map;
				}, new Map<string, { vendor: string; rejected: number; errors: number; warnings: number; resolved: number }>())
				.values()
		).sort((a, b) => b.rejected - a.rejected);
		const categories = Array.from(
			rows
				.reduce(
					(map, row) => map.set(row.category, (map.get(row.category) ?? 0) + 1),
					new Map<string, number>()
				)
				.entries()
		).map(([name, value]) => ({ name, value }));
		const open = rows.filter((row) => row.status !== "resolved").length;
		const resolved = rows.length - open;
		const high = rows.filter((row) => row.severity === "error").length;
		return { byCode, byVendor, categories, open, resolved, high };
	}, [rows]);

	return (
		<div className="space-y-4">
			<ClaimPageHeader
				title="Rejection Analytics"
				description={`Analyze rejection volume, root causes, vendors and remediation performance · ${program}`}
				actions={
					<Button variant="outline" size="sm">
						<Download className="mr-1.5 size-3.5" />
						Export analysis
					</Button>
				}
			/>
			<AnalyticsFilters
				vendor={vendor}
				setVendor={setVendor}
				vendors={vendors}
			/>
			<ClaimKpiGrid
				columns={5}
				items={[
					{
						label: "Total Rejections",
						value: formatCount(rows.length),
						hint: "Selected period",
						icon: XCircle,
						tone: "bg-red-500/10 text-red-700",
					},
					{
						label: "High Severity",
						value: formatCount(analytics.high),
						hint: `${rows.length ? Math.round((analytics.high / rows.length) * 100) : 0}% of total`,
						icon: AlertTriangle,
						tone: "bg-orange-500/10 text-orange-700",
					},
					{
						label: "Open Work",
						value: formatCount(analytics.open),
						hint: "Requires remediation",
						icon: FileWarning,
						tone: "bg-amber-500/10 text-amber-700",
					},
					{
						label: "Resolved",
						value: formatCount(analytics.resolved),
						hint: `${rows.length ? Math.round((analytics.resolved / rows.length) * 100) : 0}% resolution rate`,
						icon: ShieldCheck,
						tone: "bg-emerald-500/10 text-emerald-700",
					},
					{
						label: "Avg Resolution",
						value: "18.4h",
						hint: "↓ 2.1h vs prior period",
						icon: Clock3,
						tone: "bg-violet-500/10 text-violet-700",
					},
				]}
			/>

			<div className="grid gap-3 xl:grid-cols-5">
				<Card className="gap-1 py-2 xl:col-span-3">
					<CardHeader className="px-3 pb-0">
						<CardTitle className="text-sm">Rejections by vendor</CardTitle>
						<p className="text-[11px] text-muted-foreground">
							Error and warning distribution
						</p>
					</CardHeader>
					<CardContent className="h-72 px-3">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={analytics.byVendor}>
								<CartesianGrid vertical={false} strokeDasharray="3 3" />
								<XAxis dataKey="vendor" tick={{ fontSize: 10 }} />
								<YAxis tick={{ fontSize: 10 }} />
								<Tooltip />
								<Bar
									dataKey="errors"
									stackId="a"
									fill="#dc2626"
									name="Errors"
								/>
								<Bar
									dataKey="warnings"
									stackId="a"
									fill="#f59e0b"
									name="Warnings"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
				<Card className="gap-1 py-2 xl:col-span-2">
					<CardHeader className="px-3 pb-0">
						<CardTitle className="text-sm">Root cause mix</CardTitle>
						<p className="text-[11px] text-muted-foreground">
							Rejections by validation category
						</p>
					</CardHeader>
					<CardContent className="h-72 px-3">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={
										analytics.categories.length
											? analytics.categories
											: [{ name: "No data", value: 1 }]
									}
									dataKey="value"
									nameKey="name"
									innerRadius={55}
									outerRadius={90}
									paddingAngle={2}
								>
									{analytics.categories.map((item, index) => (
										<Cell
											key={item.name}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-3 xl:grid-cols-2">
				<Card className="gap-0 py-0">
					<CardHeader className="border-b px-4 py-3">
						<CardTitle className="text-sm">Top rejection codes</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Code</TableHead>
									<TableHead>Category</TableHead>
									<TableHead className="text-right">Count</TableHead>
									<TableHead className="text-right">Open</TableHead>
									<TableHead>Affected Vendors</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{analytics.byCode.map((row) => (
									<TableRow key={row.code}>
										<TableCell className="font-mono font-semibold">
											{row.code}
										</TableCell>
										<TableCell className="text-xs">{row.category}</TableCell>
										<TableCell className="text-right">{row.count}</TableCell>
										<TableCell className="text-right text-red-700">
											{row.open}
										</TableCell>
										<TableCell>{row.vendorCount}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
				<Card className="gap-0 py-0">
					<CardHeader className="border-b px-4 py-3">
						<CardTitle className="text-sm">
							Vendor remediation performance
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 p-4">
						{analytics.byVendor.map((row) => {
							const rate = row.rejected
								? Math.round((row.resolved / row.rejected) * 100)
								: 0;
							return (
								<div key={row.vendor} className="space-y-1.5">
									<div className="flex justify-between text-xs">
										<span className="font-medium">{row.vendor}</span>
										<span>
											{row.resolved}/{row.rejected} resolved · {rate}%
										</span>
									</div>
									<Progress
										value={rate}
										className="h-2"
										indicatorClassName={
											rate >= 70
												? "bg-emerald-500"
												: rate >= 40
													? "bg-amber-500"
													: "bg-red-500"
										}
									/>
								</div>
							);
						})}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export function AcceptanceTrendsPage() {
	const program = useAdminModuleStore((state) => state.fileType);
	const [vendor, setVendor] = useState("all");
	const files = useMemo(() => filesForProgram(program), [program]);
	const vendors = useMemo(
		() => Array.from(new Set(files.map((row) => row.vendor))).sort(),
		[files]
	);
	const selected = useMemo(
		() => files.filter((row) => vendor === "all" || row.vendor === vendor),
		[files, vendor]
	);
	const trend = useMemo(() => {
		const baseAccepted = selected.reduce((sum, row) => sum + row.accepted, 0);
		const baseRejected = selected.reduce((sum, row) => sum + row.rejected, 0);
		return Array.from({ length: 12 }, (_, index) => {
			const wave = Math.sin(index / 2) * 1.8;
			const acceptanceRate = Math.round((92.4 + index * 0.35 + wave) * 10) / 10;
			return {
				period: `W${index + 1}`,
				acceptanceRate,
				rejectionRate: Math.round((100 - acceptanceRate) * 10) / 10,
				volume: Math.round(
					((baseAccepted + baseRejected) / 12) * (0.82 + index * 0.025)
				),
				responseHours:
					Math.round((26 - index * 0.7 + Math.cos(index) * 1.4) * 10) / 10,
			};
		});
	}, [selected]);
	const latest = trend.at(-1)!;
	const prior = trend.at(-2)!;
	const rateDelta =
		Math.round((latest.acceptanceRate - trend[0]!.acceptanceRate) * 10) / 10;

	return (
		<div className="space-y-4">
			<ClaimPageHeader
				title="Acceptance Trends"
				description={`Monitor longitudinal acceptance, rejection, volume and turnaround patterns · ${program}`}
				actions={
					<Button variant="outline" size="sm">
						<Download className="mr-1.5 size-3.5" />
						Export trends
					</Button>
				}
			/>
			<AnalyticsFilters
				vendor={vendor}
				setVendor={setVendor}
				vendors={vendors}
			/>
			<ClaimKpiGrid
				columns={5}
				items={[
					{
						label: "Current Acceptance",
						value: `${latest.acceptanceRate}%`,
						hint: `${rateDelta >= 0 ? "+" : ""}${rateDelta} pts over 12 weeks`,
						icon: TrendingUp,
						tone: "bg-emerald-500/10 text-emerald-700",
					},
					{
						label: "Current Rejection",
						value: `${latest.rejectionRate}%`,
						hint: "Lowest in 8 weeks",
						icon: ArrowDownRight,
						tone: "bg-red-500/10 text-red-700",
					},
					{
						label: "Weekly Volume",
						value: formatCount(latest.volume),
						hint: `${Math.round((latest.volume / prior.volume - 1) * 100)}% week over week`,
						icon: Activity,
						tone: "bg-sky-500/10 text-sky-700",
					},
					{
						label: "Response Time",
						value: `${latest.responseHours}h`,
						hint: "Improving turnaround",
						icon: Clock3,
						tone: "bg-violet-500/10 text-violet-700",
					},
					{
						label: "Forecast",
						value: "97.8%",
						hint: "Next 4-week acceptance",
						icon: ArrowUpRight,
						tone: "bg-primary/10 text-primary",
					},
				]}
			/>

			<Card className="gap-1 py-2">
				<CardHeader className="px-3 pb-0">
					<CardTitle className="text-sm">
						12-week acceptance and rejection trend
					</CardTitle>
					<p className="text-[11px] text-muted-foreground">
						Rates as a percentage of submitted encounters
					</p>
				</CardHeader>
				<CardContent className="h-80 px-3">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={trend}>
							<defs>
								<linearGradient id="acceptTrend" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
									<stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="period" tick={{ fontSize: 10 }} />
							<YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
							<Tooltip />
							<Area
								type="monotone"
								dataKey="acceptanceRate"
								name="Acceptance %"
								stroke="#059669"
								strokeWidth={2.5}
								fill="url(#acceptTrend)"
							/>
							<Line
								type="monotone"
								dataKey="rejectionRate"
								name="Rejection %"
								stroke="#dc2626"
								strokeWidth={2}
								dot={false}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			<div className="grid gap-3 xl:grid-cols-2">
				<Card className="gap-1 py-2">
					<CardHeader className="px-3 pb-0">
						<CardTitle className="text-sm">Submission volume trend</CardTitle>
						<p className="text-[11px] text-muted-foreground">
							Weekly encounter throughput
						</p>
					</CardHeader>
					<CardContent className="h-64 px-3">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={trend}>
								<CartesianGrid vertical={false} strokeDasharray="3 3" />
								<XAxis dataKey="period" tick={{ fontSize: 10 }} />
								<YAxis tick={{ fontSize: 10 }} />
								<Tooltip />
								<Bar dataKey="volume" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
				<Card className="gap-1 py-2">
					<CardHeader className="px-3 pb-0">
						<CardTitle className="text-sm">Response turnaround trend</CardTitle>
						<p className="text-[11px] text-muted-foreground">
							Average processing hours
						</p>
					</CardHeader>
					<CardContent className="h-64 px-3">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={trend}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="period" tick={{ fontSize: 10 }} />
								<YAxis tick={{ fontSize: 10 }} />
								<Tooltip />
								<Line
									type="monotone"
									dataKey="responseHours"
									name="Hours"
									stroke="#8b5cf6"
									strokeWidth={2.5}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-3 md:grid-cols-3">
				{[
					{
						title: "Acceptance momentum",
						value: `${rateDelta >= 0 ? "+" : ""}${rateDelta} points`,
						body: "Acceptance is improving steadily across the selected reporting window.",
						tone: "border-emerald-500/30 bg-emerald-500/5 text-emerald-800",
					},
					{
						title: "Volume outlook",
						value: "+8.6% forecast",
						body: "Submission volume is projected to grow over the next four weeks.",
						tone: "border-sky-500/30 bg-sky-500/5 text-sky-800",
					},
					{
						title: "Turnaround efficiency",
						value: `${trend[0]!.responseHours - latest.responseHours > 0 ? "-" : "+"}${Math.abs(Math.round((trend[0]!.responseHours - latest.responseHours) * 10) / 10)} hours`,
						body: "Average response time has improved while volume has increased.",
						tone: "border-violet-500/30 bg-violet-500/5 text-violet-800",
					},
				].map((item) => (
					<div
						key={item.title}
						className={cn("rounded-xl border p-4", item.tone)}
					>
						<p className="text-xs font-semibold">{item.title}</p>
						<p className="mt-2 text-xl font-semibold">{item.value}</p>
						<p className="mt-2 text-xs leading-relaxed opacity-80">
							{item.body}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
