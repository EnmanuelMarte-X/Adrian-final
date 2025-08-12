import { OrdersActions } from "./OrdersActions";
import { currencyFormat } from "@/config/formats";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { OrderType } from "@/types/models/orders";
import { CalendarIcon, PackageIcon, UserIcon } from "lucide-react";

export function OrderCard({ order }: { order: OrderType }) {
	const total =
		order.products?.reduce(
			(sum, product) =>
				sum + product.price * product.quantity - (product.discount || 0) / 10,
			0,
		) || 0;

	return (
		<OrdersActions
			order={order}
			trigger={
				<button
					type="button"
					className="flex flex-col p-4 gap-y-4 bg-secondary rounded-lg shadow-md max-w-sm focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-20 transition-transform transform aria-pressed:scale-95"
				>
					<div className="inline-flex justify-between gap-x-2">
						<div className="flex flex-col gap-y-2 items-start">
							<h3 className="font-medium text-base max-w-[15ch] truncate opacity-70">
								# {order.orderId}
							</h3>
							{typeof order.buyerId === "object" &&
								order.buyerId !== null &&
								"name" in order.buyerId && (
									<p className="text-muted-foreground text-sm">
										{order.buyerId.name}
									</p>
								)}
						</div>
						<div className="flex flex-col items-end gap-y-2">
							<span className="text-sm font-medium">
								{currencyFormat.format(total)}
							</span>
						</div>
					</div>
					<div className="flex gap-3 mt-3">
						<div className="inline-flex items-center text-muted-foreground gap-x-1">
							<CalendarIcon className="size-3.5" />
							<p className="text-xs font-medium">
								{format(new Date(order.date), "dd MMM yyyy", { locale: es })}
							</p>
						</div>
						<div className="inline-flex items-center text-muted-foreground gap-x-1">
							<PackageIcon className="size-3" />
							<p className="text-xs font-medium">
								{order.products?.length ?? 0} productos
							</p>
						</div>
						{typeof order.sellerId === "object" &&
							order.sellerId !== null &&
							"firstName" in order.sellerId && (
								<div className="inline-flex items-center text-muted-foreground gap-x-1">
									<UserIcon className="size-3" />
									<p className="text-xs font-medium max-w-[10ch] truncate">
										{order.sellerId.firstName}
									</p>
								</div>
							)}
					</div>
				</button>
			}
		/>
	);
}
