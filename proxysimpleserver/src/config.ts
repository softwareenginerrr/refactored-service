import 'dotenv/config'

export const config = {
    PROXY_PORT: process.env.HTTPSERVER_PORT ?? '8080',
    HOST: process.env.HOST ?? 'api.coindesk.com',
    PORT: process.env.PORT ?? '443',
    PROTOCOL: process.env.PROTOCOL ?? 'https:',
    REQUEST_PATH: process.env.REQUEST_PATH ?? '/v1/bpi/currentprice.json',
    CACHE_DIRECTORY: process.env.CACHE_DIRECTORY ?? './proxy-cache',
    TTL: process.env.TTL ?? '60',
}
