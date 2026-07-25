import type { ApiIdentityGroupDto } from "../dto/group.dto";
import {
	toGroupModel,
	toGroupModelList,
} from "../service/mappers/group.mapper";

describe("group.mapper", () => {
	it("maps valid DTO to domain model", () => {
		const dto: ApiIdentityGroupDto = {
			id: "1",
			name: "Test Group",
			membership_mode: "enumerated",
			members: [{ display_name: "Alice", id: "m1" }],
			sync_status: "synced",
		};

		const model = toGroupModel(dto);
		expect(model?.name).toBe("Test Group");
		expect(model?.membershipMode).toBe("enumerated");
		expect(model?.members).toHaveLength(1);
	});

	it("drops invalid records from list", () => {
		const list = toGroupModelList([
			{ id: "1", name: "Valid" },
			{ id: null, name: "" },
			{ name: "No id" },
		]);
		expect(list).toHaveLength(1);
		expect(list[0]?.name).toBe("Valid");
	});

	it("defaults missing optional fields", () => {
		const model = toGroupModel({ id: "2", name: "Minimal" });
		expect(model?.description).toBeNull();
		expect(model?.syncStatus).toBe("synced");
		expect(model?.characteristics).toEqual([]);
	});
});
