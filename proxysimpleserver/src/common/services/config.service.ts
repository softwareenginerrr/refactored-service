import { config } from '../../config';

export class ConfigService {
    get(key: keyof typeof config) {
        return config[key];
    }
}
