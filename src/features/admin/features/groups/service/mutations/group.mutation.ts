"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getMutationErrorMessage } from "@/lib/api/errors";
import { toastMutationError } from "@/lib/api/mutation-toast";

import type {
	CreateGroupCommand,
	UpdateGroupCommand,
} from "../../types/group.types";
import {
	createGroupCommand,
	deleteGroupCommand,
	updateGroupCommand,
} from "../commands/group.command";
import { groupQueryKeys } from "../queries/group.query";

export function useCreateGroupMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (command: CreateGroupCommand) => createGroupCommand(command),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: groupQueryKeys.all });
		},
		onError: (error) => {
			toastMutationError(error, "Failed to create group");
		},
	});
}

export function useUpdateGroupMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (command: UpdateGroupCommand) => updateGroupCommand(command),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: groupQueryKeys.all });
			queryClient.invalidateQueries({
				queryKey: groupQueryKeys.detail(variables.id),
			});
		},
		onError: (error) => {
			toastMutationError(error, "Failed to update group");
		},
	});
}

export function useDeleteGroupMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteGroupCommand(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: groupQueryKeys.all });
			toast.success("Group deleted");
		},
		onError: (error) => {
			toast.error(getMutationErrorMessage(error));
		},
	});
}
