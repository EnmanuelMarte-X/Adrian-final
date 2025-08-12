import { useOrders } from "@/contexts/orders/queries";
import { CircleAlertIcon } from "lucide-react";
import { motion } from "motion/react";

export function LastOrdersSection({ children }: { children: React.ReactNode }) {
	const { isError } = useOrders();

	return (
		<motion.section
			className="flex flex-col"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
		>
			<motion.div
				className="inline-flex justify-between items-center"
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.1 }}
			>
				<div className="flex flex-col gap-y-2 mb-8">
					<motion.h2
						className="text-2xl font-semibold"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3, delay: 0.2 }}
					>
						Últimas ordenes
					</motion.h2>
					<motion.p
						className="text-muted-foreground text-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3, delay: 0.3 }}
					>
						Lista de los últimas ordenes registrados en el sistema.
					</motion.p>
				</div>
				<div className="inline-flex items-center gap-x-2">
					{isError && (
						<motion.div
							className="flex items-center gap-x-2"
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
						>
							<CircleAlertIcon className="w-6 h-6 text-destructive" />
							<p className="text-destructive text-sm">
								Error al cargar las ordenes. Por favor inténtelo de nuevo.
							</p>
						</motion.div>
					)}
				</div>
			</motion.div>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.4 }}
			>
				{children}
			</motion.div>
		</motion.section>
	);
}
