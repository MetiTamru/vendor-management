"use client";

import { useEffect, useRef } from "react";

import { useRouter } from "@/i18n/navigation";

const SHORTCUTS: Record<string, string> = {
	d: "/",
	v: "/admin/vendors",
	f: "/admin/file-monitoring",
	r: "/admin/reports",
	s: "/admin/settings",
	a: "/admin/activity",
	e: "/admin/error-management",
};

function isTypingTarget(target: EventTarget | null) {
	if (!(target instanceof HTMLElement)) return false;
	const tag = target.tagName;
	return (
		tag === "INPUT" ||
		tag === "TEXTAREA" ||
		tag === "SELECT" ||
		target.isContentEditable
	);
}

export function useAdminKeyboardShortcuts() {
	const router = useRouter();
	const pendingG = useRef(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		function clearPending() {
			pendingG.current = false;
			if (timer.current) {
				clearTimeout(timer.current);
				timer.current = null;
			}
		}

		function onKeyDown(event: KeyboardEvent) {
			if (event.metaKey || event.ctrlKey || event.altKey) return;
			if (isTypingTarget(event.target)) return;

			const key = event.key.toLowerCase();

			if (pendingG.current) {
				const href = SHORTCUTS[key];
				clearPending();
				if (href) {
					event.preventDefault();
					router.push(href);
				}
				return;
			}

			if (key === "g") {
				pendingG.current = true;
				timer.current = setTimeout(clearPending, 1000);
			}
		}

		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			clearPending();
		};
	}, [router]);
}
