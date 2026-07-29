"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type DashboardWidgetId =
	| "kpis"
	| "recentActivity"
	| "processingTrend"
	| "vendorStatus"
	| "alerts"
	| "quickActions"
	| "expiringDocs"
	| "activityFeed";

export const DEFAULT_DASHBOARD_WIDGETS: DashboardWidgetId[] = [
	"kpis",
	"recentActivity",
	"processingTrend",
	"vendorStatus",
	"alerts",
	"quickActions",
	"expiringDocs",
	"activityFeed",
];

export const DASHBOARD_WIDGET_LABELS: Record<DashboardWidgetId, string> = {
	kpis: "KPI cards",
	recentActivity: "Recent file activity",
	processingTrend: "Processing trend",
	vendorStatus: "Vendor status",
	alerts: "Alerts",
	quickActions: "Quick actions",
	expiringDocs: "Expiring documents",
	activityFeed: "Activity feed",
};

type DashboardWidgetsState = {
	enabledWidgets: DashboardWidgetId[];
	toggleWidget: (id: DashboardWidgetId) => void;
	setWidgets: (ids: DashboardWidgetId[]) => void;
	resetWidgets: () => void;
	isEnabled: (id: DashboardWidgetId) => boolean;
};

export const useDashboardWidgetsStore = create<DashboardWidgetsState>()(
	persist(
		(set, get) => ({
			enabledWidgets: [...DEFAULT_DASHBOARD_WIDGETS],
			toggleWidget: (id) =>
				set((state) => {
					const enabled = state.enabledWidgets.includes(id);
					return {
						enabledWidgets: enabled
							? state.enabledWidgets.filter((item) => item !== id)
							: [...state.enabledWidgets, id],
					};
				}),
			setWidgets: (ids) => set({ enabledWidgets: ids }),
			resetWidgets: () =>
				set({ enabledWidgets: [...DEFAULT_DASHBOARD_WIDGETS] }),
			isEnabled: (id) => get().enabledWidgets.includes(id),
		}),
		{
			name: "admin-dashboard-widgets",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				enabledWidgets: state.enabledWidgets,
			}),
		}
	)
);
