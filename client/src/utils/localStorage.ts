import { IUser } from "~/@types/user";
import { LocalStorage } from "~/constants/localStorage";


export const getCurrentUserLocalStorage: () => IUser = () => {
  if(typeof window !== 'undefined'){
    return JSON.parse(localStorage.getItem(LocalStorage.currentUser) || "{}");
  }
};

export const removeCurrentUserLocalStorage = () => {
  localStorage.removeItem(LocalStorage.currentUser);
};

export const setCurrentUserLocalStorage = (user: Partial<IUser>) => {
  const currentUser = getCurrentUserLocalStorage();
  const newCurrentUser = { ...currentUser, ...user };
  localStorage.setItem(LocalStorage.currentUser, JSON.stringify(newCurrentUser));
};


