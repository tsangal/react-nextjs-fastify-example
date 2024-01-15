'use client'

import { TailwindElementsProvider } from '@/components/teContext'

export default function Providers({ children }: { children: any }) {
  return (
    <>
      <TailwindElementsProvider>{children}</TailwindElementsProvider>
    </>
  )
}
