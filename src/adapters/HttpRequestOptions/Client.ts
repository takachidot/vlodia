import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';

interface HttpRequestOptions extends http.RequestOptions {
    headers?: http.OutgoingHttpHeaders;
    data?: any;
}

export class HttpClient {
    private readonly baseUrl: string;
    private readonly defaultHeaders: http.OutgoingHttpHeaders = {
        'Content-Type': 'application/json',
    };

    constructor() {
        this.baseUrl = '';
    }

    private async request(method: string, path: string, options: HttpRequestOptions = {}): Promise<any> {
        const url = new URL(path, this.baseUrl);

        const requestOptions: HttpRequestOptions = {
            method: method.toUpperCase(),
            headers: { ...this.defaultHeaders },
        };

        if (options.headers && typeof options.headers === 'object') {
            requestOptions.headers = { ...requestOptions.headers, ...options.headers };
        }

        if (options.data) {
            if (requestOptions.headers) {
                requestOptions.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(options.data));
            }
        }

        return new Promise((resolve, reject) => {
            const client = url.protocol === 'https:' ? https : http;
            const req = client.request(url.toString(), requestOptions, (res) => {
                let responseBody = '';

                res.on('data', (chunk) => {
                    responseBody += chunk;
                });

                res.on('end', () => {
                    const headers = new Headers();
                    for (const [key, value] of Object.entries(res.headers)) {
                        if (Array.isArray(value)) {
                            headers.append(key, value.join(', '));
                        } else if (value !== undefined) {
                            headers.append(key, value);
                        }
                    }

                    const response = new globalThis.Response(responseBody, {
                        status: res.statusCode || 200,
                        statusText: res.statusMessage || '',
                        headers: headers,
                    });
                    resolve(response);
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (options.data) {
                req.write(JSON.stringify(options.data));
            }

            req.end();
        });
    }

    async get(path: string, options?: HttpRequestOptions): Promise<any> {
        return this.request('GET', path, options);
    }

    async post(path: string, data?: any, options?: HttpRequestOptions): Promise<any> {
        return this.request('POST', path, { ...options, data });
    }

    async put(path: string, data?: any, options?: HttpRequestOptions): Promise<any> {
        return this.request('PUT', path, { ...options, data });
    }

    async delete(path: string, options?: HttpRequestOptions): Promise<any> {
        return this.request('DELETE', path, options);
    }

    async fetch(input: string | URL | globalThis.Request, init?: RequestInit): Promise<globalThis.Response> {
        const url = typeof input === 'string' || input instanceof URL ? new URL(input.toString()) : new URL(input.url);
        const method = init?.method ? init.method.toUpperCase() : 'GET';

        const headers: http.OutgoingHttpHeaders = { ...this.defaultHeaders };
        if (init?.headers) {
            for (const [key, value] of Object.entries(init.headers as Record<string, string>)) {
                headers[key] = value;
            }
        }

        const requestOptions: HttpRequestOptions = {
            method,
            headers,
        };

        if (init?.body) {
            requestOptions.data = init.body;
        }

        return new Promise((resolve, reject) => {
            const client = url.protocol === 'https:' ? https : http;
            const req = client.request(url.toString(), requestOptions, (res) => {
                let responseBody = '';

                res.on('data', (chunk) => {
                    responseBody += chunk;
                });

                res.on('end', () => {
                    const headers = new Headers();
                    for (const [key, value] of Object.entries(res.headers)) {
                        if (Array.isArray(value)) {
                            headers.append(key, value.join(', '));
                        } else if (value !== undefined) {
                            headers.append(key, value);
                        }
                    }

                    const response = new globalThis.Response(responseBody, {
                        status: res.statusCode || 200,
                        statusText: res.statusMessage || '',
                        headers: headers,
                    });
                    resolve(response);
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (requestOptions.data) {
                req.write(requestOptions.data);
            }

            req.end();
        });
    }
}
