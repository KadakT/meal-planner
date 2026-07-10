import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { initialAppSlice } from "./app.slice";
import { addThemeCalss, changeTheme } from "./app.updaters";
import { inject } from "@angular/core";
import { StorageService } from "app/core/services";
import { CookieKeys } from "app/shared/definitions";

export const AppStore = signalStore(
    { providedIn: 'root' },
    withState(initialAppSlice),
    withComputed(store => ({
        selectedTheme: store.selectedTheme,
    })),
    withMethods(store => {
        const storageService = inject(StorageService);
        return {
            changeTheme: () => patchState(store, changeTheme(store.themes(), storageService))
        }
    }
    ),
    withHooks(store => ({
        onInit: () => {
            const storageService = inject(StorageService);
            const cookiesThemeValue = storageService.getCookie(CookieKeys.Theme);
            if (cookiesThemeValue) {
                patchState(store, { selectedTheme: cookiesThemeValue });
                addThemeCalss(cookiesThemeValue);
            } else {
                patchState(store, { selectedTheme: 'dark' });
                storageService.setCookie(CookieKeys.Theme, 'dark');
                console.log(cookiesThemeValue + ' cookiesThemeValue');
                addThemeCalss('dark');
            }
        }
    }),

    )
)