"use client";

import { useMemo, useState } from "react";

import {
	AlertTriangle,
	Download,
	Eye,
	FileWarning,
	Search,
	Settings2,
	ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { cn } from "@/lib/utils";

type CompletenessStatus =
	| "Complete"
	| "Potential Gap"
	| "Missing Submission"
	| "Investigating";

const ROWS: Array<{
	vendor: string;
	fileType: string;
	frequency: string;
	expected: number;
	received: number;
	status: CompletenessStatus;
	lastSubmission: string;
}> = [
	{
		vendor: "UST Healthcare",
		fileType: "837 Professional",
		frequency: "Daily",
		expected: 12450,
		received: 12120,
		status: "Complete",
		lastSubmission: "07/28/2026 09:14 AM",
	},
	{
		vendor: "Avesis",
		fileType: "837 Institutional",
		frequency: "Daily",
		expected: 8700,
		received: 4250,
		status: "Missing Submission",
		lastSubmission: "07/21/2026 10:02 AM",
	},
	{
		vendor: "Change Healthcare",
		fileType: "837 Professional",
		frequency: "Daily",
		expected: 7600,
		received: 7010,
		status: "Potential Gap",
		lastSubmission: "07/28/2026 08:51 AM",
	},
	{
		vendor: "Delta Dental",
		fileType: "837 Dental",
		frequency: "Daily",
		expected: 3200,
		received: 1100,
		status: "Missing Submission",
		lastSubmission: "07/27/2026 10:02 AM",
	},
	{
		vendor: "Gainwell Medicaid",
		fileType: "837 Professional",
		frequency: "Weekly",
		expected: 15800,
		received: 15560,
		status: "Complete",
		lastSubmission: "07/28/2026 10:02 AM",
	},
	{
		vendor: "Cerry Exchange",
		fileType: "837 Professional",
		frequency: "Weekly",
		expected: 6300,
		received: 5180,
		status: "Potential Gap",
		lastSubmission: "07/28/2026 09:40 AM",
	},
];

function statusTone(status: CompletenessStatus) {
	return {
		Complete: "bg-emerald-100 text-emerald-800",
		"Potential Gap": "bg-amber-100 text-amber-900",
		"Missing Submission": "bg-red-100 text-red-800",
		Investigating: "bg-violet-100 text-violet-800",
	}[status];
}

export function EncounterCompletenessPage() {
	const [vendor, setVendor] = useState("all");
	const [fileType, setFileType] = useState("all");
	const [status, setStatus] = useState("all");
	const [selectedVendor, setSelectedVendor] = useState(ROWS[0]!.vendor);
	const [search, setSearch] = useState("");

	const visibleRows = useMemo(
		() =>
			ROWS.filter((row) => {
				return (
					(vendor === "all" || row.vendor === vendor) &&
					(fileType === "all" || row.fileType === fileType) &&
					(status === "all" || row.status === status) &&
					row.vendor.toLowerCase().includes(search.toLowerCase())
				);
			}),
		[fileType, search, status, vendor]
	);
	const selected =
		ROWS.find((row) => row.vendor === selectedVendor) ?? ROWS[0]!;
	const totalVendors = ROWS.length + 6;
	const averageCompleteness = Math.round(
		(selected.received / selected.expected) * 100
	);

	return (
		<div className="space-y-4">
			<ClaimPageHeader
				title="Encounter Completeness"
				description="Review vendor submissions to ensure we are receiving the complete encounter data expected."
				actions={
					<>
						<Button variant="outline" size="sm">
							<Download className="mr-1.5 size-3.5" />
							Export
						</Button>
						<Button variant="outline" size="sm">
							<Settings2 className="mr-1.5 size-3.5" />
							Configure Alerts
						</Button>
					</>
				}
			/>

			<div className="grid gap-2 md:grid-cols-2 xl:grid-cols-7">
				<div className="space-y-1">
					<label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
						Date Range
					</label>
					<Input value="07/01/2026 - 07/31/2026" readOnly className="h-9" />
				</div>
				<div className="space-y-1">
					<label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
						Vendor
					</label>
					<Select value={vendor} onValueChange={setVendor}>
						<SelectTrigger className="h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Vendors</SelectItem>
							{ROWS.map((row) => (
								<SelectItem key={row.vendor} value={row.vendor}>
									{row.vendor}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1">
					<label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
						File Type
					</label>
					<Select value={fileType} onValueChange={setFileType}>
						<SelectTrigger className="h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All File Types</SelectItem>
							{Array.from(new Set(ROWS.map((row) => row.fileType))).map(
								(type) => (
									<SelectItem key={type} value={type}>
										{type}
									</SelectItem>
								)
							)}
						</SelectContent>
					</Select>
				</div>
				{["Encounter Type", "Submission Frequency"].map((label) => (
					<div key={label} className="space-y-1">
						<label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
							{label}
						</label>
						<Select defaultValue="all">
							<SelectTrigger className="h-9">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All {label}s</SelectItem>
							</SelectContent>
						</Select>
					</div>
				))}
				<div className="space-y-1">
					<label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
						Status
					</label>
					<Select value={status} onValueChange={setStatus}>
						<SelectTrigger className="h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Statuses</SelectItem>
							{[
								"Complete",
								"Potential Gap",
								"Missing Submission",
								"Investigating",
							].map((value) => (
								<SelectItem key={value} value={value}>
									{value}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-end gap-2">
					<Button
						className="h-9 flex-1"
						onClick={() => toast.success("Completeness filters applied")}
					>
						Apply Filters
					</Button>
					<Button
						variant="ghost"
						className="h-9"
						onClick={() => {
							setVendor("all");
							setFileType("all");
							setStatus("all");
							setSearch("");
						}}
					>
						Clear
					</Button>
				</div>
			</div>

			<ClaimKpiGrid
				columns={5}
				items={[
					{
						label: "Total Vendors",
						value: String(totalVendors),
						hint: "In scope",
						icon: ShieldCheck,
						tone: "bg-slate-500/10 text-slate-700",
					},
					{
						label: "Complete",
						value: "6 (50%)",
						hint: "Within expected range",
						icon: ShieldCheck,
						tone: "bg-emerald-500/10 text-emerald-700",
					},
					{
						label: "Potential Gap",
						value: "3 (25%)",
						hint: "Needs review",
						icon: AlertTriangle,
						tone: "bg-amber-500/10 text-amber-700",
					},
					{
						label: "Missing Submission",
						value: "2 (17%)",
						hint: "Follow up required",
						icon: FileWarning,
						tone: "bg-red-500/10 text-red-700",
					},
					{
						label: "Investigating",
						value: "1 (8%)",
						hint: "Assigned for review",
						icon: Search,
						tone: "bg-violet-500/10 text-violet-700",
					},
				]}
			/>

			<div className="grid gap-3 xl:grid-cols-[minmax(0,2.15fr)_minmax(280px,0.65fr)]">
				<Card className="min-w-0 gap-0 py-0">
					<CardHeader className="border-b border-border/60 px-4 py-3">
						<CardTitle className="text-sm font-medium">
							Vendor Completeness Review
						</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<div className="group">
							<ScrollArea
								className="w-full"
								viewportClassName="[&>div]:!block [&>div]:w-max [&>div]:min-w-full"
								scrollbarClassName="opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 data-[state=visible]:opacity-100"
								thumbClassName="bg-foreground/20 hover:bg-foreground/30"
							>
								<div className="min-w-[1060px]">
									<Table containerClassName="overflow-visible">
										<TableHeader>
											<TableRow>
												<TableHead>Vendor / Trading Partner</TableHead>
												<TableHead>File Type</TableHead>
												<TableHead>Frequency</TableHead>
												<TableHead className="text-right">
													Expected Encounters
												</TableHead>
												<TableHead className="text-right">
													Received Encounters
												</TableHead>
												<TableHead>Completeness</TableHead>
												<TableHead className="text-right">Variance</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Last Submission</TableHead>
												<TableHead className="pr-3">Action</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{visibleRows.map((row) => {
												const pct = Math.round(
													(row.received / row.expected) * 100
												);
												const variance = row.received - row.expected;
												return (
													<TableRow
														key={row.vendor}
														className={cn(
															"cursor-pointer",
															selectedVendor === row.vendor && "bg-primary/5"
														)}
														onClick={() => setSelectedVendor(row.vendor)}
													>
														<TableCell className="font-medium">
															{row.vendor}
														</TableCell>
														<TableCell className="text-xs">
															{row.fileType}
														</TableCell>
														<TableCell className="text-xs">
															{row.frequency}
														</TableCell>
														<TableCell className="text-right text-xs tabular-nums">
															{row.expected.toLocaleString()}
														</TableCell>
														<TableCell className="text-right text-xs tabular-nums">
															{row.received.toLocaleString()}
														</TableCell>
														<TableCell>
															<div className="flex items-center gap-2">
																<span
																	className={cn(
																		"size-6 rounded-full border-[3px]",
																		pct >= 95
																			? "border-emerald-500"
																			: pct >= 70
																				? "border-amber-500"
																				: "border-red-500"
																	)}
																/>
																<span className="text-xs font-medium">
																	{pct}%
																</span>
															</div>
														</TableCell>
														<TableCell
															className={cn(
																"text-right text-xs tabular-nums",
																variance < 0 && "text-red-700"
															)}
														>
															{variance > 0 ? "+" : ""}
															{variance.toLocaleString()}
														</TableCell>
														<TableCell>
															<span
																className={cn(
																	"rounded-full px-2 py-0.5 text-[10px] font-medium",
																	statusTone(row.status)
																)}
															>
																{row.status}
															</span>
														</TableCell>
														<TableCell className="text-[11px] text-muted-foreground">
															{row.lastSubmission}
														</TableCell>
														<TableCell className="pr-3">
															<Button
																variant="ghost"
																size="icon"
																className="size-8"
																aria-label={`View ${row.vendor}`}
															>
																<Eye className="size-4" />
															</Button>
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</div>
							</ScrollArea>
						</div>
						<div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
							<span>
								Showing 1 to {visibleRows.length} of {totalVendors} results
							</span>
							<span>
								‹ &nbsp; <strong className="rounded border px-2 py-1">1</strong>{" "}
								&nbsp; 2 &nbsp; ›
							</span>
						</div>
					</CardContent>
				</Card>

				<Card className="gap-0 py-0">
					<CardHeader className="flex flex-row items-start justify-between border-b border-border/60 px-4 py-3">
						<div>
							<CardTitle className="text-sm font-semibold">
								{selected.vendor} – {selected.fileType}
							</CardTitle>
							<div className="mt-3 flex gap-5 text-xs">
								<span className="border-b-2 border-primary pb-2 text-primary">
									Summary
								</span>
								<span className="text-muted-foreground">Details</span>
								<span className="text-muted-foreground">Files</span>
								<span className="text-muted-foreground">Trends</span>
							</div>
						</div>
						<button
							type="button"
							onClick={() => setSelectedVendor("")}
							className="text-muted-foreground"
						>
							×
						</button>
					</CardHeader>
					<CardContent className="space-y-5 p-4">
						<div className="grid grid-cols-2 gap-3">
							<div className="rounded-lg border p-3">
								<p className="text-xs text-muted-foreground">Completeness</p>
								<p className="mt-2 text-2xl font-semibold text-emerald-600">
									{averageCompleteness}%
								</p>
								<p className="text-xs text-emerald-600">-3% variance</p>
							</div>
							<div className="rounded-lg border p-3">
								<p className="text-xs text-muted-foreground">
									Received vs Expected
								</p>
								<p className="mt-2 text-lg font-semibold">
									{selected.received.toLocaleString()} /{" "}
									{selected.expected.toLocaleString()}
								</p>
								<p className="text-xs text-muted-foreground">Encounters</p>
							</div>
						</div>
						<div>
							<h3 className="text-sm font-semibold">Why this status?</h3>
							<p className="mt-2 text-xs text-muted-foreground">
								Encounter volume is within the expected range.
							</p>
						</div>
						<DetailTable
							rows={[
								["Expected Encounters", selected.expected.toLocaleString()],
								["Received Encounters", selected.received.toLocaleString()],
								[
									"Variance",
									`${(selected.received - selected.expected).toLocaleString()} (${100 - averageCompleteness}%)`,
								],
								["Submission Frequency", selected.frequency],
								["Last Submission", selected.lastSubmission],
								["Encounter Type", selected.fileType],
								["Members Impacted", "—"],
								["Data Source", "Historical average (last 8 weeks)"],
							]}
						/>
						<div>
							<h3 className="text-sm font-semibold">Recommended Action</h3>
							<p className="mt-2 text-xs text-emerald-700">
								● No action required.
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							className="text-xs"
							onClick={() => toast.message("Vendor details opened")}
						>
							View Vendor Details
						</Button>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-3 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
				<Card className="gap-0 py-0">
					<CardHeader className="border-b border-border/60 px-4 py-3">
						<CardTitle className="text-sm font-medium">
							Recent Missing / Incomplete Submissions
						</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Vendor</TableHead>
									<TableHead>File Type</TableHead>
									<TableHead>Missing For</TableHead>
									<TableHead className="text-right">
										Expected Encounters
									</TableHead>
									<TableHead>Last Received</TableHead>
									<TableHead>Issue Detected</TableHead>
									<TableHead className="pr-3">Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{ROWS.filter((row) => row.status !== "Complete")
									.slice(0, 2)
									.map((row) => (
										<TableRow key={row.vendor}>
											<TableCell>{row.vendor}</TableCell>
											<TableCell>{row.fileType}</TableCell>
											<TableCell className="text-red-700">
												07/15/2026 – 07/21/2026
											</TableCell>
											<TableCell className="text-right">
												{row.expected.toLocaleString()}
											</TableCell>
											<TableCell>{row.lastSubmission}</TableCell>
											<TableCell>No file received</TableCell>
											<TableCell className="pr-3">
												<Button
													variant="outline"
													size="sm"
													className="h-7 text-xs"
												>
													Investigate
												</Button>
											</TableCell>
										</TableRow>
									))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
				<Card className="gap-0 py-0">
					<CardHeader className="border-b border-border/60 px-4 py-3">
						<CardTitle className="text-sm font-medium">
							What affects completeness?
						</CardTitle>
					</CardHeader>
					<CardContent className="p-4">
						<ul className="list-disc space-y-2 pl-4 text-xs text-muted-foreground">
							<li>Missing or late vendor file submissions</li>
							<li>Significant drop in expected encounter volume</li>
							<li>Missing encounter types or service categories</li>
							<li>Data quality issues causing records to be excluded</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function DetailTable({ rows }: { rows: Array<[string, string]> }) {
	return (
		<dl className="space-y-2 text-xs">
			{rows.map(([label, value]) => (
				<div key={label} className="flex justify-between gap-3">
					<dt className="text-muted-foreground">{label}</dt>
					<dd className="text-right font-medium">{value}</dd>
				</div>
			))}
		</dl>
	);
}
