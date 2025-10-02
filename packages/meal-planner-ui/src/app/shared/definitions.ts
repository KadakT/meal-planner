export enum CookieKeys {
    Theme = 'theme',
    TestCookie = 'testCookie'
}

export enum SessionKeys {
    Language = 'land',
    SessionId = 'sessionId',
    Token = 'token'
}

export const TOKEN_TTL = {
    REMEMBER_ME: 7 * 24 * 60 * 60 * 1000  // 7 days
} 

export interface CookieEntry {
    name: CookieKeys;
    value: string | null;
}

export interface StorageEntry {
    key: SessionKeys;
    value: string | null;
}