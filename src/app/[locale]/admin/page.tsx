import { redirect } from "next/navigation";

type Props = {
	params: Promise<{ locale: string }>;
};

/** `/admin` redirects to locale home dashboard (`/en`). */
export default async function AdminIndexRedirect({ params }: Props) {
	const { locale } = await params;
	redirect(`/${locale}`);
}
