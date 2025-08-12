"use client";

import { motion } from "motion/react";
import { BarcodeIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { EditProductSheet } from "@/components/dashboard/products/EditProductSheet";
import { DeleteProductAlertDialog } from "@/components/dashboard/products/DeleteProductAlertDialog";
import type { ProductType } from "@/types/models/products";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import Barcode from "react-barcode";

interface ProductActionsProps {
	product?: ProductType | null;
	productId: string;
}

export function ProductActions({ product, productId }: ProductActionsProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.5 }}
		>
			<Card>
				<CardHeader>
					<CardTitle>Acciones</CardTitle>
					<CardDescription>
						Gestionar el inventario de este producto
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, delay: 0.6 }}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<EditProductSheet product={product}>
								<Button
									className="w-full flex items-center justify-start gap-2 h-16"
									variant="outline"
								>
									<PencilIcon className="size-5" />
									<div className="flex flex-col items-start">
										<span>Editar</span>
										<span className="text-xs text-muted-foreground text-wrap text-left">
											Modificar producto
										</span>
									</div>
								</Button>
							</EditProductSheet>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, delay: 0.8 }}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<Drawer>
								<DrawerTrigger asChild>
									<Button
										className="w-full flex items-center justify-start gap-2 h-16"
										variant="outline"
									>
										<BarcodeIcon className="size-5" />
										<div className="flex flex-col items-start">
											<span>Ver código</span>
											<span className="text-xs text-muted-foreground text-wrap text-left">
												Ver el código de barra.
											</span>
										</div>
									</Button>
								</DrawerTrigger>
								<DrawerContent className="w-full">
									<div className="p-6 pb-8">
										<DrawerHeader className="text-center pb-6">
											<DrawerTitle className="text-xl font-bold">
												Código de Barras
											</DrawerTitle>
											<DrawerDescription>{product?.name}</DrawerDescription>
										</DrawerHeader>

										<div className="rounded-lg p-6 w-full">
											<div className="flex justify-center w-full">
												<Barcode
													value={
														product?._id || "Error al cargar id del producto."
													}
													format="CODE128"
													width={2}
													height={100}
													fontSize={16}
													textMargin={8}
													margin={10}
													background="transparent"
													lineColor="var(--foreground)"
												/>
											</div>
										</div>
									</div>
								</DrawerContent>
							</Drawer>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, delay: 0.9 }}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<DeleteProductAlertDialog productId={productId}>
								<Button
									className="w-full flex items-center justify-start gap-2 h-16"
									variant="destructive"
								>
									<Trash2Icon className="size-5" />
									<div className="flex flex-col items-start">
										<span>Eliminar</span>
										<span className="text-xs opacity-85 text-wrap text-left">
											Eliminar permanentemente.
										</span>
									</div>
								</Button>
							</DeleteProductAlertDialog>
						</motion.div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
