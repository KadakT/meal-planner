export interface CrudLoadingState {
  load: boolean;
  loadById: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface CrudState<T> {
  items: T[];
  currentItem: T | null;
  loading: CrudLoadingState;
  error: string | null;
}