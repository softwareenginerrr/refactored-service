import App from './app';
import initializeMongoose from './datasource';
import {ConfigService} from "./common/services/config.service";
const configService = new ConfigService();
const app = new App(configService.get('PORT'));
app.listen();
initializeMongoose(configService.get('MONGO_URI'));