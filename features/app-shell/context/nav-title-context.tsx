'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface NavTitleContextValue {
  title: string | null
  setTitle: (title: string | null) => void
}

const NavTitleContext = createContext<NavTitleContextValue>({
  title: null,
  setTitle: () => {},
})

export function NavTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string | null>(null)
  return <NavTitleContext.Provider value={{ title, setTitle }}>{children}</NavTitleContext.Provider>
}

export function useNavTitle() {
  return useContext(NavTitleContext).title
}

export function useSetNavTitle() {
  return useContext(NavTitleContext).setTitle
}
