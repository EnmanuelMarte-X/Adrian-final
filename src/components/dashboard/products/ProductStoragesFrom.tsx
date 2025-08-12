import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { CheckIcon, PlusIcon, XIcon, PencilIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StoragesSelect } from "../storages/StoragesSelect";
import type { ProductStorageType } from "@/types/models/products";
import type { StorageType } from "@/types/models/storages";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

type ProductStorageWithDisplay = ProductStorageType & {
	displayName: string;
};

// Función para cargar el nombre del almacén desde la API
const useStorageName = (storage?: ProductStorageWithDisplay) => {
	const [displayName, setDisplayName] = useState<string | undefined>(
		storage?.displayName,
	);
	const [isLoadingName, setIsLoadingName] = useState(false);

	useEffect(() => {
		const loadStorageName = async () => {
			if (storage && !storage.displayName && storage.storageId) {
				try {
					setIsLoadingName(true);
					const response = await fetch(`/api/storages/${storage.storageId}`);
					if (response.ok) {
						const storageData = await response.json();
						setDisplayName(storageData.name);
						storage.displayName = storageData.name;
					} else {
						setDisplayName("Error al cargar");
					}
				} catch (error) {
					console.error("Error al cargar el nombre del almacén:", error);
					setDisplayName("Error al cargar");
				} finally {
					setTimeout(() => {
						setIsLoadingName(false);
					}, 300);
				}
			}
		};

		loadStorageName();
	}, [storage]);

	return { displayName, isLoadingName };
};

function ProductStorageInput({
	onSubmit,
	isFinish,
	onCancel,
	storage,
	isEditing,
	editingStorageData,
}: {
	onSubmit: (storage: StorageType, stock: number, showInStore: boolean) => void;
	isFinish?: boolean;
	onCancel?: (action?: "edit" | "delete" | "cancel") => void;
	storage?: ProductStorageWithDisplay;
	isEditing?: boolean;
	editingStorageData?: StorageType;
}) {
	const [selectedStorage, setSelectedStorage] = useState<StorageType | null>(
		editingStorageData || null,
	);
	const [showInStore, setShowInStore] = useState(Boolean(storage?.showInStore));

	const { displayName, isLoadingName } = useStorageName(storage);

	useEffect(() => {
		if (editingStorageData) {
			setSelectedStorage(editingStorageData);
		}
	}, [editingStorageData]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: { stock: storage?.stock || 0 },
	});

	const onFormSubmit = handleSubmit((data) => {
		const storageToUse = selectedStorage || editingStorageData;
		if (storageToUse) {
			onSubmit(storageToUse, data.stock, showInStore);
		}
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmitWithLoading = useCallback(() => {
		setIsSubmitting(true);
		setTimeout(() => {
			onFormSubmit();
			setIsSubmitting(false);
		}, 200);
	}, [onFormSubmit]);

	if (isFinish && storage) {
		return (
			<>
				<div className="flex justify-between items-center p-2 border rounded-md">
					<div>
						<p className="font-medium">
							{isLoadingName ? (
								<span className="flex items-center gap-1">
									<Spinner className="size-3" />
									<span className="animate-pulse">Cargando...</span>
								</span>
							) : (
								displayName || storage.displayName || "Almacén"
							)}
						</p>
						<p className="text-sm text-muted-foreground">
							Stock: {storage.stock}
						</p>
					</div>
					<div className="flex gap-x-1">
						{!isEditing && (
							<Button
								size="icon"
								variant="ghost"
								className="group hover:bg-primary/20"
								onClick={() => onCancel?.("edit")}
							>
								<PencilIcon className="size-4 text-muted-foreground group-hover:text-foreground" />
							</Button>
						)}
						<Button
							size="icon"
							variant="ghost"
							className="dark:hover:bg-destructive/50 hover:bg-destructive/50"
							onClick={() => onCancel?.("delete")}
						>
							<XIcon className="size-4" />
						</Button>
					</div>
				</div>
				{Object.keys(errors).length >= 1 && (
					<p className="text-destructive">
						Error al procesar la información. Verifique los campos e inténtelo
						de nuevo.
					</p>
				)}
			</>
		);
	}

	return (
		<div
			className="flex gap-x-2 items-center"
			onKeyDown={(e) => {
				if (e.key === "Enter" && selectedStorage) {
					e.preventDefault();
					onFormSubmit();
				}
			}}
		>
			<StoragesSelect
				className="w-full max-w-xs"
				onChange={(value) => {
					setSelectedStorage(value || null);
				}}
				defaultValue={isEditing ? editingStorageData?._id : storage?.storageId}
			/>
			<Input
				type="number"
				required
				step="1"
				className="w-full max-w-xs"
				placeholder="Stock"
				{...register("stock", { required: true, valueAsNumber: true })}
				onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
			/>
			<div className="flex flex-col items-start gap-1 min-w-fit">
				<span className="text-xs">Mostrar en tienda</span>
				<div className="flex gap-x-2">
					<Switch checked={showInStore} onCheckedChange={setShowInStore} />
					<span className="text-xs text-muted-foreground">
						{showInStore ? "Sí" : "No"}
					</span>
				</div>
			</div>
			<div className="flex gap-x-1">
				<Button
					type="button"
					size="sm"
					className="aspect-square"
					onClick={handleSubmitWithLoading}
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<Spinner className="size-4" />
					) : (
						<CheckIcon className="size-4" />
					)}
				</Button>
				<Button
					type="button"
					size="sm"
					className="aspect-square hover:bg-destructive/70"
					variant="ghost"
					onClick={() => onCancel?.("cancel")}
					disabled={isSubmitting}
				>
					<XIcon className="size-4" />
				</Button>
			</div>
		</div>
	);
}

