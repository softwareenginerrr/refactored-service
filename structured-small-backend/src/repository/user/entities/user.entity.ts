import { Schema, model } from "mongoose";
import { IUserEntity } from "../interfaces/user-entity.interface";

const UserEntity = new Schema<IUserEntity>(
    {
        email: { type: Schema.Types.String, unique: true, required: true },
        userName: { type: Schema.Types.String, required: true },
        age: { type: Schema.Types.Number, required: true },
    },
    { virtuals: {
            userId: {
                get(this: IUserEntity): string {
                    return String(this._id);
                }
            }
        }, toObject: { virtuals: true } }
);

export default model<IUserEntity>("User", UserEntity);
