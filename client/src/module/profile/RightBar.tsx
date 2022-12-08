import React from 'react'
import { IUser } from 'src/@types/user'

interface RightBarProps {
  user:any
}
const RightBar:React.FC<RightBarProps> = ({user}) => {
  return (
    <div>
      <div className='flex flex-col gap-6 '>
              <h1 className='text-xl font-bold text-gray-800'>User Information</h1>

              <div className='flex flex-col text-gray-800 space-y-3font-semibold'>
                <div className='flex items-center gap-2 text-lg'>
                  <h5>City:</h5>
                  <span>{user?.city}</span>
                </div>
                <div className='flex items-center gap-2 text-lg'>
                  <h5>From:</h5>
                  <span>{user?.from}</span>
                </div>
                <div className='flex items-center gap-2 text-lg'>
                  <h5>Relationship:</h5>
                  <span>{user?.relationship === 1
                  ? 'Single'
                  : user?.relationship === 2
                  ? 'Married'
                  : 'Married with children'}</span>
                </div>

                {
                  user?.desc &&(
                    <div className='flex items-center gap-2 text-lg'>
                  <h5>Description:</h5>
                    <span>{user?.desc}</span>
                </div>
                  )
                }
              </div>
            </div>
    </div>
  )
}

export default RightBar