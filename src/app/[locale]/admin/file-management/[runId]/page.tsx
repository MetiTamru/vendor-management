import { redirect } from "next/navigation";

type Props = {
	params: Promise<{ locale: string; runId: string }>;
};

export default async function Page({ params }: Props) {
	const { locale, runId } = await params;
	redirect(`/${locale}/admin/file-monitoring/${runId}`);
}
