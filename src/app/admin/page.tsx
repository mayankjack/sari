'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Plus,
  Settings
} from 'lucide-react'
import Link from 'next/link'

// Mock data for dashboard
const mockStats = {
  totalRevenue: 45678.90,
  totalOrders: 1234,
  totalCustomers: 567,
  totalProducts: 89,
  revenueChange: 12.5,
  ordersChange: -2.3,
  customersChange: 8.7,
  productsChange: 15.2
}

const recentOrders = [
  { id: '1', customer: 'Priya Sharma', amount: 299.99, status: 'pending', date: '2024-01-15' },
  { id: '2', customer: 'Anjali Patel', amount: 599.99, status: 'confirmed', date: '2024-01-14' },
  { id: '3', customer: 'Meera Reddy', amount: 149.99, status: 'shipped', date: '2024-01-13' },
  { id: '4', customer: 'Sunita Verma', amount: 399.99, status: 'delivered', date: '2024-01-12' }
]

const quickActions = [
  { name: 'Add Product', href: '/admin/products/new', icon: Plus, color: 'bg-blue-500' },
  { name: 'View Orders', href: '/admin/orders', icon: ShoppingCart, color: 'bg-green-500' },
  { name: 'Manage Customers', href: '/admin/customers', icon: Users, color: 'bg-purple-500' },
  { name: 'Shop Settings', href: '/admin/shop', icon: Settings, color: 'bg-orange-500' }
]

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Here is an overview of your store performance and recent activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{mockStats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {mockStats.revenueChange > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`ml-2 text-sm font-medium ${
              mockStats.revenueChange > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {mockStats.revenueChange > 0 ? '+' : ''}{mockStats.revenueChange}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs last month</span>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.totalOrders}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {mockStats.ordersChange > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`ml-2 text-sm font-medium ${
              mockStats.ordersChange > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {mockStats.ordersChange > 0 ? '+' : ''}{mockStats.ordersChange}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs last month</span>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.totalCustomers}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {mockStats.customersChange > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`ml-2 text-sm font-medium ${
              mockStats.customersChange > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {mockStats.customersChange > 0 ? '+' : ''}{mockStats.customersChange}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs last month</span>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.totalProducts}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {mockStats.productsChange > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`ml-2 text-sm font-medium ${
              mockStats.productsChange > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {mockStats.productsChange > 0 ? '+' : ''}{mockStats.productsChange}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs last month</span>
          </div>
        </div>
      </div>

      {/* Quick Actions and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200"
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-900">{action.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-purple-600 hover:text-purple-700">
              View All
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{order.amount}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Store Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-sm text-gray-600">Customer Support</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">48h</div>
            <div className="text-sm text-gray-600">Average Delivery</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard