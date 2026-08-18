import { vendorCoreApi } from "@/lib/vendor-core/api";
import type { EligibilityFileDto, VendorDto } from "@/lib/vendor-core/types";

import type { EligibilityFilesCreateDto } from "../dto/eligibilityFilesDto";

export async function listEligibilityFiles(): Promise<EligibilityFileDto[]> {
	const page = await vendorCoreApi.listEligibilityFiles();
	return page.results ?? [];
}

export async function createEligibilityFiles(
	input: EligibilityFilesCreateDto
): Promise<EligibilityFileDto> {
	return vendorCoreApi.createEligibilityFile(input);
}

export async function listEligibilityVendors(): Promise<VendorDto[]> {
	const page = await vendorCoreApi.listVendors();
	return page.results ?? [];
}
