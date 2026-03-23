// core/utils/with-http-action.ts
import { HttpClient } from '@angular/common/http';
import { patchState, WritableStateSource } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { Observable, switchMap, tap } from 'rxjs';

interface HttpActionConfig<
  TData = any,
  TResponse = any,
  TState extends object = any,
  TStore extends WritableStateSource<TState> = WritableStateSource<TState>
> {
  store: TStore;
  http: HttpClient;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: (data: TData) => string;
  onSuccess?: (response: TResponse) => Partial<TState> | void;
  // onError?: string;
  onError?: ((error: any) => Partial<TState> | void) | string;
  body?: (data: TData) => any;
  params?: (data: TData) => Record<string, any>;
  toastSuccess?: string;
  toastError?: string;
}

export function withHttpAction<
  TData = any,
  TResponse = any,
  TState extends object = any,
  TStore extends WritableStateSource<TState> = WritableStateSource<TState>
>(config: HttpActionConfig<TData, TResponse, TState, TStore>) {
  const {
    store,
    http,
    method,
    url,
    onSuccess,
    onError,
    body,
    params,
    toastSuccess,
    toastError,
  } = config;

  return rxMethod<TData>((trigger$) =>
    trigger$.pipe(
      tap(() => patchState(store, { isLoading: true, error: null } as unknown as Partial<TState>)),
      switchMap((data) => {
        let request$: Observable<TResponse>;

        const httpParams = params ? params(data) : undefined;

        switch (method) {
          case 'GET':
            request$ = http.get<TResponse>(url(data), {
              params: httpParams
            });
            break;
          case 'POST':
            request$ = http.post<TResponse>(url(data), body ? body(data) : data);
            break;
          case 'PUT':
            request$ = http.put<TResponse>(
              url(data),
              body ? body(data) : data,   
              {
                params: httpParams  
              }
            );
            break;
          case 'DELETE':
            request$ = http.delete<TResponse>(url(data),{ params: httpParams });
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }

        return request$.pipe(
          tapResponse({
            next: (response) => {
              const updatedState = onSuccess?.(response);
              if (updatedState) patchState(store, updatedState);

              if (toastSuccess && (store as any).toastNotificationService) {
                (store as any).toastNotificationService.showSuccess(toastSuccess);
              }

              patchState(store, { isLoading: false } as unknown as Partial<TState>);
            },
            error: (err) => {
              console.error('HTTP action failed:', err);

              patchState(store, { isLoading: false } as unknown as Partial<TState>);

              if (typeof onError === 'function') {
                const errorPatch = onError(err);
                if (errorPatch) patchState(store, errorPatch);
              }
              else if (typeof onError === 'string') {
                patchState(store, { error: onError } as unknown as Partial<TState>);
              }

              if (toastError && (store as any).toastNotificationService) {
                (store as any).toastNotificationService.showError(toastError);
              }
            },
          })
        );
      })
    )
  );
}
