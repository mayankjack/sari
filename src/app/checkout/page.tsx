'use client'

import React, { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { CreditCard, Truck, MapPin, Lock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import StripePaymentForm from '@/components/StripePaymentForm'
import axios from 'axios'

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState<string>('')
  const [showPayment, setShowPayment] = useState(false)
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })
  
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true)

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', price: 0, estimatedDays: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', price: 15.99, estimatedDays: '2-3 business days' },
    { id: 'overnight', name: 'Overnight Shipping', price: 29.99, estimatedDays: '1 business day' }
  ]

  const selectedShipping = shippingMethods.find(method => method.id === shippingMethod)
  const subtotal = totalPrice
  const shipping = selectedShipping?.price || 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    })
  }

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please log in to complete checkout')
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsLoading(true)

    try {
      // Create order first
      const orderData = {
        items: items.map(item => ({
          product: item.id, // This would be the actual product ID from your database
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod: 'stripe',
        shippingAddress: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          phone: shippingInfo.phone
        },
        billingAddress: billingSameAsShipping ? {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country
        } : undefined
      }

      const response = await axios.post('/api/orders', orderData)
      setCurrentOrderId(response.data.order._id)
      setShowPayment(true)
      toast.success('Order created! Please complete payment.')
    } catch (error: any) {
      console.error('Order creation failed:', error)
      toast.error(error.response?.data?.message || 'Failed to create order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    clearCart()
    toast.success('Order completed successfully!')
    router.push('/orders')
  }

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`)
    setShowPayment(false)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to your cart before checkout.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="text-purple-600 hover:text-purple-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="mt-2 text-gray-600">Complete your purchase</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Shipping Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={shippingInfo.firstName}
                    onChange={handleShippingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={shippingInfo.lastName}
                    onChange={handleShippingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={shippingInfo.state}
                    onChange={handleShippingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={shippingInfo.zipCode}
                    onChange={handleShippingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <select
                    name="country"
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="India">India</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Shipping Method
              </h2>
              
              <div className="space-y-3">
                {shippingMethods.map((method) => (
                  <label key={method.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={method.id}
                      checked={shippingMethod === method.id}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{method.name}</span>
                        <span className="text-gray-900">
                          {method.price === 0 ? 'Free' : `$${method.price}`}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{method.estimatedDays}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Information */}
            {!showPayment ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg bg-blue-50">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Secure Card Payment</p>
                      <p className="text-sm text-gray-600">Pay securely with Stripe - supports all major credit cards</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                  <Lock className="h-4 w-4" />
                  <span>Payment will be processed securely by Stripe</span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Complete Payment
                </h2>
                
                <StripePaymentForm
                  totalAmount={total}
                  orderId={currentOrderId}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              {!showPayment && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                  ) : (
                    `Continue to Payment - $${total.toFixed(2)}`
                  )}
                </button>
              )}

              <div className="mt-4 text-center">
                <Link
                  href="/cart"
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Return to Cart
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutPage
