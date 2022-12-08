import React, { HTMLAttributes } from 'react'
import classNames from 'src/utils/className'
 interface FormGroupProps extends HTMLAttributes<HTMLDivElement>{
   children:React.ReactNode
 }
const FormGroup = ({children,className}:FormGroupProps) => {
  return (
    <div className={classNames('flex flex-col gap-y-1 mb-3',className)}>
      {children}
    </div>
  )
}

export default FormGroup