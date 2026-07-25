import type { ReactNode } from "react";

import "flag-icons/css/flag-icons.min.css";

import "./globals.css";

export { metadata } from "@/constants/metadata";

type RootLayoutProps = {
	children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
	return children;
}
