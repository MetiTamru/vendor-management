"use client";

import { type ReactNode } from "react";

import {
	ArrowLeft,
	ArrowUp,
	Bookmark,
	CalendarDays,
	Check,
	ChevronDown,
	FileText,
	StickyNote,
	User,
	UserRound,
	X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	CMS_EDGE_TABLE_CLASS,
	CMS_EDGE_TABLE_CONTAINER,
	CMS_EDGE_TABLE_LINK_CLASS,
	CmsEdgeTableScroll,
} from "@/features/admin/features/claim-encounter/cms-edge/CmsEdgeShared";
import {
	RA_STACK,
	RA_TABLE_CELL,
	RA_TABLE_HEAD,
	RaStatusPill,
} from "@/features/admin/features/claim-encounter/risk-adjustment/RiskAdjustmentShared";
import type { MemberOpportunityDetail } from "@/features/admin/features/claim-encounter/risk-adjustment/mock-data";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function DetailCard({
	title,
	children,
	className,
}: {
	title: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm",
				className
			)}
		>
			<div className="border-b border-border/50 px-3 py-2">
				<h3 className="text-sm font-semibold text-foreground">{title}</h3>
			</div>
			<div className="p-3">{children}</div>
		</div>
	);
}

function FieldGrid({
	fields,
	columns = 3,
}: {
	fields: { label: string; value: ReactNode }[];
	columns?: 2 | 3 | 4;
}) {
	return (
		<div
			className={cn(
				"grid gap-3",
				columns === 4
					? "sm:grid-cols-2 lg:grid-cols-4"
					: columns === 3
						? "sm:grid-cols-2 lg:grid-cols-3"
						: "sm:grid-cols-2"
			)}
		>
			{fields.map((field) => (
				<div key={field.label} className="min-w-0">
					<p className="text-[11px] font-medium text-muted-foreground">
						{field.label}
					</p>
					<div className="mt-0.5 text-sm text-foreground">{field.value}</div>
				</div>
			))}
		</div>
	);
}

function ChecklistItem({
	label,
	status,
	tone,
}: {
	label: string;
	status: string;
	tone: "success" | "warning" | "neutral";
}) {
	const toneMap = {
		success: "success" as const,
		warning: "warning" as const,
		neutral: "neutral" as const,
	};

	return (
		<div className="flex items-center justify-between gap-2 border-b border-border/40 py-2 last:border-b-0">
			<span className="text-xs text-foreground">{label}</span>
			<RaStatusPill label={status} tone={toneMap[tone]} />
		</div>
	);
}

