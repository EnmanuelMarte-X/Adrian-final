import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { memo, type ReactNode } from "react";

interface FilterConfig<T> {
	key: keyof T;
	label: string;
	icon?: ReactNode;
	formatValue?: (value: unknown) => string;
}

interface GenericFilterBadgesProps<T extends Record<string, unknown>> {
	filters: T;
	onRemoveFilter: (key: keyof T) => void;
	fixedKeys?: (keyof T)[];
	filterConfigs: FilterConfig<T>[];
}

function GenericFilterBadgesComponent<T extends Record<string, unknown>>({
	filters,
	onRemoveFilter,
	fixedKeys = [],
	filterConfigs,
}: GenericFilterBadgesProps<T>) {
	const hasActiveFilters = Object.values(filters).some(
		(val) => val !== undefined && val !== null && val !== "",
	);

	if (!hasActiveFilters) return null;

	const getFilterConfig = (key: keyof T) => {
		return filterConfigs.find((config) => config.key === key);
	};

	const formatFilterValue = (key: keyof T, value: unknown) => {
		const config = getFilterConfig(key);
		if (config?.formatValue) {
			return config.formatValue(value);
		}

		// Formateo por defecto
		if (Array.isArray(value)) {
			return value.join(", ");
		}
		if (typeof value === "boolean") {
			return value ? "Sí" : "No";
		}
		return String(value);
	};

	return (
		<div className="flex flex-wrap gap-2">
			{Object.entries(filters).map(([key, value]) => {
				if (
					value === undefined ||
					value === null ||
					value === "" ||
					fixedKeys.includes(key as keyof T)
				)
					return null;

				const config = getFilterConfig(key as keyof T);
				const label = config?.label || key;
				const icon = config?.icon;
				const formattedValue = formatFilterValue(key as keyof T, value);

				return (
					<Badge key={key} variant="secondary" className="text-xs h-6">
						<span className="inline-flex items-center gap-1 text-xs">
							{icon}
							{`${label}: ${formattedValue}`}
						</span>
						{!fixedKeys.includes(key as keyof T) && (
							<Button
								variant="ghost"
								size="sm"
								className="size-4 p-0 ml-1"
								onClick={() => onRemoveFilter(key as keyof T)}
							>
								<XIcon className="h-2 w-2" />
							</Button>
						)}
					</Badge>
				);
			})}
		</div>
	);
}

export const GenericFilterBadges = memo(GenericFilterBadgesComponent) as <
	T extends Record<string, unknown>,
>(
	props: GenericFilterBadgesProps<T>,
) => React.JSX.Element;
