'use client'

import { createContext, useContext, useState } from 'react'

interface ServiceRegistryContext {
  getService: (name: string) => any
  registerService: (name: string, service: any) => void
}

export const ServiceRegistryContext =
  createContext<ServiceRegistryContext | null>(null)

export function ServiceRegistryContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [serviceMap] = useState(new Map())

  function getService(name: string) {
    if (!serviceMap.has(name)) {
      throw new Error(`Unknown service name "${name}"`)
    }
    return serviceMap.get(name)
  }

  function registerService(name: string, service: any) {
    console.debug('Register service', name)
    serviceMap.set(name, service)
    return service
  }

  const value = {
    getService,
    registerService,
  }

  return (
    <ServiceRegistryContext.Provider value={value}>
      {children}
    </ServiceRegistryContext.Provider>
  )
}

export function useService(name: string) {
  const serviceRegistryContext = useContext(ServiceRegistryContext)
  return serviceRegistryContext!.getService(name)
}

export default ServiceRegistryContext
