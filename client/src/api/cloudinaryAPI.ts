import axios from 'axios';
import { ICloudinaryUpload } from 'src/@types/common.type';

const axiosCloudinary = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CLOUDINARY_API,
});

axiosCloudinary.interceptors.response.use(
  response => {
    const result = { ...response.data, status: response.status };
    return result;
  },
  ({ response }) => {
    const result = { ...response.data, status: response.status };
    return Promise.reject(result);
  }
);

export const configCloudinaryAPI = {
  uploadImage: (payload: FormData): Promise<ICloudinaryUpload> => {
    const path = `/image/upload`;
    return axiosCloudinary.post(path, payload);
  },
};
