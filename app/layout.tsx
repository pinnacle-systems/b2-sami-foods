import type { Metadata } from 'next'
import { Poppins, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: 'B2 Sami Foods',
  description: 'Discover the finest selection of organic fruits, vegetables, and farm-fresh products delivered straight to your doorstep.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/navlogo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/navlogo.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/navlogo.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/navlogo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
