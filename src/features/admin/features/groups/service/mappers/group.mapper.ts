import { z } from "zod";

import type {
	ApiGroupCharacteristicDto,
	ApiGroupMemberDto,
	ApiIdentityGroupDto,
} from "../../dto/group.dto";
import type {
	GroupCharacteristic,
	GroupMember,
	GroupModel,
	MembershipMode,
	SyncStatus,
} from "../../types/group.types";

const membershipModeSchema = z.enum(["enumerated", "definitional"]);
const syncStatusSchema = z.enum(["synced", "pending", "failed"]);
const operatorSchema = z.enum(["eq", "neq", "in", "gte", "lte"]);

function parseMembershipMode(value: unknown): MembershipMode {
	const parsed = membershipModeSchema.safeParse(value);
	return parsed.success ? parsed.data : "enumerated";
}

function parseSyncStatus(value: unknown): SyncStatus {
	const parsed = syncStatusSchema.safeParse(value);
	return parsed.success ? parsed.data : "synced";
}

function fallbackId(seed: string) {
	return seed || `local-${Date.now()}`;
}

function toMember(dto: ApiGroupMemberDto): GroupMember | null {
	const displayName =
		typeof dto.display_name === "string" ? dto.display_name.trim() : "";
	if (!displayName) return null;

	return {
		id: fallbackId(String(dto.id ?? displayName)),
		externalId: typeof dto.external_id === "string" ? dto.external_id : null,
		displayName,
		role: typeof dto.role === "string" ? dto.role : null,
	};
}

function toCharacteristic(
	dto: ApiGroupCharacteristicDto
): GroupCharacteristic | null {
	const key = typeof dto.key === "string" ? dto.key.trim() : "";
	if (!key) return null;

	const operatorParsed = operatorSchema.safeParse(dto.operator);
	const operator = operatorParsed.success ? operatorParsed.data : "eq";

	let value: string | number | string[] = "";
	if (typeof dto.value === "string" || typeof dto.value === "number") {
		value = dto.value;
	} else if (Array.isArray(dto.value)) {
		value = dto.value.map(String);
	}

	return {
		id: fallbackId(String(dto.id ?? key)),
		key,
		operator,
		value,
	};
}

export function toGroupModel(dto: ApiIdentityGroupDto): GroupModel | null {
	const id = dto.id != null ? String(dto.id) : null;
	const name = typeof dto.name === "string" ? dto.name.trim() : "";
	if (!id || !name) return null;

	const members = (dto.members ?? [])
		.map((m) => toMember(m))
		.filter((m): m is GroupMember => m !== null);

	const characteristics = (dto.characteristics ?? [])
		.map((c) => toCharacteristic(c))
		.filter((c): c is GroupCharacteristic => c !== null);

	return {
		id,
		name,
		description: typeof dto.description === "string" ? dto.description : null,
		membershipMode: parseMembershipMode(dto.membership_mode),
		members,
		characteristics,
		periodStart: typeof dto.period_start === "string" ? dto.period_start : null,
		periodEnd: typeof dto.period_end === "string" ? dto.period_end : null,
		isActive: dto.is_active !== false,
		syncStatus: parseSyncStatus(dto.sync_status),
		updatedAt:
			typeof dto.updated_at === "string"
				? dto.updated_at
				: new Date().toISOString(),
	};
}

export function toGroupModelList(dtos: ApiIdentityGroupDto[]): GroupModel[] {
	return dtos
		.map((dto) => toGroupModel(dto))
		.filter((model): model is GroupModel => model !== null);
}

/** Placeholder for Dexie cache row mapping — wire when offline layer is added. */
export function toCacheRow(model: GroupModel) {
	return { ...model, cachedAt: new Date().toISOString() };
}

export function fromCacheRow(
	row: GroupModel & { deletedAt?: string | null; cachedAt?: string }
): GroupModel {
	const { deletedAt: _d, cachedAt: _c, ...model } = row;
	return model;
}
