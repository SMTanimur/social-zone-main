import React from 'react';
import classNames from '~/utils/className';
import { convertHttps } from '~/utils/imageConvert';

interface IProps {
  url?: string;
  size?: string;
  className?: string;
}

const Avatar: React.FC<IProps> = ({ url, size, className }) => {
  return (
    <div
      className={classNames(size === 'xm'? 'w-5 h-5':size === 'sm'
      ? 'w-8 h-8'
      : size === 'lg'
        ? 'w-12 h-12'
        : 'w-10 h-10',className)}
               
      style={{ background: `#f8f8f8 url(${convertHttps(url) || '/images/avatar_placeholder.png'})` }}
    />
  )
};

Avatar.defaultProps = {
  size: 'md'
}

export default Avatar;
