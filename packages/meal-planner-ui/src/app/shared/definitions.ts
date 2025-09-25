export enum CookieKeys {
    Theme = 'theme',
    TestCookie = 'testCookie'
}

export enum SessionKeys {
    Language = 'land',
    SessionId = 'sessionId',
    Token = 'token'
}

export interface CookieEntry {
    name: CookieKeys;
    value: string | null;
}

export interface StorageEntry {
    key: SessionKeys;
    value: string | null;
}