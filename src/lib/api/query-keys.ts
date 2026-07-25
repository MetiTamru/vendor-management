import { groupQueryKeys } from "@/features/admin/features/groups/service/queries/group.query";

export const queryKeys = {
	group: groupQueryKeys,
	user: {
		all: ["user"] as const,
		me: () => [...queryKeys.user.all, "me"] as const,
	},
} as const;
