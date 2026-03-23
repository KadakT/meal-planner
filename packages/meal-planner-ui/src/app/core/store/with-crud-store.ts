import { patchState, signalStoreFeature, withMethods, withState } from "@ngrx/signals";
import { CrudState } from "./crud-state";
import { inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, EMPTY, finalize, tap, throwError } from "rxjs";
import { setLoading } from "../helpers/set-loading.helper";

export function withCrudStore<
    T extends { id: string | number }
>(config: { baseUrl: string }) {

    return signalStoreFeature(

        withState<CrudState<T>>({
            items: [],
            loading: {
                load: false,
                create: false,
                update: false,
                delete: false
            },
            error: null
        }),

        withMethods((store, http = inject(HttpClient)) => ({
            load: () => {

                if (store.loading().load) return EMPTY;

                setLoading(store, 'load', true);

                return http.get<T[]>(config.baseUrl).pipe(

                    tap(items => {

                        patchState(store, { items });

                    }),

                    catchError(err => {

                        patchState(store, { error: err.message });
                        return throwError(() => err);

                    }),

                    finalize(() => {

                        setLoading(store, 'load', false);

                    })

                );
            },

            //CREATE
            create: (item: T) => {

                if (store.loading().create) return EMPTY;

                setLoading(store, 'create', true);

                return http.post<T>(config.baseUrl, item).pipe(

                    tap(newItem => {

                        patchState(store, {
                            items: [...store.items(), newItem]
                        });

                    }),

                    finalize(() => {

                        setLoading(store, 'create', false);

                    })

                );
            },

            //UPDATE
            update: (item: T) => {

                if (store.loading().update) return EMPTY;

                setLoading(store, 'update', true);

                return http.put<T>(`${config.baseUrl}/${item.id}`, item).pipe(

                    tap(updated => {

                        patchState(store, {
                            items: store.items().map(i =>
                                i.id === updated.id ? updated : i
                            )
                        });

                    }),

                    finalize(() => {

                        setLoading(store, 'update', false);

                    })

                );
            },

            //DELETE
            delete: (id: string | number) => {

                if (store.loading().delete) return EMPTY;

                setLoading(store, 'delete', true);

                return http.delete(`${config.baseUrl}/${id}`).pipe(

                    tap(() => {

                        patchState(store, {
                            items: store.items().filter(i => i.id !== id)
                        });

                    }),

                    finalize(() => {

                        setLoading(store, 'delete', false);

                    })

                );
            }
        }))
    );
}