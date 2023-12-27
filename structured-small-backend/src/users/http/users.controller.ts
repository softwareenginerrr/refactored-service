import { NextFunction, Request, Response } from "express";
import {
    controller, httpGet,
    httpPost,
} from "inversify-express-utils";
import { inject } from "inversify";
import TYPES from "../../common/constants/InjectionTypes";
import {CreateUserDto} from "../dto/create-user.dto";
import validateDto from "../../common/middlewares/validateDto.middleware";
import {UserService} from "../services/user.service";
import {IUser} from "../interfaces/user.interface";
import {LoggerService} from "../../common/services/logger.service";
import {limiter} from "../../common/helpers/limiter";

@controller("/users")
export class UsersController {
    constructor(
        @inject(TYPES.UserService) private readonly userService: UserService,
        @inject(TYPES.LoggerService) private readonly loggerService: LoggerService,
    ) {
        this.userService = userService;
    }

    @httpPost("/", limiter, validateDto(CreateUserDto))
    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user: IUser = await this.userService.createOne(req.body);
            res.status(201).send({ user, message: 'User created!'});
            this.loggerService.info(`User ${JSON.stringify(user)} created!`);
        } catch (err) {
            return next(err);
        }
    }

    @httpGet("/", limiter)
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users: IUser[] = await this.userService.getUsers();
            res.status(200).send({users});
            this.loggerService.info(`User list has been sent to the client`);
        } catch (err) {
            return next(err);
        }
    }
}
