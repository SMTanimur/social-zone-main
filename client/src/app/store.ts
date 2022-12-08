import create from 'zustand'

import { devtools, persist } from 'zustand/middleware'
import { createUserSlice, UserSlice } from './slices/createUserSlice'
import { createThemeSlice, ThemeSlice } from './slices/themeSlice'

type StoreState = UserSlice & ThemeSlice

export const useAppStore = create<StoreState>()(devtools( persist((...a) => ({
    ...createUserSlice(...a),
    ...createThemeSlice(...a)
}))))