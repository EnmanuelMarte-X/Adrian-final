export type PaginationRequest = {
	page: number;
	limit: number;
};

export type PaginationResponse<T> = {
	data: T[];
	total: number;
};

export interface InfiniteScrollPaginationRequest {
	offset: number;
	limit: number;
}
