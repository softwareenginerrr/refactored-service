import { config } from '../../config';
import { injectable } from 'inversify';

@injectable()
export class ConfigService {
    get(key: keyof typeof config) {
        return config[key];
    }
}
