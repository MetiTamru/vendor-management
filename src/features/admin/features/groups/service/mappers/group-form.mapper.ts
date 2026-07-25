import type { GroupCreateDto, GroupUpdateDto } from "../../dto/group.dto";
import type {
	CreateGroupCommand,
	GroupModel,
	UpdateGroupCommand,
} from "../../types/group.types";
import type { GroupBusinessValues } from "../../validation/group-business.schema";
import type { GroupFormValues } from "../../validation/group-form.schema";

export function groupModelToFormValues(model: GroupModel): GroupBusinessValues {
	return {
		name: model.name,
		description: model.description,
		membershipMode: model.membershipMode,
		members: model.members.map((m) => ({
			externalId: m.externalId,
			displayName: m.displayName,
			role: m.role,
		})),
		characteristics: model.characteristics.map((c) => ({
			key: c.key,
			operator: c.operator,
			value: c.value,
		})),
		periodStart: model.periodStart,
		periodEnd: model.periodEnd,
	};
}

export function formValuesToCreateCommand(
	values: GroupFormValues
): CreateGroupCommand {
	return {
		name: values.name,
		description: values.description ?? null,
		membershipMode: values.membershipMode,
		members: values.members.map((m) => ({
			externalId: m.externalId ?? null,
			displayName: m.displayName,
			role: m.role ?? null,
		})),
		characteristics: values.characteristics.map((c) => ({
			key: c.key,
			operator: c.operator,
			value: c.value,
		})),
		periodStart: values.periodStart ?? null,
		periodEnd: values.periodEnd ?? null,
	};
}

export function formValuesToUpdateCommand(
	id: string,
	values: GroupFormValues
): UpdateGroupCommand {
	return {
		id,
		...formValuesToCreateCommand(values),
	};
}

export function toCreateDto(command: CreateGroupCommand): GroupCreateDto {
	return {
		name: command.name,
		description: command.description ?? null,
		membership_mode: command.membershipMode,
		members: command.members.map((m) => ({
			external_id: m.externalId,
			display_name: m.displayName,
			role: m.role,
		})),
		characteristics: command.characteristics.map((c) => ({
			key: c.key,
			operator: c.operator,
			value: c.value,
		})),
		period_start: command.periodStart ?? null,
		period_end: command.periodEnd ?? null,
	};
}

export function toUpdateDto(command: UpdateGroupCommand): GroupUpdateDto {
	const base = command.name
		? {
				name: command.name,
				description: command.description,
				membership_mode: command.membershipMode,
			}
		: {};

	return {
		...base,
		...(command.members
			? {
					members: command.members.map((m) => ({
						external_id: m.externalId,
						display_name: m.displayName,
						role: m.role,
					})),
				}
			: {}),
		...(command.characteristics
			? {
					characteristics: command.characteristics.map((c) => ({
						key: c.key,
						operator: c.operator,
						value: c.value,
					})),
				}
			: {}),
		period_start: command.periodStart,
		period_end: command.periodEnd,
	};
}
