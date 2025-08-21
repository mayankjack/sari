'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

interface PaymentContextType {
  isProcessing: boolean
  createPaymentIntent: (amount: number) => Promise<{ clientSecret: string; paymentIntentId: string } | null>
  confirmPayment: (paymentIntentId: string, orderId: string) => Promise<boolean>
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

export const usePayment = () => {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider')
  }
  return context
}

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const { user } = useAuth()

  const createPaymentIntent = async (amount: number): Promise<{ clientSecret: string; paymentIntentId: string } | null> => {
    if (!user) {
      toast.error('Please log in to process payment')
      return null
    }

    setIsProcessing(true)
    try {
      const response = await axios.post('/api/payments/create-payment-intent', {
        amount: amount,
        currency: 'usd'
      })

      return {
        clientSecret: response.data.clientSecret,
        paymentIntentId: response.data.paymentIntentId
      }
    } catch (error: any) {
      console.error('Payment intent creation failed:', error)
      toast.error(error.response?.data?.message || 'Failed to create payment intent')
      return null
    } finally {
      setIsProcessing(false)
    }
  }

  const confirmPayment = async (paymentIntentId: string, orderId: string): Promise<boolean> => {
    setIsProcessing(true)
    try {
      const response = await axios.post('/api/payments/confirm-payment', {
        paymentIntentId,
        orderId
      })

      toast.success('Payment confirmed successfully!')
      return true
    } catch (error: any) {
      console.error('Payment confirmation failed:', error)
      toast.error(error.response?.data?.message || 'Failed to confirm payment')
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const value: PaymentContextType = {
    isProcessing,
    createPaymentIntent,
    confirmPayment
  }

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  )
}
