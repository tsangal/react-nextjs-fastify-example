import { createContext, useContext } from 'react'

import useAuthApi from '@/components/authApi'
import { ServiceRegistryContext } from '@/components/serviceRegistry'

export const DefaultServicesContext = createContext<{}>({})

export function DefaultServicesContextProvider({
  children,
  initDefaultServices = true,
}: DefaultServicesContextProviderProps) {
  const { registerService } = useContext(ServiceRegistryContext)!

  const value: Record<string, any> = {}

  if (initDefaultServices) {
    value.authApi = useAuthApi()

    registerService('authApi', value.authApi)
  }

  return (
    <DefaultServicesContext.Provider value={value}>
      {children}
    </DefaultServicesContext.Provider>
  )
}

export interface DefaultServicesContextProviderProps {
  children: React.ReactNode
  initDefaultServices?: boolean
}

export default DefaultServicesContextProvider
