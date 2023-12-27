import { Trim } from "class-sanitizer";
import {IsString, IsNotEmpty, Length, IsNumber, IsEmail} from "class-validator";

export class CreateUserDto {
    @IsString()
    @Trim()
    @IsNotEmpty()
    @Length(5, 20)
    userName!: string;
    @IsString()
    @IsEmail()
    email!: string;
    @IsNotEmpty()
    @IsNumber()
    age!: number;
}
