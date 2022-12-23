import {  isValidObjectId, model, Schema } from "mongoose";
import { IPost } from "../../@types/post";

export enum EPrivacy {
    private = 'private',
    public = 'public',
    follower = 'follower'
}


const PostSchema = new Schema({
    _author_id: {
        // author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    privacy: {
        type: String,
        default: 'public',
        enum: ['private', 'public', 'follower']
    },
    photos: [Object],
    description: {
        type: String,
        default: ''
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    createdAt: Date,
    updatedAt: Date,
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });

PostSchema.virtual('author', {
    ref: 'User',
    localField: '_author_id',
    foreignField: '_id',
    justOne: true
});

PostSchema.methods.isPostLiked = function (this: IPost, userID) {
    if (!isValidObjectId(userID)) return;

    return this.likes.some(user => {
        return user._id.toString() === userID.toString();
    });
}

const Post= model<IPost>('Post', PostSchema);
export default Post
