'use client'

import React, { useState, useEffect } from 'react'
import { 
  useStripe, 
  useElements, 
  PaymentElement,
  Elements 
} from '@stripe/react-stripe-js'
import { StripeElementsOptions } from '@stripe/stripe-js'
import { usePayment } from '@/contexts/PaymentContext'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Lock, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import getStripe from '@/lib/stripe'

interface PaymentFormProps {
  clientSecret: string
  orderId: string
  onPaymentSuccess: () => void
  onPaymentError: (error: string) => void
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  clientSecret,
  orderId,
  onPaymentSuccess,
  onPaymentError
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const { confirmPayment } = usePayment()
  const { clearCart } = useCart()
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required'
      })

      if (error) {
        console.error('Payment failed:', error)
        toast.error(error.message || 'Payment failed')
        onPaymentError(error.message || 'Payment failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm payment with backend
        const confirmed = await confirmPayment(paymentIntent.id, orderId)
        
        if (confirmed) {
          clearCart()
          onPaymentSuccess()
          toast.success('Payment successful!')
          router.push('/orders')
        } else {
          onPaymentError('Failed to confirm payment')
        }
      }
    } catch (err: any) {
      console.error('Payment processing error:', err)
      onPaymentError(err.message || 'Payment processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center mb-3">
          <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="font-semibold text-gray-900">Payment Details</h3>
        </div>
        <PaymentElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <Lock className="h-4 w-4 text-blue-600" />
        <span>Your payment is secured by Stripe and encrypted with 256-bit SSL</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isProcessing ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <Lock className="h-5 w-5 mr-2" />
            Complete Payment
          </>
        )}
      </button>
    </form>
  )
}

interface StripePaymentFormProps {
  totalAmount: number
  orderId: string
  onPaymentSuccess: () => void
  onPaymentError: (error: string) => void
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  totalAmount,
  orderId,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [clientSecret, setClientSecret] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const { createPaymentIntent } = usePayment()
  const { user } = useAuth()

  useEffect(() => {
    const initializePayment = async () => {
      if (!user || totalAmount <= 0) {
        setIsLoading(false)
        return
      }

      try {
        const result = await createPaymentIntent(totalAmount)
        if (result) {
          setClientSecret(result.clientSecret)
        } else {
          onPaymentError('Failed to initialize payment')
        }
      } catch (error) {
        console.error('Failed to initialize payment:', error)
        onPaymentError('Failed to initialize payment')
      } finally {
        setIsLoading(false)
      }
    }

    initializePayment()
  }, [totalAmount, user, createPaymentIntent, onPaymentError])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Initializing payment...</span>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to initialize payment. Please try again.</p>
      </div>
    )
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#7c3aed',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        borderRadius: '8px',
      },
    },
  }

  return (
    <Elements stripe={getStripe()} options={options}>
      <PaymentForm
        clientSecret={clientSecret}
        orderId={orderId}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
      />
    </Elements>
  )
}

export default StripePaymentForm
