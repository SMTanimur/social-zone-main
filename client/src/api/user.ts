import { IUser, IUserUpdate } from 'src/@types/user';
import { api } from './axiosClient';

const userApi = {
  getUserInfo: async () => {
    const path = `/api/user`;
    const data = await api.get(path, {});
    return data.data;
  },

  updateProfile: async (id: any, payload: IUserUpdate) => {
    const path = `/api/user/${id}`;
    return await api.post(path, payload);
  },

  getUserDetails: async ({ queryKey }: any): Promise<IUser> => {
    const [_key, username] = queryKey;
    const path = `/api/user/${username}`;
    return await api.get(path, {});
  },
};

export default userApi;
