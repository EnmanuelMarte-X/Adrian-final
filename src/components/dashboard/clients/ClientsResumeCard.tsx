import { useClientsCount } from "@/contexts/clients/queries";
import { ResumeCard } from "../resume/ResumeCard";

export function ClientResumeCard() {
	const { data: clientsCount, isLoading } = useClientsCount();
	return (
		<ResumeCard
			title="Total de Clientes"
			description="Clientes registrados en el sistema."
			value={clientsCount || 0}
			isLoading={isLoading}
			hideComparison
			valueType="unit"
		/>
	);
}
