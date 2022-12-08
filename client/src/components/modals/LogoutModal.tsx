import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from 'react-modal';
import { IUser } from '~/@types/user';
import authApi from '~/api/auth';
import { useAppStore } from '~/app/store';
import { removeCurrentUserLocalStorage } from '~/utils/localStorage';
interface ModalUserLogout {
  isOpen: boolean;
  closeModal: () => void;
}
const LogoutModal: React.FC<ModalUserLogout> = ({ closeModal, isOpen }) => {
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
  const { push } = useRouter();
  const { setCurrentUser } = useAppStore();
  const queryClient = useQueryClient();
  const handleLogOut = async () => {
    try {
      setLogoutLoading(true);
      authApi.logoutUser();
      setLogoutLoading(false);
      toast.success('user logOut successfully');
      setCurrentUser({} as IUser);
      removeCurrentUserLocalStorage();
      await queryClient.resetQueries(['me']);
      push('/login');
    } catch (error: any) {
      setLogoutLoading(false);
      toast.error(error);
      console.log(error);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      contentLabel='Profile'
      onRequestClose={closeModal}
      className='max-w-[400px] w-[94%] min-w-[300px] bg-white top-1/2 absolute left-1/2 -translate-y-1/2 -translate-x-1/2 p-5 rounded-lg outline-none dark:bg-indigo-1000 dark:text-white'
      style={{
        overlay: {
          backgroundColor: '#2424247f',
          zIndex: '1000',
          animation: 'ease-in-out',
        },
      }}
    >
      <div className='relative'>
        <div className='p-8 laptop:px-8'>
          <h2 className='dark:text-white'>Confirm Logout</h2>
          <p className='my-4 text-gray-600 dark:text-gray-400'>
            Are you sure you want to logout?
          </p>
          <br />
          <div className='flex justify-between'>
            <button
              className='bg-gray-600 hover:bg-indigo-900 px-10 !rounded-full dark:bg-indigo-1100 dark:text-white dark:hover:bg-indigo-1100 dark:hover:text-white'
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className='px-10 py-2 bg-red-600 hover:opacity-80'
              disabled={logoutLoading}
              onClick={handleLogOut}
            >
              {logoutLoading ? 'Logging Out' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;
