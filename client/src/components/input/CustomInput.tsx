
import React from "react";
import { Path, UseFormRegister } from "react-hook-form";
import classNames from "~/utils/className";

type InputProps = {
  label: Path<any>;
  register: UseFormRegister<any>;
  required: boolean;
  error?: any;
  className?: string;
  [prop: string]: any;
};

const CustomInput = ({ label, register, required, error, className, ...rest }: InputProps) => {
  return (
    <div className="flex flex-col justify-start">
      <input {
        ...register(label, { required })}
        {...rest}
        className={classNames(error ? '!border-red-300 focus:!border-red-600 focus:!ring-red-500' :'',className)}
      />
      {error && typeof error === 'string' && (
        <span className="mt-1 ml-4 text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default CustomInput;
