import { ILoginPayload, ISignUpPayload } from "src/@types/user"
import { api } from "./axiosClient"

const authApi ={
  logoutUser: async()=>{
    const path = `/api/auth/logout`
    return await api.get(path,{})
  },

  loginUser:async (payload:ILoginPayload)=>{
     const path = `/api/auth/sign-in`
     return await api.post(path,payload)
  },
  signUp: async (payload:ISignUpPayload)=>{
    const path = `/api/auth/sign-up`
    return await api.post(path,payload)
  }
}

export default authApi