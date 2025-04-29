import { AuthContextProvider } from '@/components/authContext'
import { DefaultServicesContextProvider } from '@/components/defaultServices'
import { ServiceRegistryContextProvider } from '@/components/serviceRegistry'

export default function Providers({ children }: { children: any }) {
  return (
    <>
      <ServiceRegistryContextProvider>
        <DefaultServicesContextProvider>
          <AuthContextProvider>{children}</AuthContextProvider>
        </DefaultServicesContextProvider>
      </ServiceRegistryContextProvider>
    </>
  )
}
