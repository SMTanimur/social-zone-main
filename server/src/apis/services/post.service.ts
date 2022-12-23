import { Request, Response } from "express";
import { Types } from "mongoose";
import { IUpdatePost } from "../../@types/post";
import { IUser } from "../../@types/user";
import { LIKES_LIMIT, POST_LIMIT } from "../constants/limit";
import { buildPaginateOptions, IPaginate } from "../constants/paginate";
import { STATUS } from "../constants/status";
import Comment from "../models/CommentSchema";
import Follow from "../models/FollowSchema";
import Like from "../models/LikeSchema";
import NewsFeed from "../models/NewsFeedSchema";
import Notification, { ENotificationType } from "../models/NotificationSchema";
import Post, { EPrivacy } from "../models/post";
import User from "../models/user";
import { ApiError } from "../utils/api-error";
import { deleteImageFromStorage, uploadImageToStorage } from "../utils/cloudinary";

const newPostCreate = async (req: Request) => {
  try {
    const { description, privacy } = req.body;
    let photos: any[] = [];

    if(req.files){
      const photosToSave = req.files.map(async(file:any) =>await uploadImageToStorage(file, `${req.user.username}/posts`))
       photos = await Promise.all(photosToSave);
      console.log(photos)
    }
    const post = new Post({
      _author_id: req.user._id,
      // author: req.user._id,
      description,
      photos,
      privacy: privacy || 'public',
      createdAt: Date.now()
  });

  await post.save();
  await post
      .populate({
          path: 'author',
          select: 'profilePicture username fullname'
      })

      const myFollowersDoc = await Follow.find({ target: req.user._id }); // target is yourself
      const myFollowers = myFollowersDoc.map(user => user.user); // so user property must be used 

      const newsFeeds = myFollowers
          .map(follower => ({ // add post to follower's newsfeed
              follower: follower._id,
              //@ts-ignore
              post: Types.ObjectId(post._id),
              post_owner: req.user._id,
              createdAt: post.createdAt
          }))
          .concat({ // append own post on newsfeed
              follower: req.user._id,
              post_owner: req.user._id,
              //@ts-ignore
              post: Types.ObjectId(post._id),
              createdAt: post.createdAt
          });

      if (newsFeeds.length !== 0) {
          await NewsFeed.insertMany(newsFeeds);
      }

      // Notify followers that new post has been made 
      if (post.privacy !== 'private') {
          const io = req.app.get('io');
          myFollowers.forEach((id) => {
              io.to(id.toString()).emit('newFeed', {
                  ...post.toObject(),
                  isOwnPost: false
              });
          });
      }
    return {
      post,
      isOwnPost:true,
      message:"successfully create post"
    }
  } catch (error) {
    throw new ApiError(STATUS.BAD_REQUEST, error);
  }
};

const updatePost = async (req: Request) => {
  try {
    const {postId}=req.params
    const {description,privacy}=req.body
    const obj:IUpdatePost={updatedAt: Date.now(),isEdited:true}
    const post = await Post.findById(postId)
    if(!post) return new ApiError(STATUS.NOT_FOUND,"not found this post")

    if (!description && !privacy) return (new ApiError(400,"please ..."));

    if (description) obj.description = description
    if (privacy) obj.privacy = privacy;

    if (req.user._id.toString() === post._author_id.toString()) {
        const updatedPost = await Post.findByIdAndUpdate(postId, {
            $set: obj
        }, {
            new: true
        });
         updatedPost?.populate({
            path: 'author',
            select: 'fullname username profilePicture'
        })
            
          return {
            ...updatePost,
            isOwnPost:true,
            message:"successfully update your post"
          }
    } else {
        return new ApiError(STATUS.FORBIDDEN,"please update your own post")
    }
  } catch (error) {
    console.log(error)
    throw new ApiError(STATUS.BAD_REQUEST,"Server Error")
  }
};


