import * as http from 'http';
import * as https from 'https';
import { IProxyRequestOptions } from './interfaces/proxyServerOptions.interface';
import { CacheFile } from './cache/CacheFile';
import { ConfigService } from './services/config.service';
import { ProtocolType } from './types/protocol.type';

export class ProxyServer {
    private readonly cacheKey: string;
    constructor(private readonly cacheFile: CacheFile, private readonly configService: ConfigService) {
        this.cacheFile = cacheFile;
        this.configService = configService;
        this.cacheKey = this.configService.get('HOST') + this.configService.get('REQUEST_PATH').replaceAll('/', '.');
    }

    private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        if(req.method === 'GET'){
            await this.handleGETRequest(req, res);
        }
        else {
            this.createProxyRequest(req, res);
        }
    }

    private async handleGETRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        const cacheFile = await this.cacheFile.get(this.cacheKey);
        if (cacheFile) {
            console.log("Cache valid no need to perform new request");
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(cacheFile);
        } else {
            console.log("Taking fresh data from server");
            this.createProxyRequest(req, res);
        }
    }

    private createProxyRequest(req: http.IncomingMessage, res: http.ServerResponse): void {

        const proxyOptions: IProxyRequestOptions = {
            host: this.configService.get('HOST'),
            port: Number(this.configService.get('PORT')),
            protocol: this.configService.get('PROTOCOL') as ProtocolType,
            path: this.configService.get('REQUEST_PATH'),
        };

        const proxyProtocol = proxyOptions.protocol === 'https:' ? https : http;

        const proxyRequest = proxyProtocol.request(proxyOptions, async (proxyResponse) => {
            res.writeHead(proxyResponse.statusCode || 500, proxyResponse.headers || {});

            proxyResponse.pipe(res, {
                end: true,
            });

            if (req.method === 'GET') {

                const responseBodyChunks: Buffer[] = [];

                proxyResponse.on('data', (chunk) => {
                    responseBodyChunks.push(chunk);
                });

                proxyResponse.on('end', async () => {
                    const responseBody = Buffer.concat(responseBodyChunks).toString('utf-8');
                    await this.cacheFile.set(this.cacheKey, responseBody, Number(this.configService.get('TTL')));
                });
            }
        });

        req.pipe(proxyRequest, {
            end: true,
        });

        proxyRequest.on('error', (err) => {
            console.error('Proxy Request Error:', err.message);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        });

        req.on('error', (err) => {
            console.error('Request Error:', err.message);
            proxyRequest.destroy();
        });

        req.on('destroyed', () => {
            proxyRequest.destroy();
        });
    }

    public async start(port: number): Promise<void> {
        const server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        server.listen(port, () => {
            console.log(`Proxy server is listening on port ${port}`);
        });
    }
}
