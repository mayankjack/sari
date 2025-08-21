'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Search, Package } from 'lucide-react'

// Mock data for products
const mockProducts = [
  {
    id: '1',
    name: 'Silk Banarasi Sari',
    price: 299.99,
    category: 'Silk Saris',
    stock: 25,
    status: 'active',
    image: '/api/placeholder/100/100'
  },
  {
    id: '2',
    name: 'Cotton Handloom Sari',
    price: 149.99,
    category: 'Cotton Saris',
    stock: 50,
    status: 'active',
    image: '/api/placeholder/100/100'
  },
  {
    id: '3',
    name: 'Designer Georgette Sari',
    price: 399.99,
    category: 'Designer Saris',
    stock: 15,
    status: 'active',
    image: '/api/placeholder/100/100'
  },
  {
    id: '4',
    name: 'Traditional Kanjeevaram',
    price: 599.99,
    category: 'Bridal Saris',
    stock: 8,
    status: 'inactive',
    image: '/api/placeholder/100/100'
  }
]

const AdminProducts = () => {
  const [products, setProducts] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const categories = ['all', 'Silk Saris', 'Cotton Saris', 'Designer Saris', 'Bridal Saris']
  const statuses = ['all', 'active', 'inactive']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id))
    }
  }

  const toggleProductStatus = (id: string) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
        : product
    ))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-purple-600 font-semibold text-sm">S</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">${product.price}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      product.stock > 20 ? 'bg-green-100 text-green-800' :
                      product.stock > 10 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleProductStatus(product.id)}
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full cursor-pointer ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {product.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by adding your first product.'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && selectedStatus === 'all' && (
              <Link
                href="/admin/products/new"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredProducts.length}</span> of{' '}
              <span className="font-medium">{products.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts
