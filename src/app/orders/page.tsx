'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Package, Truck, CheckCircle, Clock, Eye, Download } from 'lucide-react'
import Link from 'next/link'

// Mock order data - will be replaced with API calls
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 299.99,
    items: [
      { id: '1', name: 'Silk Banarasi Sari', quantity: 1, price: 299.99, image: '/api/placeholder/100/100' }
    ],
    shippingAddress: '123 Main St, New York, NY 10001',
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2024-01-20'
  },
  {
    id: 'ORD-002',
    date: '2024-01-10',
    status: 'shipped',
    total: 449.98,
    items: [
      { id: '2', name: 'Cotton Handloom Sari', quantity: 1, price: 149.99, image: '/api/placeholder/100/100' },
      { id: '3', name: 'Designer Georgette Sari', quantity: 1, price: 299.99, image: '/api/placeholder/100/100' }
    ],
    shippingAddress: '123 Main St, New York, NY 10001',
    trackingNumber: 'TRK987654321',
    estimatedDelivery: '2024-01-18'
  },
  {
    id: 'ORD-003',
    date: '2024-01-05',
    status: 'processing',
    total: 599.99,
    items: [
      { id: '4', name: 'Traditional Kanjeevaram', quantity: 1, price: 599.99, image: '/api/placeholder/100/100' }
    ],
    shippingAddress: '123 Main St, New York, NY 10001',
    trackingNumber: null,
    estimatedDelivery: '2024-01-25'
  }
]

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'delivered':
      return { color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle, label: 'Delivered' }
    case 'shipped':
      return { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Truck, label: 'Shipped' }
    case 'processing':
      return { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Clock, label: 'Processing' }
    case 'cancelled':
      return { color: 'text-red-600', bgColor: 'bg-red-100', icon: Package, label: 'Cancelled' }
    default:
      return { color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Package, label: 'Unknown' }
  }
}

const OrdersPage = () => {
  const { user } = useAuth()
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your orders</h2>
          <p className="text-gray-600">You need to be logged in to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">Track your orders and view order history</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mockOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to see your orders here.</p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {mockOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status)
              const StatusIcon = statusInfo.icon
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <div className={`w-10 h-10 ${statusInfo.bgColor} rounded-full flex items-center justify-center`}>
                          <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Order {order.id}</h3>
                          <p className="text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          className="text-purple-600 hover:text-purple-700"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{item.name}</h5>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                <p className="text-sm text-gray-600">${item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Items:</span>
                            <span className="text-gray-900">{order.items.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Order Total:</span>
                            <span className="text-gray-900 font-semibold">${order.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                          </div>
                          {order.trackingNumber && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tracking:</span>
                              <span className="text-gray-900 font-mono text-xs">{order.trackingNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Order Details */}
                    {selectedOrder === order.id && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
                            <p className="text-gray-600">{order.shippingAddress}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Delivery Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Estimated Delivery:</span>
                                <span className="text-gray-900">{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                              </div>
                              {order.trackingNumber && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Tracking Number:</span>
                                  <span className="text-gray-900 font-mono text-xs">{order.trackingNumber}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-wrap gap-3">
                          {order.trackingNumber && (
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                              <Truck className="h-4 w-4 mr-2" />
                              Track Package
                            </button>
                          )}
                          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <Download className="h-4 w-4 mr-2" />
                            Download Invoice
                          </button>
                          {order.status === 'delivered' && (
                            <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                              Write Review
                            </button>
                          )}
                          {order.status === 'processing' && (
                            <button className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
