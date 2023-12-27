import {ProxyServer} from "./common/initializeServer";
import {CacheFile} from "./common/cache/CacheFile";
import {ConfigService} from "./common/services/config.service";

const config = new ConfigService();
const proxyServer = new ProxyServer(new CacheFile(config.get('CACHE_DIRECTORY')), config);
proxyServer.start(Number(config.get('PROXY_PORT')));
