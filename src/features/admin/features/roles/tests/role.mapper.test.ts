import { toRoleModel } from "../service/mappers/role.mapper";

describe("role.mapper", () => {
	it("maps valid dto", () => {
		expect(
			toRoleModel({
				id: "r1",
				name: "Admin",
				permissions: ["*"],
			})
		).toEqual({
			id: "r1",
			name: "Admin",
			slug: "Admin",
			permissions: ["*"],
			isSystemRole: false,
			description: null,
		});
	});
});
