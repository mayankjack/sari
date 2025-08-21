'use client'

import React from 'react'
import Link from 'next/link'

const categories = [
  {
    id: '1',
    name: 'Silk Saris',
    description: 'Luxurious silk saris for special occasions',
    image: '/api/placeholder/400/300',
    productCount: 150,
    color: 'from-purple-500 to-purple-700'
  },
  {
    id: '2',
    name: 'Cotton Saris',
    description: 'Comfortable cotton saris for daily wear',
    image: '/api/placeholder/400/300',
    productCount: 200,
    color: 'from-pink-500 to-pink-700'
  },
  {
    id: '3',
    name: 'Designer Saris',
    description: 'Exclusive designer collections',
    image: '/api/placeholder/400/300',
    productCount: 75,
    color: 'from-blue-500 to-blue-700'
  },
  {
    id: '4',
    name: 'Bridal Saris',
    description: 'Stunning bridal wear for your special day',
    image: '/api/placeholder/400/300',
    productCount: 50,
    color: 'from-red-500 to-red-700'
  },
  {
    id: '5',
    name: 'Casual Saris',
    description: 'Easy-to-wear casual saris',
    image: '/api/placeholder/400/300',
    productCount: 120,
    color: 'from-green-500 to-green-700'
  },
  {
    id: '6',
    name: 'Party Wear',
    description: 'Glamorous party and evening wear',
    image: '/api/placeholder/400/300',
    productCount: 80,
    color: 'from-yellow-500 to-yellow-700'
  }
]

const CategoryGrid = () => {
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
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group block"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                {/* Category Image */}
                <div className={`w-full h-48 bg-gradient-to-r ${category.color} flex items-center justify-center relative overflow-hidden`}>
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
                      {category.productCount} products
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
