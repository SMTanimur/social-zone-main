import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IError, IUser } from '~/@types/user';
import Loader from '../Loaders/Loader';

interface IProps {
  floatingResult?: boolean;
  clickItemCallback?: (user: IUser) => void;
  showNoResultMessage?: boolean;
  inputClassName?: string;
  preventDefault?: boolean;
}

const SearchInput: React.FC<IProps> = props => {
  const [searchInput, setSearchInput] = useState('');
  const [isSuggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<IUser[]>([]);
  const [isVisibleSuggestion, setVisibleSuggestion] = useState(false);
  const [error, setError] = useState<IError | null>(null);
  const history = useRouter();
  const isVisibleSuggestionRef = useRef(isVisibleSuggestion);

  useEffect(() => {
    isVisibleSuggestionRef.current = isVisibleSuggestion;
  }, [isVisibleSuggestion]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickOutside = (e: MouseEvent) => {
    const target = (e.target as HTMLDivElement).closest('.input-wrapper');

    if (!target && isVisibleSuggestionRef.current) {
      setVisibleSuggestion(false);
    }
  };

  // const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   e.persist();
  //   const val = e.target.value;
  //   setSearchInput(val);

  //   (async () => {
  //     try {
  //       setSuggesting(true);
  //       setError(null);
  //       const users = await search({ q: val, limit: 5 });

  //       setSuggestions(users as IProfile[]);
  //       setSuggesting(false);
  //     } catch (e: any) {
  //       setSuggesting(false);
  //       setSuggestions([]);
  //       setError(e);
  //     }
  //   })();
  // }

  const onFocusInput = (e: React.FocusEvent<HTMLInputElement>) => {
    setVisibleSuggestion(true);
    e.target.select();
  };

  const onClickItem = (user: IUser) => {
    if (props.clickItemCallback) {
      props.clickItemCallback(user);
    } else {
      history.push(`/user/${user.username}`);
      setVisibleSuggestion(false);
    }
  };

  const onSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // props.preventDefault to stop dispatching the event when enter key pressed
    if (e.key === 'Enter' && searchInput && !props.preventDefault) {
      history.push({
        pathname: '/search',
        search: `q=${searchInput.trim()}&type=users`,
      });
      setVisibleSuggestion(false);
    }
  };

  return (
    <div
      className={` relative flex flex-col items-center ${props.inputClassName}`}
    >
      <FiSearch className='absolute z-50 text-gray-400 left-3 top-3' />
      <input
        className='border-gray-100 !pl-10 !py-2 bg-gray-100 dark:bg-indigo-950 dark:!border-indigo-900 focus:!border-indigo-600 dark:text-white dark:focus:!border-indigo-500'
        placeholder='Search...'
        type='text'
        onFocus={onFocusInput}
        // onChange={debounce()}
        onKeyDown={onSearchSubmit}
      />
      {searchInput && isVisibleSuggestion && (
        <div
          className={` bg-white dark:bg-indigo-900 shadow-lg rounded-md w-full flex justify-center flex-col overflow-hidden ${
            props.floatingResult ? 'absolute top-12' : 'relative top-0'
          }`}
        >
          {!props.showNoResultMessage && !error && (
            <h6 className='p-4 text-xs border-b border-gray-100 dark:text-white dark:border-gray-800'>
              Search Suggestion
            </h6>
          )}
          {isSuggesting && !error && (
            <div className='flex items-center justify-center p-4'>
              <Loader />
            </div>
          )}
          {/* {(!isSuggesting && !error && suggestions.length !== 0) && suggestions.map((user) => (
            <div
              className="p-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-950"
              key={user.id}
              onClick={() => onClickItem(user)}
            >
              <div className="flex items-center">
                <Avatar url={typeof user.profilePicture === 'string' ? user.profilePicture : user.profilePicture?.url} className="mr-2" />
                <div className="flex flex-col">
                  {user.fullname && <p className="text-xs text-gray-600 dark:text-gray-400">{user.fullname}</p>}
                  <h6 className="max-w-md mr-10 overflow-hidden text-sm overflow-ellipsis dark:text-white">{user.username}</h6>
                </div>
              </div>
            </div>
          ))} */}
          {/* {(error && suggestions.length === 0 && props.showNoResultMessage) && (
            <div className="flex items-center justify-center p-4">
              <span className="text-sm italic text-gray-400">
                {error?.error?.message || 'Something went wrong :('}
              </span>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

SearchInput.defaultProps = {
  floatingResult: true,
  showNoResultMessage: false,
  inputClassName: 'w-20rem',
  preventDefault: false,
};

export default SearchInput;
