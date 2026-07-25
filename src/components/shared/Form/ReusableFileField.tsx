import React from "react";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { MultipleFileUploader } from "./ReusableMultiFileUpload";

interface ReusableFileUploadFieldProps {
	name: string;
	labelKey: string; // Key for the label in the translation file
	descriptionKey?: string; // Key for the description in the translation file
	local?: string; // Optional namespace for translations
	required?: boolean; // Indicates if the field is required
	control: any; // Control object from react-hook-form or similar
	maxfiles?: number;
	maxSize?: number;
	onFilesChange?: (files: File[]) => void; // Callback to send files to the parent
}

const ReusableFileUploadField: React.FC<ReusableFileUploadFieldProps> = ({
	name,
	labelKey,
	descriptionKey,
	local,
	required = false,
	control,
	maxSize = 10 * 1024 * 1024,
	maxfiles = 1,
	onFilesChange,
}) => {
	const namespace = local || "common";
	const t = useTranslations(namespace);

	const handleUpload = async (files: File[]) => {
		// Notify parent component of uploaded files
		if (onFilesChange) {
			onFilesChange(files);
		}

		// Simulate file upload process
		for (let i = 0; i < 100; i++) {
			await new Promise((resolve) => setTimeout(resolve, 50));
		}
		console.log(
			"Files uploaded:",
			files.map((f) => f.name)
		);
	};

	return (
		<FormField
			control={control}
			name={name}
			render={() => (
				<FormItem>
					<FormLabel className="flex gap-2 items-center">
						{descriptionKey && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<Info size={15} />
									</TooltipTrigger>
									<TooltipContent className="bg-secondary">
										<FormDescription className="text-black">
											{t(descriptionKey)}
										</FormDescription>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
						{t(labelKey)}
						{required && <span className="text-red-500">*</span>}
					</FormLabel>
					<FormControl>
						<MultipleFileUploader
							acceptedFileTypes={{
								"image/*": [".png", ".jpg", ".jpeg", ".gif"],
								"application/pdf": [".pdf"],
								"application/msword": [".doc", ".docx"],
								"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
									[".docx"],
								"text/plain": [".txt"],
							}}
							maxFileSize={maxSize} // 10MB
							maxFiles={maxfiles}
							onUpload={handleUpload}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default ReusableFileUploadField;
