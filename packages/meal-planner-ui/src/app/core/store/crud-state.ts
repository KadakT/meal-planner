export interface CrudLoadingState {
  load: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface CrudState<T> {
  items: T[];
  loading: CrudLoadingState;
  error: string | null;
}