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

        const requestOptions: http.RequestOptions = {
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
                    const response = {
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: responseBody,
                    };
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
}
