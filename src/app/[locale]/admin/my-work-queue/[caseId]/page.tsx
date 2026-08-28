import { WorkQueueDetailPage } from "@/features/admin/features/my-work-queue/pages/WorkQueueDetailPage";

type PageProps = {
	params: Promise<{ caseId: string }>;
};

export default async function Page({ params }: PageProps) {
	const { caseId } = await params;
	return <WorkQueueDetailPage caseId={caseId} />;
}
