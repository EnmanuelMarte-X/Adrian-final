import { useStoragesCount } from "@/contexts/storages/queries";
import { ResumeCard } from "../resume/ResumeCard";

export function StoragesResumeCard() {
	const { data: storagesCount, isLoading } = useStoragesCount();

	return (
		<ResumeCard
			title="Total de Almacenes"
			description="Espacios de almacenamiento registrado."
			value={storagesCount || 0}
			valueType="unit"
			hideComparison
			isLoading={isLoading}
		/>
	);
}
