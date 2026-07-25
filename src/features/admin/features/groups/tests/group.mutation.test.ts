import { offlineDb } from "@/lib/offline/db";

import { listCachedGroups } from "../offline/group.cache";
import { groupApi } from "../service/api/group.api";
import {
	createGroupCommand,
	deleteGroupCommand,
} from "../service/commands/group.command";
import { toCreateDto } from "../service/mappers/group-form.mapper";
import type { CreateGroupCommand } from "../types/group.types";

jest.mock("../service/api/group.api", () => ({
	groupApi: {
		create: jest.fn(),
		update: jest.fn(),
		remove: jest.fn(),
		list: jest.fn(),
		getById: jest.fn(),
	},
}));

const createCommand: CreateGroupCommand = {
	name: "Ops Team",
	description: null,
	membershipMode: "enumerated",
	members: [{ externalId: null, displayName: "Alice", role: null }],
	characteristics: [],
	periodStart: null,
	periodEnd: null,
};

describe("group commands", () => {
	beforeEach(async () => {
		jest.clearAllMocks();
		await offlineDb?.groups.clear();
		await offlineDb?.syncQueue.clear();
	});

	it("createGroupCommand writes to cache and syncs via API when online", async () => {
		const expectedDto = toCreateDto(createCommand);
		const serverModel = {
			id: "grp-1",
			name: createCommand.name,
			description: null,
			membershipMode: "enumerated" as const,
			members: [],
			characteristics: [],
			periodStart: null,
			periodEnd: null,
			isActive: true,
			syncStatus: "synced" as const,
			updatedAt: new Date().toISOString(),
		};

		jest.mocked(groupApi.create).mockResolvedValue(serverModel);

		const result = await createGroupCommand(createCommand);

		expect(groupApi.create).toHaveBeenCalledWith(expectedDto);
		expect(result.name).toBe("Ops Team");

		const cached = await listCachedGroups();
		expect(cached.some((g) => g.id === "grp-1")).toBe(true);
	});

	it("deleteGroupCommand removes via API on flush", async () => {
		jest.mocked(groupApi.remove).mockResolvedValue(undefined);

		await createGroupCommand({
			...createCommand,
			name: "To Delete",
		});

		const before = await listCachedGroups();
		const id = before[0]?.id;
		expect(id).toBeDefined();

		await deleteGroupCommand(id!);

		expect(groupApi.remove).toHaveBeenCalledWith(id);
		const after = await listCachedGroups();
		expect(after.find((g) => g.id === id)).toBeUndefined();
	});
});
