export interface AppSlice {
    readonly selectedTheme: string;
    readonly themes: string[];
}

export const initialAppSlice: AppSlice = {
    selectedTheme: '',
    themes: ['light', 'dark'],
};
