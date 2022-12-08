import {
  ArrowLeftOutlined, ArrowRightOutlined, CloseOutlined,
  LogoutOutlined, MenuOutlined, SearchOutlined,
  StarOutlined, TeamOutlined, UsergroupAddOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { IUser } from "~/@types/user";
import Avatar from "~/components/image/Avatar";
import SearchInput from "~/components/input/SearchInput";
import ThemeToggler from "~/components/shared/ThemeToggler";
import { PATH } from "~/constants/path";
import { useUser } from "~/Hooks/useUser";



interface IProps {
  theme: string;
  openModal: () => void;
}
const NavBarMobile: React.FC<IProps> = ({ theme,  openModal }) => {
  const [isOpenSearch, setOpenSearch] = useState(false);
  const [isOpenMenu, setOpenMenu] = useState(false);
  const {data:currentUser}=useUser()
 
  const router = useRouter()
  const onClickMenuItem = () => {
    setOpenMenu(false);
  }

  const clickSearchItemCallback = (user: IUser) => {
    setOpenSearch(false);
    router.push(`/user/${user.username}`);
  }

  return isOpenSearch ? (
    <div className="fixed top-0 left-0 flex items-center w-full px-2 py-2 pr-2 shadow-xl dark:bg-indigo-1100 z-9999">
      <div
        className="flex items-center justify-center p-2 rounded-full cursor-pointer hover:bg-indigo-500"
        onClick={() => setOpenSearch(false)}
      >
        <ArrowLeftOutlined className="dark:text-white" style={{ fontSize: '18px' }} />
      </div>
      <SearchInput
        clickItemCallback={clickSearchItemCallback}
        inputClassName="w-full"
      />
    </div>
  ) : (
    <nav className="fixed top-0 left-0 flex justify-between w-full py-2 text-gray-700 bg-white border-b border-transparent shadow-md contain z-9999 align-center w-100 dark:bg-indigo-1000 h-60px laptop:shadow-sm dark:border-gray-800">
      <div className="flex items-center space-x-8 shrink-0">
        {/* ---- LOGO -------- */}
        <link
          href={PATH.home}
        >
          <img
            src={theme === 'dark' ? '/assets/logo-light.svg' : '/assets/logo-dark.svg'}
            alt=""
            className="w-32"
          />
        </link>
      </div>
      {/* ---- NAVICONS FOR MOBILE ---- */}
      <div className="flex items-center space-x-4 laptop:hidden">
        {currentUser && (
          <>
            <div
              className="flex items-center justify-center p-2 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-indigo-1100"
            >
              {/* <Messages isAuth={isAuth} /> */}
            </div>
            <div
              className="flex items-center justify-center p-2 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-indigo-1100"
            >
              {/* <Notification isAuth={isAuth} /> */}
            </div>
          </>
        )}
        <div
          className="flex items-center justify-center p-2 rounded-full cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-indigo-1100"
          onClick={() => setOpenSearch(true)}
        >
          <SearchOutlined style={{ fontSize: '20px' }} />
        </div>
        <div
          className="flex items-center justify-center p-2 rounded-full cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-indigo-1100"
          onClick={() => setOpenMenu(true)}
        >
          <MenuOutlined style={{ fontSize: '20px' }} />
        </div>
      </div>
      {/* ---- NAV DRAWER FOR MOBILE --- */}
      <div className={`flex  flex-col w-full h-screen fixed top-0 right-0 transition-transform  transform ${isOpenMenu ? 'translate-x-0' : 'translate-x-full'} bg-white dark:bg-indigo-1000 laptop:hidden`}>
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <h1 className="dark:text-white">Menu</h1>
            <ThemeToggler />
          </div>
          <div
            className="flex items-center justify-center p-2 rounded-full cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-indigo-1100"
            onClick={() => setOpenMenu(false)}
          >
            <CloseOutlined style={{ fontSize: '20px' }} />
          </div>
        </div>
        {currentUser ? (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            <li className="px-4 py-3 pb-4 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-1100">
              <Link
                className="flex font-medium dark:text-indigo-400"
                onClick={onClickMenuItem}
                href={`/user/${currentUser?.username}`}
              >
                <Avatar url={typeof currentUser.profilePicture === 'string' ? currentUser.profilePicture : ''} size="lg" className="mr-2" />
                <div className="flex flex-col">
                  <span>{currentUser?.username}</span>
                  <span className="text-xs text-gray-400">View Profile</span>
                </div>
              </Link>
            </li>
            <li className="p-4 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-1100">
              <Link
                className="flex items-center text-black dark:text-white"
                onClick={onClickMenuItem}
                href={`/user/${currentUser?.username}/following`}
              >
                <TeamOutlined className="text-indigo-700 dark:text-indigo-400" style={{ fontSize: '30px', marginRight: '25px' }} />
                <h6 className="text-sm">Following</h6>
              </Link>
            </li>
            <li className="p-4 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-1100">
              <Link
                className="flex items-center text-black dark:text-white"
                onClick={onClickMenuItem}
                href={`/user/${currentUser?.username}/followers`}
              >
                <TeamOutlined className="text-indigo-700 dark:text-indigo-400" style={{ fontSize: '30px', marginRight: '25px' }} />
                <h6 className="text-sm">Followers</h6>
              </Link>
            </li>
            {/* <li className="p-4 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-1100">
              <Link
                className="flex items-center text-black dark:text-white"
                onClick={onClickMenuItem}
                to={SUGGESTED_PEOPLE}
              >
                <UsergroupAddOutlined className="text-indigo-700 dark:text-indigo-400" style={{ fontSize: '30px', marginRight: '25px' }} />
                <h6 className="text-sm">Suggested People</h6>
              </Link>
            </li> */}
            <li className="p-4 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-1100">
              <div
                className="flex items-center text-black dark:text-white"
                onClick={() => {
                  openModal();
                  setOpenMenu(false);
                }}
              >
                <LogoutOutlined className="text-red-500" style={{ fontSize: '30px', marginRight: '25px' }} />
                <h6 className="text-sm text-red-500">Logout</h6>
              </div>
            </li>
          </ul>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            <li className="flex items-center justify-start px-4 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-1100">
              <ArrowRightOutlined className="dark:text-white" />
              <Link
                className="flex-grow p-4 font-medium dark:text-indigo-400"
                href={PATH.login}
              >
                Login
              </Link>
            </li>
            <li className="flex items-center justify-start px-4 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-1100">
              <ArrowRightOutlined className="dark:text-white" />
              <Link
                className="flex-grow p-4 font-medium dark:text-indigo-400"
                href={PATH.singup}
              >
                Register
              </Link>
            </li>
          </ul>
        )}
        {/* --- COPYRIGHT -- */}
        <div className="absolute left-0 right-0 mx-auto bottom-24 ">
          <span className="block text-xs text-center text-gray-400">
            &copy;Copyright {new Date().getFullYear()} Social Gen
          </span>
          <span className="block text-sm text-center text-gray-400">
            Crafted with ❤️ by <a href="https://juliusguevarra.com">Julius Guevarra</a>
          </span>
        </div>
      </div>
    </nav>
  )
};

export default NavBarMobile;
