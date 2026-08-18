import type { ApiCredentialsDto } from "../dto/credentialsDto";
import type { CredentialsModel } from "../types/credentialsModel";

export function toCredentialsModel(dto: ApiCredentialsDto): CredentialsModel {
	return {
		id: dto.id,
		name: dto.name,
		kind: dto.kind,
		secretRef: dto.secret_ref,
		createdAt: dto.created_at,
	};
}
