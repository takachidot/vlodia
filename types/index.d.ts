export interface WriteOptions {
	write?: boolean;
	pretty?: boolean;
}

import * as http from 'http';
interface HttpRequestOptions extends http.RequestOptions {
  headers?: http.OutgoingHttpHeaders;
  data?: any;
}
declare module "vlodia" {
  export class Database {
    private readonly dbFilePath: string;
    private cache: Record<string, unknown>;
    public constructor(filePath: string);
    public get: (key: string) => any;
    public fetch: (key: string) => any;
    public has: (key: string) => boolean;
    public set: (key: string, value: any, options?: WriteOptions) => any;
    private write: (options?: WriteOptions) => void;
    public delete: (key: string, options?: WriteOptions) => boolean;
    public add: (key: string, count: number, options: WriteOptions) => any;
    public subtract: (key: string, count: number, options: WriteOptions) => any;
    public push: (key: string, el: any, options: WriteOptions) => any;
    public pull: (key: string, el: any, options: WriteOptions) => boolean;
    public all: () => Record<string, unknown>;
    public clear: () => boolean;
    private read: () => Record<string, unknown>;
    private get _get(): number;
    private get _set(): number;
    private get ping(): Record<string, unknown>;
  }
  export class HttpClient {
    get(path: string, options?: HttpRequestOptions): Promise<any>;
        post(path: string, data?: any, options?: HttpRequestOptions): Promise<any>;
        put(path: string, data?: any, options?: HttpRequestOptions): Promise<any>;
        delete(path: string, options?: HttpRequestOptions): Promise<any>;

  }
}
