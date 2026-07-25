"use client";

import Image from "next/image";

import { useTheme } from "next-themes";

import { IMAGES } from "@/constants/files";
import { siteConfig } from "@/constants/siteconfig";

type Props = {
	whiteOnly?: boolean;
};

const Logo = (props: Props) => {
	const { theme, systemTheme } = useTheme();

	const currentTheme = theme === "system" ? systemTheme : theme;
	if (props.whiteOnly) {
		return (
			<Image
				src={IMAGES.colLogo}
				alt={`${siteConfig.name} Logo`}
				width={140}
				height={140}
				className={currentTheme === "dark" ? "h-28 w-32" : "h-32 w-36"}
			/>
		);
	} else {
		return (
			<div>
				<Image
					src={currentTheme === "dark" ? IMAGES.colLogo : IMAGES.logoIcon}
					alt={`${siteConfig.name} Logo`}
					width={140}
					height={100}
					className={currentTheme === "dark" ? "h-28 w-32" : "h-32 w-36"}
				/>
			</div>
		);
	}
};

export default Logo;
