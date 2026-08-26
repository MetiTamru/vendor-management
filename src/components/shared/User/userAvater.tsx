"use client";

import { LogIn, LogOut, User } from "lucide-react";
import { useLocale } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useVendorCoreSessionOptional } from "@/components/vendor-core/VendorCoreGate";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import {
	readDevSignedOutFromDocument,
	setDevSignedOutCookie,
} from "@/lib/auth/dev-session";
import { MOCK_ADMIN_USER, isMockAuthEnabled } from "@/lib/auth/mock-auth";
import { AUTH_PATHS } from "@/lib/auth/paths";
import { serverUserFromMe } from "@/lib/auth/session-user";
import { getInitials } from "@/lib/utils/nameUtils";

interface UserAvatarProps {
	className?: string;
}

type MenuUser = {
	name?: string | null;
	email?: string | null;
	image?: string | null;
};

function localeAuthPath(locale: string, path: string) {
	return `/${locale}${path}`;
}

const UserAvatar = ({ className: _className }: UserAvatarProps) => {
	const locale = useLocale();
	const mockAuth = isMockAuthEnabled();
	const vendorCore = useVendorCoreSessionOptional();
	const { data: session, isPending } = authClient.useSession();
	const mockSignedOut = mockAuth && readDevSignedOutFromDocument();

	const djangoUser =
		vendorCore?.shellAuth && vendorCore.user
			? serverUserFromMe(vendorCore.user)
			: null;

	const user: MenuUser | null = mockAuth
		? mockSignedOut
			? null
			: MOCK_ADMIN_USER
		: (djangoUser ?? session?.user ?? null);

	const handleSignOut = async () => {
		if (mockAuth) {
			setDevSignedOutCookie();
			window.location.assign(localeAuthPath(locale, AUTH_PATHS.login));
			return;
		}
		if (vendorCore?.shellAuth) {
			await vendorCore.signOut();
			// signOut already navigates; keep assign as fallback if navigation was blocked
			window.location.assign(localeAuthPath(locale, AUTH_PATHS.login));
			return;
		}
		await authClient.signOut();
		window.location.assign(localeAuthPath(locale, AUTH_PATHS.login));
	};

	const pendingDjango =
		Boolean(vendorCore?.shellAuth) && Boolean(vendorCore?.bootstrapping);
	if ((!mockAuth && isPending && !vendorCore?.shellAuth) || pendingDjango) {
		return <Skeleton className="size-10 shrink-0 rounded-full" />;
	}

	if (!user) {
		return (
			<Button variant="outline" size="sm" className="h-9 gap-1.5" asChild>
				<Link href={AUTH_PATHS.login}>
					<LogIn className="size-3.5" />
					Sign in
				</Link>
			</Button>
		);
	}

	const displayName = user.name?.trim() || "User";
	const displayEmail =
		user.email?.trim() || (mockAuth ? "Dev admin session" : "");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative h-10 w-10 rounded-full border border-border transition-colors hover:bg-muted/50"
				>
					{user.name ? (
						<Avatar className="h-9 w-9">
							<AvatarImage src={user.image ?? undefined} alt={displayName} />
							<AvatarFallback className="bg-primary/10">
								{getInitials(displayName)}
							</AvatarFallback>
						</Avatar>
					) : (
						<User className="h-5 w-5 text-muted-foreground" />
					)}
					<span className="sr-only">Open user menu</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{displayName}</p>
						{displayEmail ? (
							<p className="text-xs leading-none text-muted-foreground">
								{displayEmail}
							</p>
						) : null}
						{mockAuth ? (
							<p className="pt-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
								Dev admin (no Nest session)
							</p>
						) : null}
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="flex cursor-pointer items-center gap-2 text-red-600 focus:text-red-600"
					onSelect={(event) => {
						event.preventDefault();
						void handleSignOut();
					}}
				>
					<LogOut className="h-4 w-4" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserAvatar;
