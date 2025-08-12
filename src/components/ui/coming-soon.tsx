"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComingSoonProps {
	title?: string;
	description?: string;
	className?: string;
}

export function ComingSoon({
	title = "Próximamente",
	description = "Esta funcionalidad estará disponible muy pronto. Estamos trabajando para brindarte la mejor experiencia.",
	className = "",
}: ComingSoonProps) {
	return (
		<Card
			className={cn(
				"border-dashed border-2 border-muted-foreground/30 max-w-3xl",
				className,
			)}
		>
			<CardHeader className="text-center">
				<div className="flex justify-center mb-4">
					<div className="relative">
						<Clock className="h-12 w-12 text-muted-foreground/60" />
						<Sparkles className="h-6 w-6 text-primary absolute -top-1 -right-1" />
					</div>
				</div>
				<CardTitle className="text-xl text-muted-foreground">{title}</CardTitle>
				<CardDescription className="text-center max-w-md mx-auto">
					{description}
				</CardDescription>
			</CardHeader>
			<CardContent className="text-center">
				<Badge>
					<Clock className="h-3 w-3 mr-1" />
					Próximamente
				</Badge>
			</CardContent>
		</Card>
	);
}
