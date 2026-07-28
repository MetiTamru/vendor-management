"use client";

import { useMemo, useState, type ReactNode } from "react";

import {
	AlertTriangle,
	ArrowDownLeft,
	ArrowUpRight,
	CheckCircle2,
	Copy,
	Download,
	FileText,
	Plus,
	ScrollText,
	XCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { vendorIdForRun } from "@/features/admin/features/vendors/vendor-integration-mock";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import {
	displayRunStatus,
	getFileRun,
	markFileRunReviewed,
	type FileRun,
	type ValidationIssue,
} from "../mock-data";

function downloadTextFile(filename: string, content: string, mime = "text/plain") {
	const blob = new Blob([content], { type: mime });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();
	URL.revokeObjectURL(url);
}

function RunStatusIcon({ status }: { status: FileRun["status"] }) {
	const label = displayRunStatus(status);
	if (label === "Success") {
		return (
			<span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
				<CheckCircle2 className="size-4 text-emerald-600" />
				Success
			</span>
		);
	}
	if (label === "Failed") {
		return (
			<span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700">
				<XCircle className="size-4 text-red-600" />
				Failed
			</span>
		);
	}
	if (label === "Warning") {
		return (
			<span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700">
				<AlertTriangle className="size-4 text-amber-500" />
				Warning
			</span>
		);
	}
	return (
		<span className="inline-flex items-center gap-1.5 text-sm font-medium capitalize text-muted-foreground">
			{label}
		</span>
	);
}

function MetaChip({
	label,
	value,
	icon,
}: {
	label: string;
	value: ReactNode;
	icon?: ReactNode;
}) {
	return (
		<div className="min-w-0">
			<p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
				{label}
			</p>
			<div className="mt-1 flex items-center gap-1.5 text-sm font-medium">
				{icon}
				<span className="truncate">{value}</span>
			</div>
		</div>
	);
}

export function FileRunDetailPage() {
	const params = useParams<{ runId: string }>();
	const router = useRouter();
	const selected = useMemo(() => getFileRun(params.runId), [params.runId]);
	const [selectedIssueId, setSelectedIssueId] = useState<string | null>(
		() => getFileRun(params.runId)?.issues[0]?.id ?? null
	);
	const [reviewed, setReviewed] = useState(selected?.reviewed ?? false);
	const [page, setPage] = useState(1);
	const pageSize = 5;

	const vendorId = selected ? vendorIdForRun(selected) : null;
	const selectHref = vendorId
		? `/admin/file-monitoring/select?vendor=${vendorId}`
		: "/admin/file-monitoring/select";

	const selectedIssue = useMemo(
		() =>
			selected?.issues.find((i) => i.id === selectedIssueId) ??
			selected?.issues[0] ??
			null,
		[selected, selectedIssueId]
	);

	const pageCount = Math.max(
		1,
		Math.ceil((selected?.issues.length ?? 0) / pageSize)
	);
	const pageIssues =
		selected?.issues.slice((page - 1) * pageSize, page * pageSize) ?? [];

	function selectIssue(issue: ValidationIssue) {
		setSelectedIssueId(issue.id);
		requestAnimationFrame(() => {
			document
				.getElementById("investigation-preview")
				?.scrollIntoView({ behavior: "smooth", block: "start" });
		});
	}

	function copyGuid() {
		if (!selected) return;
		void navigator.clipboard.writeText(selected.correlationId);
		toast.success("Run GUID copied");
	}

	if (!selected) {
		return (
			<div className="space-y-4">
				<nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-primary">
					<Link href="/admin/file-monitoring" className="hover:underline">
						File Monitoring
					</Link>
					<span className="text-muted-foreground">&gt;</span>
					<Link href="/admin/file-monitoring/select" className="hover:underline">
						File Runs
					</Link>
					<span className="text-muted-foreground">&gt;</span>
					<span className="text-foreground">File Run Details</span>
				</nav>
				<div className="rounded-xl border border-border/50 bg-card/70 p-10 text-center">
					<p className="text-lg font-semibold">File run not found</p>
					<Button asChild className="mt-5">
						<Link href="/admin/file-monitoring/select">
							Select a vendor or failed run
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="min-w-0 flex-1">
					<nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-primary">
						<Link href="/admin/file-monitoring" className="hover:underline">
							File Monitoring
						</Link>
						<span className="text-muted-foreground">&gt;</span>
						<Link href={selectHref} className="hover:underline">
							File Runs
						</Link>
						<span className="text-muted-foreground">&gt;</span>
						<span className="text-foreground">File Run Details</span>
					</nav>
					<div className="mt-2">
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							File Run Details
						</h1>
						<p className="mt-0.5 max-w-xl text-sm text-muted-foreground">
							View processing, validation results, and investigation details.
						</p>
					</div>
				</div>
				<Button variant="outline" size="sm" className="h-9" asChild>
					<Link href={selectHref}>
						<Plus className="mr-1.5 size-3.5" />
						Back to File Runs
					</Link>
				</Button>
			</div>

			{/* Metadata ribbon */}
			<div className="grid gap-4 rounded-xl border border-border/50 bg-card p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
				<MetaChip
					label="File Type"
					value={selected.fileType}
					icon={<FileText className="size-3.5 text-primary" />}
				/>
				<MetaChip
					label="File Name"
					value={
						<span className="font-mono text-xs">{selected.fileName ?? "—"}</span>
					}
				/>
				<MetaChip
					label="Run GUID"
					value={
						<button
							type="button"
							onClick={copyGuid}
							className="inline-flex max-w-full items-center gap-1 font-mono text-xs hover:text-primary"
						>
							<span className="truncate">{selected.correlationId}</span>
							<Copy className="size-3 shrink-0" />
						</button>
					}
				/>
				<MetaChip label="Vendor" value={selected.vendor} />
				<MetaChip
					label="Run Date/Time"
					value={selected.startedAt ?? selected.expectedAt}
				/>
				<MetaChip
					label="Status"
					value={<RunStatusIcon status={selected.status} />}
				/>
			</div>

			{/* Overview + Actions */}
			<div className="grid gap-4 lg:grid-cols-3">
				<Card className="gap-2 border-border/50 bg-card py-4 lg:col-span-2">
					<CardHeader className="px-4 pb-1 pt-0">
						<CardTitle className="text-base">Overview</CardTitle>
					</CardHeader>
					<CardContent className="px-4">
						<div className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
							<div className="space-y-3 text-sm">
								<div className="flex justify-between gap-3 border-b border-border/40 pb-2">
									<span className="text-muted-foreground">Direction</span>
									<span className="inline-flex items-center gap-1 font-medium">
										{selected.direction === "inbound" ? (
											<>
												<ArrowDownLeft className="size-3.5 text-sky-600" />
												Incoming
											</>
										) : (
											<>
												<ArrowUpRight className="size-3.5 text-violet-600" />
												Outgoing
											</>
										)}
									</span>
								</div>
								<div className="flex justify-between gap-3 border-b border-border/40 pb-2">
									<span className="text-muted-foreground">Frequency</span>
									<span className="font-medium">{selected.frequency}</span>
								</div>
								<div className="flex justify-between gap-3 border-b border-border/40 pb-2">
									<span className="text-muted-foreground">Records Received</span>
									<span className="font-medium tabular-nums">
										{selected.records?.toLocaleString() ?? "—"}
									</span>
								</div>
								<div className="flex justify-between gap-3 border-b border-border/40 pb-2">
									<span className="text-muted-foreground">Records Loaded</span>
									<span className="font-medium tabular-nums">
										{selected.recordsLoaded?.toLocaleString() ?? "—"}
									</span>
								</div>
								<div className="flex justify-between gap-3">
									<span className="text-muted-foreground">Errors</span>
									<span
										className={cn(
											"font-semibold tabular-nums",
											selected.errorCount > 0 && "text-red-700"
										)}
									>
										{selected.errorCount}
									</span>
								</div>
							</div>
							<div className="space-y-3 text-sm">
								<div className="flex justify-between gap-3 border-b border-border/40 pb-2">
									<span className="text-muted-foreground">Warnings</span>
									<span
										className={cn(
											"font-semibold tabular-nums",
											selected.warningCount > 0 && "text-red-700"
										)}
									>
										{selected.warningCount}
									</span>
								</div>
								<div className="flex justify-between gap-3 border-b border-border/40 pb-2">
									<span className="text-muted-foreground">Duration</span>
									<span className="font-medium tabular-nums">
										{selected.duration ?? "—"}
									</span>
								</div>
								<div className="flex justify-between gap-3">
									<span className="text-muted-foreground">Process Date/Time</span>
									<span className="font-medium">
										{selected.startedAt ?? selected.expectedAt}
									</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="gap-2 border-border/50 bg-card py-4">
					<CardHeader className="px-4 pb-1 pt-0">
						<CardTitle className="text-base">Actions</CardTitle>
					</CardHeader>
					<CardContent className="space-y-1 px-4">
						{[
							{
								label: "Download Original File",
								icon: Download,
								onClick: () => {
									if (!selected.fileName) return;
									const lines = [
										`# Original file: ${selected.fileName}`,
										`# Vendor: ${selected.vendor}`,
										`# Type: ${selected.fileType}`,
										`# Run: ${selected.runId}`,
										`# Correlation: ${selected.correlationId}`,
										"",
										...selected.issues.map(
											(issue, i) =>
												`${i + 1}. [${issue.severity}] ${issue.code} — ${issue.message}`
										),
									];
									downloadTextFile(
										selected.fileName.replace(/\.[^.]+$/, "") + ".txt",
										lines.join("\n")
									);
									toast.success("Original file download started.");
								},
								disabled: !selected.fileName,
							},
							{
								label: "Download Log",
								icon: ScrollText,
								href: `/admin/processing-logs?run=${selected.id}`,
							},
							{
								label: "Investigate Selected Error",
								icon: AlertTriangle,
								href: selectedIssue
									? `/admin/file-monitoring/${selected.id}/investigate/${selectedIssue.id}`
									: undefined,
								disabled: !selectedIssue,
								onClick: !selectedIssue
									? () => toast.message("Select a validation error first.")
									: undefined,
							},
							{
								label: "Export Error Details",
								icon: Download,
								onClick: () => {
									const header =
										"code,severity,message,field,record,line";
									const rows = selected.issues.map((issue) =>
										[
											issue.code,
											issue.severity,
											`"${issue.message.replace(/"/g, '""')}"`,
											issue.field ?? "",
											issue.record ?? "",
											issue.line ?? "",
										].join(",")
									);
									downloadTextFile(
										`${selected.runId}-errors.csv`,
										[header, ...rows].join("\n"),
										"text/csv"
									);
									toast.success("Error details exported.");
								},
								disabled:
									selected.errorCount === 0 && selected.warningCount === 0,
							},
							{
								label: "Export Summary",
								icon: Download,
								onClick: () => {
									const summary = [
										`Run ID: ${selected.runId}`,
										`Vendor: ${selected.vendor}`,
										`File: ${selected.fileName ?? "—"}`,
										`Type: ${selected.fileType}`,
										`Status: ${displayRunStatus(selected.status)}`,
										`Records: ${selected.records ?? "—"}`,
										`Errors: ${selected.errorCount}`,
										`Warnings: ${selected.warningCount}`,
										`Duration: ${selected.duration ?? "—"}`,
										`Received: ${selected.receivedAt ?? "—"}`,
										`Completed: ${selected.completedAt ?? "—"}`,
										`Correlation: ${selected.correlationId}`,
									].join("\n");
									downloadTextFile(
										`${selected.runId}-summary.txt`,
										summary
									);
									toast.success("Summary exported.");
								},
							},
							{
								label: reviewed ? "Reviewed" : "Mark as Reviewed",
								icon: CheckCircle2,
								onClick: () => {
									markFileRunReviewed(selected.id, true);
									setReviewed(true);
									toast.success("File run marked as reviewed.");
								},
								disabled: reviewed,
							},
						].map((action) => {
							const Icon = action.icon;
							const actionClass =
								"h-10 w-full justify-start gap-2 bg-primary/5 font-medium text-primary hover:bg-primary/10 hover:text-primary";
							if (action.href) {
								return (
									<Button
										key={action.label}
										variant="ghost"
										className={actionClass}
										asChild
									>
										<Link href={action.href}>
											<Icon className="size-4 text-primary" />
											{action.label}
										</Link>
									</Button>
								);
							}
							return (
								<Button
									key={action.label}
									variant="ghost"
									className={actionClass}
									disabled={action.disabled}
									onClick={action.onClick}
								>
									<Icon className="size-4 text-primary" />
									{action.label}
								</Button>
							);
						})}
					</CardContent>
				</Card>
			</div>

			{/* Validation Results */}
			<Card className="gap-2 border-border/50 bg-card py-4">
				<CardHeader className="px-4 pb-1 pt-0">
					<CardTitle className="text-base">
						Validation Results{" "}
						{selected.issues.length > 0 && (
							<span className="font-normal text-muted-foreground">
								(Showing first {Math.min(pageSize, selected.issues.length)} of{" "}
								{selected.issues.length} errors)
							</span>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent className="px-0 pb-0">
					{selected.issues.length === 0 ? (
						<div className="flex items-center gap-3 border-t border-border/50 px-4 py-6 text-sm text-emerald-800 sm:px-6">
							<CheckCircle2 className="size-4 text-emerald-600" />
							No validation errors or warnings for this run.
						</div>
					) : (
						<>
							<div className="overflow-x-auto border-t border-border/50">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="pl-4 sm:pl-6">Line #</TableHead>
											<TableHead>Member ID</TableHead>
											<TableHead>Field Name</TableHead>
											<TableHead>Error Code</TableHead>
											<TableHead>Error Description</TableHead>
											<TableHead>Severity</TableHead>
											<TableHead className="pr-4 text-right sm:pr-6">
												Action
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{pageIssues.map((issue) => {
											const isSelected =
												(selectedIssueId ?? selected.issues[0]?.id) ===
												issue.id;
											return (
												<TableRow
													key={issue.id}
													className={cn(
														"cursor-pointer hover:bg-muted/30",
														isSelected && "bg-primary/[0.04]"
													)}
													onClick={() => selectIssue(issue)}
													onDoubleClick={() =>
														router.push(
															`/admin/file-monitoring/${selected.id}/investigate/${issue.id}`
														)
													}
												>
													<TableCell className="pl-4 tabular-nums sm:pl-6">
														{issue.line ?? "—"}
													</TableCell>
													<TableCell className="font-mono text-xs">
														{issue.memberId ?? "—"}
													</TableCell>
													<TableCell>{issue.field ?? "—"}</TableCell>
													<TableCell className="font-mono text-xs font-semibold">
														{issue.code}
													</TableCell>
													<TableCell className="max-w-[280px] text-sm text-muted-foreground">
														{issue.message}
													</TableCell>
													<TableCell>
														{issue.severity === "error" ? (
															<span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700">
																<XCircle className="size-3.5 text-red-600" />
																Error
															</span>
														) : issue.severity === "warning" ? (
															<span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
																<AlertTriangle className="size-3.5 text-amber-500" />
																Warning
															</span>
														) : (
															<span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-700">
																<CheckCircle2 className="size-3.5 text-sky-600" />
																Info
															</span>
														)}
													</TableCell>
													<TableCell
														className="pr-4 text-right sm:pr-6"
														onClick={(e) => e.stopPropagation()}
													>
														<Button
															variant="link"
															className="h-auto p-0 text-primary"
															asChild
														>
															<Link
																href={`/admin/file-monitoring/${selected.id}/investigate/${issue.id}`}
															>
																Investigate
															</Link>
														</Button>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
							<div className="flex items-center justify-end gap-1 border-t border-border/50 px-4 py-3">
								<Button
									variant="outline"
									size="sm"
									className="h-8"
									disabled={page <= 1}
									onClick={() => setPage((p) => p - 1)}
								>
									‹
								</Button>
								{Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
									<Button
										key={p}
										variant={p === page ? "default" : "outline"}
										size="sm"
										className="size-8 p-0"
										onClick={() => setPage(p)}
									>
										{p}
									</Button>
								))}
								<Button
									variant="outline"
									size="sm"
									className="h-8"
									disabled={page >= pageCount}
									onClick={() => setPage((p) => p + 1)}
								>
									›
								</Button>
							</div>
						</>
					)}
				</CardContent>
			</Card>

			{/* Investigation Details */}
			<div id="investigation-preview">
				{selectedIssue ? (
					<Card className="gap-2 border-border/50 bg-card py-4">
						<CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0 px-4 pb-1 pt-0">
							<CardTitle className="text-base">
								Investigation Details (For selected error)
							</CardTitle>
							<Button size="sm" asChild>
								<Link
									href={`/admin/file-monitoring/${selected.id}/investigate/${selectedIssue.id}`}
								>
									Open Validation Investigation
									<ArrowUpRight className="ml-1.5 size-3.5" />
								</Link>
							</Button>
						</CardHeader>
						<CardContent className="px-4">
							<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
								<div>
									<p className="text-sm font-semibold">Received Value</p>
									<p className="mt-2 font-mono text-sm font-semibold text-foreground">
										{selectedIssue.receivedValue ?? "—"}
									</p>
								</div>
								<div>
									<p className="text-sm font-semibold">Expected Value</p>
									<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
										{selectedIssue.expectedValue ?? "—"}
									</p>
								</div>
								<div>
									<p className="text-sm font-semibold">Validation Rule</p>
									<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
										{selectedIssue.validationRule ?? "—"}
									</p>
								</div>
								<div>
									<p className="text-sm font-semibold">Recommended Resolution</p>
									<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
										{selectedIssue.recommendedResolution ?? "—"}
									</p>
								</div>
								<div>
									<p className="text-sm font-semibold">Related Information</p>
									<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
										{selectedIssue.relatedInformation ?? "—"}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				) : null}
			</div>
		</div>
	);
}
