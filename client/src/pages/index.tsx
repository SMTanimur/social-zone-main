
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { withAuth } from 'src/HOC/withAuth';
import { withAuthRoute } from 'src/HOC/withAuthRoute';
import PostCreateCard from 'src/module/posts/PostCreateCard';
import AppLayout from '~/layouts/AppLayout';
import styles from '../styles/Home.module.css';

function Home() {
  return (
    <AppLayout>
      <div className=''>
      
        
        {/* <PostCreateCard /> */}
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
