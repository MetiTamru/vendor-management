import { toUserModel, toUserModelList } from "../service/mappers/user.mapper";

describe("user.mapper", () => {
	it("maps valid dto to UserModel", () => {
		const model = toUserModel({
			id: "1",
			email: "a@b.com",
			name: "Alice",
			roles: ["admin"],
			is_active: true,
		});
		expect(model).toEqual({
			id: "1",
			email: "a@b.com",
			name: "Alice",
			roles: ["admin"],
			isActive: true,
		});
	});

	it("drops invalid rows in list", () => {
		const list = toUserModelList([
			{ id: "1", email: "a@b.com", name: "A" },
			{ id: null, email: "x@y.com", name: "Bad" },
		]);
		expect(list).toHaveLength(1);
	});
});