export function RiskAdjustmentMemberOpportunityDetailPage({
	opportunity,
}: {
	opportunity: MemberOpportunityDetail;
}) {
	const d = opportunity;

	return (
		<div className={cn(RA_STACK, "pb-4")}>
			<div className="flex flex-wrap items-center justify-end gap-2">
				<Button variant="outline" size="sm" className="h-8 text-xs" asChild>
					<Link href="/admin/claim-encounter/regulatory/risk-adjustment/member-opportunities">
						<ArrowLeft className="mr-1.5 size-3.5" />
						Back to List
					</Link>
				</Button>
				<Button variant="outline" size="icon" className="size-8">
					<Bookmark className="size-3.5" />
				</Button>
				<Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
					Actions
					<ChevronDown className="size-3" />
				</Button>
			</div>

			<div className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
				<div className="flex flex-wrap items-start gap-3 p-3">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
						<UserRound className="size-5" />
					</div>
					<div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
						<div>
							<p className="text-[11px] text-muted-foreground">Member ID</p>
							<p className="text-sm font-medium text-primary">{d.memberId}</p>
						</div>
						<div>
							<p className="text-[11px] text-muted-foreground">Member Name</p>
							<p className="text-sm font-medium">{d.name}</p>
						</div>
						<div>
							<p className="text-[11px] text-muted-foreground">DOB</p>
							<p className="text-sm tabular-nums">
								{d.dob} ({d.age})
							</p>
						</div>
						<div>
							<p className="text-[11px] text-muted-foreground">Plan / LOB</p>
							<p className="text-sm">{d.planLob}</p>
						</div>
						<div>
							<p className="text-[11px] text-muted-foreground">
								PCP / Provider
							</p>
							<p className="text-sm">{d.pcp}</p>
						</div>
						<div>
							<p className="text-[11px] text-muted-foreground">
								Coverage Status
							</p>
							<RaStatusPill label={d.coverageStatus} tone="success" />
						</div>
						<div>
							<p className="text-[11px] text-muted-foreground">Member Status</p>
							<RaStatusPill label={d.memberStatus} tone="info" />
						</div>
					</div>
				</div>

				<Tabs defaultValue="opportunity">
					<div className="border-t border-border/50 px-3">
						<TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">
							{[
								"Opportunity",
								"Evidence",
								"Claims & Encounters",
								"Documentation",
								"Activity History",
							].map((tab) => (
								<TabsTrigger
									key={tab}
									value={tab
										.toLowerCase()
										.replace(/\s+&\s+/g, "-")
										.replace(/\s+/g, "-")}
									className="rounded-none border-b-2 border-transparent px-3 py-2 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary"
								>
									{tab}
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					<TabsContent value="opportunity" className="mt-0 bg-muted/15 p-3">
						<div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
							<div className="space-y-3">
								<DetailCard title="Risk Adjustment Opportunity">
									<FieldGrid
										columns={3}
										fields={[
											{
												label: "HCC",
												value: (
													<span className="font-medium text-primary">
														{d.hcc}
													</span>
												),
											},
											{ label: "Condition", value: d.hccDescription },
											{
												label: "Opportunity Type",
												value: (
													<RaStatusPill
														label={d.opportunityType}
														tone="warning"
													/>
												),
											},
											{ label: "Risk Model", value: d.riskModel },
											{
												label: "Current RAF",
												value: (
													<span className="tabular-nums">
														{d.currentRaf.toFixed(3)}
													</span>
												),
											},
											{
												label: "Potential RAF Impact",
												value: (
													<span className="font-medium tabular-nums text-primary">
														{d.potentialRafImpact.toFixed(3)}
													</span>
												),
											},
											{
												label: "Estimated Payment Impact (Est.)",
												value: (
													<span className="font-medium text-emerald-700">
														${d.paymentImpact.toLocaleString()}
													</span>
												),
											},
											{ label: "Date Identified", value: d.dateIdentified },
											{ label: "Last Service Date", value: d.lastServiceDate },
											{ label: "Coding Source", value: d.codingSource },
										]}
									/>
								</DetailCard>

								<DetailCard title="Clinical / Coding Evidence">
									<CmsEdgeTableScroll>
										<Table
											containerClassName={CMS_EDGE_TABLE_CONTAINER}
											className={cn(CMS_EDGE_TABLE_CLASS, "min-w-[900px]")}
										>
											<TableHeader>
												<TableRow className="hover:bg-transparent">
													<TableHead className={RA_TABLE_HEAD}>
														Diagnosis Code
													</TableHead>
													<TableHead className={RA_TABLE_HEAD}>
														Diagnosis Description
													</TableHead>
													<TableHead className={RA_TABLE_HEAD}>
														Date of Service
													</TableHead>
													<TableHead className={RA_TABLE_HEAD}>
														Claim / Encounter
													</TableHead>
													<TableHead className={RA_TABLE_HEAD}>
														Rendering Provider
													</TableHead>
													<TableHead className={RA_TABLE_HEAD}>POS</TableHead>
													<TableHead className={RA_TABLE_HEAD}>
														Evidence Source
													</TableHead>
													<TableHead className={cn(RA_TABLE_HEAD, "pr-3")}>
														Documentation Available
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{d.evidence.map((row) => (
													<TableRow
														key={row.claimEncounter}
														className="hover:bg-muted/20"
													>
														<TableCell
															className={cn(
																RA_TABLE_CELL,
																"font-mono text-primary"
															)}
														>
															{row.diagnosisCode}
														</TableCell>
														<TableCell className={RA_TABLE_CELL}>
															{row.diagnosisDescription}
														</TableCell>
														<TableCell
															className={cn(RA_TABLE_CELL, "tabular-nums")}
														>
															{row.dateOfService}
														</TableCell>
														<TableCell className={RA_TABLE_CELL}>
															<Button
																variant="link"
																className={CMS_EDGE_TABLE_LINK_CLASS}
															>
																{row.claimEncounter}
															</Button>
														</TableCell>
														<TableCell className={RA_TABLE_CELL}>
															{row.renderingProvider}
														</TableCell>
														<TableCell className={RA_TABLE_CELL}>
															{row.pos}
														</TableCell>
														<TableCell className={RA_TABLE_CELL}>
															{row.evidenceSource}
														</TableCell>
														<TableCell className={cn(RA_TABLE_CELL, "pr-3")}>
															<span className="inline-flex items-center gap-1 text-emerald-700">
																<Check className="size-3.5" />
																Yes
															</span>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</CmsEdgeTableScroll>
								</DetailCard>

								<DetailCard title="Supporting Information">
									<FieldGrid
										columns={2}
										fields={[
											{
												label: "HCC Category",
												value: d.supporting.hccCategory,
											},
											{
												label: "Comorbidity / Complication",
												value: d.supporting.comorbidity,
											},
											{
												label: "Hierarchical Rule",
												value: d.supporting.hierarchicalRule,
											},
											{
												label: "Complication Status",
												value: d.supporting.complicationStatus,
											},
											{
												label: "Exclusion / Consideration",
												value: d.supporting.exclusion,
											},
											{
												label: "Documentation Type Needed",
												value: d.supporting.documentationTypeNeeded,
											},
											{
												label: "Member Risk Score (Current)",
												value: (
													<span className="tabular-nums">
														{d.supporting.memberRiskScoreCurrent.toFixed(3)}
													</span>
												),
											},
											{
												label: "Previous RAF Impact",
												value: (
													<span className="tabular-nums">
														{d.supporting.previousRafImpact.toFixed(3)}
													</span>
												),
											},
											{
												label: "Full RAF Score (Current)",
												value: (
													<span className="tabular-nums">
														{d.supporting.fullRafScoreCurrent.toFixed(3)}
													</span>
												),
											},
											{
												label: "Potential RAF Increase",
												value: (
													<span className="font-medium tabular-nums text-primary">
														{d.supporting.potentialRafIncrease.toFixed(3)}
													</span>
												),
											},
										]}
									/>
								</DetailCard>

								<div className="flex flex-wrap gap-2 rounded-lg border border-border/70 bg-card p-3 shadow-sm">
									<Button
										size="sm"
										className="h-8 bg-emerald-600 text-xs hover:bg-emerald-700"
										onClick={() => toast.success("Opportunity validated")}
									>
										<Check className="mr-1.5 size-3.5" />
										Validate Opportunity
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="h-8 border-red-200 text-xs text-red-600"
									>
										<X className="mr-1.5 size-3.5" />
										Reject Opportunity
									</Button>
									<Button variant="outline" size="sm" className="h-8 text-xs">
										<FileText className="mr-1.5 size-3.5" />
										Request Documentation
									</Button>
									<Button variant="outline" size="sm" className="h-8 text-xs">
										<User className="mr-1.5 size-3.5" />
										Assign / Reassign
									</Button>
									<Button variant="outline" size="sm" className="h-8 text-xs">
										<StickyNote className="mr-1.5 size-3.5" />
										Add Note
									</Button>
								</div>
							</div>

							<div className="space-y-3">
								<DetailCard title="Workflow & Assignment">
									<div className="space-y-3">
										<div className="flex items-center justify-between gap-2">
											<span className="text-xs text-muted-foreground">
												Status
											</span>
											<RaStatusPill label={d.workflow.status} tone="warning" />
										</div>
										<div className="flex items-center justify-between gap-2">
											<span className="text-xs text-muted-foreground">
												Priority
											</span>
											<span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
												<ArrowUp className="size-3.5" />
												{d.workflow.priority}
											</span>
										</div>
										<div className="space-y-1">
											<Label className="text-[11px] text-muted-foreground">
												Assigned To
											</Label>
											<Select defaultValue="sarah">
												<SelectTrigger className="h-8 text-xs">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="sarah">Sarah L.</SelectItem>
													<SelectItem value="michael">Michael T.</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="space-y-1">
											<Label className="text-[11px] text-muted-foreground">
												Due Date
											</Label>
											<div className="relative">
												<CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
												<Input
													className="h-8 pl-8 text-xs"
													defaultValue={d.workflow.dueDate}
												/>
											</div>
										</div>
										<div className="space-y-1">
											<Label className="text-[11px] text-muted-foreground">
												Notes
											</Label>
											<Textarea
												className="min-h-[88px] text-xs"
												defaultValue={d.workflow.notes}
											/>
										</div>
										<p className="text-[11px] text-muted-foreground">
											Last Activity {d.workflow.lastActivity}
										</p>
									</div>
								</DetailCard>

								<DetailCard title="Validation Checklist">
									{d.checklist.map((item) => (
										<ChecklistItem
											key={item.label}
											label={item.label}
											status={item.status}
											tone={item.tone}
										/>
									))}
								</DetailCard>

								<DetailCard title="History at a Glance">
									<dl className="space-y-2 text-xs">
										{[
											["First Identified", d.history.firstIdentified],
											[
												"First Opportunity Type",
												d.history.firstOpportunityType,
											],
											[
												"Opportunities (All Time)",
												String(d.history.opportunitiesAllTime),
											],
											["Previously Submitted", d.history.previouslySubmitted],
										].map(([label, value]) => (
											<div key={label} className="flex justify-between gap-2">
												<dt className="text-muted-foreground">{label}</dt>
												<dd className="font-medium">{value}</dd>
											</div>
										))}
									</dl>
								</DetailCard>
							</div>
						</div>
					</TabsContent>

					{[
						"evidence",
						"claims-encounters",
						"documentation",
						"activity-history",
					].map((tab) => (
						<TabsContent
							key={tab}
							value={tab}
							className="mt-0 p-6 text-center text-sm text-muted-foreground"
						>
							{tab.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
							content will appear here.
						</TabsContent>
					))}
				</Tabs>
			</div>
		</div>
	);
}
