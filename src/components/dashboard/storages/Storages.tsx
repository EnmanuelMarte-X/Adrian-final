"use client";

import {
	useStorages,
	useUpdateStorageOrderMutation,
} from "@/contexts/storages/queries";
import { getPageFromOffset, isArrayEmpty } from "@/lib/utils";
import { StorageComponent, DragStorageOverlay } from "./StorageComponent";
import { StorageSkeleton } from "./StorageSkeleton";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useRef, useState, memo, useCallback } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
	type DragStartEvent,
	DragOverlay,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { StorageType } from "@/types/models/storages";
import { Spinner } from "@/components/ui/spinner";
import { debounce } from "@/lib/debounce";
import { AlertCircleIcon, AlertOctagonIcon, WarehouseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortableStorageProps {
	storage: StorageType;
	tabIndex: number;
}

const SortableStorage = memo(({ storage, tabIndex }: SortableStorageProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: storage._id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const handleDragHandleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	const handleDragHandleTouch = (e: React.TouchEvent) => {
		e.stopPropagation();
	};

	return (
		<div ref={setNodeRef} style={style}>
			<div className="relative">
				<Link href={`storages/${storage._id}`}>
					<StorageComponent
						storage={storage}
						tabIndex={tabIndex}
						dragHandleProps={{
							...attributes,
							...listeners,
							onClick: handleDragHandleClick,
							onTouchStart: handleDragHandleTouch,
							style: {
								touchAction: "none",
							},
						}}
					/>
				</Link>
			</div>
		</div>
	);
});

SortableStorage.displayName = "SortableStorage";

export function Storages() {
	const [storages, setStorages] = useState<StorageType[]>([]);
	const [activeStorage, setActiveStorage] = useState<StorageType | null>(null);
	const [hasMore, setHasMore] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [offset, setOffset] = useState(0);
	const limit = 20;

	const updateStorageOrderMutation = useUpdateStorageOrderMutation();

	const { data, isError, isLoading, refetch } = useStorages({
		pagination: {
			page: getPageFromOffset(offset, limit),
			limit,
		},
	});

	const debouncedUpdateOrder = useCallback(
		(storageIds: string[]) => {
			const debouncedFn = debounce<(ids: string[]) => void>((ids) => {
				updateStorageOrderMutation.mutate(ids, {
					onError: () => {
						toast.error("Error de actualización", {
							description: "No se pudo actualizar el factura de los almacenes",
						});
					},
				});
			}, 800);

			return debouncedFn(storageIds);
		},
		[updateStorageOrderMutation],
	);

	useEffect(() => {
		if (data?.storages) {
			setStorages((prevStorages) => {
				if (offset === 0) {
					return data.storages;
				}

				const existingIds = new Set(prevStorages.map((storage) => storage._id));
				const newStorages = data.storages.filter(
					(storage) => !existingIds.has(storage._id),
				);

				return [...prevStorages, ...newStorages];
			});

			if (data.storages.length === 0 || data.storages.length < limit) {
				setHasMore(false);
			} else if (data.total !== undefined) {
				setHasMore(offset + data.storages.length < data.total);
			}
		}
	}, [data, offset]);

	useEffect(() => {
		if (offset === 0) {
			setHasMore(true);
		}
	}, [offset]);

	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadMoreRef = useCallback(
		(node: Element | null) => {
			if (isLoadingMore) return;

			if (observerRef.current) observerRef.current.disconnect();

			observerRef.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
					loadMoreItems();
				}
			});

			if (node) observerRef.current.observe(node);
		},
		[isLoadingMore, hasMore],
	);

	const loadMoreItems = useCallback(async () => {
		if (!hasMore || isLoadingMore) return;

		setIsLoadingMore(true);
		setOffset((prevOffset) => prevOffset + limit);
		setIsLoadingMore(false);
	}, [hasMore, isLoadingMore]);

	const containerRef = useRef<HTMLDivElement>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 250,
				tolerance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const draggedStorage = storages.find(
			(storage) => storage._id === active.id,
		);
		if (draggedStorage) {
			setActiveStorage(draggedStorage);
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		setActiveStorage(null);

		if (over && active.id !== over.id) {
			setStorages((items) => {
				const oldIndex = items.findIndex((item) => item._id === active.id);
				const newIndex = items.findIndex((item) => item._id === over.id);

				const newOrder = arrayMove(items, oldIndex, newIndex);

				const newStorageIds = newOrder.map((storage) => storage._id);
				debouncedUpdateOrder(newStorageIds).catch((error) =>
					console.error("Failed to update storage order:", error),
				);

				return newOrder;
			});
		}
	};

	if (isLoading) {
		return (
			<div className="container flex flex-wrap gap-4">
				{Array.from({ length: 9 }, (_, i) => (
					<StorageSkeleton key={i} />
				))}
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center size-full">
				<AlertOctagonIcon className="size-12 mb-4 text-destructive-foreground" />
				<h3 className="text-xl font-semibold text-destructive-foreground mb-2">
					Error al cargar los almacenes
				</h3>
				<p className="text-muted-foreground text-center max-w-md mb-6">
					Ocurrió un problema al intentar cargar la información de los
					almacenes. Por favor, intente nuevamente.
				</p>
				<Button variant="destructive" onClick={() => refetch()}>
					<AlertCircleIcon className="size-4" />
					<span>Intentar nuevamente</span>
				</Button>
			</div>
		);
	}

	if (isArrayEmpty(storages)) {
		return (
			<div className="flex flex-col items-center justify-center size-full py-12 px-4 text-center">
				<div className="flex items-center justify-center mb-4 rounded-full p-3 bg-secondary">
					<WarehouseIcon className="size-12 text-muted-foreground" />
				</div>
				<h3 className="text-xl font-semibold mb-2">
					No hay almacenes disponibles
				</h3>
				<p className="text-muted-foreground max-w-md mb-6">
					No se encontraron almacenes. Puedes crear un nuevo almacén para
					comenzar a organizar tus productos.
				</p>
			</div>
		);
	}

	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<div
					ref={containerRef}
					className="flex flex-wrap gap-4"
					style={{
						touchAction: "manipulation",
					}}
				>
					<SortableContext items={storages.map((storage) => storage._id)}>
						{storages.map((storage) => (
							<SortableStorage
								key={storage._id}
								storage={storage}
								tabIndex={0}
							/>
						))}
					</SortableContext>
				</div>
				<DragOverlay>
					{activeStorage ? (
						<DragStorageOverlay storage={activeStorage} />
					) : null}
				</DragOverlay>
			</DndContext>

			{hasMore && (
				<div ref={loadMoreRef} className="w-full py-4 flex justify-center">
					{isLoadingMore ? (
						<div className="flex gap-2 items-center">
							<Spinner className="size-4" />
							<span>Loading more...</span>
						</div>
					) : (
						<div className="h-8" />
					)}
				</div>
			)}
		</>
	);
}
