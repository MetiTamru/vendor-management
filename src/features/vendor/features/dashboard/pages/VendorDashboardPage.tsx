"use client";

import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import { vmsApi } from "@/features/shared/vms/api";
import {
	useCertificatesList,
	useCurrentVendor,
	useNotificationsList,
	usePurchaseOrdersList,
	useRfxList,
} from "@/features/shared/vms/queries";
import { formatDate } from "@/features/shared/vms/utils";
import { Link } from "@/i18n/navigation";

export function VendorDashboardPage() {
	const { vendor, isLoading } = useCurrentVendor();
	const { orders: purchaseOrders } = usePurchaseOrdersList(
		vmsApi.currentVendorId
	);
	const { events } = useRfxList();
	const { notifications } = useNotificationsList();
	const { certificates } = useCertificatesList();

	if (isLoading) {
		return (
			<div className="container space-y-5 py-8">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-32 w-full" />
			</div>
		);
	}

	if (!vendor)
		return (
			<div className="container py-8 text-sm text-muted-foreground">
				Vendor profile unavailable.
			</div>
		);

	const vendorPos = purchaseOrders.filter((po) => po.vendorId === vendor.id);
	const opportunities = events.filter(
		(event) =>
			event.status === "published" || event.invitedVendorIds.includes(vendor.id)
	);
	const expiring = certificates.filter(
		(item) =>
			item.vendorId === vendor.id &&
			["expiring", "expired"].includes(item.status)
	);
	const metrics = [
		{
			label: "Onboarding progress",
			value: `${vendor.onboardingProgress}%`,
			href: "/vendor/onboarding",
		},
		{
			label: "POs to acknowledge",
			value: String(vendorPos.filter((po) => po.status === "sent").length),
			href: "/vendor/purchase-orders",
		},
		{
			label: "Open opportunities",
			value: String(
				opportunities.filter((event) => event.status === "published").length
			),
			href: "/vendor/opportunities",
		},
		{
			label: "Unread notifications",
			value: String(notifications.filter((item) => !item.read).length),
			href: "/vendor/notifications",
		},
	];

	return (
		<div className="container space-y-8 py-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">
					Welcome, {vendor.tradeName ?? vendor.legalName}
				</h1>
				<p className="text-sm text-muted-foreground">
					Your supplier relationship workspace and action queue.
				</p>
			</div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{metrics.map((metric) => (
					<Link
						key={metric.label}
						href={metric.href}
						className="rounded-xl border bg-card p-5 shadow-sm transition-colors hover:bg-muted/40"
					>
						<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
							{metric.label}
						</p>
						<p className="mt-2 text-3xl font-semibold tabular-nums">
							{metric.value}
						</p>
						{metric.label === "Onboarding progress" && (
							<Progress className="mt-3" value={vendor.onboardingProgress} />
						)}
					</Link>
				))}
			</div>
			<section className="space-y-3">
				<div className="flex items-center justify-between">
					<h2 className="font-semibold">Compliance attention</h2>
					<Link
						href="/vendor/documents"
						className="text-sm text-primary hover:underline"
					>
						Manage documents
					</Link>
				</div>
				<div className="divide-y rounded-xl border bg-card">
					{expiring.map((certificate) => (
						<div
							key={certificate.id}
							className="flex items-center justify-between gap-4 p-4"
						>
							<div>
								<p className="text-sm font-medium">{certificate.name}</p>
								<p className="text-xs text-muted-foreground">
									Expires {formatDate(certificate.expiresAt)}
								</p>
							</div>
							<StatusBadge status={certificate.status} />
						</div>
					))}
					{expiring.length === 0 && (
						<p className="p-6 text-sm text-muted-foreground">
							No documents are expiring soon.
						</p>
					)}
				</div>
			</section>
		</div>
	);
}
