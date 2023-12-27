import * as bodyParser from "body-parser";
import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import { Container } from "inversify";
import TYPES from "./common/constants/InjectionTypes";
import { ConfigService } from "./common/services/config.service";
import {LoggerService} from "./common/services/logger.service";
import cors from 'cors';
import exceptionsMiddleware from "./common/middlewares/exceptions.middleware";

import './users/http/users.controller';
import {UserService} from "./users/services/user.service";
import {UserRepository} from "./repository/user/user.repository";
class App {
    public app: InversifyExpressServer;
    public port: string;

    constructor(port: string) {
        this.port = port;
        this.app = this.initializeContainer();
        this.initializeMiddlewares();
    }
    private initializeContainer() {
        const container = new Container();
        container.bind<LoggerService>(TYPES.LoggerService).to(LoggerService);
        container.bind<ConfigService>(TYPES.ConfigService).to(ConfigService);
        container.bind<UserService>(TYPES.UserService).to(UserService);
        container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
        return new InversifyExpressServer(container);
    }

    private initializeMiddlewares() {
        this.app.setConfig((app) => {
            app.use(bodyParser.json());
            app.use(cors({ credentials: true, origin: ['http://localhost:8080'] }));
        });
        this.app.setErrorConfig((app) => {
            app.use(exceptionsMiddleware);
        });
    }

    public listen() {
        const serverInstance = this.app.build();
        serverInstance.listen(this.port);
        console.log(`App listening on the port ${this.port}`);
    }
}

export default App;
