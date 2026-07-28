"use client";

import { type FormEvent, useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/features/shared/vms/StatusBadge";
import { vmsApi } from "@/features/shared/vms/api";
import {
	useAddDocumentMutation,
	useCurrentVendor,
	useDocumentsList,
} from "@/features/shared/vms/queries";
import type { DocumentType } from "@/features/shared/vms/types";
import { formatDate } from "@/features/shared/vms/utils";

const documentTypes: DocumentType[] = [
	"tax_certificate",
	"insurance",
	"business_license",
	"contract",
	"w9",
	"other",
];

export function VendorDocumentsPage() {
	const { vendor } = useCurrentVendor();
	const { documents } = useDocumentsList(vmsApi.currentVendorId);
	const addDocument = useAddDocumentMutation();
	const [name, setName] = useState("");
	const [type, setType] = useState<DocumentType>("other");
	const visible = documents.filter(
		(document) => document.vendorId === vendor?.id
	);

	async function submit(event: FormEvent) {
		event.preventDefault();
		if (!vendor || !name.trim()) return;
		try {
			await addDocument.mutateAsync({
				vendorId: vendor.id,
				vendorName: vendor.legalName,
				name: name.trim(),
				type,
				status: "pending",
				expiresAt: null,
				visibility: "both",
			});
			toast.success("Document added");
			setName("");
			setType("other");
		} catch {
			toast.error("Could not add document");
		}
	}

	return (
		<div className="container space-y-6 py-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
				<p className="text-sm text-muted-foreground">
					Maintain compliance and company documents shared with the buyer.
				</p>
			</div>
			<div className="grid gap-6 lg:grid-cols-[1fr_360px]">
				<section className="overflow-hidden rounded-xl border bg-card">
					{visible.map((document) => (
						<div
							key={document.id}
							className="flex items-center justify-between gap-4 border-b p-5 last:border-0"
						>
							<div className="min-w-0">
								<p className="truncate text-sm font-medium">{document.name}</p>
								<p className="text-xs text-muted-foreground">
									{document.type.replace(/_/g, " ")} · Uploaded{" "}
									{formatDate(document.uploadedAt)}
									{document.expiresAt
										? ` · Expires ${formatDate(document.expiresAt)}`
										: ""}
								</p>
							</div>
							<StatusBadge status={document.status} />
						</div>
					))}
					{visible.length === 0 && (
						<p className="p-8 text-center text-sm text-muted-foreground">
							No documents uploaded.
						</p>
					)}
				</section>
				<form
					onSubmit={submit}
					className="h-fit space-y-5 rounded-xl border bg-card p-6 shadow-sm"
				>
					<div>
						<h2 className="font-semibold">Add document</h2>
						<p className="mt-1 text-xs text-muted-foreground">
							Enter the uploaded file name and classification.
						</p>
					</div>
					<div className="space-y-2">
						<Label htmlFor="name">Document name</Label>
						<Input
							id="name"
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder="Insurance Certificate.pdf"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label>Document type</Label>
						<Select
							value={type}
							onValueChange={(value) => setType(value as DocumentType)}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{documentTypes.map((item) => (
									<SelectItem key={item} value={item}>
										{item.replace(/_/g, " ")}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<Button
						className="w-full"
						type="submit"
						disabled={addDocument.isPending}
					>
						Add document
					</Button>
				</form>
			</div>
		</div>
	);
}
