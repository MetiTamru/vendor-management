export function formatMoney(amount: number, currency = "USD") {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		maximumFractionDigits: 0,
	}).format(amount);
}

export function formatDate(iso: string | null | undefined) {
	if (!iso) return "—";
	const d = iso.slice(0, 10);
	return d;
}

export const BUYER_ROLES = [
	"admin",
	"platform_admin",
	"procurement_manager",
	"manager",
	"buyer",
	"ap_finance",
	"compliance_officer",
	"viewer",
] as const;

export const VENDOR_ROLES = [
	"vendor_admin",
	"vendor_bidder",
	"vendor_finance",
	"vendor_viewer",
] as const;

export function isVendorRole(roles: string[]): boolean {
	return roles.some((r) =>
		(VENDOR_ROLES as readonly string[]).includes(r)
	);
}

export function isBuyerRole(roles: string[]): boolean {
	if (isVendorRole(roles)) return false;
	return (
		roles.length === 0 ||
		roles.some((r) => (BUYER_ROLES as readonly string[]).includes(r))
	);
}
