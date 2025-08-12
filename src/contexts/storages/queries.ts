import {
	getPaginationRequestParams,
	parseSafeUrlWithParams,
} from "@/lib/utils";
import type { StorageType } from "@/types/models/storages";
import type { PaginationRequest } from "@/types/pagination";
import { keepPreviousData, useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";

export const useStorage = ({
	id,
	enabled = true,
}: {
	id: string;
	enabled?: boolean;
}) => {
	return useQuery({
		queryKey: ["storage", id],
		queryFn: async () => {
			const response = await fetch(`/api/storages/${id}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch storage: ${response.status}`);
			}

			const data = await response.json();
			return data as StorageType;
		},
		enabled,
	});
};

export const useStorages = ({
	ids,
	pagination = { page: 1, limit: 20 },
	enabled = true,
}: {
	ids?: Array<string>;
	pagination?: PaginationRequest;
	enabled?: boolean;
}) => {
	return useQuery({
		queryKey: ["storages"],
		queryFn: async () => {
			const params = getPaginationRequestParams(pagination);

			if (ids) {
				params.append("ids", ids.join(","));
			}

			const response = await fetch(
				parseSafeUrlWithParams("/api/storages", params),
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch storages: ${response.status}`);
			}

			const data = await response.json();
			return {
				storages: data.data as StorageType[],
				total: data.total as number,
			};
		},
		enabled,
		placeholderData: keepPreviousData,
	});
};

export const useUpdateStorageOrderMutation = () =>
	useMutation({
		mutationFn: async (storageIds: string[]) => {
			const response = await fetch("/api/storages/reorder", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ storageIds }),
			});

			if (!response.ok) {
				throw new Error(`Failed to update storage order: ${response.status}`);
			}

			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["storages"] });
		},
	});

export function useStoragesCount() {
	return useQuery({
		queryKey: ["storagesCount"],
		queryFn: async () => {
			const response = await fetch("/api/storages/count");

			if (!response.ok) {
				throw new Error(`Failed to fetch storages count: ${response.status}`);
			}

			const { count } = await response.json();
			return count ?? 0;
		},
	});
}

export const useUpdateStorageMutation = () =>
	useMutation({
		mutationFn: async ({
			id,
			storage,
		}: { id: string; storage: Partial<StorageType> }) => {
			const response = await fetch(`/api/storages/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(storage),
			});

			if (!response.ok) {
				throw new Error(`Failed to update storage: ${response.status}`);
			}

			return response.json() as Promise<StorageType>;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["storages"] });
			queryClient.setQueryData(["storage", data._id], data);
		},
	});

export const useDeleteStorageMutation = () =>
	useMutation({
		mutationFn: async (id: string) => {
			const response = await fetch(`/api/storages/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error(`Failed to delete storage: ${response.status}`);
			}

			return response.json() as Promise<StorageType>;
		},
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: ["storages"] });
			queryClient.invalidateQueries({ queryKey: ["storagesCount"] });
			queryClient.removeQueries({ queryKey: ["storage", id] });
		},
	});
