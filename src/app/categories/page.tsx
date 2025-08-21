'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

const categories = [
  {
    id: 'silk-saris',
    name: 'Silk Saris',
    description: 'Luxurious silk saris with intricate designs and premium quality',
    image: '/api/placeholder/400/300',
    productCount: 45,
    priceRange: '$200 - $800',
    featured: true
  },
  {
    id: 'cotton-saris',
    name: 'Cotton Saris',
    description: 'Comfortable and breathable cotton saris perfect for daily wear',
    image: '/api/placeholder/400/300',
    productCount: 32,
    priceRange: '$80 - $300',
    featured: false
  },
  {
    id: 'designer-saris',
    name: 'Designer Saris',
    description: 'Exclusive designer saris with contemporary styles and premium finishes',
    image: '/api/placeholder/400/300',
    productCount: 28,
    priceRange: '$300 - $1200',
    featured: true
  },
  {
    id: 'bridal-saris',
    name: 'Bridal Saris',
    description: 'Magnificent bridal saris for your special day with traditional craftsmanship',
    image: '/api/placeholder/400/300',
    productCount: 18,
    priceRange: '$500 - $2000',
    featured: true
  },
  {
    id: 'casual-saris',
    name: 'Casual Saris',
    description: 'Easy-to-wear casual saris for everyday comfort and style',
    image: '/api/placeholder/400/300',
    productCount: 25,
    priceRange: '$60 - $200',
    featured: false
  },
  {
    id: 'party-saris',
    name: 'Party Saris',
    description: 'Glamorous party saris with modern designs and elegant appeal',
    image: '/api/placeholder/400/300',
    productCount: 22,
    priceRange: '$150 - $600',
    featured: false
  }
]

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Sari Categories</h1>
          <p className="mt-2 text-gray-600">Explore our diverse collection of saris by category</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.filter(cat => cat.featured).map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Featured
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{category.productCount}</span> products
                    </div>
                    <div className="text-sm text-gray-500">
                      {category.priceRange}
                    </div>
                  </div>
                  
                  <Link
                    href={`/categories/${category.id}`}
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Explore Category
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Categories */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover"
                  />
                  {category.featured && (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{category.productCount}</span> products
                    </div>
                    <div className="text-sm text-gray-500">
                      {category.priceRange}
                    </div>
                  </div>
                  
                  <Link
                    href={`/categories/${category.id}`}
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Explore Category
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Benefits */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Our Categories?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600">Every sari is carefully selected and quality-checked before reaching you</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Wide Variety</h3>
              <p className="text-gray-600">From traditional to contemporary, find the perfect sari for every occasion</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Curation</h3>
              <p className="text-gray-600">Our fashion experts curate the best collections for you</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoriesPage
