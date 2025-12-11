import { Button } from "@/components/ui/button";
import {
	FilePlusIcon,
	BanknoteIcon,
	PackagePlusIcon,
	ScanIcon,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { CreateProductSheet } from "../products/CreateProductSheet";
import { CreateOrderSheet } from "../orders/CreateOrderSheet";
import { BarcodeScanner } from "../shared/BarcodeScanner";
import { CreatePaymentSheet } from "../paymentHistory/CreatePaymentSheet";

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 20, scale: 0.95 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.4,
			ease: "easeOut",
		},
	},
};

export function QuickActions() {
	return (
		<motion.div
			key="action-buttons"
			className="flex flex-col gap-y-4 w-full bg-card p-4 rounded-lg border shadow-sm"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
		>
			<div className="flex flex-col gap-y-2">
				<h2>Acciones rápidas</h2>
				<p className="text-sm text-muted-foreground max-w-prose">
					Estas acciones te permiten gestionar tu inventario, pedidos y pagos de manera
					eficiente.
				</p>
			</div>

			<motion.div
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
				variants={containerVariants}
			>
				<motion.div variants={itemVariants}>
					<BarcodeScanner
						onProductFound={(product) => {
							console.log("Producto encontrado:", product);
						}}
						onOrderFound={(order) => {
							console.log("Factura encontrada:", order);
						}}
						onPaymentFound={(payment) => {
							console.log("Pago encontrado:", payment);
						}}
					>
						<Button
							className="w-full flex flex-col sm:flex-row justify-center sm:justify-start gap-3 h-20 sm:h-16 hover:shadow-md transition-all duration-200"
							variant="outline"
						>
							<ScanIcon className="h-5 w-5 shrink-0" />
							<div className="flex flex-col items-center sm:items-start text-center sm:text-left">
								<span className="font-medium text-sm">Buscar por código</span>
								<span className="text-xs text-muted-foreground hidden sm:block">
									Buscar productos, facturas y pagos
								</span>
							</div>
						</Button>
					</BarcodeScanner>
				</motion.div>

				<motion.div variants={itemVariants}>
					<CreateProductSheet>
						<Button
							className="w-full flex flex-col sm:flex-row justify-center sm:justify-start gap-3 h-20 sm:h-16 hover:shadow-md transition-all duration-200"
							variant="outline"
						>
							<PackagePlusIcon className="h-5 w-5 shrink-0" />
							<div className="flex flex-col items-center sm:items-start text-center sm:text-left">
								<span className="font-medium text-sm">Crear producto</span>
								<span className="text-xs text-muted-foreground hidden sm:block">
									Crear un nuevo producto
								</span>
							</div>
						</Button>
					</CreateProductSheet>
				</motion.div>

				<motion.div variants={itemVariants}>
					<CreateOrderSheet>
						<Button
							className="w-full flex flex-col sm:flex-row justify-center sm:justify-start gap-3 h-20 sm:h-16 hover:shadow-md transition-all duration-200"
							variant="outline"
						>
							<FilePlusIcon className="h-5 w-5 shrink-0" />
							<div className="flex flex-col items-center sm:items-start text-center sm:text-left">
								<span className="font-medium text-sm">Crear factura</span>
								<span className="text-xs text-muted-foreground hidden sm:block">
									Crear una factura de compra nueva
								</span>
							</div>
						</Button>
					</CreateOrderSheet>
				</motion.div>

				<motion.div variants={itemVariants}>
					<CreatePaymentSheet>
						<Button
							className="flex flex-col sm:flex-row justify-center sm:justify-start gap-3 h-20 sm:h-16 hover:shadow-md transition-all duration-200 w-full"
							variant="outline"
						>
							<BanknoteIcon className="h-5 w-5 shrink-0" />
							<div className="w-full flex flex-col items-center sm:items-start text-center sm:text-left">
								<span className="font-medium text-sm">Crear pago</span>
								<span className="text-xs text-muted-foreground hidden sm:block truncate max-w-[26ch] xl:max-w-none">
									Crear un nuevo pago a una factura
								</span>
							</div>
						</Button>
					</CreatePaymentSheet>
				</motion.div>
			</motion.div>
		</motion.div>
	);
}
