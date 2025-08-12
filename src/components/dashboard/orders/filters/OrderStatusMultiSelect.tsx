import type {
	MultipleSelectorProps,
	Option,
} from "@/components/ui/multi-select";
import MultipleSelector from "@/components/ui/multi-select";
import { statusLabels } from "@/config/orders";
import { orderStatuses } from "@/contexts/orders/status";
import { useState } from "react";
import { useDebouncedCallback } from "@/hooks/use-debounce";

export const options: Option[] = orderStatuses.map((status) => ({
	label: statusLabels[status],
	value: status,
}));

export interface OrderStatusMultiSelectProps extends MultipleSelectorProps {
	selectedKeys?: string[];
	onSelectedKeysChange?: (keys: string[]) => void;
}

export function OrderStatusMultiSelect({
	selectedKeys,
	onSelectedKeysChange,
	...props
}: OrderStatusMultiSelectProps) {
	const [selectedOptions, setSelectedOptions] = useState<Option[]>(() => {
		return selectedKeys
			? options.filter((option) =>
					selectedKeys.includes(option.value as string),
				)
			: [];
	});
	const handleOnChange = useDebouncedCallback((options: Option[]) => {
		setSelectedOptions(options);
		if (onSelectedKeysChange) {
			onSelectedKeysChange(options.map((option) => option.value as string));
		}
	}, 500);

	return (
		<MultipleSelector
			options={options}
			className="w-full min-w-48 max-w-[280px]"
			placeholder="Seleccionar estado"
			value={selectedOptions}
			onChange={handleOnChange}
			{...props}
		/>
	);
}
