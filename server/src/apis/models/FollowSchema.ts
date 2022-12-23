import { Document, model, Schema } from "mongoose";
import { IUser } from "../../@types/user";


export interface IFollow extends Document {
    user: IUser['_id'];
    target: IUser['_id'];
}

const FollowSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    target: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });

const Follow= model<IFollow>('Follow', FollowSchema);
export default Follow
