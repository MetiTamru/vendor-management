"use client";

import Image from "next/image";
import { useState } from "react";

import { FileTextIcon, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	type FileWithPreview,
	type UseMultipleFileUploadProps,
	useMultipleFileUpload,
} from "@/hooks/use-multiFileupload";

interface MultipleFileUploaderProps extends UseMultipleFileUploadProps {
	onUpload: (files: File[]) => Promise<void>;
}

export function MultipleFileUploader({
	acceptedFileTypes,
	maxFileSize,
	maxFiles,
	onUpload,
}: MultipleFileUploaderProps) {
	const {
		files,
		setFiles,
		getRootProps,
		getInputProps,
		isDragActive,
		removeFile,
	} = useMultipleFileUpload({
		acceptedFileTypes,
		maxFileSize,
		maxFiles,
	});
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
	const handleUpload = async () => {
		setUploading(true);
		setUploadProgress(0);
		try {
			await onUpload(files);
			setUploadProgress(100);
			toast.success(
				`${files.length} file${files.length > 1 ? "s" : ""} uploaded successfully!`
			);
			setUploadedFiles([...files]);
			setFiles([]);
		} catch {
			toast.error("Failed to upload files. Please try again.");
		} finally {
			setUploading(false);
		}
	};

	const renderThumbnail = (file: FileWithPreview) => {
		if (file.fileType === "image") {
			return (
				<Image
					src={file.preview}
					alt={file.name}
					width={40}
					height={40}
					className="rounded object-cover"
				/>
			);
		} else {
			return <FileTextIcon className="h-10 w-10 text-gray-400" />;
		}
	};

	return (
		<div className="w-full max-w-md mx-auto">
			<div
				{...getRootProps()}
				className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
					isDragActive
						? "border-primary bg-primary/10"
						: "border-gray-300 hover:border-primary"
				}`}
			>
				<input {...getInputProps()} />
				<Upload className="mx-auto h-12 w-12 text-gray-400" />
				<p className="mt-2 text-sm text-gray-500">
					Drag &apos;n&apos; drop some files here, or click to select files
				</p>
				<p className="text-xs text-gray-500 mt-1">
					Max {maxFiles} files, up to{" "}
					{(maxFileSize ?? 5 * 1024 * 1024) / (1024 * 1024)}MB each
				</p>
			</div>

			{files.length > 0 && (
				<ul className="mt-4 space-y-2">
					{files.map((file) => (
						<li
							key={file.name}
							className="flex items-center justify-between p-2 bg-gray-100 rounded"
						>
							<div className="flex items-center space-x-2">
								{renderThumbnail(file)}
								<span className="text-sm truncate max-w-[200px]">
									{file.name}
								</span>
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => removeFile(file)}
								className="text-gray-500 hover:text-red-500"
							>
								<X className="h-4 w-4" />
							</Button>
						</li>
					))}
				</ul>
			)}

			{files.length > 0 && (
				<div className="mt-4">
					<Button
						onClick={handleUpload}
						disabled={uploading}
						className="w-full"
					>
						{uploading ? "Uploading..." : "Upload Files"}
					</Button>
					{uploading && <Progress value={uploadProgress} className="mt-2" />}
				</div>
			)}

			{uploadedFiles.length > 0 && (
				<div className="mt-6">
					<h3 className="text-lg font-semibold mb-2">Uploaded Files</h3>
					<ul className="grid grid-cols-2 gap-4">
						{uploadedFiles.map((file) => (
							<li
								key={file.name}
								className="flex flex-col items-center p-2 bg-gray-100 rounded"
							>
								<div className="w-20 h-20 flex items-center justify-center mb-2">
									{renderThumbnail(file)}
								</div>
								<span className="text-xs text-center truncate w-full">
									{file.name}
								</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
