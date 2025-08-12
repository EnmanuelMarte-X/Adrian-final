"use client";

import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { X } from "lucide-react";
import * as React from "react";
import { forwardRef, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export interface Option {
	value: string;
	label: string;
	disable?: boolean;
	fixed?: boolean;
	[key: string]: string | boolean | undefined;
}

interface GroupOption {
	[key: string]: Option[];
}

export interface MultipleSelectorProps {
	value?: Option[];
	defaultOptions?: Option[];
	options?: Option[];
	placeholder?: string;
	loadingIndicator?: React.ReactNode;
	emptyIndicator?: React.ReactNode;
	delay?: number;
	triggerSearchOnFocus?: boolean;
	onSearch?: (value: string) => Promise<Option[]>;
	onSearchSync?: (value: string) => Option[];
	onChange?: (options: Option[]) => void;
	maxSelected?: number;
	onMaxSelected?: (maxLimit: number) => void;
	hidePlaceholderWhenSelected?: boolean;
	disabled?: boolean;
	groupBy?: string;
	className?: string;
	badgeClassName?: string;
	selectFirstItem?: boolean;
	creatable?: boolean;
	commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
	inputProps?: Omit<
		React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
		"value" | "placeholder" | "disabled"
	>;
	hideClearAllButton?: boolean;
}

export interface MultipleSelectorRef {
	selectedValue: Option[];
	input: HTMLInputElement;
	focus: () => void;
	reset: () => void;
}

export function useDebounce<T>(value: T, delay?: number): T {
	const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}

function transToGroupOption(options: Option[], groupBy?: string) {
	if (options.length === 0) {
		return {};
	}
	if (!groupBy) {
		return {
			"": options,
		};
	}

	const groupOption: GroupOption = {};
	options.map((option) => {
		const key = (option[groupBy] as string) || "";
		if (!groupOption[key]) {
			groupOption[key] = [];
		}
		groupOption[key].push(option);
	});
	return groupOption;
}

function removePickedOption(groupOption: GroupOption, picked: Option[]) {
	const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption;

	for (const [key, value] of Object.entries(cloneOption)) {
		cloneOption[key] = value.filter(
			(val) => !picked.find((p) => p.value === val.value),
		);
	}
	return cloneOption;
}

function isOptionsExist(groupOption: GroupOption, targetOption: Option[]) {
	for (const [, value] of Object.entries(groupOption)) {
		if (
			value.some((option) => targetOption.find((p) => p.value === option.value))
		) {
			return true;
		}
	}
	return false;
}

const CommandEmpty = forwardRef<
	HTMLDivElement,
	React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, forwardedRef) => {
	const render = useCommandState((state) => state.filtered.count === 0);

	if (!render) return null;

	return (
		<div
			ref={forwardedRef}
			className={cn("py-6 text-center text-sm", className)}
			cmdk-empty=""
			role="presentation"
			{...props}
		/>
	);
});

CommandEmpty.displayName = "CommandEmpty";

const MultipleSelector = React.forwardRef<
	MultipleSelectorRef,
	MultipleSelectorProps
