import { vendorCoreApi } from "@/lib/vendor-core/api";
import type { CredentialDto } from "@/lib/vendor-core/types";

import type { CredentialsCreateDto } from "../dto/credentialsDto";

export async function listCredentials(): Promise<CredentialDto[]> {
	const page = await vendorCoreApi.listCredentials();
	return page.results ?? [];
}

export async function createCredentials(
	input: CredentialsCreateDto
): Promise<CredentialDto> {
	return vendorCoreApi.createCredential(input);
}
