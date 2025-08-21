'use client'

import React from 'react'
import Link from 'next/link'
import { Star, Heart, ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

// Mock data for featured products
const featuredProducts = [
  {
    id: '1',
    name: 'Silk Banarasi Sari',
    price: 299.99,
    originalPrice: 399.99,
    image: '/api/placeholder/300/400',
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
    isSale: true
  },
  {
    id: '2',
    name: 'Cotton Handloom Sari',
    price: 149.99,
    originalPrice: 199.99,
    image: '/api/placeholder/300/400',
    rating: 4.6,
    reviewCount: 89,
    isNew: false,
    isSale: true
  },
  {
    id: '3',
    name: 'Designer Georgette Sari',
    price: 399.99,
    originalPrice: 499.99,
    image: '/api/placeholder/300/400',
    rating: 4.9,
    reviewCount: 156,
    isNew: true,
    isSale: false
  },
  {
    id: '4',
    name: 'Traditional Kanjeevaram',
    price: 599.99,
    originalPrice: 699.99,
    image: '/api/placeholder/300/400',
    rating: 4.7,
    reviewCount: 203,
    isNew: false,
    isSale: true
  }
]

const FeaturedProducts = () => {
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
          {featuredProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="w-full h-80 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-xl font-bold">S</span>
                    </div>
                    <p className="text-gray-600 font-medium">Sari Image</p>
                  </div>
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      New
                    </span>
                  )}
                  {product.isSale && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Sale
                    </span>
                  )}
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
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    ({product.reviewCount})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  
                  {product.originalPrice > product.price && (
                    <span className="text-sm font-medium text-red-600">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
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
