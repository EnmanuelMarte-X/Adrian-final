"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CreateStorageDialogProps {
	children?: React.ReactNode;
	onStorageCreated?: () => void;
}

export function CreateStorageDialog({
	children,
	onStorageCreated,
}: CreateStorageDialogProps) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			toast.error("El nombre del almacén no puede estar vacío");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/storages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: name.trim(),
					id: Date.now().toString(),
					productsCount: 0,
					order: 0,
				}),
			});

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			toast.success("Almacén creado exitosamente!");
			setName("");
			setOpen(false);

			if (onStorageCreated) {
				onStorageCreated();
			}
		} catch (error) {
			console.error("Error creating storage:", error);
			toast.error("Error al crear el almacén. Por favor, inténtalo de nuevo.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{children ? children : <Button>Crear almacén</Button>}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Crear nuevo almacén</DialogTitle>
						<DialogDescription>
							Ingresa la información para el nuevo almacén. Haz clic en guardar
							cuando termines.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Nombre del almacén</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Ej: Almacén Principal"
								required
								autoFocus
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isLoading}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Creando..." : "Crear almacén"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
