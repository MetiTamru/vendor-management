import { Badge } from "@/components/ui/badge";

import type { SyncStatus } from "../types/group.types";

const labels: Record<SyncStatus, string> = {
	synced: "Synced",
	pending: "Pending sync",
	failed: "Sync failed",
};

const variants: Record<SyncStatus, "default" | "secondary" | "destructive"> = {
	synced: "secondary",
	pending: "default",
	failed: "destructive",
};

export function GroupSyncBadge({ status }: { status: SyncStatus }) {
	return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
