import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { PaymentProvider } from '@/contexts/PaymentContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sari Shop - Your One-Stop Destination for Beautiful Saris',
  description: 'Discover our exclusive collection of handcrafted saris, designer wear, and traditional Indian clothing. Shop the latest trends with premium quality and authentic designs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <PaymentProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster position="top-right" />
            </PaymentProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
