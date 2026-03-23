import { PartialStateUpdater } from "@ngrx/signals";
import { AppSlice } from "./app.slice";
import { StorageService } from "app/core/services";
import { CookieKeys } from "app/shared/definitions";
import { activateTheme } from "app/shared/utils";

export function changeTheme(themes: string[], storageService: StorageService): PartialStateUpdater<AppSlice> {
    return state => {
        const index = themes.indexOf(state.selectedTheme) ?? -1;
        const nextIndex = (index + 1) % themes.length;
        const selectedTheme = themes[nextIndex];
        storageService.setCookie(CookieKeys.Theme, selectedTheme);
        addThemeCalss(selectedTheme)
        return { selectedTheme };
    }
}

export function addThemeCalss(theme: string): void {
     if (document.body.classList) {
            document.body.classList.remove('dark', 'light'), document.body.classList.add(theme)
        }
}