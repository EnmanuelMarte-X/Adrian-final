"use client";

import { useFormContext } from "react-hook-form";
import { ClientAddressesFields } from "./ClientAddressesFields";
import { ClientPhonesFields } from "./ClientPhonesFields";
import type { CreateClientFormValues } from "./schemas/create-client-schema";

export function ClientContactsForm() {
	const { control } = useFormContext<CreateClientFormValues>();

	return (
		<div className="space-y-6">
			<div>
				<h4 className="font-medium mb-4 text-lg">Teléfonos *</h4>
				<ClientPhonesFields control={control} />
			</div>

			<div>
				<h4 className="font-medium mb-4 text-lg">Direcciones</h4>
				<ClientAddressesFields control={control} />
			</div>
		</div>
	);
}
