import { Types } from "mongoose";

export interface IUserEntity {
    _id: Types.ObjectId;
    userId: string;
    userName: string;
    email: string;
    age: number;
}
