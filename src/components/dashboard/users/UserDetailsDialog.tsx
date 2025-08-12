"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserBasicInfo } from "@/contexts/users/queries";
import { getInitials } from "@/lib/utils";
import type { UserBasicInfo } from "@/types/models/users";
import { AtSign, Mail, User as UserIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface UserDetailsDialogProps {
	userId: string;
	children?: React.ReactNode;
	userInfo?: UserBasicInfo;
	triggerLabel?: string;
	title?: string;
}

export function UserDetailsDialog({
	userId,
	children,
	userInfo: initialUserInfo,
	triggerLabel = "Ver detalles",
	title = "Detalles del usuario",
}: UserDetailsDialogProps) {
	const [open, setOpen] = useState(false);
	const { data: fetchedUserInfo, isLoading } = useUserBasicInfo(
		initialUserInfo ? undefined : userId,
	);

	const userInfo = initialUserInfo || fetchedUserInfo;

	const renderUserInfo = () => {
		if (isLoading) {
			return (
				<div className="flex flex-col gap-4 py-4">
					<div className="flex items-center gap-4">
						<Skeleton className="h-12 w-12 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-[250px]" />
							<Skeleton className="h-4 w-[200px]" />
						</div>
					</div>
					<Skeleton className="h-4 w-[300px]" />
					<Skeleton className="h-4 w-[250px]" />
				</div>
			);
		}

		if (!userInfo) {
			return (
				<div className="flex flex-col items-center py-8">
					<UserIcon className="h-16 w-16 text-muted-foreground mb-4" />
					<p className="text-muted-foreground text-center">
						No se encontró información del usuario.
					</p>
				</div>
			);
		}

		return (
			<div className="flex flex-col gap-6 py-4">
				<div className="flex items-center gap-4">
					<Avatar className="h-16 w-16">
						<AvatarImage src={userInfo.avatar} alt={userInfo.firstName} />
						<AvatarFallback>
							{getInitials(`${userInfo.firstName} ${userInfo.lastName}`)}
						</AvatarFallback>
					</Avatar>
					<div>
						<h3 className="text-xl font-semibold">
							{userInfo.firstName} {userInfo.lastName}
						</h3>
						<p className="text-sm text-muted-foreground flex items-center gap-1">
							<AtSign className="h-3 w-3" /> {userInfo.username}
						</p>
					</div>
				</div>

				<div className="grid gap-4">
					<div className="flex items-center gap-2">
						<Mail className="size-4 text-muted-foreground" />
						<span>{userInfo.email}</span>
					</div>
				</div>
			</div>
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{children || <Button variant="outline">{triggerLabel}</Button>}
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						Información detallada del usuario
					</DialogDescription>
				</DialogHeader>
				{renderUserInfo()}
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cerrar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
