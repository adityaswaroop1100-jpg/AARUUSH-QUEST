declare module 'next/headers' {
  export interface CookieItem {
    name: string;
    value: string;
    options?: any;
  }
  export interface ReadonlyRequestCookies {
    getAll(): CookieItem[];
    set(name: string, value: string, options?: any): void;
    get(name: string): CookieItem | undefined;
  }
  export function cookies(): Promise<ReadonlyRequestCookies>;
}

declare module 'next/server' {
  export class NextRequest {
    headers: any;
    cookies: {
      getAll(): { name: string; value: string }[];
      set(name: string, value: string, options?: any): void;
    };
  }
  export class NextResponse {
    static next(init?: any): NextResponse;
    cookies: {
      set(name: string, value: string, options?: any): void;
    };
  }
}
