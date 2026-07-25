"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { getMutationErrorMessage } from "@/lib/api/errors";

import { GroupForm } from "../components/GroupForm";
import { formValuesToCreateCommand } from "../service/mappers/group-form.mapper";
import { useCreateGroupMutation } from "../service/mutations/group.mutation";
import type { GroupBusinessValues } from "../validation/group-business.schema";

export function GroupCreatePage() {
	const t = useTranslations("Groups.createPage");
	const router = useRouter();
	const createMutation = useCreateGroupMutation();

	async function handleSubmit(values: GroupBusinessValues) {
		try {
			const command = formValuesToCreateCommand(values);
			const created = await createMutation.mutateAsync(command);
			toast.success(t("success"));
			router.push(`/admin/groups/${created.id}`);
		} catch (error) {
			toast.error(getMutationErrorMessage(error));
		}
	}

	return (
		<div className="container max-w-2xl py-8">
			<Card>
				<CardHeader>
					<CardTitle>{t("title")}</CardTitle>
				</CardHeader>
				<CardContent>
					<GroupForm
						onSubmit={handleSubmit}
						isSubmitting={createMutation.isPending}
						submitLabel={t("submit")}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
