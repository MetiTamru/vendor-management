import { apiClient } from "@/lib/api/client";

import type {
	ApiGroupListResponseDto,
	ApiIdentityGroupDto,
	GroupCreateDto,
	GroupUpdateDto,
} from "../../dto/group.dto";
import type { GroupModel } from "../../types/group.types";
import { toGroupModel, toGroupModelList } from "../mappers/group.mapper";
import { groupEndpoints } from "./group.endpoints";
import { MOCK_GROUPS } from "./group.mock";

function isMockDataEnabled(): boolean {
	return process.env.NEXT_PUBLIC_USE_MOCK_GROUPS === "true";
}

async function withMockFallback<T>(
	remote: () => Promise<T>,
	fallback: () => T
): Promise<T> {
	if (isMockDataEnabled()) return fallback();
	return remote();
}

export const groupApi = {
	async list(): Promise<GroupModel[]> {
		const dtos = await withMockFallback(
			() =>
				apiClient<ApiGroupListResponseDto | ApiIdentityGroupDto[]>(
					groupEndpoints.list()
				).then((res) => (Array.isArray(res) ? res : (res.results ?? []))),
			() => MOCK_GROUPS
		);
		return toGroupModelList(dtos);
	},

	async getById(id: string): Promise<GroupModel | null> {
		const dto = await withMockFallback(
			() => apiClient<ApiIdentityGroupDto>(groupEndpoints.detail(id)),
			() => MOCK_GROUPS.find((g) => String(g.id) === id) ?? null
		);
		if (!dto) return null;
		return toGroupModel(dto);
	},

	async create(payload: GroupCreateDto): Promise<GroupModel> {
		const dto = await withMockFallback(
			() =>
				apiClient<ApiIdentityGroupDto>(groupEndpoints.create(), {
					method: "POST",
					body: JSON.stringify(payload),
				}),
			() => ({
				...payload,
				id: `grp-${Date.now()}`,
				sync_status: "pending",
				updated_at: new Date().toISOString(),
				is_active: true,
			})
		);
		const model = toGroupModel(dto);
		if (!model) throw new Error("Invalid create response");
		return model;
	},

	async update(id: string, payload: GroupUpdateDto): Promise<GroupModel> {
		const dto = await withMockFallback(
			() =>
				apiClient<ApiIdentityGroupDto>(groupEndpoints.update(id), {
					method: "PATCH",
					body: JSON.stringify(payload),
				}),
			() => {
				const existing = MOCK_GROUPS.find((g) => String(g.id) === id);
				return { ...existing, ...payload, id };
			}
		);
		const model = toGroupModel(dto);
		if (!model) throw new Error("Invalid update response");
		return model;
	},

	async remove(id: string): Promise<void> {
		await withMockFallback(
			() =>
				apiClient<void>(groupEndpoints.delete(id), {
					method: "DELETE",
				}),
			() => undefined
		);
	},
};
