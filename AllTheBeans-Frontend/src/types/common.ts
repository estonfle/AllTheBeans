export interface PagedResult<T> {
    items?: T[] | null;
    totalCount?: number;
    pageNumber?: number;
    pageSize?: number;
}

export interface PaginationParams {
    search?: string;
    page?: number;
    pageSize?: number;
}