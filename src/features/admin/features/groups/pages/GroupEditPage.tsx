"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useRouter } from "@/i18n/navigation";
import { getMutationErrorMessage } from "@/lib/api/errors";

import { GroupForm } from "../components/GroupForm";
import {
	useGroup,
	useUpdateGroupMutation,
} from "../feature/queries/useGroupsQuery";
import {
	formValuesToUpdateCommand,
	groupModelToFormValues,
} from "../service/mappers/group-form.mapper";
import type { GroupBusinessValues } from "../validation/group-business.schema";

type GroupEditPageProps = {
	groupId: string;
};

export function GroupEditPage({ groupId }: GroupEditPageProps) {
	const t = useTranslations("Groups.editPage");
	const router = useRouter();
	const { group, isLoading, isNotFound } = useGroup(groupId);
	const updateMutation = useUpdateGroupMutation();

	async function handleSubmit(values: GroupBusinessValues) {
		try {
			const command = formValuesToUpdateCommand(groupId, values);
			await updateMutation.mutateAsync(command);
			toast.success(t("success"));
			router.push(`/admin/groups/${groupId}`);
		} catch (error) {
			toast.error(getMutationErrorMessage(error));
		}
	}

	if (isLoading) {
		return (
			<div className="container max-w-2xl space-y-4 py-8">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	if (isNotFound || !group) {
		return (
			<div className="container py-16 text-center">
				<h1 className="text-xl font-semibold">{t("notFound")}</h1>
				<Button className="mt-4" asChild>
					<Link href="/admin/settings?tab=groups">{t("backToList")}</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="container max-w-2xl py-8">
			<Card>
				<CardHeader>
					<CardTitle>{t("title")}</CardTitle>
				</CardHeader>
				<CardContent>
					<GroupForm
						defaultValues={groupModelToFormValues(group)}
						onSubmit={handleSubmit}
						isSubmitting={updateMutation.isPending}
						submitLabel={t("submit")}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
