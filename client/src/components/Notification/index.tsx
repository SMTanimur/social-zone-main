import React, { useEffect, useRef, useState } from "react";
import { BiBell } from 'react-icons/bi';
import { INotification } from "~/@types/common.type";
import { IUser } from "~/@types/user";
import { socket } from "~/utils/socket";





interface IProps {
  isAuth: IUser;
}

const Notification: React.FC<IProps> = ({ isAuth }) => {
 

  return (
    <div>
      <h1 className="text-sm">notification</h1>
    </div>
  );
};

export default Notification;
