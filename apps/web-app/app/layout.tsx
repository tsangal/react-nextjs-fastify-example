import type { Metadata } from 'next'
import { Inter, Roboto } from 'next/font/google'
import 'tw-elements-react/dist/css/tw-elements-react.min.css'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({ weight: '400', subsets: ['latin'] })

import Navbar from './navbar'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'React Next.js example',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${roboto.className}`}>
        <Providers>
          <Navbar />
          <div>{children}</div>
        </Providers>
      </body>
    </html>
  )
}
