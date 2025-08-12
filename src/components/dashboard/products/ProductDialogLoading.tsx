import { Spinner } from "@/components/ui/spinner";
import { TriangleAlert } from "lucide-react";

interface ProductDialogLoadingProps {
	isLoading: boolean;
	isError: boolean;
}

export function ProductDialogLoading({
	isLoading,
	isError,
}: ProductDialogLoadingProps) {
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[200px]">
				<Spinner className="size-9 text-muted-foreground" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[200px] text-destructive-foreground/70">
				<TriangleAlert className="size-12" />
				<p className="text-sm text-muted-foreground/70 text-center mt-2 max-w-[45ch] font-medium">
					Error al cargar el producto. Por favor, verifica tu conexión a
					internet o intenta nuevamente más tarde.
				</p>
			</div>
		);
	}

	return null;
}
