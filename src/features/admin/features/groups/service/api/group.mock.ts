import type { ApiIdentityGroupDto } from "../../dto/group.dto";

/** Dev fallback when remote API is unavailable — replace with real API only. */
export const MOCK_GROUPS: ApiIdentityGroupDto[] = [
	{
		id: "grp-1",
		name: "Engineering",
		description: "Core product engineering",
		membership_mode: "enumerated",
		members: [
			{
				id: "m-1",
				display_name: "Ada Lovelace",
				role: "lead",
			},
		],
		characteristics: [],
		period_start: "2025-01-01",
		period_end: "2025-12-31",
		is_active: true,
		sync_status: "synced",
		updated_at: new Date().toISOString(),
	},
	{
		id: "grp-2",
		name: "High-value customers",
		description: "Definitional segment by spend",
		membership_mode: "definitional",
		members: [],
		characteristics: [
			{
				id: "c-1",
				key: "lifetime_value",
				operator: "gte",
				value: 10000,
			},
		],
		is_active: true,
		sync_status: "pending",
		updated_at: new Date().toISOString(),
	},
];
