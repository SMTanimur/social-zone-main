import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React, { useRef, useEffect } from 'react';
import {
  QueryClientProvider,
  QueryClient,
  Hydrate,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import useSound from 'use-sound';
import { Toaster } from 'react-hot-toast';
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Router } from 'next/router';
import { useAppStore } from '~/app/store';


export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [sound] = useSound('../sounds/notification.mp3');
 
  const {currentUser}=useAppStore()
  useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();
    Router.events.on("routeChangeStart", handleRouteStart);
    Router.events.on("routeChangeComplete", handleRouteDone);
    Router.events.on("routeChangeError", handleRouteDone);
    return () => {
      Router.events.off("routeChangeStart", handleRouteStart);
      Router.events.off("routeChangeComplete", handleRouteDone);
      Router.events.off("routeChangeError", handleRouteDone);
    };
  }, []);

  // useEffect(() => {
  //   if (user) {

  //     socket?.emit('addUser', user?._id);
  //     socket?.on('getUsers', users => {
  //       dispatch(setOnlineUsers(users));
  //     });
  //     socket?.on('getMessage', () => {
  //       // @ts-ignore
  //       dispatch(updateNotifications());
  //       dispatch(setRefetchMessages());
  //       const audio = new Audio('../sounds/notification.mp3');

  //       audio.play();
  //     });
  //     socket?.on('getRequest', () => {
  //       const audio = new Audio('../sounds/notification.mp3');
  //       dispatch(setRefetch());
  //       audio.play();
  //     });
  //     socket?.on('typing', () => dispatch(setIsTyping(true)));
  //     socket?.on('stopTyping', () => dispatch(setIsTyping(false)));
  //   } else {
  //     socket?.disconnect();
  //   }
  // }, [user, dispatch]);

  
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
        <Toaster position="top-right" reverseOrder={false} />
      </Hydrate>
    </QueryClientProvider>
  );
}
