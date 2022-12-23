import Link from 'next/link';
import React, { Suspense, useEffect, useState } from 'react';
import { useAppStore } from '~/app/store';
import Avatar from '~/components/image/Avatar';
import SearchInput from '~/components/input/SearchInput';
import LogoutModal from '~/components/modals/LogoutModal';
import Notification from '~/components/Notification';
import ThemeToggler from '~/components/shared/ThemeToggler';
import { PATH } from '~/constants/path';
import { useMediaQuery } from '~/Hooks/useMediaQuery';

import useModal from '~/Hooks/useModal';
import { useUser } from '~/Hooks/useUser';
import NavBarMobile from './NavBarMobile';

const Navbar = () => {
  const { data: user } = useUser();
  // const [laptop, setLaptop] = useState(true);
  const { currentUser, theme } = useAppStore();
  const laptop = useMediaQuery('laptop')
  // browser code

  const { isShow, toggleModal } = useModal();
  return (
    <React.Fragment>
      <div className='bg-white dark:bg-indigo-1000 h-[60px] border-b shadow-md laptop:shadow-sm dark:border-gray-900 text-gray-600 dark:text-white flex items-center justify-center fixed top-0 z-50 w-full py-2'>
        <div className='relative layout-container'>
          <nav className='hidden laptop:items-center laptop:justify-between laptop:flex'>
            <div className='flex items-center space-x-4 '>
              <Link href={PATH.home} className='flex items-center gap-2 '>
                <img src='/images/logo.svg' alt='' className='w-7' />
                <h4 className='mt-1 text-xl font-bold text-gray-900 dark:text-white'>
                  SOCIAL ZONE
                </h4>
              </Link>
              <SearchInput />
            </div>

            <div className='hidden space-x-2 laptop:flex laptop:items-center'>
              {user ? (
                <>
                  {/* ----- FOLLOW/MESSAGE/NOTIF ICONS ------ */}
                  <ul className='flex items-center space-x-8'>
                    <li className='flex items-center justify-center w-10 h-10 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-indigo-1100'>
                      {/* <Messages isAuth={currentUser} /> */}
                    </li>
                    <li className='flex items-center justify-center w-10 h-10 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-indigo-1100'>
                      <Notification isAuth={currentUser} />
                    </li>
                  </ul>
                  <div className='flex items-center'>
                    {/* ---- AVATAR WITH  USERNAME ----------- */}
                    <Link
                      href={`/user/${user?.username}`}
                      className='cursor-pointer'
                    >
                      <div className='flex items-center'>
                        <Avatar
                          url={
                            typeof user?.profilePicture === 'string'
                              ? user?.profilePicture
                              : ''
                          }
                          className='mr-2 rounded-full'
                        />
                        <h6 className='mr-10 text-sm dark:text-indigo-400'>
                          @{user?.username}
                        </h6>
                      </div>
                    </Link>
                    {/* ----- LOGOUT BUTTON ------ */}
                    <button
                      className='button--muted !rounded-full dark:bg-indigo-1100 dark:text-white dark:hover:bg-indigo-900 dark:hover:text-white dark:active:bg-indigo-1100'
                      onClick={toggleModal}
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                ''
              )}
              <ThemeToggler />
            </div>
          </nav>

          {/* <Suspense fallback={<nav className="fixed top-0 left-0 w-full bg-white shadow-md h-60px laptop:hidden"></nav>}>
           <NavBarMobile
            theme={theme}
            openModal={toggleModal}
            />
             </Suspense> */}

          <LogoutModal isOpen={isShow} closeModal={toggleModal} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Navbar;
