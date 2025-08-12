import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	CopyIcon,
	EditIcon,
	MoreHorizontalIcon,
	TrashIcon,
	EyeIcon,
	FileTextIcon,
} from "lucide-react";
import { DeleteProductAlertDialog } from "./DeleteProductAlertDialog";
import { useState } from "react";
import { EditProductSheet } from "./EditProductSheet";
import type { ProductType } from "@/types/models/products";
import { toast } from "sonner";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { tryCatch } from "@/lib/utils";
import { useAuthorization } from "@/hooks/use-auth";

export function ProductsActions({
	product,
	trigger,
}: { product: ProductType; trigger?: React.ReactNode }) {
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const { isAdmin } = useAuthorization();

	const handleOpenDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		setDeleteOpen(true);
	};

	const handleOpenEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		setEditOpen(true);
	};

	const handleCopyId = (e: React.MouseEvent) => {
		e.stopPropagation();
		console.log("Copiando ID del producto:", product._id);
		tryCatch(navigator.clipboard.writeText(product._id));
		toast.info("ID copiado en el portapapeles.");
	};

	const handleViewOrders = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<>
			{isAdmin && (
				<DeleteProductAlertDialog
					productId={product._id}
					isOpen={deleteOpen}
					onOpenChange={setDeleteOpen}
				/>
			)}

			<EditProductSheet
				product={product}
				isOpen={editOpen}
				onOpenChange={setEditOpen}
			/>

			<DropdownMenu>
				<DropdownMenuTrigger
					onClick={(e) => {
						e.stopPropagation();
					}}
					asChild
				>
					{trigger ? (
						trigger
					) : (
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Ver acciones</span>
							<MoreHorizontalIcon />
						</Button>
					)}
				</DropdownMenuTrigger>
				<DropdownMenuContent className="min-w-[200px]" align="end">
					<DropdownMenuArrow />
					<DropdownMenuLabel>Acciones</DropdownMenuLabel>
					<Link
						href={`/dashboard/products/${product._id}`}
						onClick={(e) => e.stopPropagation()}
					>
						<DropdownMenuItem>
							<EyeIcon className="size-4" /> Ver detalles
						</DropdownMenuItem>
					</Link>
					<DropdownMenuItem onClick={handleCopyId}>
						<CopyIcon className="size-4" /> Copiar ID
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<Link
						href={`/dashboard/orders?productId=${product._id}`}
						onClick={handleViewOrders}
					>
						<DropdownMenuItem>
							<FileTextIcon className="size-4" /> Ver facturas
						</DropdownMenuItem>
					</Link>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleOpenEdit}>
						<EditIcon className="size-4" /> Editar
					</DropdownMenuItem>
					{isAdmin && (
						<DropdownMenuItem onClick={handleOpenDelete} variant="destructive">
							<TrashIcon className="size-4" /> Eliminar
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
