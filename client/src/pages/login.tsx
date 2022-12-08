import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AiOutlineLoading } from 'react-icons/ai';
import { MdLock } from 'react-icons/md';
import * as Yup from 'yup';
import authApi from '~/api/auth';
import { useAppStore } from '~/app/store';
import CustomInput from '~/components/input/CustomInput';
import { PATH } from '~/constants/path';
//@ts-ignore
import LazyImage from 'react-lazy-blur-image';
import { setCurrentUserLocalStorage } from '~/utils/localStorage';
import { GetServerSideProps } from 'next';
import { withAuthRedirect } from '~/HOC/withAuthRedirect';
const Schema = Yup.object({
  email: Yup.string()
    .required('Email is required.')
    .email('this not valid email'),
  password: Yup.string().required('Password is required'),
}).required();

interface IForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {  setCurrentUser } = useAppStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(Schema),
  });
 
  const onSubmit = handleSubmit(async values => {
    try {
      const {data}= await authApi.loginUser(values)
      setCurrentUserLocalStorage(data)
      setCurrentUser(data);
      router.push('/')
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message);
    }
  });

  return (
    <div className='flex min-h-screen bg-white'>
      <div className='relative laptop:w-7/12 h-screen laptop:p-8 hidden laptop:justify-start laptop:items-end laptop:flex bg-[#3982ad] '>
        <img
          src='/login.jpg'
          alt='Social zone'
          className='absolute top-0 left-0 object-cover w-full h-full'
        />

        <Link
          className='absolute flex items-center space-x-2 left-8 top-8'
          href={PATH.home}
        >
          <img src='/images/logo.svg' alt='Social Logo' className='w-8' />
          <h5 className='mt-2 text-indigo-1000 '>SOCIAL ZONE</h5>
        </Link>
        {/* -- INFO --- */}
        <h3 className='z-10 w-9/12 text-white animate-fade mb-14 drop-shadow-md '>
          Looking for new friends? You're in the right place.
        </h3>
        {/* --- CREDITS LINK --- */}
      </div>
      <div className='relative flex flex-col items-center justify-center w-full pt-8 animate-fade laptop:w-5/12 laptop:pt-0'>
        <Link href={PATH.home}>
          <img
            src='/images/logo.svg'
            alt='SocialZone Logo'
            className='relative w-12 mx-auto laptop:w-10 laptop:hidden'
          />
        </Link>
        <div className='w-full px-8 text-center laptop:px-14 laptop:text-left'>
          <div>
            <h2 className='mt-6 text-xl font-extrabold text-gray-900 laptop:text-2xl'>
              Login to Social Zone
            </h2>
          </div>
          <form className='mt-8 space-y-6' onSubmit={onSubmit}>
            <div className='space-y-2 rounded-md'>
              <CustomInput
                type='email'
                error={errors.email?.message}
                name='email'
                label='email'
                register={register}
                required
                readOnly={isLoading}
                placeholder='Email'
              />

              <div className='relative'>
                <CustomInput
                  type={isPasswordVisible ? 'text' : 'password'}
                  name='password'
                  label='password'
                  error={errors.password?.message}
                  register={register}
                  required
                  readOnly={isLoading}
                  placeholder='Password'
                />
                <div className='absolute top-0 right-0 z-10 flex items-center justify-center w-12 h-12 rounded-tr-full rounded-br-full cursor-pointer hover:bg-gray-200'>
                  {isPasswordVisible ? (
                    <EyeInvisibleOutlined
                      className='flex items-center justify-center w-full h-full text-gray-500 outline-none'
                      onClick={() => setPasswordVisible(false)}
                    />
                  ) : (
                    <EyeOutlined
                      className='flex items-center justify-center w-full h-full outline-none'
                      onClick={() => setPasswordVisible(true)}
                    />
                  )}
                </div>
              </div>
            </div>
            <button type='submit' className='relative w-full '>
              {isLoading ? (
                <AiOutlineLoading className='text-xl text-white animate-spin' />
              ) : (
                <>
                  <MdLock className='absolute top-0 bottom-0 my-auto left-8' />
                  Login
                </>
              )}
            </button>
          </form>
          <div className='mt-8 text-center'>
            <Link
              className='font-medium underline'
              onClick={e => isLoading && e.preventDefault()}
              href={PATH.singup}
            >
              I dont have an account
            </Link>
          </div>
          {/* --- COPYRIGHT -- */}
          <span className='block mx-auto mt-4 text-xs text-center text-gray-400'>
            &copy;Copyright {new Date().getFullYear()} SocialZone. All rights
            reserved.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = withAuthRedirect(
  async () => {
    return {
      props: {},
    };
  }
);
