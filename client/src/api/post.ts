import { IPostCreate } from "src/@types/post"
import { api } from "./axiosClient"


const postApi ={
  postCreate: async (payload:IPostCreate)=>{
    const path = `/api/post/create`
    return await api.post(path,payload)
  },
  postTimeline: async ({queryKey}:any)=>{
   const {}=queryKey
  }
}

export default postApi