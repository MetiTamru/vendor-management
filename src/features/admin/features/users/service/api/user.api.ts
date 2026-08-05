import { apiClient } from "@/lib/api/client";
import { withMockOrRemote } from "@/lib/mock-mode";

import type { ApiUserDto, ApiUserListResponseDto } from "../../dto/user.dto";
import type { UserModel } from "../../types/user.types";
import { toUserModelList } from "../mappers/user.mapper";
import { userEndpoints } from "./user.endpoints";
import { MOCK_USERS } from "./user.mock";

export const userApi = {
	async list(): Promise<UserModel[]> {
		const dtos = await withMockOrRemote(
			() => MOCK_USERS,
			() =>
				apiClient<ApiUserListResponseDto | ApiUserDto[]>(
					userEndpoints.list()
				).then((res) => (Array.isArray(res) ? res : (res.results ?? [])))
		);
		return toUserModelList(dtos);
	},
};
