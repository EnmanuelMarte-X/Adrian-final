import { useClickOutside } from "@/hooks/use-click-outside";
import { cn, getDateFromObjectId } from "@/lib/utils";
import type { StorageType } from "@/types/models/storages";
import { formatDate } from "date-fns";
import { CalendarDays, GripIcon, Package } from "lucide-react";
import { useRef } from "react";

export interface StorageComponentProps
	extends Omit<React.ComponentProps<"div">, "children"> {
	storage: StorageType;
	isSelectionEnabled?: boolean;
	onClickOutside?: () => void;
	dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function StorageComponent({
	storage,
	isSelectionEnabled,
	className,
	onClickOutside,
	dragHandleProps,
	...props
}: StorageComponentProps) {
	const ref = useRef<HTMLDivElement>(null);
	const createdAt = getDateFromObjectId(storage._id);

	useClickOutside(ref, onClickOutside, {
		enabled: isSelectionEnabled,
	});

	return (
		<div
			ref={ref}
			className={cn(
				"relative bg-card border-y-4 sm:border-y-6 border-x-4 sm:border-x-7 border-secondary rounded-md overflow-hidden min-w-[200px] sm:min-w-sm",
				isSelectionEnabled && "transition-all opacity-55",
				className,
			)}
			{...props}
		>
			<div className="bg-secondary h-2 sm:h-3 w-full flex justify-around items-center">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-border rounded-full"
					/>
				))}
			</div>

			<div
				{...dragHandleProps}
				className="absolute top-6 sm:top-10 -left-6 sm:-left-9 bg-secondary rounded-tr-md text-secondary-foreground/50 transform rotate-90 font-mono font-bold text-xs sm:text-sm flex items-center gap-0.5 sm:gap-1 cursor-grab active:cursor-grabbing h-5 sm:h-7 max-w-[8ch] sm:max-w-[11ch] w-full truncate touch-none select-none"
				style={{
					minHeight: "44px",
					minWidth: "44px",
					...dragHandleProps?.style,
				}}
			>
				<GripIcon className="size-2.5 sm:size-3 min-w-2.5 sm:min-w-3 min-h-2.5 sm:min-h-3" />
				{storage._id?.substring(0, 4)}
			</div>

			<div className="pr-2 sm:pr-4 pb-2 sm:pb-4 pl-6 sm:pl-9">
				<h3 className="text-base sm:text-xl font-bold mb-1.5 sm:mb-3 mt-1 sm:mt-2 truncate">{storage.name}</h3>
				<div className="space-y-1 sm:space-y-2 text-muted-foreground">
					<div className="flex items-center">
						<Package className="size-3 sm:size-4 mr-1" />
						<span className="text-xs sm:text-sm">{storage.productsCount}</span>
					</div>
					{createdAt && (
						<div className="flex items-center text-muted-foreground">
							<CalendarDays className="size-3 sm:size-4 mr-1" />
							<span className="text-xs sm:text-sm">{formatDate(createdAt, "dd/MM/yyyy")}</span>
						</div>
					)}
				</div>
			</div>

			<div className="h-2 sm:h-3 bg-secondary w-full flex">
				{[...Array(8)].map((_, i) => (
					<div
						key={i}
						className="flex-1 border-r-2 sm:border-r-3 last:border-0"
					/>
				))}
			</div>
		</div>
	);
}

export function DragStorageOverlay({ storage }: StorageComponentProps) {
	const createdAt = getDateFromObjectId(storage._id);

	return (
		<div className="relative bg-card border-y-4 sm:border-y-6 border-x-4 sm:border-x-7 border-secondary rounded-md overflow-hidden shadow-xl scale-105 opacity-85 min-w-[200px] sm:min-w-sm">
			<div className="bg-secondary h-2 sm:h-3 w-full flex justify-around items-center">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-background/80 rounded-full"
					/>
				))}
			</div>

			<div className="absolute top-6 sm:top-11 -left-6 sm:-left-9 bg-secondary rounded-tr-md text-secondary-foreground/50 transform rotate-90 font-mono font-bold text-xs sm:text-sm flex items-center gap-0.5 sm:gap-1 cursor-grab active:cursor-grabbing h-5 sm:h-7 max-w-[8ch] sm:max-w-[10ch] w-full truncate touch-none select-none">
				<GripIcon className="size-2.5 sm:size-3 min-w-2.5 sm:min-w-3 min-h-2.5 sm:min-h-3" />
				{storage._id?.substring(0, 4)}
			</div>

			<div className="pr-2 sm:pr-4 pb-2 sm:pb-4 pl-6 sm:pl-9">
				<h3 className="text-base sm:text-xl font-bold mb-1.5 sm:mb-3 mt-1 sm:mt-2 truncate">{storage.name}</h3>
				<div className="space-y-1 sm:space-y-2">
					<div className="flex items-center">
						<Package className="size-3 sm:size-4 mr-1" />
						<span className="text-xs sm:text-sm">{storage.productsCount}</span>
					</div>
					{createdAt && (
						<div className="flex items-center text-muted-foreground">
							<CalendarDays className="size-3 sm:size-4 mr-1" />
							<span className="text-xs sm:text-sm">{formatDate(createdAt, "dd/MM/yyyy")}</span>
						</div>
					)}
				</div>
			</div>

			<div className="h-2 sm:h-3 bg-secondary w-full flex">
				{[...Array(8)].map((_, i) => (
					<div
						key={i}
						className="flex-1 border-r-2 sm:border-r-3 last:border-0"
					/>
				))}
			</div>
		</div>
	);
}
