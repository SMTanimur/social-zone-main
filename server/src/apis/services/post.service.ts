import { Request, Response } from "express";
import { STATUS } from "../constants/status";
import Comment from "../models/comment";
import Post from "../models/post";
import PostNotification from "../models/postNotification";
import User from "../models/user";
import { ApiError } from "../utils/api-error";

const newPostCreate = async (req: Request) => {
  try {
    const post = await Post.create(req.body);
    const fullPost = await User.populate(post, {
      path: "author",
      select: "username profilePicture",
    });
    return {
      message: "successfully created ",
      data: fullPost,
    };
  } catch (error) {
    throw new ApiError(STATUS.BAD_REQUEST, error);
  }
};

const updatePost = async (req: Request, res: Response) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    throw new ApiError(STATUS.NOT_FOUND, "Post not found");
  } else {
    if (post.author === res.locals.user.id) {
      post = await post.updateOne(req.body, {
        new: true,
        runValidators: true,
      });
      return post;
    } else {
      throw new ApiError(STATUS.BAD_REQUEST, "you can not update");
    }
  }
};

//delete post
const PostDelete = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);
  console.log(res.locals.user.id);
  if (post) {
    if (String(post.author) === res.locals.user.id) {
      await Comment.deleteMany({ postId: post._id });
      await post.deleteOne();
      return {
        message: "you successfully delete your post",
      };
    } else {
      throw new ApiError(STATUS.UNAUTHORIZED, "you only delete your post");
    }
  } else {
    throw new ApiError(STATUS.NOT_FOUND, "Post not found");
  }
};

const likePost = async (req: Request, res: Response) => {
  let post = await Post.findById(req.params.id);
  if (post) {
    if (post.likes.includes(res.locals.user.id)) {
      post.likes = post.likes.filter((id) => String(id) !== res.locals.user.id);
    } else {
      post.likes.push(res.locals.user.id);
      if (String(post.author) !== res.locals.user.id) {
        const notification = await PostNotification.create({
          user: res.locals.user.id,
          post: post?._id,
          type: "Like",
        });
        console.log(notification);
        await User.findByIdAndUpdate(post?.author!, {
          $push: {
            postNotifications: notification?._id,
          },
        });
      }
    }
    await post.save();
    post = await Post.findById(req.params.id).populate("author", "username profilePicture");
    return {
      message: "you put on this post",
      data: post,
    };
  } else {
    throw new ApiError(STATUS.NOT_FOUND, `post with id ${req.params.id} not found`);
  }
};

// get user own post
const getUserPost = async (req: Request) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username profilePicture")
      .populate("comments", "author body postId createdAt");
    if (!post) throw new ApiError(STATUS.NOT_FOUND, `post id ${req.params.id} not found`);
    const fullPost = await User.populate(post, {
      path: "comments.author",
      select: "username profilePicture desc",
    });
    const notifications = await PostNotification.find({
      post: fullPost?._id,
    });
    const notificationId = notifications.map((n) => n._id);
    await User.findByIdAndUpdate(post?.author?._id, {
      $pull: {
        postNotifications: {
          // @ts-ignore
          $in: notificationId,
        },
      },
    });
    await PostNotification.deleteMany({ post: post?._id });
  } catch (error) {}
};

const getUsersPosts = async (req: Request) => {
  const posts = await Post.find({ author: req.params.userId })
    .populate("author", "username profilePicture")
    .sort({
      createdAt: -1,
    });
  return posts;
};

//create comment
const createComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req.body;

  const comment = await Comment.create({
    author: res.locals.user.id,
    postId: id,
    body,
  });
  const post = await Post.findByIdAndUpdate(
    id,
    {
      $push: {
        comments: comment._id,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate("author", "username profilePicture desc")
    .populate("comments", "author body postId createdAt");
  const updatedPost = await User.populate(post, {
    path: "comments.author",
    select: "username profilePicture desc",
  });

  if (post?.author._id != res.locals.user.id) {
    const notification = await PostNotification.create({
      post: post?._id,
      user: res.locals.id,
      type: "comment",
    });

    await User.findByIdAndUpdate(post?.author._id, {
      $push: { postNotifications: notification._id },
    });
  }
  return{
    message: 'you comment successfully',
    updatedPost
  }
};

//delete post comment

const deletePostComment = async(req:Request)=>{
  try {
    const { postId, commentId } = req.params;
    await Comment.findByIdAndDelete(commentId);
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: {
          comments: commentId,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('author', 'username profilePicture')
      .populate('comments', 'author body postId createdAt');
    const updatedPost = await User.populate(post, {
      path: 'comments.author',
      select: 'username profilePicture',
    });
    const response={
      message:'successfully delete comment',
      data:updatePost
    }
    return response
  } catch (error) {
    throw new ApiError(STATUS.NOT_FOUND, "notfound"|| error)
  }
}

const getPosts = async (req: Request) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const currentUser = await User.findById(req.query.userId);
  const userPosts = await Post.find({ author: req.query.userId }).populate(
    'author',
    'username profilePicture'
  );
  const friendPosts = await Post.find({
    author: {
      $in: currentUser?.friends,
    },
  }).populate('author', 'username profilePicture');
  // @ts-ignore
  let allPosts = userPosts.concat(...friendPosts).sort((p1, p2) => {
    return (
      // @ts-ignore
      new Date(p2.createdAt).getTime() - new Date(p1.createdAt).getTime()
    );
  });
  const numberOfPages = Math.ceil(allPosts.length / limit);
  allPosts = allPosts.slice(skip).slice(0, limit);

  return{
    posts:allPosts,
    numberOfPages
  }
};
   

const postService = {
  newPostCreate,
  updatePost,
  PostDelete,
  likePost,
  getUserPost,
  getUsersPosts,
  createComment,
  deletePostComment,
  getPosts
};
export default postService;
