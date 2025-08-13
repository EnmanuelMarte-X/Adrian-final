import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import type { UseQueryStateReturn } from "nuqs";
import { useState, memo, useEffect } from "react";
import { useDeferredValue } from "react";

interface TextFilterProps {
	id?: string;
	label: string;
	placeholder?: string;
	initialValue?: string | null;
	urlSetter?: UseQueryStateReturn<string | null, string>[1];
}

function TextFilterComponent({
	id,
	label,
	placeholder,
	initialValue,
	urlSetter,
}: TextFilterProps) {
	const [inputValue, setInputValue] = useState(initialValue || "");
	const deferredInputValue = useDeferredValue(inputValue);

	useEffect(() => {
		setInputValue(initialValue || "");
	}, [initialValue]);

	const updateFilter = async (value: string | undefined): Promise<void> => {
		if (!urlSetter) return;
		await urlSetter(value == null || value === "" ? null : value);
	};

	const debouncedHandleChange = useDebouncedCallback(async (value: string) => {
		await updateFilter(value);
	}, 800);

	useEffect(() => {
		debouncedHandleChange(deferredInputValue);
	}, [deferredInputValue, debouncedHandleChange]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			updateFilter(inputValue);
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor={id}>{label}</Label>
			<Input
				id={id}
				placeholder={placeholder}
				value={inputValue}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
			/>
		</div>
	);
}

export const TextFilter = memo(TextFilterComponent);
