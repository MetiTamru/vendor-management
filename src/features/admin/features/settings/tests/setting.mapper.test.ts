import { toSettingModel } from "../service/mappers/setting.mapper";

describe("setting.mapper", () => {
	it("maps valid dto", () => {
		expect(
			toSettingModel({
				id: "1",
				key: "app.name",
				value: "Starter",
				category: "general",
			})
		).toEqual({
			id: "1",
			key: "app.name",
			value: "Starter",
			category: "general",
			valueType: "string",
			isSecret: false,
			description: null,
		});
	});
});
