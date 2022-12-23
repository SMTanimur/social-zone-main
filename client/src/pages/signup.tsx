import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Link from 'next/link';
import { PATH } from '~/constants/path';
import CustomInput from '~/components/input/CustomInput';
import { useMutation } from '@tanstack/react-query';
import authApi from '~/api/auth';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const Schema = Yup.object({
  username: Yup.string()
    .max(24, 'Max length of 24 exceeded')
    .required('Username is required.'),
  email: Yup.string()
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Invalid email format'
    )
    .required('Email is required.'),
  password: Yup.string().required('Password is required'),
  repeatPassword: Yup.string().required('Repeat password to check.'),
}).required();

interface IForm {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const signUpPage: React.FC = () => {
  const { isLoading, mutateAsync } = useMutation(authApi.signUp);

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, touchedFields },
  } = useForm<IForm>({
    resolver: yupResolver(Schema),
  });
  
  const router = useRouter();
  const passwordsMatch = getValues('password') === getValues('repeatPassword');

  const onSubmit = handleSubmit(async (values: any) => {
    try {
      if (passwordsMatch) {
        await mutateAsync(values, {
          onSuccess: () => {
            router.push(PATH.login);
          },
        });
      }
    } catch (error:any) {
      toast.error(error.message)
    }
  });

  return (
    <div className='flex min-h-screen bg-white'>
      <div className='relative hidden laptop:w-7/12 h-screen laptop:p-8 laptop:sticky laptop:top-0 laptop:flex laptop:justify-start laptop:items-end bg-[#e3dad5]'>
        {/* ---- BACKGROUND IMAGE -----  */}
        <img
          src='/login.jpg'
          alt='Social zone'
          className='absolute top-0 left-0 object-cover w-full h-full'
        />
        {/* --- LOGO --- */}
        <Link className='absolute left-8 top-8' href={PATH.home}>
          <img src='/images/logo.svg' alt='Social Zone' className='w-8' />
        </Link>
        {/* -- INFO --- */}
        <h3 className='z-10 w-9/12 text-white animate-fade mb-14'>
          Create your account now and discover new ideas and connect with
          people.
        </h3>
      </div>
      <div className='relative flex flex-col items-center justify-center w-full py-8 text-center animate-fade laptop:w-5/12 laptop:text-left'>
        <Link href={PATH.home}>
          <img
            src='/images/logo.svg'
            alt='Social zone'
            className='relative w-12 mx-auto laptop:w-10 laptop:hidden'
          />
        </Link>
        <div className='w-full px-8 laptop:px-14'>
          <div>
            <h2 className='mt-6 text-xl font-extrabold text-gray-900 laptop:text-2xl'>
              Create your account
            </h2>
          </div>
          <form className='mt-8 space-y-6' onSubmit={onSubmit}>
            <div className='space-y-2 rounded-md'>
              <CustomInput
                type='text'
                error={errors.username?.message}
                name='username'
                label='username'
                register={register}
                required
                readOnly={isLoading}
                placeholder='Username'
              />
              <CustomInput
                type='email'
                name='email'
                label='email'
                error={errors.email?.message}
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
                  error={errors.password?.message || !passwordsMatch}
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
              {touchedFields.password &&
                touchedFields.repeatPassword &&
                !passwordsMatch && (
                  <span className='text-[11px] ml-4 text-red-500'>
                    Passwords do not match
                  </span>
                )}

              <CustomInput
                type='password'
                name='repeatPassword'
                label='repeatPassword'
                error={errors.repeatPassword?.message || !passwordsMatch}
                register={register}
                required
                readOnly={isLoading}
                placeholder='Repeat Password'
              />
            </div>
            <button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <div className='mt-8 text-center'>
            <Link
              className='font-medium underline'
              onClick={e => isLoading && e.preventDefault()}
              href={PATH.login}
            >
              Login instead
            </Link>
          </div>
          {/* --- COPYRIGHT -- */}
          <span className='block mx-auto mt-4 text-xs text-center text-gray-400'>
            &copy;Copyright {new Date().getFullYear()} SocialZone
          </span>
        </div>
      </div>
    </div>
  );
};

export default signUpPage;
