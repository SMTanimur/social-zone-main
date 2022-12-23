import { CloseCircleOutlined, FileImageOutlined } from '@ant-design/icons';
import React, { ChangeEvent, useState } from 'react';
import Modal from 'react-modal';
import dynamic from 'next/dynamic';
const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });
import { IUser } from '~/@types/user';
import postApi from '~/api/post';
import { useUploadImage } from '~/Hooks/uploadImage';
interface IProps {
  isOpen: boolean;
  closeModal: () => void;
  currentUser: IUser;
}
const CreatePostModal: React.FC<IProps> = ({
  closeModal,
  isOpen,
  currentUser,
}) => {
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (event: any, emojiObject: any) => {
    console.log(emojiObject.emoji);
    setDesc(desc + emojiObject.emoji);
  };

  const { uploadImage } = useUploadImage();


  const handleAddNewImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const newImgUrl = await uploadImage(e);
    setFile(newImgUrl);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!desc) return;
    const newPost = {
      author: currentUser._id,
      desc,
      img: file,
    };

    try {
      setIsCreatingPost(true);
      const { data } = await postApi.postCreate(newPost);
      setIsCreatingPost(false);
      setDesc('');
      setFile('');
    } catch (error) {
      setIsCreatingPost(false);
      console.log(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel='Profile'
      onRequestClose={closeModal}
      className=' w-[94%] min-w-[320px] bg-white top-1/2 absolute left-1/2 -translate-y-1/2 -translate-x-1/2 p-5 rounded-lg outline-none dark:bg-indigo-1000 dark:text-white laptop:w-[40rem]'
      style={{
        overlay: {
          backgroundColor: '#2424247f',
          zIndex: '1000',
          animation: 'ease-in-out',
        },
      }}
    >
      <form className='w-full min-w-[320px] laptop:w-40rem p-4 laptop:px-8'
       onSubmit={handleSubmit}
      >
        <h2 className='dark:text-white'>Create Post</h2>

        <div className='flex flex-col'>
          <div className='relative'>
            <textarea
              className='dark:bg-indigo-1100 dark:text-white dark:!border-indigo-950'
              cols={3}
              id='post'
              name='post'
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="What's on your mind?"
              rows={3}
              readOnly={isCreatingPost}
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

          <div className='flex items-center'>
            {/* --- UPLOAD OPTIONS */}
               {
                !file && (
                  <div className='flex items-center flex-grow'>
                  <input
                    multiple
                    type='file'
                    hidden
                    accept='image/*'
                    onChange={handleAddNewImage}
                    readOnly={isCreatingPost}
                    id='photos'
                  />
                  <label
                    className='inline-flex items-center justify-start py-2 text-xs text-gray-400 border-gray-200 cursor-pointer'
                    htmlFor='photos'
                  >
                    <div
                      className='flex items-center justify-center w-10 h-10 border-2 border-gray-400 border-dashed group hover:border-indigo-700'
                      title='Upload photo'
                    >
                      <FileImageOutlined className='text-xl text-gray-400 hover:text-indigo-700' />
                    </div>
                  </label>
                </div>
                )
               }
            {/* ---- POST BUTTON --- */}
            <div className='flex justify-end'>
              <button type='submit' disabled={isCreatingPost}>
                Create Post
              </button>
            </div>
          </div>
          {/*  ---- IMAGES PREVIEWS LIST ----- */}
          <div className='flex items-center space-x-2'>
            {file && (
              <div
                className='w-14 h-14 !bg-cover !bg-no-repeat relative'
                key={file}
                style={{
                  background: `#f7f7f7 url(${file})`,
                }}
              >
                <CloseCircleOutlined
                  className='absolute top-0 bottom-0 left-0 right-0 p-2 text-3xl text-white outline-none opacity-75 cursor-pointer margin-auto hover:bg-red-600 hover:opacity-100'
                  onClick={() => setFile('')}
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePostModal;
