import { GroupEditPage } from "@/features/admin/features/groups/pages/GroupEditPage";

type PageProps = {
	params: Promise<{ groupId: string }>;
};

export default async function AdminGroupEditRoute({ params }: PageProps) {
	const { groupId } = await params;
	return <GroupEditPage groupId={groupId} />;
}