// get user own post
const getUserPost = async (req: Request) => {
  try {
    const { username } = req.params;
    const { sortBy, sortOrder } = req.query;

    const user = await User.findOne({ username });
    const myFollowingDoc = await Follow.find({ user: req.user._id });
    const myFollowing = myFollowingDoc.map(user => user.target);

    if (!user) return new ApiError(STATUS.NOT_FOUND,"User Not found")

    const offset = parseInt(req.query.offset as string) || 0;
    const limit = POST_LIMIT;
    const skip = offset * limit;
    const query = {
        _author_id: user._id,
        privacy: { $in: [EPrivacy.public] },
    };
    const sortQuery = {
        [sortBy || 'createdAt']: sortOrder === 'asc' ? 1 : -1
    };

    if (username === req.user.username) { // if own profile, get both public,private,follower posts
        query.privacy.$in = [EPrivacy.public, EPrivacy.follower, EPrivacy.private];
    } else if (myFollowing.includes(user._id.toString())) {
        // else get only public posts or follower-only posts
        query.privacy.$in = [EPrivacy.public, EPrivacy.follower];
    }

    // run aggregation service
    const agg = await getPosts(req.user, query, { skip, limit, sort: sortQuery });

    if (agg.length <= 0 && offset === 0) {
        return new ApiError(404, `${username} hasn't posted anything yet.`)
    } else if (agg.length <= 0 && offset >= 1) {
        return new ApiError(404, 'No more posts.')
    }

    return agg
} catch (e) {
    console.log(e);
    
}
};



 const getPosts = (user: IUser | null, query: Object, paginate?: Partial<IPaginate>): Promise<any[]> => {
  return new Promise(async (resolve, reject) => {
      try {
          const agg = await Post.aggregate([
              {
                  $match: query
              },
              ...buildPaginateOptions(paginate || {}),
              { // lookup from Comments collection to get total
                  $lookup: {
                      from: 'comments',
                      localField: '_id',
                      foreignField: '_post_id',
                      as: 'comments'
                  }
              },
              { // lookup from Likes collection to get total
                  $lookup: {
                      from: 'likes',
                      localField: '_id',
                      foreignField: 'target',
                      as: 'likes'
                  }
              },
              {
                  $lookup: {
                      from: 'users',
                      let: { authorID: '$_author_id' },
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $eq: ['$_id', '$$authorID']
                                  }
                              }
                          },
                          {
                              $project: {
                                  _id: 0,
                                  id: '$_id',
                                  email: 1,
                                  profilePicture: 1,
                                  username: 1,
                              }
                          }
                      ],
                      as: 'author'
                  }
              },
              {
                  $addFields: {
                      likeIDs: {
                          $map: {
                              input: "$likes",
                              as: "postLike",
                              in: '$$postLike.user'
                          }
                      },
                  }
              },
              { // add isLiked field by checking if user id exists in $likes array from lookup
                  $addFields: {
                      isLiked: { $in: [user?._id, '$likeIDs'] },
                      isOwnPost: { $eq: ['$$CURRENT._author_id', user?._id] },
                  }
              },
              {
                  $project: {
                      _id: 0,
                      id: '$_id',
                      privacy: 1,
                      photos: 1,
                      description: 1,
                      isEdited: 1,
                      createdAt: 1,
                      updatedAt: 1,
                      author: { $first: '$author' },
                      isLiked: 1,
                      isOwnPost: 1,
                      commentsCount: {
                          $size: '$comments'
                      },
                      likesCount: {
                          $size: '$likes'
                      }
                  }
              }
          ]);

          resolve(agg);
      } catch (err) {
          reject(err);
      }
  });
}
   
