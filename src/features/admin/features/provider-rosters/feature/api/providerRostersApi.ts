import { vendorCoreApi } from "@/lib/vendor-core/api";
import type { ProviderRosterDto, VendorDto } from "@/lib/vendor-core/types";

export async function listProviderRosters(): Promise<ProviderRosterDto[]> {
	const page = await vendorCoreApi.listProviderRosters();
	return page.results ?? [];
}

export async function listProviderRosterVendors(): Promise<VendorDto[]> {
	const page = await vendorCoreApi.listVendors();
	return page.results ?? [];
}
