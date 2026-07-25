import type { ApiUserDto } from "../../dto/user.dto";
import type { UserModel } from "../../types/user.types";

export function toUserModel(dto: ApiUserDto): UserModel | null {
	const id = dto.id != null ? String(dto.id) : null;
	const email = dto.email?.trim();
	const name = dto.name?.trim();
	if (!id || !email || !name) return null;

	return {
		id,
		email,
		name,
		roles: Array.isArray(dto.roles) ? dto.roles.map(String) : [],
		isActive: dto.is_active !== false,
	};
}

export function toUserModelList(dtos: ApiUserDto[]): UserModel[] {
	return dtos
		.map((dto) => toUserModel(dto))
		.filter((model): model is UserModel => model !== null);
}
