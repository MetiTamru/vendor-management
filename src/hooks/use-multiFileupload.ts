import { useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";

export type FileWithPreview = File & {
	preview: string;
	fileType: "image" | "document";
};

export type UseMultipleFileUploadProps = {
	acceptedFileTypes: Record<string, string[]>;
	maxFileSize?: number;
	maxFiles?: number;
};

export function useMultipleFileUpload({
	acceptedFileTypes,
	maxFileSize = 5 * 1024 * 1024, // 5MB default
	maxFiles = 5,
}: UseMultipleFileUploadProps) {
	const [files, setFiles] = useState<FileWithPreview[]>([]);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			setFiles((prevFiles) => {
				const newFiles = acceptedFiles.map((file) =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
						fileType: file.type.startsWith("image/")
							? "image"
							: ("document" as "image" | "document"), // Explicitly cast
					})
				);
				return [...prevFiles, ...newFiles].slice(0, maxFiles);
			});
		},
		[maxFiles]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: acceptedFileTypes,
		maxSize: maxFileSize,
		maxFiles,
	});

	const removeFile = useCallback((fileToRemove: FileWithPreview) => {
		setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
		URL.revokeObjectURL(fileToRemove.preview);
	}, []);

	return {
		files,
		setFiles,
		getRootProps,
		getInputProps,
		isDragActive,
		removeFile,
	};
}
