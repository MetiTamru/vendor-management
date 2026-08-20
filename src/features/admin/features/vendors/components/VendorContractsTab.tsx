"use client";

import { useState } from "react";

import {
	CalendarDays,
	DollarSign,
	FileText,
	ScrollText,
	Timer,
} from "lucide-react";

import { ContractsPage } from "@/features/admin/features/contracts/pages/ContractsPage";
import {
	ContractsDetailsHubPage,
	ContractsDocumentsPage,
	ContractsEffectiveDatesPage,
	ContractsRateFeeSchedulePage,
	ContractsSlaTermsPage,
} from "@/features/admin/features/contracts/pages/ContractsSectionPages";
import { cn } from "@/lib/utils";

const CONTRACT_SECTIONS = [
	{
		id: "overview",
		label: "Overview",
		icon: FileText,
	},
	{
		id: "details",
		label: "Contract Details",
		icon: ScrollText,
	},
	{
		id: "effective-dates",
		label: "Effective Dates",
		icon: CalendarDays,
	},
	{
		id: "rate-fee-schedule",
		label: "Rate / Fee Schedule",
		icon: DollarSign,
	},
	{
		id: "sla-terms",
		label: "SLA Terms",
		icon: Timer,
	},
	{
		id: "documents",
		label: "Documents",
		icon: FileText,
	},
] as const;

type ContractSectionId = (typeof CONTRACT_SECTIONS)[number]["id"];

export function VendorContractsTab({ vendorId }: { vendorId: string }) {
	const [section, setSection] = useState<ContractSectionId>("overview");

	return (
		<section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
			<div className="flex min-h-[560px]">
				<aside className="w-52 shrink-0 border-r border-border bg-muted/30">
					<div className="border-b border-border px-3 py-3">
						<p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							Contracts
						</p>
					</div>
					<nav
						className="flex flex-col gap-0.5 p-2"
						aria-label="Contract sections"
					>
						{CONTRACT_SECTIONS.map((item) => {
							const Icon = item.icon;
							const active = section === item.id;
							return (
								<button
									key={item.id}
									type="button"
									onClick={() => setSection(item.id)}
									className={cn(
										"flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-semibold transition-colors",
										active
											? "bg-primary text-primary-foreground shadow-sm"
											: "text-muted-foreground hover:bg-muted hover:text-foreground"
									)}
								>
									<Icon className="size-3.5 shrink-0" />
									<span className="leading-snug">{item.label}</span>
								</button>
							);
						})}
					</nav>
				</aside>
				<div className="min-w-0 flex-1 overflow-auto p-4">
					{section === "overview" ? (
						<ContractsPage vendorId={vendorId} embedded />
					) : null}
					{section === "details" ? (
						<ContractsDetailsHubPage vendorId={vendorId} embedded />
					) : null}
					{section === "effective-dates" ? (
						<ContractsEffectiveDatesPage vendorId={vendorId} embedded />
					) : null}
					{section === "rate-fee-schedule" ? (
						<ContractsRateFeeSchedulePage vendorId={vendorId} embedded />
					) : null}
					{section === "sla-terms" ? (
						<ContractsSlaTermsPage vendorId={vendorId} embedded />
					) : null}
					{section === "documents" ? (
						<ContractsDocumentsPage vendorId={vendorId} embedded />
					) : null}
				</div>
			</div>
		</section>
	);
}
