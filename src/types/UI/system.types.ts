export interface SidebarNavItem {
	title: string;
	href?: string;
	/** ABAC component resource name for `hasComponentAccess` */
	permission?: string;
	/** Sidebar section group key (overview, procurement, governance, …) */
	section?: string;
	items?: SidebarNavItem[];
}
