import { useQuery } from '@tanstack/react-query';
import { IUser } from 'src/@types/user';
import userApi from 'src/api/user';

export const useUser = () => {
  return useQuery<IUser>(['me'], userApi.getUserInfo, { staleTime: 6000 ,retry:0});
};
