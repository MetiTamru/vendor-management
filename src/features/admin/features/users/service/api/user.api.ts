import { apiClient } from "@/lib/api/client";

import type { ApiUserDto, ApiUserListResponseDto } from "../../dto/user.dto";
import type { UserModel } from "../../types/user.types";
import { toUserModelList } from "../mappers/user.mapper";
import { userEndpoints } from "./user.endpoints";
import { MOCK_USERS } from "./user.mock";

function isMockDataEnabled(): boolean {
	return process.env.NEXT_PUBLIC_USE_MOCK_USERS === "true";
}

async function withMockFallback<T>(
	remote: () => Promise<T>,
	fallback: () => T
): Promise<T> {
	if (isMockDataEnabled()) return fallback();
	return remote();
}

export const userApi = {
	async list(): Promise<UserModel[]> {
		const dtos = await withMockFallback(
			() =>
				apiClient<ApiUserListResponseDto | ApiUserDto[]>(
					userEndpoints.list()
				).then((res) => (Array.isArray(res) ? res : (res.results ?? []))),
			() => MOCK_USERS
		);
		return toUserModelList(dtos);
	},
};
