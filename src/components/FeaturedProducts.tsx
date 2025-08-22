'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, Heart, ShoppingCart, Package } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { API_URLS } from '@/lib/config'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  images: string[]
  isFeatured: boolean
  isActive: boolean
  rating?: {
    average: number
    count: number
  }
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔍 Fetching featured products...')
        console.log('📍 API URL:', API_URLS.PRODUCTS({ 
          limit: '8', 
          featured: 'true',
          active: 'true'
        }))
        
        // Fetch featured and active products
        const response = await fetch(API_URLS.PRODUCTS({ 
          limit: '8', 
          featured: 'true',
          active: 'true'
        }))
        
        console.log('📡 Response status:', response.status)
        console.log('📡 Response ok:', response.ok)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Response error:', errorText)
          throw new Error('Failed to fetch featured products')
        }
        
        const data = await response.json()
        console.log('📦 Products data:', data)
        console.log('📦 Products count:', data.products?.length || 0)
        
        setProducts(data.products || [])
      } catch (error) {
        console.error('❌ Error fetching featured products:', error)
        setError('Failed to load featured products')
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and trending saris, carefully selected for their quality and style
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="w-full h-80 bg-gray-200 rounded-t-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and trending saris, carefully selected for their quality and style
            </p>
          </div>
          
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load products</h3>
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

  if (products.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and trending saris, carefully selected for their quality and style
            </p>
          </div>
          
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No featured products yet</h3>
            <p className="text-gray-500 mb-4">Check back soon for our latest collections!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular and trending saris, carefully selected for their quality and style
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-t-lg">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-80 object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement
                      if (target && target.nextElementSibling) {
                        target.style.display = 'none'
                        const fallback = target.nextElementSibling as HTMLElement
                        fallback.style.display = 'flex'
                      }
                    }}
                  />
                ) : null}
                
                {/* Fallback Image */}
                <div className="w-full h-80 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center" style={{ display: product.images && product.images[0] ? 'none' : 'flex' }}>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-xl font-bold">S</span>
                    </div>
                    <p className="text-gray-600 font-medium">Sari Image</p>
                  </div>
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Featured
                  </span>
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>

                {/* Quick Add to Cart */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-white text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Quick Add
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating!.average)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.rating.count})
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-3 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-600 hover:text-white transition-colors duration-300"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
