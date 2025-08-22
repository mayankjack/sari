'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FolderOpen, Package } from 'lucide-react'
import { API_URLS } from '@/lib/config'

interface Category {
  _id: string
  name: string
  description: string
  image?: string
  productCount?: number
  isActive: boolean
}

const CategoryGrid = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔍 Fetching categories...')
        console.log('📍 API URL:', API_URLS.CATEGORIES({ 
          active: 'true', 
          limit: '100' 
        }))
        
        // Fetch active categories
        const response = await fetch(API_URLS.CATEGORIES({ 
          active: 'true', 
          limit: '100' 
        }))
        
        console.log('📡 Response status:', response.status)
        console.log('📡 Response ok:', response.ok)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Response error:', errorText)
          throw new Error('Failed to fetch categories')
        }
        
        const data = await response.json()
        console.log('📂 Categories data:', data)
        console.log('📂 Categories count:', data.categories?.length || 0)
        
        setCategories(data.categories || [])
      } catch (error) {
        console.error('❌ Error fetching categories:', error)
        setError('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Color gradients for categories
  const colorGradients = [
    'from-purple-500 to-purple-700',
    'from-pink-500 to-pink-700',
    'from-blue-500 to-blue-700',
    'from-red-500 to-red-700',
    'from-green-500 to-green-700',
    'from-yellow-500 to-yellow-700',
    'from-indigo-500 to-indigo-700',
    'from-teal-500 to-teal-700'
  ]

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our diverse collection organized by style, occasion, and fabric type
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our diverse collection organized by style, occasion, and fabric type
            </p>
          </div>
          
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
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our diverse collection organized by style, occasion, and fabric type
            </p>
          </div>
          
          <div className="text-center py-12">
            <FolderOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-500 mb-4">Categories will appear here once they're added!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our diverse collection organized by style, occasion, and fabric type
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category._id}
              href={`/categories/${category._id}`}
              className="group block"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
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
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.productCount || 0} products
                    </span>
                    <span className="text-purple-600 font-medium group-hover:text-purple-700 transition-colors">
                      Shop Now →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-300"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid
