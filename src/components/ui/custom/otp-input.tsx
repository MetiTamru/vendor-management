"use client";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";

interface OTPInputProps {
	value: string;
	onChange: (value: string) => void;
	length?: number;
	containerClassName?: string;
	inputClassName?: string;
}

export function OTPInput({
	value,
	onChange,
	length = 6,
	containerClassName,
	inputClassName,
}: OTPInputProps) {
	return (
		<div className={containerClassName}>
			<InputOTP
				maxLength={length}
				value={value}
				onChange={onChange}
				pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
			>
				<InputOTPGroup>
					{Array.from({ length }).map((_, index) => (
						<InputOTPSlot
							key={index}
							index={index}
							className={`w-10 h-12 text-center border ${inputClassName}`}
						/>
					))}
				</InputOTPGroup>
			</InputOTP>
		</div>
	);
}
