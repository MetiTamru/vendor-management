"use client";

import { useEffect, useMemo, useState } from "react";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type {
	ConnectionDto,
	IntakeJobDto,
	VendorDto,
} from "@/lib/vendor-core/types";

const FILE_TYPES = [
	"auto",
	"837",
	"837P",
	"837I",
	"834",
	"835",
	"999",
	"277CA",
	"accumulator",
	"provider_roster",
	"unknown",
] as const;

const STATUSES = ["draft", "active", "paused", "disabled"] as const;

export type IntakeJobFormValues = {
	name: string;
	vendor: string;
	connection: string;
	file_type: string;
	filename_pattern: string;
	schedule_cron: string;
	schedule_timezone: string;
	status: string;
};

const EMPTY_VALUES: IntakeJobFormValues = {
	name: "",
	vendor: "",
	connection: "",
	file_type: "auto",
	filename_pattern: "*",
	schedule_cron: "",
	schedule_timezone: "UTC",
	status: "draft",
};

function jobToValues(job: IntakeJobDto): IntakeJobFormValues {
	return {
		name: job.name ?? "",
		vendor: job.vendor_id,
		connection: job.connection_id,
		file_type: job.file_type || "auto",
		filename_pattern: job.filename_pattern || "*",
		schedule_cron: job.schedule_cron ?? "",
		schedule_timezone: job.schedule_timezone || "UTC",
		status: job.status || "draft",
	};
}

export function IntakeJobFormDialog({
	open,
	onOpenChange,
	job,
	vendors,
	connections,
	saving,
	error,
	onSubmit,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	job?: IntakeJobDto | null;
	vendors: VendorDto[];
	connections: ConnectionDto[];
	saving?: boolean;
	error?: string | null;
	onSubmit: (values: IntakeJobFormValues) => Promise<void> | void;
}) {
	const [values, setValues] = useState<IntakeJobFormValues>(EMPTY_VALUES);

	useEffect(() => {
		if (!open) return;
		setValues(job ? jobToValues(job) : EMPTY_VALUES);
	}, [open, job]);

	const vendorConnections = useMemo(
		() =>
			values.vendor
				? connections.filter((c) => c.vendor_id === values.vendor)
				: connections,
		[connections, values.vendor]
	);

	function patch<K extends keyof IntakeJobFormValues>(
		key: K,
		value: IntakeJobFormValues[K]
	) {
		setValues((current) => {
			const next = { ...current, [key]: value };
			if (key === "vendor" && current.connection) {
				const stillValid = connections.some(
					(c) => c.id === current.connection && c.vendor_id === value
				);
				if (!stillValid) next.connection = "";
			}
			return next;
		});
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<form
					className="grid gap-4"
					onSubmit={(e) => {
						e.preventDefault();
						void onSubmit(values);
					}}
				>
					<DialogHeader>
						<DialogTitle>
							{job ? "Edit intake job" : "Create intake job"}
						</DialogTitle>
						<DialogDescription>
							Required fields are name, vendor, and connection.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-2">
						<Label htmlFor="intake-job-name">Name</Label>
						<Input
							id="intake-job-name"
							value={values.name}
							onChange={(e) => patch("name", e.target.value)}
							required
						/>
					</div>

					<div className="grid gap-2">
						<Label>Vendor</Label>
						<Select
							value={values.vendor}
							onValueChange={(value) => patch("vendor", value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select vendor" />
							</SelectTrigger>
							<SelectContent>
								{vendors.map((vendor) => (
									<SelectItem key={vendor.id} value={vendor.id}>
										{vendor.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid gap-2">
						<Label>Connection</Label>
						<Select
							value={values.connection}
							onValueChange={(value) => patch("connection", value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select connection" />
							</SelectTrigger>
							<SelectContent>
								{vendorConnections.map((connection) => (
									<SelectItem key={connection.id} value={connection.id}>
										{connection.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="grid gap-2">
							<Label>File type</Label>
							<Select
								value={values.file_type}
								onValueChange={(value) => patch("file_type", value)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{FILE_TYPES.map((type) => (
										<SelectItem key={type} value={type}>
											{type}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid gap-2">
							<Label>Status</Label>
							<Select
								value={values.status}
								onValueChange={(value) => patch("status", value)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{STATUSES.map((status) => (
										<SelectItem key={status} value={status}>
											{status}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="intake-job-pattern">Filename pattern</Label>
						<Input
							id="intake-job-pattern"
							value={values.filename_pattern}
							onChange={(e) => patch("filename_pattern", e.target.value)}
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="grid gap-2">
							<Label htmlFor="intake-job-cron">Schedule cron</Label>
							<Input
								id="intake-job-cron"
								placeholder="0 6 * * *"
								value={values.schedule_cron}
								onChange={(e) => patch("schedule_cron", e.target.value)}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="intake-job-tz">Timezone</Label>
							<Input
								id="intake-job-tz"
								value={values.schedule_timezone}
								onChange={(e) => patch("schedule_timezone", e.target.value)}
							/>
						</div>
					</div>

					{error ? <p className="text-sm text-destructive">{error}</p> : null}

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={
								saving || !values.name || !values.vendor || !values.connection
							}
						>
							{saving ? <Loader2 className="animate-spin" /> : null}
							{job ? "Save" : "Create"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
