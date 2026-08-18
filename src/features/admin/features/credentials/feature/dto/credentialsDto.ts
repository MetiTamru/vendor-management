export type { CredentialDto as ApiCredentialsDto } from "@/lib/vendor-core/types";

export type CredentialsCreateDto = {
	name: string;
	kind: string;
	secret_ref: string;
	metadata?: Record<string, unknown>;
};