export function ProductStoragesFrom({
	productId,
	initialStorages = [],
	onStoragesChange,
}: {
	productId?: string;
	initialStorages?: ProductStorageWithDisplay[];
	onStoragesChange?: (storages: ProductStorageWithDisplay[]) => void;
}) {
	const [productStorages, setProductStorages] =
		useState<ProductStorageWithDisplay[]>(initialStorages);
	const [showNewForm, setShowNewForm] = useState(false);
	const [editingStorageIndex, setEditingStorageIndex] = useState<number | null>(
		null,
	);

	const [editingStorageData, setEditingStorageData] =
		useState<StorageType | null>(null);

	const handleSubmitStorage = useCallback(
		(storage: StorageType, stock: number, showInStore: boolean) => {
			let updatedStorages: ProductStorageWithDisplay[];

			if (editingStorageIndex !== null) {
				const currentStorage = productStorages[editingStorageIndex];

				if (currentStorage.storageId !== storage._id) {
					const existingIndex = productStorages.findIndex(
						(item) => item.storageId === storage._id,
					);
					if (existingIndex >= 0) {
						toast.error(
							`El almacén "${storage.name}" ya está en la lista. Por favor seleccione otro almacén.`,
						);
						return;
					}
				}

				updatedStorages = [...productStorages];
				updatedStorages[editingStorageIndex] = {
					...updatedStorages[editingStorageIndex],
					stock,
					storageId: storage._id,
					displayName: storage.name,
					showInStore,
				};
				setEditingStorageIndex(null);
				setEditingStorageData(null);
			} else {
				const existingIndex = productStorages.findIndex(
					(item) => item.storageId === storage._id,
				);
				if (existingIndex >= 0) {
					toast.error(
						`El almacén "${storage.name}" ya está en la lista. Por favor seleccione otro almacén.`,
					);
					return;
				}

				const newStorage: ProductStorageWithDisplay = {
					productId: productId || "",
					storageId: storage._id,
					stock,
					displayName: storage.name,
					showInStore,
				};
				updatedStorages = [...productStorages, newStorage];
			}

			setProductStorages(updatedStorages);
			if (onStoragesChange) {
				onStoragesChange(updatedStorages);
			}
			setShowNewForm(false);
		},
		[productStorages, editingStorageIndex, productId, onStoragesChange],
	);

	const createStorageFromProductStorage = useCallback(
		(productStorage: ProductStorageWithDisplay): StorageType => {
			return {
				_id: productStorage.storageId,
				id: productStorage.storageId,
				name: productStorage.displayName || "Almacén",
				order: 0,
				productsCount: 0,
			};
		},
		[],
	);

	const loadStorageData = useCallback(
		async (storageId: string): Promise<StorageType> => {
			const response = await fetch(`/api/storages/${storageId}`);
			if (response.ok) {
				const storageData = await response.json();
				return {
					_id: storageId,
					id: storageId,
					name: storageData.name,
					order: 0,
					productsCount: 0,
				};
			}
			throw new Error("Failed to load storage data");
		},
		[],
	);

	const handleStorageAction = useCallback(
		async (index: number, action: "edit" | "delete" | "cancel") => {
			if (action === "delete") {
				const updatedStorages = productStorages.filter((_, i) => i !== index);
				setProductStorages(updatedStorages);
				if (onStoragesChange) {
					onStoragesChange(updatedStorages);
				}
			} else if (action === "edit") {
				setEditingStorageIndex(index);
				const currentStorage = productStorages[index];

				if (currentStorage.displayName) {
					setEditingStorageData(
						createStorageFromProductStorage(currentStorage),
					);
				} else {
					setEditingStorageData({
						_id: currentStorage.storageId,
						id: currentStorage.storageId,
						name: "⟳ Cargando...",
						order: 0,
						productsCount: 0,
					});

					try {
						const storageData = await loadStorageData(currentStorage.storageId);
						currentStorage.displayName = storageData.name;
						setEditingStorageData(storageData);
					} catch (error) {
						console.error("Error al cargar el nombre del almacén:", error);
						setEditingStorageData(
							createStorageFromProductStorage(currentStorage),
						);
					}
				}
			} else {
				setEditingStorageIndex(null);
				setEditingStorageData(null);
			}
		},
		[
			productStorages,
			onStoragesChange,
			createStorageFromProductStorage,
			loadStorageData,
		],
	);

	return (
		<div className="flex flex-col gap-2 p-4">
			{productStorages.map((storage, index) =>
				editingStorageIndex === index ? (
					<ProductStorageInput
						key={`editing-${storage.storageId}-${index}`}
						onSubmit={handleSubmitStorage}
						onCancel={() => handleStorageAction(index, "cancel")}
						storage={storage}
						isEditing={true}
						editingStorageData={editingStorageData || undefined}
					/>
				) : (
					<ProductStorageInput
						key={`${storage.storageId}-${index}`}
						onSubmit={() => {}}
						isFinish={true}
						onCancel={(action) =>
							handleStorageAction(index, action || "delete")
						}
						storage={storage}
					/>
				),
			)}

			{showNewForm ? (
				<ProductStorageInput
					onSubmit={handleSubmitStorage}
					onCancel={() => setShowNewForm(false)}
				/>
			) : (
				<Button
					variant="outline"
					className="w-full"
					onClick={() => setShowNewForm(true)}
				>
					<PlusIcon /> Agregar Almacén
				</Button>
			)}
		</div>
	);
}
