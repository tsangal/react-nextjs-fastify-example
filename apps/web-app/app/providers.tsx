import { AuthContextProvider } from '@/components/authContext'
import { DefaultServicesContextProvider } from '@/components/defaultServices'
import { TailwindElementsProvider } from '@/components/teContext'
import { ServiceRegistryContextProvider } from '@/components/serviceRegistry'

export default function Providers({ children }: { children: any }) {
  return (
    <>
      <ServiceRegistryContextProvider>
        <DefaultServicesContextProvider>
          <AuthContextProvider>
            <TailwindElementsProvider>{children}</TailwindElementsProvider>
          </AuthContextProvider>
        </DefaultServicesContextProvider>
      </ServiceRegistryContextProvider>
    </>
  )
}
