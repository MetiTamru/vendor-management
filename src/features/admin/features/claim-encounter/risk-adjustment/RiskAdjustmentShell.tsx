"use client";

import { type ReactNode } from "react";

import {
	ClipboardList,
	Download,
	FileCheck,
	FolderOpen,
	LayoutDashboard,
	Scale,
	Send,
	Shield,
	Stethoscope,
	Users,
	type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	RISK_ADJUSTMENT_TAB_META,
	RISK_ADJUSTMENT_TAB_SLUGS,
	RISK_ADJUSTMENT_TABS,
	type RiskAdjustmentTab,
} from "@/features/admin/features/claim-encounter/risk-adjustment/mock-data";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const TAB_ICONS: Record<RiskAdjustmentTab, LucideIcon> = {
	Overview: LayoutDashboard,
	"HCC Management": ClipboardList,
	"Member Opportunities": Users,
	"Coding Validation": FileCheck,
	Submissions: Send,
	"Audit & Reconciliation": Shield,
	Documents: FolderOpen,
};

const TAB_TRIGGER = cn(
	"inline-flex items-center rounded-none border-b-2 border-transparent px-3 py-2 text-xs font-medium transition-colors",
	"text-muted-foreground hover:bg-muted/40 hover:text-foreground",
	"data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary"
);

function tabFromPathname(pathname: string): RiskAdjustmentTab {
	const segment = pathname.split("/").filter(Boolean).pop() ?? "overview";
	const match = RISK_ADJUSTMENT_TABS.find(
		(tab) => RISK_ADJUSTMENT_TAB_SLUGS[tab] === segment
	);
	return match ?? "Overview";
}

export function RiskAdjustmentShell({
	children,
	headerAction,
}: {
	children: ReactNode;
	headerAction?: ReactNode;
}) {
	const pathname = usePathname();
	const activeTab = tabFromPathname(pathname);
	const meta = RISK_ADJUSTMENT_TAB_META[activeTab];

	return (
		<div className="space-y-0 pb-3">
			<div className="flex flex-col gap-0 border-b border-border/70 bg-card lg:flex-row lg:items-stretch">
				<ScrollArea type="always" className="min-w-0 flex-1" scrollbarClassName="h-2">
					<nav className="inline-flex h-auto w-max min-w-full justify-start gap-0 p-0">
						{RISK_ADJUSTMENT_TABS.map((tab) => {
							const slug = RISK_ADJUSTMENT_TAB_SLUGS[tab];
							const href = `/admin/claim-encounter/regulatory/risk-adjustment/${slug}`;
							const Icon = TAB_ICONS[tab];
							const isActive = activeTab === tab;

							return (
								<Link
									key={tab}
									href={href}
									data-active={isActive}
									className={TAB_TRIGGER}
								>
									<Icon className="mr-1.5 size-3.5" />
									{tab}
								</Link>
							);
						})}
					</nav>
				</ScrollArea>

				<div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-border/50 px-3 py-2 lg:border-l lg:border-t-0">
					<div className="flex items-center gap-2">
						<label className="sr-only" htmlFor="ra-program">
							Program
						</label>
						<Select defaultValue="medicare-advantage">
							<SelectTrigger id="ra-program" className="h-8 w-[150px] border-border/70 bg-background text-xs">
								<Scale className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="medicare-advantage">Medicare Advantage</SelectItem>
								<SelectItem value="medicaid">Medicaid</SelectItem>
								<SelectItem value="aca">ACA Marketplace</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center gap-2">
						<label className="sr-only" htmlFor="ra-year">
							Measurement Year
						</label>
						<Select defaultValue="2025">
							<SelectTrigger id="ra-year" className="h-8 w-[100px] border-border/70 bg-background text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="2025">2025</SelectItem>
								<SelectItem value="2024">2024</SelectItem>
								<SelectItem value="2023">2023</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<div className="space-y-3 bg-muted/20 px-3 py-3">
				<div className="flex flex-wrap items-start justify-between gap-2 border-b border-border/50 pb-3">
					<div className="min-w-0 max-w-3xl space-y-0.5">
						<h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
							{meta.title}
						</h1>
						<p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
							{meta.description}
						</p>
					</div>
					{headerAction ?? (
						<Button size="sm" className="h-8" onClick={() => toast.success("Export queued")}>
							<Download className="mr-1.5 size-3.5" />
							Export
						</Button>
					)}
				</div>

				{children}
			</div>
		</div>
	);
}
