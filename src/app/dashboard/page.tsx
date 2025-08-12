"use client";

import { LastOrdersSection } from "@/components/dashboard/orders/LastOrdersSection";
import { LastOrdersTable } from "@/components/dashboard/orders/LastOrdersTable";
import { LastProductsSection } from "@/components/dashboard/products/LastProductsSection";
import { LastProductsTable } from "@/components/dashboard/products/LastProductsTable";
import { ResumeCards } from "@/components/dashboard/resume/ResumeCards";
import { QuickActions } from "@/components/dashboard/resume/QuickActions";
import { LastClientsSection } from "@/components/dashboard/clients/LastClientsSection";
import { motion } from "motion/react";
import { LastClientsTable } from "@/components/dashboard/clients/LastClientTable";

export default function DashboardPage() {
	return (
		<main className="flex-1 p-4 sm:p-6 space-y-5 sm:space-y-7 animate-in fade-in duration-500">
			{/* Sidebar width assumed to be 250px */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				<ResumeCards />
			</motion.div>

			<motion.div
				className="w-full"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.15 }}
			>
				<QuickActions />
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}
			>
				<LastProductsSection>
					<LastProductsTable />
				</LastProductsSection>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.4 }}
			>
				<LastOrdersSection>{<LastOrdersTable />}</LastOrdersSection>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}
			>
				<LastClientsSection>
					<LastClientsTable />
				</LastClientsSection>
			</motion.div>
		</main>
	);
}
