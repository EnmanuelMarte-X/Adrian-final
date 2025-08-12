import { format } from "date-fns";
import { es } from "date-fns/locale";

export const currencyFormat = new Intl.NumberFormat("es-DO", {
	style: "currency",
	currency: "DOP",
});

export const percentageFormat = new Intl.NumberFormat("es-DO", {
	style: "percent",
	minimumFractionDigits: 1,
	maximumFractionDigits: 1,
});

export const numberFormat = new Intl.NumberFormat("es-DO", {
	unitDisplay: "short",
	minimumFractionDigits: 0,
	maximumFractionDigits: 2,
});

export const dateFormat = (date?: Date, formatString = "PP") => {
	if (!date) return "No disponible";
	return format(date, formatString, { locale: es });
};

export const nameFormat = (name?: string): string => {
	if (!name || typeof name !== "string") return "N/A";
	const words = name.trim().split(" ");
	if (words.length === 0) return "N/A";
	if (words.length < 3) return words.join(" ");
	return `${words[0]} ${words[1].charAt(0).toUpperCase()}. ${words[2]}`;
};
