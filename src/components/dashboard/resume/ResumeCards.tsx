import { OrdersResumeCard } from "@/components/dashboard/orders/OrdersResumeCard";
import { ProductsResumeCard } from "@/components/dashboard/products/ProductsResumeCard";
import { StoragesResumeCard } from "@/components/dashboard/storages/StorageResumeCard";
import { ClientResumeCard } from "../clients/ClientsResumeCard";
import { motion } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function ResumeCards() {
	const { state } = useSidebar();
	return (
		<div
			className={cn("grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-4", {
				"sm:grid-cols-1": state === "expanded",
				"sm:grid-cols-2": state === "collapsed",
			})}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3, delay: 0.1 }}
			>
				<ProductsResumeCard />
			</motion.div>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3, delay: 0.2 }}
			>
				<OrdersResumeCard />
			</motion.div>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3, delay: 0.3 }}
			>
				<StoragesResumeCard />
			</motion.div>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3, delay: 0.4 }}
			>
				<ClientResumeCard />
			</motion.div>
		</div>
	);
}
