'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, Star, ShoppingCart, Heart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import toast from 'react-hot-toast'

// Mock data for now - will be replaced with API calls
const mockProducts = [
  {
    id: '1',
    name: 'Silk Banarasi Sari',
    price: 299.99,
    originalPrice: 399.99,
    category: 'Silk Saris',
    rating: 4.8,
    reviews: 124,
    image: '/api/placeholder/300/400',
    description: 'Exquisite handcrafted Banarasi silk sari with intricate zari work',
    inStock: true
  },
  {
    id: '2',
    name: 'Cotton Handloom Sari',
    price: 149.99,
    originalPrice: 199.99,
    category: 'Cotton Saris',
    rating: 4.6,
    reviews: 89,
    image: '/api/placeholder/300/400',
    description: 'Comfortable and breathable cotton handloom sari',
    inStock: true
  },
  {
    id: '3',
    name: 'Designer Georgette Sari',
    price: 399.99,
    originalPrice: 499.99,
    category: 'Designer Saris',
    rating: 4.9,
    reviews: 156,
    image: '/api/placeholder/300/400',
    description: 'Elegant designer georgette sari perfect for special occasions',
    inStock: true
  },
  {
    id: '4',
    name: 'Traditional Kanjeevaram',
    price: 599.99,
    originalPrice: 699.99,
    category: 'Bridal Saris',
    rating: 4.7,
    reviews: 67,
    image: '/api/placeholder/300/400',
    description: 'Magnificent Kanjeevaram sari for your special day',
    inStock: false
  }
]

const ProductsPage = () => {
  const [products, setProducts] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState('grid')
  
  const { addItem } = useCart()

  const categories = ['all', 'Silk Saris', 'Cotton Saris', 'Designer Saris', 'Bridal Saris', 'Casual Saris']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return b.id.localeCompare(a.id)
      default:
        return 0
    }
  })

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    })
    toast.success(`${product.name} added to cart!`)
  }

  const handleWishlist = (productId: string) => {
    toast.success('Added to wishlist!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Sari Collection</h1>
          <p className="mt-2 text-gray-600">Discover our exclusive collection of handcrafted saris</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search saris..."
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

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-medium">{sortedProducts.length}</span> of{' '}
            <span className="font-medium">{products.length}</span> products
          </p>
        </div>

        {/* Products Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-80 object-cover rounded-t-lg"
                  />
                  {!product.inStock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Out of Stock
                    </div>
                  )}
                  <button
                    onClick={() => handleWishlist(product.id)}
                    className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                  >
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center mb-2">
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
                    <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{product.category}</span>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-gray-900">${product.price}</span>
                      <span className="text-sm text-gray-500">{product.category}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button
                      onClick={() => handleWishlist(product.id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
