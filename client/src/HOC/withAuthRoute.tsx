
import { useUser } from "@Hooks/useUser";
import { useEffect } from "react";
import Router from 'next/router'
import { useAppStore } from "@app/store";

export const withAuthRoute = <T extends void>(
  Component: React.ComponentType<T>
) => {
  
  const RequireAuthentication = (props: any) => {
    const {user}=useAppStore()
    useEffect(() => {
      if (!user) {
        Router.push("/login");
      }
    }, [user]);
    
    return user ? <Component {...props} /> : null;
  };
  return RequireAuthentication;
};
