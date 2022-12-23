import React from "react";
import { useAppStore } from "~/app/store";


interface IInjectedProps {
  theme: string;
  [prop: string]: any;
}

const withTheme = <P extends IInjectedProps>(Component: React.ComponentType<P>) => {
  return (props: Pick<P, Exclude<keyof P, keyof IInjectedProps>>) => {
    const {theme}=useAppStore()

    return <Component {...props as P} theme={theme} />
  }
};

export default withTheme;

