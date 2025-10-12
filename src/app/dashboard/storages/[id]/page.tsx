"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
	useStorage,
	useUpdateStorageMutation,
	useDeleteStorageMutation,
	useFixStorageCountsMutation,
} from "@/contexts/storages/queries";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { getDateFromObjectId } from "@/lib/utils";
import { dateFormat } from "@/config/formats";
import { Button } from "@/components/ui/button";
import {
	Edit2Icon,
	ScanIcon,
	Trash2Icon,
	CheckIcon,
	XIcon,
	ArrowLeftIcon,
	RefreshCwIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StorageProductsTable } from "@/components/dashboard/products/StorageProductsTable";
import Link from "next/link";
import { BarcodeScanner } from "@/components/dashboard/shared/BarcodeScanner";
import type { ProductType } from "@/types/models/products";

export default function StorageDetailPage({
	params,
}: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [editedName, setEditedName] = useState("");

	const { data: storage, isLoading, isError } = useStorage({ id });
	const updateStorageMutation = useUpdateStorageMutation();
	const deleteStorageMutation = useDeleteStorageMutation();
	const fixCountsMutation = useFixStorageCountsMutation();

	const createdAt = getDateFromObjectId(storage?._id);

	const handleEdit = () => {
		setEditedName(storage?.name || "");
		setIsEditing(true);
	};

	const handleCancelEdit = () => {
		setEditedName(storage?.name || "");
		setIsEditing(false);
	};

	const handleSaveEdit = async () => {
		if (!storage || !editedName.trim()) return;

		try {
			await updateStorageMutation.mutateAsync({
				id: storage._id,
				storage: { name: editedName.trim() },
			});
			setIsEditing(false);
			toast.success("Almacén actualizado correctamente");
		} catch (error) {
			console.error("Error updating storage:", error);
			toast.error("Error al actualizar el almacén");
		}
	};

	const handleDelete = () => {
		if (storage?.productsCount && storage.productsCount > 0) {
			toast.warning(
				"No se puede eliminar un almacén que tiene productos asociados",
			);
			return;
		}
		setIsDeleting(true);
	};

	const handleProductSelect = (product: ProductType) => {
		useRouter().push(`/dashboard/products/${product._id}`);
	};

	const handleConfirmDelete = async () => {
		if (!storage) return;

		try {
			await deleteStorageMutation.mutateAsync(storage._id);
			toast.success("Almacén eliminado correctamente");
			router.push("/dashboard/storages");
		} catch (error) {
			console.error("Error deleting storage:", error);
			toast.error("Error al eliminar el almacén");
			setIsDeleting(false);
		}
	};

	const handleCancelDelete = () => {
		setIsDeleting(false);
	};

	const handleFixCounts = async () => {
		try {
			console.log("Starting fix counts operation...");
			const result = await fixCountsMutation.mutateAsync();
			console.log("Fix counts result:", result);
			
			if (result.success) {
				const fixedStoragesCount = result.details?.length || 0;
				if (fixedStoragesCount > 0) {
					toast.success(
						`Se corrigieron los conteos de ${fixedStoragesCount} almacén(es)`
					);
				} else {
					toast.info("Todos los conteos de productos están correctos");
				}
			}
		} catch (error) {
			console.error("Error fixing storage counts:", error);
			toast.error("Error al corregir los conteos de productos");
		}
	};

	if (isError) {
		return (
			<motion.div
				className="flex flex-col flex-1 p-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				<Alert variant="destructive">
					<AlertDescription>
						Error al cargar la información del almacén. Por favor, intenta de
						nuevo.
					</AlertDescription>
				</Alert>
			</motion.div>
		);
	}

	return (
		<motion.div
			className="flex flex-col flex-1 p-6 gap-y-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
		>
			<motion.header
				className="flex flex-wrap items-center justify-between gap-4"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
			>
				<div className="flex items-center gap-2">
					<Link href="/dashboard/storages" className="mr-2">
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Button variant="outline" size="icon">
								<ArrowLeftIcon className="size-4" />
							</Button>
						</motion.div>
					</Link>
					<h1 className="text-2xl font-bold">Detalles del almacén</h1>
				</div>
			</motion.header>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<motion.div layout transition={{ duration: 0.3, ease: "easeInOut" }}>
					<Card>
						<CardHeader>
							<CardTitle className="text-xl">Información del almacén</CardTitle>
							<CardDescription>Detalles y especificaciones</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<motion.div
									className="flex justify-between items-center py-3 border-b border-border/50"
									layout
								>
									<span className="text-muted-foreground font-medium">
										Nombre
									</span>
									<AnimatePresence mode="wait">
										{isLoading ? (
											<motion.div
												key="skeleton"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{ delay: 0.3, duration: 0.2 }}
											>
												<Skeleton className="h-5 w-32" />
											</motion.div>
										) : isEditing ? (
											<motion.div
												key="editing"
												className="flex items-center gap-2"
												initial={{ opacity: 0, scale: 0.95 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0, scale: 0.95 }}
												transition={{ duration: 0.2 }}
											>
												<Input
													value={editedName}
													onChange={(e) => setEditedName(e.target.value)}
													onKeyDown={(e) => {
														if (e.key === "Enter" && editedName.trim()) {
															handleSaveEdit();
														} else if (e.key === "Escape") {
															handleCancelEdit();
														}
													}}
													className="h-8 w-32 text-sm"
													autoFocus
												/>
												<Button
													size="sm"
													variant="ghost"
													onClick={handleSaveEdit}
													disabled={
														updateStorageMutation.isPending ||
														!editedName.trim()
													}
													className="h-8 w-8 p-0 text-success hover:text-success/80 hover:bg-success/10"
												>
													<CheckIcon className="size-4" />
												</Button>
												<Button
													size="sm"
													variant="ghost"
													onClick={handleCancelEdit}
													className="h-8 w-8 p-0 text-destructive-foreground hover:text-destructive-foreground/80 hover:bg-destructive-foreground/10"
												>
													<XIcon className="size-4" />
												</Button>
											</motion.div>
										) : (
											<motion.span
												key="display"
												className="font-medium"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{ delay: 0.3, duration: 0.2 }}
											>
												{storage?.name}
											</motion.span>
										)}
									</AnimatePresence>
								</motion.div>
								<div className="flex justify-between items-center py-3 border-b border-border/50">
									<span className="text-muted-foreground font-medium">
										Cantidad de productos
									</span>
									{isLoading ? (
										<Skeleton className="h-5 w-16" />
									) : (
										<motion.span
											className="font-medium text-lg"
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.4 }}
										>
											{storage?.productsCount}
										</motion.span>
									)}
								</div>
								<div className="flex justify-between items-center py-3 border-b border-border/50">
									<span className="text-muted-foreground font-medium">
										Número de orden
									</span>
									{isLoading ? (
										<Skeleton className="h-5 w-24" />
									) : (
										<motion.span
											className="font-medium"
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.5 }}
										>
											{storage?.order ?? "N/A"}
										</motion.span>
									)}
								</div>
								{(createdAt || isLoading) && (
									<div className="flex justify-between items-center py-3">
										<span className="text-muted-foreground font-medium">
											Creado
										</span>
										{isLoading ? (
											<Skeleton className="h-5 w-28" />
										) : (
											<motion.span
												className="font-medium text-sm"
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ delay: 0.6 }}
											>
												{dateFormat(createdAt)}
											</motion.span>
										)}
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div layout transition={{ duration: 0.3, ease: "easeInOut" }}>
					<Card className="h-full">
						<CardHeader>
							<CardTitle className="text-xl">Acciones rápidas</CardTitle>
							<CardDescription>
								Gestiona el almacén y sus productos
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AnimatePresence mode="wait">
								{isDeleting ? (
									<motion.div
										key="delete-confirmation"
										className="space-y-4"
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.95 }}
										transition={{ duration: 0.2 }}
									>
										<div className="flex flex-col items-center justify-center text-center py-6">
											<Trash2Icon className="mx-auto h-12 w-12 text-destructive-foreground mb-4" />
											<h3 className="text-lg font-semibold text-destructive-foreground mb-2">
												¿Estás seguro de eliminar {storage?.name}?
											</h3>
											<p className="text-sm text-muted-foreground max-w-[45ch]">
												Esta acción eliminará el almacén{" "}
												<strong>{storage?.name}</strong> y todos sus productos
												asociados. Esta acción no se puede deshacer.
											</p>
										</div>
										<div className="flex gap-3">
											<Button
												className="flex-1"
												variant="destructive"
												onClick={handleConfirmDelete}
												disabled={deleteStorageMutation.isPending}
											>
												{deleteStorageMutation.isPending
													? "Eliminando..."
													: "Sí, eliminar"}
											</Button>
											<Button
												className="flex-1"
												variant="outline"
												onClick={handleCancelDelete}
												disabled={deleteStorageMutation.isPending}
											>
												Cancelar
											</Button>
										</div>
									</motion.div>
								) : (
									<motion.div
										key="action-buttons"
										className="space-y-3"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
									>
										<BarcodeScanner
											filters={{
												storageId: storage?._id,
											}}
											onProductFound={handleProductSelect}
										>
											<Button
												className="w-full flex justify-start gap-3 h-16"
												variant="outline"
											>
												<ScanIcon className="h-5 w-5" />
												<div className="flex flex-col items-start">
													<span className="font-medium">Escanear producto</span>
													<span className="text-xs text-muted-foreground">
														Buscar producto en el almacén
													</span>
												</div>
											</Button>
										</BarcodeScanner>
										<Button
											className="w-full flex justify-start gap-3 h-16"
											variant="outline"
											onClick={handleEdit}
											disabled={isLoading || updateStorageMutation.isPending}
										>
											<Edit2Icon className="h-5 w-5" />
											<div className="flex flex-col items-start">
												<span className="font-medium">Editar nombre</span>
												<span className="text-xs text-muted-foreground">
													Modificar el nombre del almacén
												</span>
											</div>
										</Button>
										<Button
											className="w-full flex justify-start gap-3 h-16"
											variant="outline"
											onClick={handleFixCounts}
											disabled={isLoading || fixCountsMutation.isPending}
										>
											<RefreshCwIcon className="h-5 w-5" />
											<div className="flex flex-col items-start">
												<span className="font-medium">
													{fixCountsMutation.isPending
														? "Corrigiendo conteos..."
														: "Corregir conteos"}
												</span>
												<span className="text-xs text-muted-foreground">
													Recalcular conteos de productos
												</span>
											</div>
										</Button>
										<Button
											className="w-full text-wrap flex justify-start gap-3 h-16 text-destructive-foreground hover:text-destructive-foreground"
											variant="outline"
											onClick={handleDelete}
											disabled={isLoading || deleteStorageMutation.isPending}
										>
											<Trash2Icon className="h-5 w-5" />
											<div className="flex flex-col items-start">
												<span className="font-medium">Eliminar almacén</span>
												<p className="text-xs text-destructive-foreground/70 text-left text-wrap max-w-[55ch] line-clamp-2">
													Eliminar permanentemente el almacén. Una vez que hayas
													eliminado un almacén, no podrás recuperarlo.
												</p>
											</div>
										</Button>
									</motion.div>
								)}
							</AnimatePresence>
						</CardContent>
					</Card>
				</motion.div>

				{storage?._id && (
					<motion.div
						className="lg:col-span-2"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.2 }}
					>
						<Card>
							<CardHeader>
								<CardTitle className="text-xl">
									Productos en el almacén
								</CardTitle>
								<CardDescription>
									Gestiona y visualiza todos los productos disponibles en este
									almacén
								</CardDescription>
							</CardHeader>
							<CardContent className="p-0">
								<div className="p-6 pt-0">
									<StorageProductsTable storageId={storage._id} />
								</div>
							</CardContent>
						</Card>
					</motion.div>
				)}
			</div>
		</motion.div>
	);
}
