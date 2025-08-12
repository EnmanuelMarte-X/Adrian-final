import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function OrderValue({
	label,
	children,
	isLoading,
	classNames,
	align = "left",
}: {
	label?: string;
	children: React.ReactNode;
	isLoading?: boolean;
	classNames?: {
		container?: string;
		label?: string;
		value?: string;
		skeleton?: string;
	};
	align?: "left" | "right";
}) {
	return (
		<div className={cn("flex flex-col gap-y-2", classNames?.container)}>
			<h3
				className={cn(
					"font-semibold text-muted-foreground text-sm",
					align === "right" && "place-self-end text-right",
					classNames?.label,
				)}
			>
				{label}
			</h3>

			{isLoading ? (
				<Skeleton
					className={cn(
						"h-4 w-22",
						align === "right" && "place-self-end",
						classNames?.skeleton,
					)}
				/>
			) : (
				<span
					className={cn(align === "right" && "text-right", classNames?.value)}
				>
					{children}
				</span>
			)}
		</div>
	);
}
