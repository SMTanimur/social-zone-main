import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';

import { HiMoon, HiOutlineSun } from 'react-icons/hi';
import { useAppStore } from '~/app/store';
;



const ThemeToggler = () => {
   const {theme,setTheme} =useAppStore()

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const onThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  return (
    <label
      className="flex items-center justify-center bg-gray-100 border border-gray-200 rounded-full cursor-pointer w-9 h-9 hover:bg-indigo-100 dark:bg-indigo-900 dark:hover:bg-indigo-1000 dark:border-indigo-900"
      title={theme === 'dark' ? 'Toggle Light Theme' : 'Toggle Dark Theme'}
    >
      <input
        className="hidden"
        checked={theme === 'dark'}
        type="checkbox"
        id="theme"
        onChange={onThemeChange}
        name="theme-switch"
        hidden
      />
      {theme === 'dark' ? (
        <HiMoon className="text-[cyan] text-xl" />
      ) : (
        <HiOutlineSun className="text-xl text-orange-400"/>
      )}
    </label>
  );
};

export default ThemeToggler;
