import { LabelHTMLAttributes } from "react";
import classNames from "src/utils/className";


type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

const Label = ({ htmlFor, className, children, ...props }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={classNames("text-[#555555cc] font-medium cursor-pointer", className)}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;
