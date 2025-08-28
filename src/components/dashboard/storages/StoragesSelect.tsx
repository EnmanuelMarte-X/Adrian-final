import { useState } from "react";
import { useStorages } from "@/contexts/storages/queries";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { StorageType } from "@/types/models/storages";
import { Spinner } from "@/components/ui/spinner";

interface StoragesSelectProps {
	defaultValue?: string;
	onChange?: (value?: StorageType) => void;
	disabled?: boolean;
	className?: string;
}

export function StoragesSelect({
	defaultValue,
	onChange,
	disabled = false,
	className,
}: StoragesSelectProps) {
	const [pagination] = useState({
		page: 1,
		limit: 100,
	});

	const { data, isLoading, error } = useStorages({ pagination });

	const storages = data?.storages || [];

	if (error) {
		console.error("Error loading storages:", error);
	}

	const handleOnChange = (value: string) => {
		if (!storages) return;
		const storage = storages.find((e) => e._id === value);
		onChange?.(storage);
	};

	return (
		<Select
			onValueChange={handleOnChange}
			disabled={disabled || isLoading}
			defaultValue={defaultValue}
		>
			<SelectTrigger className={className}>
				<SelectValue placeholder="Seleccionar almacén" />
				{isLoading && <Spinner />}
			</SelectTrigger>
			<SelectContent>
				{storages.map((storage: StorageType) => (
					<SelectItem key={storage._id} value={storage._id}>
						{storage.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
