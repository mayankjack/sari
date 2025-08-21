'use client'

import React from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const CartPage = () => {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId)
      toast.success('Item removed from cart')
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
    toast.success('Item removed from cart')
  }

  const handleClearCart = () => {
    clearCart()
    toast.success('Cart cleared')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start Shopping
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">You have {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-24 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-50"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 text-gray-900 font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-50"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-700 p-2"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${item.price} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="text-gray-900">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${(totalPrice * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      ${(totalPrice + (totalPrice * 0.08)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <div className="mt-4 text-center">
                <Link
                  href="/products"
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
