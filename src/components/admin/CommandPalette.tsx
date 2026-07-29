"use client";

import { useEffect, useMemo, useState } from "react";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { siteConfig } from "@/constants/siteconfig";
import { FILE_RUNS } from "@/features/admin/features/file-management/mock-data";
import { useVendorsList } from "@/features/shared/vms/queries";
import { useRouter } from "@/i18n/navigation";

const EXTRA_PAGES = [
	{ title: "Risk Scoring", href: "/admin/risk-scoring" },
	{ title: "Command Center", href: "/admin/activity" },
	{ title: "Automations", href: "/admin/automations" },
	{ title: "Vendor Comparison", href: "/admin/vendor-comparison" },
	{ title: "Export Center", href: "/admin/exports" },
	{ title: "Users", href: "/admin/users" },
	{ title: "Groups", href: "/admin/groups" },
	{ title: "Documents", href: "/admin/documents" },
	{ title: "Invoices", href: "/admin/invoices" },
	{ title: "Purchase Orders", href: "/admin/purchase-orders" },
	{ title: "Contracts", href: "/admin/contracts" },
];

export function CommandPalette() {
	const router = useRouter();
	const { vendors } = useVendorsList();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setOpen((value) => !value);
			}
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	const pages = useMemo(() => {
		const nav = siteConfig.sidebarNav
			.filter((item) => item.href)
			.map((item) => ({ title: item.title, href: item.href as string }));
		const seen = new Set(nav.map((item) => item.href));
		const extras = EXTRA_PAGES.filter((item) => !seen.has(item.href));
		return [...nav, ...extras];
	}, []);

	function go(href: string) {
		setOpen(false);
		router.push(href);
	}

	return (
		<CommandDialog
			open={open}
			onOpenChange={setOpen}
			title="Search"
			description="Jump to pages, vendors, and file runs"
		>
			<CommandInput placeholder="Search pages, vendors, file runs…" />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Pages">
					{pages.map((page) => (
						<CommandItem
							key={page.href}
							value={`page ${page.title}`}
							onSelect={() => go(page.href)}
						>
							{page.title}
						</CommandItem>
					))}
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Vendors">
					{vendors.slice(0, 20).map((vendor) => (
						<CommandItem
							key={vendor.id}
							value={`vendor ${vendor.tradeName ?? vendor.legalName}`}
							onSelect={() => go(`/admin/vendors/${vendor.id}`)}
						>
							{vendor.tradeName ?? vendor.legalName}
						</CommandItem>
					))}
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="File runs">
					{FILE_RUNS.slice(0, 20).map((run) => (
						<CommandItem
							key={run.id}
							value={`run ${run.fileName ?? ""} ${run.runId} ${run.vendor}`}
							onSelect={() => go(`/admin/file-monitoring/${run.id}`)}
						>
							<span className="truncate">
								{run.fileName ?? run.runId} · {run.vendor}
							</span>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
