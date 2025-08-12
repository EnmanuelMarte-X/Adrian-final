"use client";

import { Storages } from "@/components/dashboard/storages/Storages";
import { GripIcon, Info } from "lucide-react";
import { CreateStorageDialog } from "@/components/dashboard/storages/CreateStorageDialog";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";

export default function StoragesPage() {
	const queryClient = useQueryClient();

	const handleStorageCreated = () => {
		queryClient.invalidateQueries({ queryKey: ["storages"] });
		queryClient.invalidateQueries({ queryKey: ["storagesCount"] });
	};

	return (
		<motion.div
			className="flex flex-col w-full h-full py-4 px-6 space-y-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4 }}
		>
			<motion.header
				className="flex flex-wrap gap-y-4 items-center justify-between"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				<motion.p
					className="flex flex-col sm:flex-row sm:items-center text-muted-foreground text-sm gap-2 sm:gap-0"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.2 }}
				>
					<span className="flex items-center">
						<Info className="size-5 sm:mr-2 mr-1" />
						<span>
							Arrastra (<GripIcon className="size-4 inline mx-1" />) los
							contenedores para cambiar su factura.
						</span>
					</span>
				</motion.p>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.3 }}
				>
					<CreateStorageDialog onStorageCreated={handleStorageCreated} />
				</motion.div>
			</motion.header>

			<motion.main
				className="size-full py-4 overflow-y-auto"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.4 }}
			>
				<Storages />
			</motion.main>
		</motion.div>
	);
}
