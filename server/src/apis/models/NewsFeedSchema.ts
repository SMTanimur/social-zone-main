import { Document, model, Schema } from "mongoose";
import { IPost } from "../../@types/post";
import { IUser } from "../../@types/user";

export interface INewsFeed extends Document {
    follower: IUser['_id'];
    post: IPost['_id'];
    post_owner: IUser['_id'];
}

const NewsFeedSchema = new Schema({
    follower: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    post: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    post_owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: Date
});

const NewsFeed = model<INewsFeed>('NewsFeed', NewsFeedSchema);
export default NewsFeed
