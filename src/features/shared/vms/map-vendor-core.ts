import type { VendorDto } from "@/lib/vendor-core/types";

import type { VendorModel, VendorStatus } from "./types";

const VENDOR_STATUSES = new Set<VendorStatus>([
	"prospect",
	"invited",
	"onboarding",
	"under_review",
	"active",
	"suspended",
	"offboarded",
]);

function mapStatus(raw: string): VendorStatus {
	if (raw === "terminated") return "offboarded";
	if (VENDOR_STATUSES.has(raw as VendorStatus)) return raw as VendorStatus;
	return "active";
}

function mapRiskLevel(raw?: string | null): VendorModel["riskLevel"] {
	const value = (raw ?? "low").toLowerCase();
	if (value === "medium" || value === "high" || value === "critical") {
		return value;
	}
	return "low";
}

/** Map vendor-core VendorDto → VMS VendorModel used by dashboard / shared queries. */
export function vendorDtoToModel(v: VendorDto): VendorModel {
	const now = new Date().toISOString();
	const categories =
		v.categories?.map((c) => c.name ?? c.code).filter(Boolean) ??
		(v.tags?.length ? v.tags : []);
	const primary = v.primary_contact;
	return {
		id: v.id,
		legalName: v.legal_name || v.name,
		tradeName: v.trade_name ?? null,
		status: mapStatus(v.status),
		categories,
		tags: v.tags?.length ? v.tags : v.vendor_code ? [v.vendor_code] : [],
		country: v.country ?? "",
		city: v.city ?? "",
		taxId: v.tax_id ?? null,
		website: v.website ?? null,
		description: v.description ?? null,
		contacts: primary
			? [
					{
						id: primary.id,
						name: primary.name,
						email: primary.email,
						phone: primary.phone ?? null,
						role: primary.role ?? "primary",
						isPrimary: primary.is_primary,
					},
				]
			: [],
		riskLevel: mapRiskLevel(v.risk_level),
		riskScore: Number(v.risk_score ?? 0),
		onboardingProgress: v.status === "active" ? 100 : 40,
		createdAt: v.created_at ?? now,
		updatedAt: v.updated_at ?? now,
	};
}
