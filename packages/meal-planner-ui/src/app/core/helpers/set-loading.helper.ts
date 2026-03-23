import { patchState } from "@ngrx/signals";
import { CrudLoadingState } from "../store/crud-state";

export function setLoading<T>(
  store: any,
  action: keyof CrudLoadingState,
  value: boolean
) {
  patchState(store, {
    loading: {
      ...store.loading(),
      [action]: value
    }
  });
}