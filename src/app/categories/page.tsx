'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FolderOpen, Package, ArrowRight } from 'lucide-react'
import { API_URLS } from '@/lib/config'

interface Category {
  _id: string
  name: string
  description: string
  image?: string
  productCount?: number
  isActive: boolean
  parentCategory?: {
    _id: string
    name: string
  }
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [parentFilter, setParentFilter] = useState('all')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔍 Fetching categories...')
        
        const params = new URLSearchParams({
          limit: '100',
          active: 'true'
        })
        
        if (searchTerm) params.append('search', searchTerm)
        if (parentFilter === 'main') params.append('parent', 'null')
        else if (parentFilter !== 'all') params.append('parent', parentFilter)
        
        const response = await fetch(API_URLS.CATEGORIES() + '?' + params.toString())
        
        console.log('📡 Categories response status:', response.status)
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        
        const data = await response.json()
        console.log('📂 Categories data:', data)
        setCategories(data.categories || [])
      } catch (error) {
        console.error('❌ Error fetching categories:', error)
        setError('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [searchTerm, parentFilter])

  // Color gradients for categories
  const colorGradients = [
    'from-purple-500 to-purple-700',
    'from-pink-500 to-pink-700',
    'from-blue-500 to-blue-700',
    'from-red-500 to-red-700',
    'from-green-500 to-green-700',
    'from-yellow-500 to-yellow-700',
    'from-indigo-500 to-indigo-700',
    'from-teal-500 to-teal-700',
    'from-orange-500 to-orange-700',
    'from-cyan-500 to-cyan-700'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <FolderOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load categories</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our diverse collection organized by style, occasion, and fabric type
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Parent Filter */}
            <select
              value={parentFilter}
              onChange={(e) => setParentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="main">Main Categories</option>
              <option value="sub">Sub Categories</option>
            </select>
          </div>
        </div>

        {/* Categories Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || parentFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'No categories available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category._id}
                href={`/categories/${category._id}`}
                className="group block"
              >
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                  {/* Category Image */}
                  <div className={`w-full h-48 bg-gradient-to-r ${colorGradients[index % colorGradients.length]} flex items-center justify-center relative overflow-hidden`}>
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <span className="text-white text-2xl font-bold">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                      <p className="font-medium">{category.name}</p>
                    </div>
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">Explore Collection</span>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {category.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    
                    {/* Parent Category */}
                    {category.parentCategory && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-500">
                          Parent: {category.parentCategory.name}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {category.productCount || 0} products
                      </span>
                      <span className="text-purple-600 font-medium group-hover:text-purple-700 transition-colors flex items-center">
                        Shop Now <ArrowRight className="h-4 w-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Our collection is constantly growing. Contact us for custom orders or special requests.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoriesPage
