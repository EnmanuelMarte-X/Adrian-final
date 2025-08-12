"use client";

import React, { useState } from "react";
import type { ClientFilters } from "@/contexts/clients/types";
import { useQueryState, parseAsString, parseAsBoolean } from "nuqs";
import { ClientFilterBadges } from "./ClientFilterBadges";
import { isObjectEmpty } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import { AdvancedClientsFilters } from "./filters/AdvancedClientsFilters";

interface ClientsFiltersProps {
	filters: ClientFilters;
	onFiltersChange: (filters: ClientFilters) => void;
}

export function ClientsFilters({
	filters,
	onFiltersChange,
}: ClientsFiltersProps) {
	const [nameParam, setNameParam] = useQueryState("name", parseAsString);
	const [documentNumberParam, setDocumentNumberParam] = useQueryState(
		"documentNumber",
		parseAsString,
	);
	const [documentTypeParam, setDocumentTypeParam] = useQueryState(
		"documentType",
		parseAsString,
	);
	const [typeParam, setTypeParam] = useQueryState("type", parseAsString);
	const [emailParam, setEmailParam] = useQueryState("email", parseAsString);
	const [isActiveParam, setIsActiveParam] = useQueryState(
		"isActive",
		parseAsBoolean,
	);
	const [phoneParam, setPhoneParam] = useQueryState("phone", parseAsString);

	const [localName, setLocalName] = useState(nameParam ?? "");
	const [localEmail, setLocalEmail] = useState(emailParam ?? "");

	React.useEffect(() => {
		setLocalName(nameParam ?? "");
	}, [nameParam]);

	React.useEffect(() => {
		setLocalEmail(emailParam ?? "");
	}, [emailParam]);

	React.useEffect(() => {
		const newFilters: ClientFilters = {};
		if (nameParam) newFilters.name = nameParam;
		if (documentNumberParam) newFilters.documentNumber = documentNumberParam;
		if (documentTypeParam)
			newFilters.documentType =
				documentTypeParam as ClientFilters["documentType"];
		if (typeParam) newFilters.type = typeParam as ClientFilters["type"];
		if (emailParam) newFilters.email = emailParam;
		if (typeof isActiveParam === "boolean") newFilters.isActive = isActiveParam;

		if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
			onFiltersChange(newFilters);
		}
	}, [
		nameParam,
		documentNumberParam,
		documentTypeParam,
		typeParam,
		emailParam,
		isActiveParam,
		filters,
		onFiltersChange,
	]);

	const debouncedUpdateName = useDebouncedCallback((value: string) => {
		setNameParam(value || null);
	}, 400);

	const debouncedUpdateEmail = useDebouncedCallback((value: string) => {
		setEmailParam(value || null);
	}, 400);

	const debouncedUpdateDocumentNumber = useDebouncedCallback(
		(value: string) => {
			setDocumentNumberParam(value || null);
		},
		400,
	);

	const handleNameChange = (value: string) => {
		setLocalName(value);
		debouncedUpdateName(value);
	};

	const handleEmailChange = (value: string) => {
		setLocalEmail(value);
		debouncedUpdateEmail(value);
	};

	const handleDocumentNumberChange = (value: string) => {
		setDocumentNumberParam(value);
		debouncedUpdateDocumentNumber(value);
	};

	const handleClearFilters = async () => {
		await Promise.all([setDocumentTypeParam(null), setTypeParam(null)]);
	};

	const removeFilter = async (key: keyof ClientFilters) => {
		switch (key) {
			case "name":
				await setNameParam(null);
				break;
			case "documentNumber":
				await setDocumentNumberParam(null);
				break;
			case "documentType":
				await setDocumentTypeParam(null);
				break;
			case "type":
				await setTypeParam(null);
				break;
			case "email":
				await setEmailParam(null);
				break;
			case "isActive":
				await setIsActiveParam(null);
				break;
		}
	};

	return (
		<div className="flex flex-col w-full gap-3">
			<div className="flex flex-wrap gap-3 items-end">
				<div className="flex flex-col">
					<Label htmlFor="name" className="mb-1 text-sm">
						Nombre
					</Label>
					<Input
						id="name"
						placeholder="Nombre del cliente"
						className="w-52"
						value={localName}
						onChange={(e) => handleNameChange(e.target.value)}
					/>
				</div>

				<div className="flex flex-col">
					<Label htmlFor="email" className="mb-1 text-sm">
						Email
					</Label>
					<Input
						id="email"
						placeholder="example@talentix.dev"
						className="w-52"
						value={localEmail}
						onChange={(e) => handleEmailChange(e.target.value)}
					/>
				</div>

				<div className="flex flex-col">
					<Label htmlFor="phone" className="mb-1 text-sm">
						Teléfono
					</Label>
					<Input
						id="phone"
						placeholder="+1 809-123-4567"
						className="w-52"
						value={phoneParam ?? ""}
						onChange={(e) => setPhoneParam(e.target.value || null)}
					/>
				</div>

				<div className="flex flex-col">
					<Label htmlFor="documentNumber" className="mb-1 text-sm">
						Número de documento
					</Label>
					<Input
						id="documentNumber"
						placeholder="402-1234567-8"
						className="w-52"
						value={documentNumberParam ?? ""}
						onChange={(e) => handleDocumentNumberChange(e.target.value)}
					/>
				</div>

				<AdvancedClientsFilters
					filters={filters}
					documentType={documentTypeParam ?? undefined}
					type={typeParam ?? undefined}
					documentTypeUrlSetter={setDocumentTypeParam}
					typeUrlSetter={setTypeParam}
					isActive={isActiveParam ?? null}
					isActiveUrlSetter={setIsActiveParam}
					onClearFilters={handleClearFilters}
				/>
			</div>

			{!isObjectEmpty(filters) && (
				<ClientFilterBadges
					filters={filters}
					onRemoveFilter={removeFilter}
					fixedKeys={[]}
				/>
			)}
		</div>
	);
}
