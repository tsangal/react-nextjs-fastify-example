'use client'

import { createContext } from 'react'

interface RuntimeConfigContext {
  apiBaseUrl: string
}

export const RuntimeConfigContext = createContext<RuntimeConfigContext | null>(
  null
)

export interface RuntimeConfigContextProviderProps {
  children: React.ReactNode
  value: RuntimeConfigContext
}

export function RuntimeConfigContextProvider({
  children,
  value,
}: RuntimeConfigContextProviderProps) {
  return (
    <RuntimeConfigContext.Provider value={value}>
      {children}
    </RuntimeConfigContext.Provider>
  )
}

export default RuntimeConfigContext
