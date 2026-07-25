export interface SidebarNavItem {
	title: string;
	href?: string;
	/** ABAC component resource name for `hasComponentAccess` */
	permission?: string;
	items?: SidebarNavItem[];
}
