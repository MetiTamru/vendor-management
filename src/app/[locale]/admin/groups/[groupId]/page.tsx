import { GroupDetailPage } from "@/features/admin/features/groups/pages/GroupDetailPage";

type PageProps = {
	params: Promise<{ groupId: string }>;
};

export default async function AdminGroupDetailRoute({ params }: PageProps) {
	const { groupId } = await params;
	return <GroupDetailPage groupId={groupId} />;
}
