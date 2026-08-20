import { vendorCoreApi } from "@/lib/vendor-core/api";
import type {
	AccountDto,
	ConnectionDto,
	InboundFileDto,
	IntakeJobDto,
	VendorDto,
} from "@/lib/vendor-core/types";

export async function listVendors(): Promise<VendorDto[]> {
	const page = await vendorCoreApi.listVendors();
	return page.results ?? [];
}

export async function getVendor(id: string): Promise<VendorDto> {
	return vendorCoreApi.getVendor(id);
}

export async function listVendorConnections(
	vendorId?: string
): Promise<ConnectionDto[]> {
	const page = await vendorCoreApi.listConnections(
		vendorId ? { vendor_id: vendorId } : undefined
	);
	return page.results ?? [];
}

export async function listVendorJobs(
	vendorId?: string
): Promise<IntakeJobDto[]> {
	const page = await vendorCoreApi.listIntakeJobs(
		vendorId ? { vendor_id: vendorId } : undefined
	);
	return page.results ?? [];
}

export async function listVendorAccounts(
	vendorId?: string
): Promise<AccountDto[]> {
	const page = await vendorCoreApi.listAccounts(
		vendorId ? { vendor_id: vendorId } : undefined
	);
	return page.results ?? [];
}

export async function listVendorInboundFiles(params?: {
	stage?: string;
	vendor_id?: string;
}): Promise<InboundFileDto[]> {
	const page = await vendorCoreApi.listInboundFiles(params);
	return page.results ?? [];
}
