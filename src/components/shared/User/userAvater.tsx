"use client";

import { LogOut, User } from "lucide-react";

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
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils/nameUtils";

interface UserAvatarProps {
	className?: string;
}

const UserAvatar = ({ className: _className }: UserAvatarProps) => {
	const router = useRouter();
	const { data: session } = authClient.useSession();
	const user = session?.user;

	if (!user) return null;

	const handleSignOut = async () => {
		await authClient.signOut();
		router.push("/auth/login");
		router.refresh();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative h-10 w-10 rounded-full border border-gray-200 transition-colors hover:bg-gray-100/50"
				>
					{user.name ? (
						<Avatar className="h-9 w-9">
							<AvatarImage src={user.image ?? undefined} alt={user.name} />
							<AvatarFallback className="bg-primary/10">
								{getInitials(user.name)}
							</AvatarFallback>
						</Avatar>
					) : (
						<User className="h-5 w-5 text-gray-600" />
					)}
					<span className="sr-only">Open user menu</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{user.name}</p>
						<p className="text-xs leading-none text-gray-500">{user.email}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="flex cursor-pointer items-center gap-2 text-red-600"
					onClick={handleSignOut}
				>
					<LogOut className="h-4 w-4" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserAvatar;
