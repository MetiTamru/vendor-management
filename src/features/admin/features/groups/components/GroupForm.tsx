"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
	type GroupBusinessValues,
	groupBusinessSchema,
} from "../validation/group-business.schema";

type GroupFormProps = {
	defaultValues?: Partial<GroupBusinessValues>;
	onSubmit: (values: GroupBusinessValues) => void | Promise<void>;
	isSubmitting?: boolean;
	submitLabel?: string;
};

const emptyDefaults: GroupBusinessValues = {
	name: "",
	description: "",
	membershipMode: "enumerated",
	members: [],
	characteristics: [],
	periodStart: null,
	periodEnd: null,
};

export function GroupForm({
	defaultValues,
	onSubmit,
	isSubmitting,
	submitLabel = "Save group",
}: GroupFormProps) {
	const form = useForm<GroupBusinessValues>({
		resolver: zodResolver(groupBusinessSchema),
		defaultValues: { ...emptyDefaults, ...defaultValues },
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									value={field.value ?? ""}
									onChange={(e) => field.onChange(e.target.value || null)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="membershipMode"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Membership mode</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select mode" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="enumerated">Enumerated</SelectItem>
									<SelectItem value="definitional">Definitional</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="grid gap-4 sm:grid-cols-2">
					<FormField
						control={form.control}
						name="periodStart"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Period start</FormLabel>
								<FormControl>
									<Input type="date" {...field} value={field.value ?? ""} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="periodEnd"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Period end</FormLabel>
								<FormControl>
									<Input type="date" {...field} value={field.value ?? ""} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Saving..." : submitLabel}
				</Button>
			</form>
		</Form>
	);
}
