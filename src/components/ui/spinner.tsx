import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import type { SVGProps } from "react";

export const Spinner = ({ className }: SVGProps<SVGElement>) => {
	return <Loader2Icon className={cn("animate-spin", className)} />;
};