/**Like Post service */
const postLike=async(req:Request)=>{
  try {
    const {postId}=req.params
    const post = await Post.findById(postId)
    if(!post)  return new ApiError(STATUS.NOT_FOUND,`post id ${postId} not found`)
    let state = false; // the state whether isLiked = true | false to be sent back to user
    const query = {
        target:  postId,
        user: req.user._id,
        type: 'Post'
    };

    const likedPost = await Like.findOne(query); // Check if already liked post

    if (!likedPost) { // If not liked, save new like and notify post owner
        const like = new Like({
            type: 'Post',
            target: post._id,
            user: req.user._id
        });

        await like.save();
        state = true;

        // If not the post owner, send notification to post owner
        if (post._author_id.toString() !== req.user._id.toString()) {
            const io = req.app.get('io');
            const targetUserID = post._author_id;
            const newNotif = {
                type: ENotificationType.like,
                initiator: req.user._id,
                target: targetUserID,
                link: `/post/${postId}`,
            };
            const notificationExists = await Notification.findOne(newNotif);

            if (!notificationExists) {
                const notification = new Notification({ ...newNotif, createdAt: Date.now() });

                const doc = await notification.save();
                await doc
                    .populate({
                        path: 'target initiator',
                        select: 'fullname profilePicture username'
                    })

                io.to(targetUserID).emit('newNotification', { notification: doc, count: 1 });
            } else {
                await Notification.findOneAndUpdate(newNotif, { $set: { createdAt: Date.now() } });
            }
        }
    } else {
        await Like.findOneAndDelete(query);
        state = false;
    }

    const likesCount = await Like.find({ target: postId });
    return{
      likesCount: likesCount.length,
      state
    }
  } catch (error) {
    throw new ApiError(STATUS.BAD_REQUEST,"Server Error")
  }
}

//delete post by postId
const deletePost=async(req:Request)=>{
 try {
    const {postId}=req.params
    const post = await Post.findById(postId)
    if(!post) return new ApiError(STATUS.NOT_FOUND,"post not found")
    if(req.user?._id.toString() === post._author_id.toString()){
        const imageIDs = post.photos!  // array of image public_ids
        .filter(img => img?.public_id)
        .map(img => img.public_id);

        if (post.photos && post.photos.length !== 0) await deleteImageFromStorage(imageIDs);

        await Post.findByIdAndDelete(postId);
        await Comment.deleteMany({ _post_id: new Types.ObjectId(postId) });
        await NewsFeed.deleteMany({ post: new Types.ObjectId(postId) });
        return {
            message:"successfully delete this post"
        }
    }else{
        return new ApiError(STATUS.FORBIDDEN,"you can delete your own post")
    }
 } catch (error) {
    console.log(error)
    throw new ApiError(STATUS.BAD_REQUEST,"Server Error")
 }
}

//getSinglePost

const getSinglePost = async(req:Request)=>{
  try {
    const {postId}=req.params
    const agg = await getPosts(req.user, { _id: new Types.ObjectId(postId) });

    const post = agg[0] || {}

    if (!post) return new ApiError(400, 'Post not found.')

    if (post?.privacy === 'private' && post._author_id?.toString() !== req.user._id.toString()) {
        return new ApiError(STATUS.FORBIDDEN,"f")
    }
  } catch (error) {
    console.log(error)
    throw new ApiError(STATUS.BAD_REQUEST,"Server Error")
  }
} 


// get post likes
 
const getPostLikes = async(req:Request)=>{
    try {
        const { postId } = req.params;
        const offset = parseInt(req.query.offset as string) || 0;
        const limit = LIKES_LIMIT;
        const skip = offset * limit;

        const exist = await Post.findById(new Types.ObjectId(postId));
        if (!exist) return new ApiError(400, 'Post not found.')

        const likers = await Like
            .find({
                target: new Types.ObjectId(postId),
                type: 'Post'
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'user',
                select: 'profilePicture username fullname'
            })

        if (likers.length === 0 && offset < 1) {
            return new ApiError(404, 'No likes found.')
        }

        if (likers.length === 0 && offset > 0) {
            return new ApiError(404, 'No more likes found.')
        }

        const myFollowingDoc = await Follow.find({ user: req.user._id });
        const myFollowing = myFollowingDoc.map(user => user.target);

        const result = likers.map((like) => {
            return {
                ...like.user.toObject(),
                isFollowing: myFollowing.includes(like.user.id)
            }
        });

        return result
    } catch (e) {
        console.log('CANT GET POST LIKERS', e);
        throw new ApiError(STATUS.BAD_REQUEST,"Server Error")
    }
}
const postService = {
  newPostCreate,
  updatePost,
  getUserPost,
  postLike,
  deletePost,
  getSinglePost,
  getPostLikes
};
export default postService;
