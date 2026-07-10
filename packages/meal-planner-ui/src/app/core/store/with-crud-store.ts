import { patchState, signalStoreFeature, withMethods, withState } from "@ngrx/signals";
import { CrudState, CrudStoreConfig, PaginatedResponse } from "./crud-state";
import { inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, EMPTY, finalize, tap, throwError } from "rxjs";
import { setLoading } from "../helpers/set-loading.helper";

export function withCrudStore<
    TEntity extends { id: string | number },
    TCreate = Omit<TEntity, 'id'>,
    TUpdate = Partial<TCreate>,
    TApi = TEntity
>(config: CrudStoreConfig<TEntity, TApi>) {

    return signalStoreFeature(

        withState<CrudState<TEntity>>({
            items: [],
            pagination: null,
            currentItem: null,
            loading: {
                load: false,
                loadById: false,
                create: false,
                update: false,
                delete: false
            },
            error: null
        }),

        withMethods((store, http = inject(HttpClient)) => ({
            load: (page = 1, limit = 10) => {
                if (store.loading().load) return EMPTY;

                setLoading(store, 'load', true);

                const params = {
                    page,
                    limit,
                };

                const mapFromApi = (item: TApi): TEntity =>
                    config.mapFromApi
                        ? config.mapFromApi(item)
                        : item as unknown as TEntity;

                return http
                    .get<PaginatedResponse<TApi>>(config.baseUrl, { params })
                    .pipe(
                        tap((response) => {
                            patchState(store, {
                                items: response.data.map(mapFromApi),
                                pagination: response.pagination,
                            });
                        }),

                        catchError((err) => {
                            patchState(store, { error: err.message });
                            return throwError(() => err);
                        }),

                        finalize(() => {
                            setLoading(store, 'load', false);
                        })
                    );
            },

            loadById: (id: string | number) => {
                if (store.loading().loadById) return EMPTY;

                setLoading(store, 'loadById', true);

                return http.get<TApi>(`${config.baseUrl}/${id}`).pipe(
                    tap((item) => {
                        const mapped = config.mapFromApi ? config.mapFromApi(item) : (item as unknown as TEntity);
                        const items = store.items();
                        const existingIndex = items.findIndex((existing) => existing.id === mapped.id);

                        const updatedItems =
                            existingIndex >= 0
                                ? items.map((existing) => (existing.id === mapped.id ? mapped : existing))
                                : [...items, mapped];

                        patchState(store, {
                            currentItem: mapped,
                            items: updatedItems
                        });
                    }),
                    catchError((err) => {
                        patchState(store, { error: err.message });
                        return throwError(() => err);
                    }),
                    finalize(() => {
                        setLoading(store, 'loadById', false);
                    })
                );
            },


            //CREATE
            create: (item: TCreate) => {

                if (store.loading().create) return EMPTY;

                setLoading(store, 'create', true);

                return http.post<TApi>(config.baseUrl, item).pipe(

                    tap(newItem => {
                        const mapped = config.mapFromApi ? config.mapFromApi(newItem) : (newItem as unknown as TEntity);

                        patchState(store, {
                            items: [...store.items(), mapped]
                        });

                    }),

                    finalize(() => {

                        setLoading(store, 'create', false);

                    })

                );
            },

            //UPDATE
            update: (id: string | number, item: TUpdate) => {

                if (store.loading().update) return EMPTY;

                setLoading(store, 'update', true);

                return http.put<TApi>(`${config.baseUrl}/${id}`, item).pipe(

                    tap(updated => {
                        const mapped = config.mapFromApi ? config.mapFromApi(updated) : (updated as unknown as TEntity);

                        patchState(store, {
                            currentItem: mapped,
                            items: store.items().map(i =>
                                i.id === mapped.id ? mapped : i
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
            },

            clearCurrentItem: () => {
                patchState(store, {
                    currentItem: null
                });
            },
        }))
    );
}