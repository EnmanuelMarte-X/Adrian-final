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
				"relative bg-card border-y-6 border-x-7 border-secondary rounded-md overflow-hidden min-w-sm",
				isSelectionEnabled && "transition-all opacity-55",
				className,
			)}
			{...props}
		>
			<div className="bg-secondary h-3 w-full flex justify-around items-center">
				{[...Array(8)].map((_, i) => (
					<div
						key={i}
						className="w-1 h-1 bg-border rounded-full"
					/>
				))}
			</div>

			<div
				{...dragHandleProps}
				className="absolute top-10 -left-9 bg-secondary rounded-tr-md text-secondary-foreground/50 transform rotate-90 font-mono font-bold text-sm flex items-center gap-1 cursor-grab active:cursor-grabbing h-7 max-w-[11ch] w-full truncate touch-none select-none"
				style={{
					minHeight: "44px", // Aumentar área táctil para móviles
					minWidth: "44px",
					...dragHandleProps?.style,
				}}
			>
				<GripIcon className="size-3 min-w-3 min-h-3" />
				{storage._id?.substring(0, 6)}
			</div>

			<div className="pr-4 pb-4 pl-9">
				<h3 className="text-xl font-bold mb-3 mt-2">{storage.name}</h3>
				<div className="space-y-2 text-muted-foreground">
					<div className="flex items-center">
						<Package className="size-4 mr-1" />
						<span>{storage.productsCount}</span>
					</div>
					{createdAt && (
						<div className="flex items-center text-muted-foreground">
							<CalendarDays className="size-4 mr-1" />
							<span>{formatDate(createdAt, "dd/MM/yyyy")}</span>
						</div>
					)}
				</div>
			</div>

			<div className="h-3 bg-secondary w-full flex">
				{[...Array(12)].map((_, i) => (
					<div
						key={i}
						className="flex-1 border-r-3 last:border-0"
					/>
				))}
			</div>
		</div>
	);
}

export function DragStorageOverlay({ storage }: StorageComponentProps) {
	const createdAt = getDateFromObjectId(storage._id);

	return (
		<div className="relative bg-card border-y-6 border-x-7 border-secondary rounded-md overflow-hidden shadow-xl scale-105 opacity-85">
			<div className="bg-secondary h-3 w-full flex justify-around items-center">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className="w-1 h-1 bg-background/80 rounded-full"
					/>
				))}
			</div>

			<div className="absolute top-11 -left-9 bg-secondary rounded-tr-md text-secondary-foreground/50 transform rotate-90 font-mono font-bold text-sm flex items-center gap-1 cursor-grab active:cursor-grabbing h-7 max-w-[10ch] w-full truncate touch-none select-none">
				<GripIcon className="size-3 min-w-3 min-h-3" />
				{storage._id?.substring(0, 6)}
			</div>

			<div className="pr-4 pb-4 pl-9">
				<h3 className="text-xl font-bold mb-3 mt-2">{storage.name}</h3>
				<div className="space-y-2">
					<div className="flex items-center">
						<Package className="size-4" />
						<span>{storage.productsCount}</span>
					</div>
					{createdAt && (
						<div className="flex items-center text-muted-foreground">
							<CalendarDays className="size-4" />
							<span>{formatDate(createdAt, "dd/MM/yyyy")}</span>
						</div>
					)}
				</div>
			</div>

			<div className="h-3 bg-secondary w-full flex">
				{[...Array(12)].map((_, i) => (
					<div
						key={i}
						className="flex-1 border-r-3 last:border-0"
					/>
				))}
			</div>
		</div>
	);
}
