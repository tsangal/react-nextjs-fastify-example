import { unstable_noStore as noStore } from 'next/cache'

import { RuntimeConfigContextProvider } from '@/components/runtimeConfig'

export default function RuntimeInit({
  children,
}: {
  children: React.ReactNode
}) {
  noStore()

  const value = {
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
  }

  return (
    <RuntimeConfigContextProvider value={value}>
      {children}
    </RuntimeConfigContextProvider>
  )
}
