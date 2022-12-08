import { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { configCloudinaryAPI } from 'src/api';

const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

export const useUploadImage = () => {
  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    let urlUploaded: string = '';
    if (!e.target.files) return '';
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    try {
      const { url } = await configCloudinaryAPI.uploadImage(formData);
      if (url) urlUploaded = url;
    } catch (error: any) {
      toast.error(error?.message);
    }
    return urlUploaded;
  };
  return {
    uploadImage,
  };
};
