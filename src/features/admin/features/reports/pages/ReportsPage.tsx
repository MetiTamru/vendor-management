"use client";

import { useMemo } from "react";

import { Download, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInvoicesList, useVendorsList } from "@/features/shared/vms/queries";
import { formatMoney } from "@/features/shared/vms/utils";
import { cn } from "@/lib/utils";

function csvCell(value: string | number) {
	return `"${String(value).replaceAll("\"", "\"\"")}"`;
}

export function ReportsPage() {
	const { vendors, isLoading: vendorsLoading } = useVendorsList();
	const { invoices, isLoading: invoicesLoading } = useInvoicesList();
	const data = useMemo(
		() =>
			vendors
				.map((vendor) => {
					const vendorInvoices = invoices.filter(
						(invoice) => invoice.vendorId === vendor.id
					);
					return {
						vendor: vendor.tradeName || vendor.legalName,
						legalName: vendor.legalName,
						status: vendor.status,
						invoiceCount: vendorInvoices.length,
						spend: vendorInvoices.reduce(
							(sum, invoice) => sum + invoice.amount,
							0
						),
					};
				})
				.sort((a, b) => b.spend - a.spend),
		[vendors, invoices]
	);

	function exportCsv() {
		const rows = [
			["Vendor", "Status", "Invoice count", "Spend"],
			...data.map((row) => [
				row.legalName,
				row.status,
				row.invoiceCount,
				row.spend,
			]),
		];
		const blob = new Blob(
			[rows.map((row) => row.map(csvCell).join(",")).join("\n")],
			{ type: "text/csv;charset=utf-8" }
		);
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `vendor-spend-${new Date().toISOString().slice(0, 10)}.csv`;
		link.click();
		URL.revokeObjectURL(url);
		toast.success("CSV report downloaded.");
	}

	const loading = vendorsLoading || invoicesLoading;
	const total = data.reduce((sum, row) => sum + row.spend, 0);
	const vendorStatus = useMemo(() => {
		const counts = new Map<string, number>();
		for (const vendor of vendors) {
			counts.set(vendor.status, (counts.get(vendor.status) ?? 0) + 1);
		}
		return Array.from(counts.entries()).map(([name, value], index) => ({
			name: name.replace(/_/g, " "),
			value,
			color: ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#94a3b8"][index] ?? "#94a3b8",
		}));
	}, [vendors]);
	const spendTrend = [
		{ month: "Feb", spend: 42000, invoices: 18 },
		{ month: "Mar", spend: 51000, invoices: 22 },
		{ month: "Apr", spend: 48000, invoices: 20 },
		{ month: "May", spend: 61000, invoices: 27 },
		{ month: "Jun", spend: 58000, invoices: 24 },
		{ month: "Jul", spend: 67000, invoices: 29 },
	];
	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Reports</h1>
					<p className="mt-0.5 max-w-xl text-sm text-muted-foreground">
						Analyze spend, invoice flow, and vendor performance trends.
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						size="sm"
						className="h-9"
						onClick={exportCsv}
						disabled={loading || data.length === 0}
					>
						<Download className="mr-2 size-4" /> Export CSV
					</Button>
				</div>
			</div>

			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{[
					{
						label: "Total spend",
						value: formatMoney(total),
						hint: "Across invoiced activity",
						tone: "text-primary bg-primary/10",
					},
					{
						label: "Invoices",
						value: invoices.length,
						hint: "Current invoice count",
						tone: "text-sky-700 bg-sky-500/10",
					},
					{
						label: "Vendors represented",
						value: data.filter((row) => row.spend > 0).length,
						hint: "Contributing spend",
						tone: "text-emerald-700 bg-emerald-500/10",
					},
					{
						label: "Avg. spend / vendor",
						value: formatMoney(
							data.length ? Math.round(total / Math.max(data.length, 1)) : 0
						),
						hint: "Portfolio average",
						tone: "text-violet-700 bg-violet-500/10",
					},
				].map((item) => (
					<div
						key={item.label}
						className="rounded-xl border border-border/50 bg-card/70 p-4"
					>
						<div className="flex items-start justify-between gap-3">
							<div>
								<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
									{item.label}
								</p>
								<p className="mt-2 text-2xl font-semibold tracking-tight">
									{item.value}
								</p>
								<p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
							</div>
							<div
								className={cn(
									"flex size-10 items-center justify-center rounded-lg",
									item.tone
								)}
							>
								<TrendingUp className="size-4" />
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="grid gap-4 xl:grid-cols-5">
				<Card className="min-w-0 gap-2 bg-card/70 py-4 xl:col-span-3">
					<CardHeader className="px-4 pb-1 pt-0">
						<CardTitle className="text-base">Spend trend</CardTitle>
					</CardHeader>
					<CardContent className="h-80 px-4 pt-2">
						{loading ? (
							<Skeleton className="h-full w-full" />
						) : (
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={spendTrend}>
									<defs>
										<linearGradient id="reports-spend" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="#13446c" stopOpacity={0.35} />
											<stop offset="95%" stopColor="#13446c" stopOpacity={0.03} />
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
									<XAxis dataKey="month" tickLine={false} axisLine={false} />
									<YAxis tickLine={false} axisLine={false} />
									<Tooltip formatter={(value) => formatMoney(Number(value))} />
									<Area
										type="monotone"
										dataKey="spend"
										stroke="#13446c"
										strokeWidth={2.5}
										fill="url(#reports-spend)"
									/>
								</AreaChart>
							</ResponsiveContainer>
						)}
					</CardContent>
				</Card>

				<Card className="min-w-0 gap-2 bg-card/70 py-4 xl:col-span-2">
					<CardHeader className="px-4 pb-1 pt-0">
						<CardTitle className="flex items-center gap-2 text-base">
							<PieChartIcon className="size-4 text-primary" />
							Vendor status mix
						</CardTitle>
					</CardHeader>
					<CardContent className="px-4 pt-2">
						{loading ? (
							<Skeleton className="h-64 w-full" />
						) : (
							<div className="grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)]">
								<div className="relative h-48">
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={vendorStatus}
												dataKey="value"
												nameKey="name"
												innerRadius={44}
												outerRadius={66}
												paddingAngle={2}
											>
												{vendorStatus.map((entry) => (
													<Cell key={entry.name} fill={entry.color} />
												))}
											</Pie>
											<Tooltip />
										</PieChart>
									</ResponsiveContainer>
								</div>
								<div className="space-y-2">
									{vendorStatus.map((entry) => (
										<div
											key={entry.name}
											className="flex items-center justify-between border-b border-border/40 py-2 last:border-0"
										>
											<div className="flex items-center gap-2">
												<span
													className="size-2.5 rounded-full"
													style={{ backgroundColor: entry.color }}
												/>
												<span className="text-sm font-medium capitalize">{entry.name}</span>
											</div>
											<span className="text-sm font-semibold tabular-nums">
												{entry.value}
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<Card className="bg-card/70">
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Top vendor spend</CardTitle>
				</CardHeader>
				<CardContent className="px-0 pb-0">
					<div className="border-t border-border/50">
						<table className="w-full text-sm">
							<thead>
								<tr className="bg-primary/[0.04] text-left">
									<th className="px-6 py-3 font-semibold text-primary">Vendor</th>
									<th className="px-4 py-3 font-semibold text-primary">Status</th>
									<th className="px-4 py-3 font-semibold text-primary">Invoices</th>
									<th className="px-6 py-3 text-right font-semibold text-primary">Spend</th>
								</tr>
							</thead>
							<tbody>
								{data.slice(0, 8).map((row) => (
									<tr key={row.vendor} className="border-t border-border/40">
										<td className="px-6 py-3 font-medium">{row.vendor}</td>
										<td className="px-4 py-3 capitalize text-muted-foreground">
											{row.status.replace(/_/g, " ")}
										</td>
										<td className="px-4 py-3 tabular-nums">{row.invoiceCount}</td>
										<td className="px-6 py-3 text-right font-semibold tabular-nums">
											{formatMoney(row.spend)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