>(
	(
		{
			value,
			onChange,
			placeholder,
			defaultOptions: arrayDefaultOptions = [],
			options: arrayOptions,
			delay,
			onSearch,
			onSearchSync,
			loadingIndicator,
			emptyIndicator,
			maxSelected = Number.MAX_SAFE_INTEGER,
			onMaxSelected,
			hidePlaceholderWhenSelected,
			disabled,
			groupBy,
			className,
			badgeClassName,
			selectFirstItem = true,
			creatable = false,
			triggerSearchOnFocus = false,
			commandProps,
			inputProps,
			hideClearAllButton = false,
		}: MultipleSelectorProps,
		ref: React.Ref<MultipleSelectorRef>,
	) => {
		const inputRef = React.useRef<HTMLInputElement>(null);
		const [open, setOpen] = React.useState(false);
		const [onScrollbar, setOnScrollbar] = React.useState(false);
		const [isLoading, setIsLoading] = React.useState(false);
		const dropdownRef = React.useRef<HTMLDivElement>(null);

		const [selected, setSelected] = React.useState<Option[]>(value || []);
		const [options, setOptions] = React.useState<GroupOption>(
			transToGroupOption(arrayDefaultOptions, groupBy),
		);
		const [inputValue, setInputValue] = React.useState("");
		const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

		React.useImperativeHandle(
			ref,
			() => ({
				selectedValue: [...selected],
				input: inputRef.current as HTMLInputElement,
				focus: () => inputRef?.current?.focus(),
				reset: () => setSelected([]),
			}),
			[selected],
		);

		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				inputRef.current &&
				!inputRef.current.contains(event.target as Node)
			) {
				setOpen(false);
				inputRef.current.blur();
			}
		};

		const handleUnselect = React.useCallback(
			(option: Option) => {
				const newOptions = selected.filter((s) => s.value !== option.value);
				setSelected(newOptions);
				onChange?.(newOptions);
			},
			[onChange, selected],
		);

		const handleKeyDown = React.useCallback(
			(e: React.KeyboardEvent<HTMLDivElement>) => {
				const input = inputRef.current;
				if (input) {
					if (e.key === "Delete" || e.key === "Backspace") {
						if (input.value === "" && selected.length > 0) {
							const lastSelectOption = selected[selected.length - 1];
							if (!lastSelectOption.fixed) {
								handleUnselect(selected[selected.length - 1]);
							}
						}
					}
					if (e.key === "Escape") {
						input.blur();
					}
				}
			},
			[handleUnselect, selected],
		);

		// biome-ignore lint/correctness/useExhaustiveDependencies: arrayOptions is not a dependency.
		useEffect(() => {
			if (open) {
				document.addEventListener("mousedown", handleClickOutside);
				document.addEventListener("touchend", handleClickOutside);
			} else {
				document.removeEventListener("mousedown", handleClickOutside);
				document.removeEventListener("touchend", handleClickOutside);
			}

			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
				document.removeEventListener("touchend", handleClickOutside);
			};
		}, [open]);

		useEffect(() => {
			if (value) {
				setSelected(value);
			}
		}, [value]);

		// biome-ignore lint/correctness/useExhaustiveDependencies: arrayOptions is not a dependency.
		useEffect(() => {
			if (!arrayOptions || onSearch) {
				return;
			}
			const newOption = transToGroupOption(arrayOptions || [], groupBy);
			if (JSON.stringify(newOption) !== JSON.stringify(options)) {
				setOptions(newOption);
			}
		}, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);

		// biome-ignore lint/correctness/useExhaustiveDependencies: onSearchSync is not a dependency.
		useEffect(() => {
			const doSearchSync = () => {
				const res = onSearchSync?.(debouncedSearchTerm);
				setOptions(transToGroupOption(res || [], groupBy));
			};

			const exec = async () => {
				if (!onSearchSync || !open) return;

				if (triggerSearchOnFocus) {
					doSearchSync();
				}

				if (debouncedSearchTerm) {
					doSearchSync();
				}
			};

			void exec();
		}, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

		// biome-ignore lint/correctness/useExhaustiveDependencies: onSearch is not a dependency.
		useEffect(() => {
			const doSearch = async () => {
				setIsLoading(true);
				const res = await onSearch?.(debouncedSearchTerm);
				setOptions(transToGroupOption(res || [], groupBy));
				setIsLoading(false);
			};

			const exec = async () => {
				if (!onSearch || !open) return;

				if (triggerSearchOnFocus) {
					await doSearch();
				}

				if (debouncedSearchTerm) {
					await doSearch();
				}
			};

			void exec();
		}, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

		const CreatableItem = () => {
			if (!creatable) return undefined;
			if (
				isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
				selected.find((s) => s.value === inputValue)
			) {
				return undefined;
			}

			const Item = (
				<CommandItem
					value={inputValue}
					className="cursor-pointer"
					onMouseDown={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
					onSelect={(value: string) => {
						if (selected.length >= maxSelected) {
							onMaxSelected?.(selected.length);
							return;
						}
						setInputValue("");
						const newOptions = [...selected, { value, label: value }];
						setSelected(newOptions);
						onChange?.(newOptions);
					}}
				>
					{`Create "${inputValue}"`}
				</CommandItem>
			);

			if (!onSearch && inputValue.length > 0) {
				return Item;
			}

			if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
				return Item;
			}

			return undefined;
		};

		const EmptyItem = React.useCallback(() => {
			if (!emptyIndicator) return undefined;

			if (onSearch && !creatable && Object.keys(options).length === 0) {
				return (
					<CommandItem value="-" disabled>
						{emptyIndicator}
					</CommandItem>
				);
			}

			return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
		}, [creatable, emptyIndicator, onSearch, options]);

		const selectables = React.useMemo<GroupOption>(
			() => removePickedOption(options, selected),
			[options, selected],
		);

		const commandFilter = React.useCallback(() => {
			if (commandProps?.filter) {
				return commandProps.filter;
			}

			if (creatable) {
				return (value: string, search: string) => {
					return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
				};
			}
			return undefined;
		}, [creatable, commandProps?.filter]);

		return (
			<Command
				ref={dropdownRef}
				{...commandProps}
				onKeyDown={(e) => {
					handleKeyDown(e);
					commandProps?.onKeyDown?.(e);
				}}
				className={cn(
					"h-auto overflow-visible bg-transparent",
					commandProps?.className,
				)}
				shouldFilter={
					commandProps?.shouldFilter !== undefined
						? commandProps.shouldFilter
						: !onSearch
				}
				filter={commandFilter()}
			>
				<div
					data-fit={selected.length !== 0}
					className={cn(
						"min-h-9 h-9 data-[fit=true]:h-fit rounded-md dark:bg-input/30 bg-transparent border border-input text-base md:text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
						{
							"px-3 py-2": selected.length !== 0,
							"cursor-text": !disabled && selected.length !== 0,
						},
						className,
					)}
					onClick={() => {
						if (disabled) return;
						inputRef?.current?.focus();
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !disabled) {
							inputRef?.current?.focus();
						}
					}}
					onKeyUp={(e) => {
						if (e.key === "Enter" && !disabled) {
							inputRef?.current?.focus();
						}
					}}
				>
					<div className="relative flex flex-wrap gap-1">
						{selected.map((option) => {
							return (
								<Badge
									key={option.value}
									variant="accent"
									className={cn(
										"data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground",
										"data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground",
										badgeClassName,
									)}
									data-fixed={option.fixed}
									data-disabled={disabled || undefined}
								>
									{option.label}
									<button
										type="button"
										className={cn(
											"ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2",
											(disabled || option.fixed) && "hidden",
										)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												handleUnselect(option);
											}
										}}
										onKeyUp={(e) => {
											if (e.key === "Enter") {
												handleUnselect(option);
											}
										}}
										onClick={() => handleUnselect(option)}
									>
										<X className="h-3 w-3 text-accent-foreground" />
									</button>
								</Badge>
							);
						})}
						<CommandPrimitive.Input
							{...inputProps}
							ref={inputRef}
							value={inputValue}
							disabled={disabled}
							onValueChange={(value) => {
								setInputValue(value);
								inputProps?.onValueChange?.(value);
							}}
							onBlur={(event) => {
								if (!onScrollbar) {
									setOpen(false);
								}
								inputProps?.onBlur?.(event);
							}}
							onFocus={(event) => {
								setOpen(true);
								inputProps?.onFocus?.(event);
							}}
							placeholder={
								hidePlaceholderWhenSelected && selected.length !== 0
									? ""
									: placeholder
							}
							className={cn(
								"flex-1 outline-none placeholder:text-muted-foreground",
								{
									"w-full": hidePlaceholderWhenSelected,
									"px-3 py-2": selected.length === 0,
									"ml-1": selected.length !== 0,
								},
								inputProps?.className,
							)}
						/>
						<button
							type="button"
							onClick={() => {
								setSelected(selected.filter((s) => s.fixed));
								onChange?.(selected.filter((s) => s.fixed));
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									setSelected(selected.filter((s) => s.fixed));
									onChange?.(selected.filter((s) => s.fixed));
								}
							}}
							onKeyUp={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									setSelected(selected.filter((s) => s.fixed));
									onChange?.(selected.filter((s) => s.fixed));
								}
							}}
							className={cn(
								"absolute right-0 h-6 w-6 p-0",
								(hideClearAllButton ||
									disabled ||
									selected.length < 1 ||
									selected.filter((s) => s.fixed).length === selected.length) &&
									"hidden",
							)}
						>
							<X className="size-4" />
						</button>
					</div>
				</div>
				<div className="relative">
					{open && (
						<CommandList
							data-side="bottom"
							data-state={open ? "open" : "closed"}
							className={cn(
								"absolute top-2 z-50 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none",
								"data-[state=open]:animate-in data-[state=closed]:animate-out",
								"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
								"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
								"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
								"data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
								"max-h-96 overflow-hidden",
							)}
							onMouseLeave={() => {
								setOnScrollbar(false);
							}}
							onMouseEnter={() => {
								setOnScrollbar(true);
							}}
							onMouseUp={() => {
								inputRef?.current?.focus();
							}}
						>
							{isLoading ? (
								<div className="flex items-center justify-center py-6">
									{loadingIndicator || (
										<div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent" />
									)}
								</div>
							) : (
								<>
									{EmptyItem()}
									{CreatableItem()}
									{!selectFirstItem && (
										<CommandItem value="-" className="hidden" />
									)}
									{Object.entries(selectables).map(([key, dropdowns]) => (
										<CommandGroup
											key={key}
											heading={key}
											className="h-full overflow-auto"
										>
											{dropdowns.map((option) => {
												return (
													<CommandItem
														key={option.value}
														value={option.label}
														disabled={option.disable}
														onMouseDown={(e) => {
															e.preventDefault();
															e.stopPropagation();
														}}
														onSelect={() => {
															if (selected.length >= maxSelected) {
																onMaxSelected?.(selected.length);
																return;
															}
															setInputValue("");
															const newOptions = [...selected, option];
															setSelected(newOptions);
															onChange?.(newOptions);
														}}
														className={cn(
															"cursor-pointer",
															option.disable &&
																"cursor-default text-muted-foreground",
														)}
													>
														{option.label}
													</CommandItem>
												);
											})}
										</CommandGroup>
									))}
								</>
							)}
						</CommandList>
					)}
				</div>
			</Command>
		);
	},
);

MultipleSelector.displayName = "MultipleSelector";
export default MultipleSelector;
