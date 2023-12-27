import { injectable } from "inversify";
import {IUserEntity} from "./interfaces/user-entity.interface";
import User from './entities/user.entity'
@injectable()
export class UserRepository {
    public async getAll(): Promise<IUserEntity[]> {
        return await User.find();
    }

    public async createOne(
        user: Omit<IUserEntity, "_id" | "userId">
    ): Promise<IUserEntity | null> {
        await User.create(user);
        return await User.findOne({userName: user.userName});
    }

    public async getUser(email: string): Promise<IUserEntity | null> {
        return await User.findOne({ email });
    }
}
