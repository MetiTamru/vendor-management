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
import { getModuleSidebarNav } from "@/constants/siteconfig";
import { FILE_RUNS } from "@/features/admin/features/file-management/mock-data";
import {
	displayName,
	getMemberSummaries,
} from "@/features/admin/features/members/mock-data";
import {
	displayProviderName,
	getProviderSummaries,
} from "@/features/admin/features/providers/mock-data";
import { useVendorsList } from "@/features/shared/vms/queries";
import { useRouter } from "@/i18n/navigation";
import { useAdminModuleStore } from "@/stores/admin-module-store";

const EXTRA_PAGES = [
	{ title: "Risk Scoring", href: "/admin/risk-scoring" },
	{ title: "Command Center", href: "/admin/activity" },
	{ title: "Automations", href: "/admin/automations" },
	{ title: "Vendor Comparison", href: "/admin/vendor-comparison" },
	{ title: "Export Center", href: "/admin/exports" },
];

export function CommandPalette() {
	const router = useRouter();
	const { vendors } = useVendorsList();
	const [open, setOpen] = useState(false);
	const { moduleId, fileType } = useAdminModuleStore();

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
		const nav = getModuleSidebarNav(moduleId)
			.filter((item) => item.href)
			.map((item) => ({ title: item.title, href: item.href as string }));
		if (moduleId !== "vendor_management") return nav;
		const seen = new Set(nav.map((item) => item.href));
		const extras = EXTRA_PAGES.filter((item) => !seen.has(item.href));
		return [...nav, ...extras];
	}, [moduleId]);

	const filteredRuns = useMemo(
		() => FILE_RUNS.filter((run) => run.program === fileType).slice(0, 20),
		[fileType]
	);

	const memberResults = useMemo(
		() =>
			getMemberSummaries()
				.filter((m) => m.program === fileType)
				.slice(0, 20),
		[fileType]
	);

	const providerResults = useMemo(
		() =>
			getProviderSummaries()
				.filter((p) => p.program === fileType)
				.slice(0, 20),
		[fileType]
	);

	function go(href: string) {
		setOpen(false);
		router.push(href);
	}

	return (
		<CommandDialog
			open={open}
			onOpenChange={setOpen}
			title="Search"
			description="Jump to pages, vendors, members, providers, and file runs"
		>
			<CommandInput placeholder="Search pages, vendors, members, providers…" />
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
				{moduleId === "vendor_management" ? (
					<>
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
						<CommandGroup heading="Members">
							{memberResults.map((member) => (
								<CommandItem
									key={member.id}
									value={`member ${displayName(member)} ${member.memberId}`}
									onSelect={() => go(`/admin/members/${member.id}`)}
								>
									<span className="truncate">
										{displayName(member)} · {member.memberId}
									</span>
								</CommandItem>
							))}
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="Providers">
							{providerResults.map((provider) => (
								<CommandItem
									key={provider.id}
									value={`provider ${displayProviderName(provider)} ${provider.npi}`}
									onSelect={() => go(`/admin/providers/${provider.id}`)}
								>
									<span className="truncate">
										{displayProviderName(provider)} · {provider.npi}
									</span>
								</CommandItem>
							))}
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="File runs">
							{filteredRuns.map((run) => (
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
					</>
				) : null}
			</CommandList>
		</CommandDialog>
	);
}
