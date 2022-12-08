/* eslint-disable @next/next/no-img-element */
import { MdCancel } from 'react-icons/md'
import { ChangeEvent, useState } from 'react';

import toast from 'react-hot-toast';
import postApi from 'src/api/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { createRipple } from '~/utils/createRipple';
import { useUploadImage } from '~/Hooks/uploadImage';
import { useUser } from '~/Hooks/useUser';
const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const PostCreateCard = () => {
  const { data: user } = useUser();
  const [desc, setDesc] = useState('');
  const [postImage, setPostImage] = useState('');
  const { uploadImage } = useUploadImage();
  const [showPicker, setShowPicker] = useState(false);
  const { mutateAsync,data } = useMutation(postApi.postCreate);
  const onEmojiClick = (event: any, emojiObject: any) => {
    setDesc(desc + emojiObject.emoji);
  };
  const handleChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const newAvatarUrl = await uploadImage(e);
      setPostImage(newAvatarUrl);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };
  const queryClient = useQueryClient();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!desc && !postImage) return;
    const newPost = {
      desc,
      author:String(user?._id),
      img: postImage,
    };
    console.log(newPost)
    try {
      await mutateAsync(newPost, {
        onSuccess: async () => {
          await queryClient.invalidateQueries(['posts']);
          setPostImage('')
          setDesc('')
        },
      });
    } catch (error: any) {
      toast.error(error?.message);
    }
    setDesc('');
  };

  return (
    <div className='w-full bg-white border border-gray-200 rounded shadow hover:shadow-md'>
      <div className='p-6'>
        <h1 className='mb-4 text-lg font-semibold'>Create new post</h1>

        <form className='flex flex-col' onSubmit={handleSubmit}>
          <div className='relative flex gap-2'>
            <img
              src={
                user?.profilePicture
                  ? user?.profilePicture
                  : 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1663824680/dquestion_app_widget_1_b_axtw5v.png'
              }
              alt='profile'
              className='object-cover w-12 h-12 rounded-full '
            />
            <textarea
              className='w-full p-3 border border-gray-200 rounded outline-none resize-none h-[150px] shadow-inner'
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder='Type your message...'
            />
            <span
              className='absolute top-2 right-2'
              onClick={() => setShowPicker(!showPicker)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </span>

            {showPicker && (
              <div className='absolute right-0 z-10 top-10'>
                <Picker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>

          <hr className='my-4' />
          {postImage && (
            <div className='share__container'>
              <img
                className='share__image--upload'
                src={postImage}
                alt='upload'
              />
              <MdCancel
                className='share__cancel'
                onClick={() => setPostImage('')}
              />
            </div>
          )}
          <div className='share__bottom'>
            <div className='share__options'>
              <label
                htmlFor='post'
                className='flex items-center text-sm text-gray-500 cursor-pointer hover:text-gray-700'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-6 h-6 mr-2'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
                <span className='share__text'>Attach Photo</span>
                <input
                  type='file'
                  id='post'
                  style={{ display: 'none' }}
                  accept='.png,.jpeg,.jpg'
                  onChange={handleChangeImage}
                />
              </label>
            </div>

            <button
              type='submit'
              onClick={createRipple}
              className='relative overflow-hidden w-[100px] shadow    py-2 px-4 text-sm font-bold rounded text-white transition duration-300 bg-blue-500    hover:bg-blue-500/90 '
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PostCreateCard;
