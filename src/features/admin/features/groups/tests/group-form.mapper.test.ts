import {
	formValuesToUpdateCommand,
	groupModelToFormValues,
} from "../service/mappers/group-form.mapper";
import type { GroupModel } from "../types/group.types";

const sampleModel: GroupModel = {
	id: "grp-1",
	name: "Engineering",
	description: "Dev team",
	membershipMode: "enumerated",
	members: [
		{
			id: "m1",
			externalId: "ext-1",
			displayName: "Alice",
			role: "lead",
		},
	],
	characteristics: [
		{
			id: "c1",
			key: "department",
			operator: "eq",
			value: "engineering",
		},
	],
	periodStart: "2025-01-01",
	periodEnd: "2025-12-31",
	isActive: true,
	syncStatus: "synced",
	updatedAt: "2025-01-01T00:00:00.000Z",
};

describe("group-form.mapper", () => {
	it("groupModelToFormValues strips member and characteristic ids", () => {
		const values = groupModelToFormValues(sampleModel);

		expect(values.name).toBe("Engineering");
		expect(values.members).toHaveLength(1);
		expect(values.members[0]).toEqual({
			externalId: "ext-1",
			displayName: "Alice",
			role: "lead",
		});
		expect(values.characteristics[0]).toEqual({
			key: "department",
			operator: "eq",
			value: "engineering",
		});
		expect(values.members[0]).not.toHaveProperty("id");
	});

	it("formValuesToUpdateCommand includes group id", () => {
		const values = groupModelToFormValues(sampleModel);
		const command = formValuesToUpdateCommand("grp-1", values);

		expect(command.id).toBe("grp-1");
		expect(command.name).toBe("Engineering");
	});
});
