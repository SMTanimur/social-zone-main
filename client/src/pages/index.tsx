
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { withAuth } from 'src/HOC/withAuth';
import PostCreateCard from 'src/module/posts/PostCreateCard';
import Avatar from '~/components/image/Avatar';
import CreatePostModal from '~/components/modals/CreataPostModal';
import useModal from '~/Hooks/useModal';
import { useUser } from '~/Hooks/useUser';
import AppLayout from '~/layouts/AppLayout';
import SideMenu from '~/module/home/SideMenu';
import styles from '../styles/Home.module.css';

function Home() {
  const {data:user}=useUser()
  const {isShow,toggleModal}=useModal()
  return (
    <AppLayout>
      <div className='flex items-start pt-20'>
        {/**Sidebar */}
      <div className="relative hidden mr-4 space-y-4 laptop:block laptop:w-1/4 laptop:sticky laptop:top-20">
          <SideMenu />
          {/* <DevCard /> */}
        </div>
        
        <div className='relative flex w-full laptop:w-2/4'>
        <div className="flex items-center justify-start w-full p-4 mb-4 bg-white shadow-sm tablet:rounded-md dark:bg-indigo-1000">
            <Avatar url={typeof user?.profilePicture === 'string' ? user?.profilePicture : ''} className="mr-2" />
            <div className="flex-grow w-full">
              <input
                className="dark:bg-indigo-950 dark:!border-gray-700 dark:text-white  dark:placeholder-gray-400 w-full"
                type="text"
                placeholder="Create a post."
                onClick={ toggleModal}
              />
            </div>
          </div>
        </div>

        {/**Right bar */}
        <div className='hidden laptop:block laptop:w-1/4'>
          <h1>Right bar</h1>
        </div>
        <CreatePostModal closeModal={toggleModal} currentUser={user!} isOpen={isShow}/>
      </div>
    </AppLayout>
  );
}

export default Home;
export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
