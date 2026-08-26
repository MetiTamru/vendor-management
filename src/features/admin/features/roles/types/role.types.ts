export type RoleModel = {
	id: string;
	/** Human-readable label (display_name from API). */
	name: string;
	/** Stable role key (name from API). */
	slug: string;
	permissions: string[];
	isSystemRole: boolean;
	description: string | null;
};
