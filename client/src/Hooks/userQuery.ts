import { useQuery } from '@tanstack/react-query';
import { IUser } from 'src/@types/user';
import userApi from 'src/api/user';

export const useUserDetails = (username: string) => {
  return useQuery(['user', username], userApi.getUserDetails, {
    staleTime: 6000,
    retry: 0,
  });
};
