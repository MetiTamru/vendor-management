/** Stable internal contracts — UI and application layer only. */

export type SyncStatus = "synced" | "pending" | "failed";

export type MembershipMode = "enumerated" | "definitional";

export type GroupMember = {
	id: string;
	externalId: string | null;
	displayName: string;
	role: string | null;
};

export type GroupCharacteristic = {
	id: string;
	key: string;
	operator: "eq" | "neq" | "in" | "gte" | "lte";
	value: string | number | string[];
};

export type GroupModel = {
	id: string;
	name: string;
	description: string | null;
	membershipMode: MembershipMode;
	members: GroupMember[];
	characteristics: GroupCharacteristic[];
	periodStart: string | null;
	periodEnd: string | null;
	isActive: boolean;
	syncStatus: SyncStatus;
	updatedAt: string;
};

export type CreateGroupCommand = {
	name: string;
	description?: string | null;
	membershipMode: MembershipMode;
	members: Omit<GroupMember, "id">[];
	characteristics: Omit<GroupCharacteristic, "id">[];
	periodStart?: string | null;
	periodEnd?: string | null;
};

export type UpdateGroupCommand = Partial<CreateGroupCommand> & {
	id: string;
};

export type GroupListFilters = {
	search: string;
	membershipMode: MembershipMode | "all";
};
