import { MemberDetailPage } from "@/features/admin/features/members/pages/MemberDetailPage";

type PageProps = {
	params: Promise<{ memberId: string }>;
};

export default async function Page({ params }: PageProps) {
	const { memberId } = await params;
	return <MemberDetailPage memberId={memberId} />;
}
