import { inject, injectable } from "inversify";
import TYPES from "../../common/constants/InjectionTypes";
import { UserDto } from "../dto/user.dto";
import {CreateUserDto} from "../dto/create-user.dto";
import {IUser} from "../interfaces/user.interface";
import {UserRepository} from "../../repository/user/user.repository";
import {ApiError} from "../../common/helpers/apiError";
import {IUserEntity} from "../../repository/user/interfaces/user-entity.interface";
import {LoggerService} from "../../common/services/logger.service";

@injectable()
export class UserService {
    constructor(
        @inject(TYPES.UserRepository)
        private readonly userRepository: UserRepository,
        @inject(TYPES.LoggerService)
        private readonly loggerService: LoggerService,
    ) {
        this.userRepository = userRepository;
        this.loggerService = loggerService;
    }

    public async createOne(userDto: CreateUserDto): Promise<IUser> {
        const user: IUserEntity | null = await this.userRepository.getUser(
            userDto.email
        );
        if (user) {
            this.loggerService.warn(`Trial to create user with existing email: ${userDto.email}`);
            throw ApiError.BadRequestException(
                `User with email: "${userDto.email}" is already exist!`
            );
        }
        const newUser = await this.userRepository.createOne(userDto);
        if (!newUser) {
            this.loggerService.warn(`Database returned null on grabbing a freshly created created user! Email from dto ${userDto.email}`);
            throw ApiError.BadRequestException("User can't be retrieved.");
        }
        return new UserDto(newUser);
    }
    public async getUsers(): Promise<IUser[]> {
        const users = await this.userRepository.getAll();
        return users.map((user) => new UserDto(user));
    }
}
