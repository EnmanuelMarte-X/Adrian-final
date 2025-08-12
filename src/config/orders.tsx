import type { PaymentMethod } from "@/types/models/paymentHistory";

import {
	CircleDollarSignIcon,
	CircleHelpIcon,
	CreditCardIcon,
	LandmarkIcon,
} from "lucide-react";
import type { JSX } from "react";

export const paymentMethodIcons: Record<PaymentMethod, JSX.Element> = {
	credit_card: <CreditCardIcon />,
	bank_transfer: <LandmarkIcon />,
	cash: <CircleDollarSignIcon />,
};

export const unknownPaymentMethod = "Desconocido";
export const unknownPaymentMethodIcon = <CircleHelpIcon />;
