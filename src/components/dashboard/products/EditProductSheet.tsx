import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import type { ProductType } from "@/types/models/products";
import { EditProductFrom } from "./EditProductForm";
import { useEffect, useState } from "react";

export function EditProductSheet({
	product,
	isOpen,
	onOpenChange,
	children,
}: {
	product?: ProductType | null;
	isOpen?: boolean;
	onOpenChange?: (isOpen: boolean) => void;
	children?: React.ReactNode;
}) {
	const [isOpenState, setIsOpenState] = useState(isOpen || false);

	useEffect(() => {
		if (isOpen !== undefined) {
			setIsOpenState(isOpen);
		}
	}, [isOpen]);

	const handleOpenChange = (open: boolean) => {
		setIsOpenState(open);
		onOpenChange?.(open);
	};

	const handleClose = () => {
		handleOpenChange(false);
	};

	return (
		<Sheet
			open={isOpenState}
			defaultOpen={false}
			onOpenChange={handleOpenChange}
		>
			{children && <SheetTrigger asChild>{children}</SheetTrigger>}
			<SheetContent className="sm:min-w-2xl w-full overflow-y-auto">
				<SheetHeader>
					<SheetTitle>Editar producto</SheetTitle>
					<SheetDescription>
						Edita la información de tu producto y haz clic en "Guardar cambios"
						para actualizarlo.
					</SheetDescription>
				</SheetHeader>
				<EditProductFrom product={product} onSuccess={handleClose} />
				<SheetFooter className="grid grid-cols-2 gap-2">
					<Button form="edit-product" type="submit">
						Guardar cambios
					</Button>
					<Button variant="ghost" onClick={handleClose}>
						Cancelar
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
