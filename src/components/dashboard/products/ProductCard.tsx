import { currencyFormat } from "@/config/formats";
import type { ProductType } from "@/types/models/products";
import {
	BanknoteIcon,
	BoxesIcon,
	InspectionPanelIcon,
	Package2Icon,
} from "lucide-react";
import { ProductsActions } from "./ProductsActions";

export function ProductCard({
	product,
}: {
	product: ProductType;
}) {
	return (
		<ProductsActions
			product={product}
			trigger={
				<button
					type="button"
					className="flex flex-col p-4 gap-y-4 bg-secondary rounded-lg shadow-md max-w-sm focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-20 transition-transform transform aria-pressed:scale-95"
				>
					<div className="inline-flex justify-between gap-x-2">
						<div className="flex flex-col gap-y-2 items-start">
							<h3 className="font-medium">
								{`${product.name} - ${product.brand}`}
							</h3>
							<p className="text-muted-foreground text-sm">
								{product.category}
							</p>
						</div>
						<div className="flex flex-col items-end gap-y-2">
							<span className="text-sm text-muted-foreground">
								{currencyFormat.format(product.retailPrice)}
							</span>
							<div className="inline-flex gap-x-1 items-center text-[.8rem] text-muted-foreground">
								<BoxesIcon size={13} />
								{currencyFormat.format(product.wholesalePrice)}
							</div>
						</div>
					</div>
					<div className="flex gap-3 mt-3">
						<div className="inline-flex items-center text-muted-foreground gap-x-1">
							<BanknoteIcon className="size-3.5" />
							<p className="text-xs font-medium">
								{currencyFormat.format(product.cost)}
							</p>
						</div>
						<div className="inline-flex items-center text-muted-foreground gap-x-1">
							<Package2Icon className="size-3" />
							<p className="text-xs font-medium">{product.stock}</p>
						</div>
						<div className="inline-flex items-center text-muted-foreground gap-x-1">
							<InspectionPanelIcon className="size-3" />
							<p className="text-xs font-medium uppercase">{`${product.capacity} ${product.capacityUnit !== "count" ? product.capacityUnit : "Unidades"}`}</p>
						</div>
					</div>
				</button>
			}
		/>
	);
}
