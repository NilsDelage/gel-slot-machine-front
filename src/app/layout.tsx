import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/utils/wagmi-providers'
import { ApolloWrapper } from "@/utils/apollo-providers"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gelato Slot Machine | VRF Showcase',
  description: 'The Gelato Slot Machine is a public showcase of the Gelato Verifiable Random Function (VRF) service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}><ApolloWrapper>{children}</ApolloWrapper></body>
      </Providers>
    </html>
  )
}
