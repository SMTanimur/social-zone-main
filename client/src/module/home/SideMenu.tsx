import { StarOutlined, TeamOutlined } from "@ant-design/icons";
import Link from "next/link";
import React from "react";
import Avatar from "~/components/image/Avatar";
import { useUser } from "~/Hooks/useUser";


const SideMenu  = () => {
 const {data:user}=useUser()

  return (
    <ul className="overflow-hidden bg-white dark:bg-indigo-1000 laptop:shadow-md laptop:rounded-md ">
      <li className="px-4 py-3 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900">
        <Link href={`/user/${user?.username}`} className="flex items-center text-black">
          <Avatar url={typeof user?.profilePicture === 'string' ? user?.profilePicture : ''} className="mr-4" />
          <h6 className="text-sm dark:text-white">My Profile</h6>
        </Link>
      </li>
      <li className="px-4 py-3 mt-4 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900">
        <Link href={`/user/${user?.username}/following`} className="flex items-center text-black">
          <TeamOutlined className="text-indigo-700 dark:text-indigo-400" style={{ fontSize: '30px', marginRight: '25px' }} />
          <h6 className="text-sm dark:text-white">Following</h6>
        </Link>
      </li>
      <li className="px-4 py-3 mt-4 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900">
        <Link href={`/user/${user?.username}/followers`} className="flex items-center text-black">
          <TeamOutlined className="text-indigo-700 dark:text-indigo-400" style={{ fontSize: '30px', marginRight: '25px' }} />
          <h6 className="text-sm dark:text-white">Followers</h6>
        </Link>
      </li>
      <li className="px-4 py-3 mt-4 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900">
        <Link href={`/user/${user?.username}/bookmarks`} className="flex items-center text-black">
          <StarOutlined className="text-indigo-700 dark:text-indigo-400" style={{ fontSize: '30px', marginRight: '25px' }} />
          <h6 className="text-sm dark:text-white">Bookmarks</h6>
        </Link>
      </li>
    </ul>
  )
};

export default SideMenu;
