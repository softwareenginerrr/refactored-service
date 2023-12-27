import {IsNumber, IsString} from "class-validator";
import { IUser } from "../interfaces/user.interface";

export class UserDto implements IUser {
    constructor(user: IUser) {
        this.userId = user.userId;
        this.userName = user.userName;
        this.email = user.email;
        this.age  = user.age;
    }
    @IsString()
    userId!: string;
    @IsString()
    userName: string;
    @IsString()
    email!: string;
    @IsNumber()
    age!: number;
}
