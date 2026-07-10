export interface CrudLoadingState {
  load: boolean;
  loadById: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface CrudState<T> {
  items: T[];
  pagination: Pagination | null;
  currentItem: T | null;
  loading: CrudLoadingState;
  error: string | null;
}

export interface CrudStoreConfig<TEntity, TApi = TEntity> {
    baseUrl: string;
    mapFromApi?: (item: TApi) => TEntity;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}