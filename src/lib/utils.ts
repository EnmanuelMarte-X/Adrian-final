import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/config/pagination";
import {
	capacityUnitLabels,
	capacityUnitLabelsPlural,
} from "@/config/products";
import type { Result } from "@/types/helpers";
import type { ClientDocumentType } from "@/types/models/clients";
import type { ProductCapacityUnit } from "@/types/models/products";
import type { PaginationRequest } from "@/types/pagination";
import type { PaginationState } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const isDev = process.env.NODE_ENV === "development";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength)}...`;
}

export function isArrayEmpty<T>(array: T[] | undefined): boolean {
	return !array || array.length === 0;
}

export function isObjectEmpty<T>(object: T | undefined): boolean {
	return !object || Object.keys(object).length === 0;
}

export function isValidDate<T>(date: T): boolean {
	return date instanceof Date;
}

export function getTotalPages(total?: number, pageSize?: number): number {
	if (!total || !pageSize) return 0;

	return Math.ceil(total / pageSize);
}

export function getPageFromOffset(offset: number, pageSize: number): number {
	return Math.floor(offset / pageSize) + 1;
}

export function getOffsetFromPage(page: number, pageSize: number): number {
	return (page - 1) * pageSize;
}

export function getSafePaginationRequest(
	pageRequest: PaginationRequest,
): PaginationRequest {
	return {
		limit: Math.max(1, pageRequest.limit || DEFAULT_PAGE_SIZE),
		page: Math.max(1, pageRequest.page || DEFAULT_PAGE),
	};
}

export function getUnsetValue<T>(value: T | undefined, unsetValue: T): T {
	if (value === undefined) {
		return unsetValue;
	}

	if (!value || (typeof value === "string" && value.trim() === "")) {
		return unsetValue;
	}

	return value;
}

export function getDateFromObjectId(id?: string) {
	if (!id || typeof id !== "string" || id.length < 8) return undefined;

	const timestamp = Number.parseInt(id.substring(0, 8), 16);
	if (Number.isNaN(timestamp)) return undefined;

	return new Date(timestamp * 1000);
}

export function getProductCapacityUnitLabel(
	capacityUnit: ProductCapacityUnit,
	value: number,
): string {
	if (value === 1) {
		return capacityUnitLabels[capacityUnit];
	}

	return capacityUnitLabelsPlural[capacityUnit];
}

export async function tryCatch<T, E = Error>(
	promise: Promise<T>,
): Promise<Result<T, E>> {
	try {
		const data = await promise;
		return { data, error: null };
	} catch (error) {
		return { data: null, error: error as E };
	}
}

export function getPaginationRequestParams(
	pagination: PaginationRequest,
): URLSearchParams {
	const params = new URLSearchParams();

	if (pagination.page) {
		params.set("page", pagination.page.toString());
	}

	if (pagination.limit) {
		params.set("limit", pagination.limit.toString());
	}

	return params;
}

export function parseSafeUrlWithParams(
	url: string,
	params: URLSearchParams,
): string {
	if (params.toString() === "") {
		return url;
	}

	return `${url}?${params.toString()}`;
}

export function getPaginationRequestFromState(
	state: PaginationState,
): PaginationRequest {
	return {
		page: state.pageIndex,
		limit: state.pageSize,
	};
}

export function parseSortParams<T extends { field: string; order: string }>(
	sortString: string | undefined | null,
): T[] {
	if (!sortString) return [];

	return sortString
		.split(",")
		.filter(Boolean)
		.map((sortItem: string) => {
			const [field, order] = sortItem.split(":");
			return { field, order } as T;
		});
}

export function sumArray(array: number[]): number {
	return array.reduce((acc, v) => acc + v, 0);
}

export function setStartOfDay(date: Date): Date {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

export function setEndOfDay(date: Date): Date {
	const d = new Date(date);
	d.setHours(23, 59, 59, 999);
	return d;
}

export function getInitials(name?: string): string {
	if (!name || typeof name !== "string") return "?";

	const trimmedName = name.trim();
	if (!trimmedName) return "?";

	const words = trimmedName.split(" ");
	if (words.length >= 2) {
		return `${words[0].charAt(0).toUpperCase()}${words[1].charAt(0).toUpperCase()}`;
	}
	return trimmedName.substring(0, 2).toUpperCase();
}

export function isValidObjectId(id: unknown): id is string {
	return typeof id === "string" && /^[a-f\d]{24}$/i.test(id);
}

export function formatNationalId(
	id?: string,
	documentType?: ClientDocumentType,
) {
	if (!id || !documentType) return id || "";
	console.log("Formatting ID:", id, "Type:", documentType);
	switch (documentType) {
		case "cedula":
			return id.replace(/(\d{3})(\d{7})(\d{1})/, "$1-$2-$3");
		case "rnc":
			return id.replace(/(\d{3})(\d{7})(\d{1})/, "$1-$2-$3");
		case "passport":
			return id.toUpperCase();
		default:
			return id;
	}
}

const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function encodeBase62(num: bigint): string {
	let s = "";
	let n = num;
	while (n > BigInt(0)) {
		s = BASE62[Number(n % BigInt(62))] + s;
		n = n / BigInt(62);
	}
	return s || "0";
}

function decodeBase62(str: string): bigint {
	let num = BigInt(0);
	for (const c of str) {
		const val = BigInt(BASE62.indexOf(c));
		num = num * BigInt(62) + val;
	}
	return num;
}

export function mongoIdToShort(id: string): string {
	return encodeBase62(BigInt(`0x${id}`));
}

export function shortToMongoId(short: string): string {
	return decodeBase62(short).toString(16).padStart(24, "0");
}


export function getFirstNameAndLastInitial(fullName: string): string {
	const names = fullName.trim().split(" ");
	if (names.length === 0) return "";
	const firstName = names[0];
	const lastInitial = names.length > 1 ? `${names[names.length - 1][0]}.` : "";
	return `${firstName} ${lastInitial}`.trim();
}