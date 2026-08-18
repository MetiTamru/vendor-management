"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";

import { GroupCharacteristicsSection } from "../components/GroupCharacteristicsSection";
import { GroupDetailCard } from "../components/GroupDetailCard";
import { GroupHeader } from "../components/GroupHeader";
import { GroupMembersSection } from "../components/GroupMembersSection";
import { useGroupTabs } from "../hooks/useGroupTabs";
import { useGroup } from "../feature/queries/useGroupsQuery";

type GroupDetailPageProps = {
	groupId: string;
};

export function GroupDetailPage({ groupId }: GroupDetailPageProps) {
	const { group, isLoading, isNotFound, isStale, hasSyncError, refetch } =
		useGroup(groupId);
	const { activeTab, setActiveTab } = useGroupTabs();

	if (isLoading) {
		return (
			<div className="container space-y-6 py-8">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-48 w-full" />
			</div>
		);
	}

	if (isNotFound || !group) {
		return (
			<div className="container py-16 text-center">
				<h1 className="text-xl font-semibold">Group not found</h1>
				<Button className="mt-4" asChild>
					<Link href="/admin/groups">Back to groups</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="container space-y-6 py-8">
			<div className="flex items-center gap-4">
				<Button variant="outline" size="sm" asChild>
					<Link href="/admin/groups">← Back</Link>
				</Button>
				{(isStale || hasSyncError) && (
					<Button variant="secondary" size="sm" onClick={() => refetch()}>
						Retry sync
					</Button>
				)}
			</div>

			<GroupHeader group={group} />

			<Tabs
				value={activeTab}
				onValueChange={(v) =>
					setActiveTab(v as "overview" | "members" | "characteristics")
				}
			>
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="members">Members</TabsTrigger>
					<TabsTrigger value="characteristics">Characteristics</TabsTrigger>
				</TabsList>
				<TabsContent value="overview" className="mt-4">
					<GroupDetailCard group={group} />
				</TabsContent>
				<TabsContent value="members" className="mt-4">
					<GroupMembersSection group={group} />
				</TabsContent>
				<TabsContent value="characteristics" className="mt-4">
					<GroupCharacteristicsSection group={group} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
