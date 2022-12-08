
import { useRouter } from 'next/router';
import React, { HTMLAttributes, useEffect } from 'react'
import classNames from '~/utils/className';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
interface LayoutHomeProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
const AppLayout:React.FC<LayoutHomeProps> = ({children, className=""}) => {
  return (
    <div className={classNames('flex flex-col ',className)}>
       <Navbar/>
       <main className='flex layout-container'>
        <Sidebar/>
        <div className='w-full'>
        {children}
        </div>
       </main>
    </div>
  )
}

export default AppLayout