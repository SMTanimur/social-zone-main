/* eslint-disable @next/next/no-img-element */
import { useAppStore } from '@app/store';
import { useUploadImage } from '@Hooks/uploadImage';
import { useUser } from '@Hooks/useUser';
import AppLayout from '@layouts/AppLayout';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PacmanLoader from 'react-spinners/PacmanLoader';
import userApi from 'src/api/user';
import { FiEdit2 } from 'react-icons/fi';
import { withAuth } from 'src/HOC/withAuth';
import Popover from '@components/popup/Popover';
import userInfoModal from '@components/modals/userInfoModal';
import usePopover from '@Hooks/usePopover';
import RightBar from 'src/module/profile/RightBar';
import useModal from '@Hooks/useModal';
import UserInfoModal from '@components/modals/userInfoModal';
import { useUserDetails } from '@Hooks/userQuery';
import { IUser } from 'src/@types/user';
import { useQueryClient } from '@tanstack/react-query';

const ProfileDetails = () => {
  const { query } = useRouter();
  const [loadingCover, setLoadingCover] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const { setCurrentUser } = useAppStore();
  const { id } = query;
  const { uploadImage } = useUploadImage();
  const { data: user } = useUserDetails(id);
  const { user: userD } = useAppStore();
  const { data: currentUser } = useUser();

  const queryClient = useQueryClient();
  

  const { activePopover, hidePopover, showPopover } = usePopover();
  const handleChangeAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setLoadingImage(true);
      const newAvatarUrl = await uploadImage(e);
      const { data } = await userApi.updateProfile(id, {
        profilePicture: newAvatarUrl,
      });
      await queryClient.invalidateQueries(['me']);
      setLoadingImage(false);
      const newCurrentUser = { ...userD, ...data };
      setCurrentUser(newCurrentUser);
    } catch (error: any) {
      setLoadingImage(false);
      toast.error(error?.message);
    }
  };

  const { isShow, toggleModal } = useModal();
  
  const handleChangeCover = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setLoadingCover(true);
      const newAvatarUrl = await uploadImage(e);
      const { data } = await userApi.updateProfile(id, {
        coverPicture: newAvatarUrl,
      });
      setLoadingCover(false);
      const newCurrentUser = { ...userD, ...data };
      setCurrentUser(newCurrentUser);
    } catch (error: any) {
      setLoadingCover(false);
      toast.error(error?.message);
    }
  };

  return (
    <AppLayout>
      <div className='flex flex-col items-center'>
        <section className='relative w-full '>
          <div className='relative flex flex-col space-y-6 overflow-hidden'>
            <div className='relative w-full'>
              <img
                src={
                  currentUser?.coverPicture
                    ? currentUser.coverPicture
                    : user?.coverPicture || ''
                }
                alt='coverImage'
                className='object-cover w-full h-[250px]'
              />

              {currentUser?._id === id && (
                <label className='absolute top-0 bottom-0 left-0 right-0 cursor-pointer'>
                  <input
                    type='file'
                    onChange={handleChangeCover}
                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                  />
                </label>
              )}
            </div>

            <div
              className='absolute -bottom-[60px] right-[50%] translate-x-[50%] z-40 w-[140px] h-[140px]
          rounded-full ring-2 ring-white overflow-hidden'
            >
              <div className='relative'>
                {loadingImage ? (
                  <PacmanLoader
                    color='#36d7b7'
                    className='w-[150px] h-[150px]'
                  />
                ) : (
                  <img
                    src={
                      currentUser?.profilePicture
                        ? currentUser?.profilePicture
                        : user?.profilePicture || ''
                    }
                    alt='profile pic'
                    className='object-cover '
                  />
                )}
                {currentUser?._id === id && (
                  <label
                    htmlFor='profile'
                    className='absolute top-0 bottom-0 left-0 right-0 cursor-pointer'
                  >
                    <input
                      type='file'
                      className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-45'
                      onChange={handleChangeAvatar}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
          <h4 className='text-2xl font-bold text-center text-gray-secondary'>
            {currentUser?.username}
          </h4>
          <div className='absolute -bottom-10 right-2'>
            {currentUser?._id === id && (
              <div className=''>
                <div
                  className='relative items-end flex-shrink-0 cursor-pointer flex-end '
                  onMouseEnter={showPopover}
                  onMouseLeave={hidePopover}
                  onClick={toggleModal}
                >
                  <FiEdit2 className='text-3xl cursor-pointer' />
                  <Popover
                    active={activePopover}
                    className='w-[100px] !bg-gray-100  !top-10 !right-0 '
                  >
                    <span className=''>Edit Profile</span>
                  </Popover>
                </div>
                <UserInfoModal
                  isOpen={isShow}
                  closeModal={toggleModal}
                  user={userD}
                />
              </div>
            )}
          </div>
        </section>
        {/* user Post and user information */}
        <section className='flex items-center w-full mt-12 md:mt-14'>
          {/* user post here in a div */}
          <div className='md:w-[65%] w-full '>
            <h3>this is a user post div</h3>
          </div>
          {/* User information is placed on the right side */}
          <div className=' md:w-[35%] md:flex md:flex-col space-y-4 hidden'>
            <RightBar user={currentUser ? currentUser : user} />
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default ProfileDetails;
export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
