'use client'

import React, { useState } from 'react'
import { API_URLS, API_CONFIG } from '@/lib/config'

const ApiTest = () => {
  const [testResults, setTestResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    setTestResults({})

    try {
      console.log('🧪 Starting API tests...')
      console.log('🌐 API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL)
      console.log('🔗 API_URLS.CATEGORIES():', API_URLS.CATEGORIES())
      console.log('🔗 API_URLS.PRODUCTS():', API_URLS.PRODUCTS())

      // Test 1: Direct backend connection
      console.log('🧪 Test 1: Direct backend connection')
      const directResponse = await fetch(`${API_CONFIG.BASE_URL}/api/categories?limit=1`)
      console.log('📡 Direct response status:', directResponse.status)
      console.log('📡 Direct response ok:', directResponse.ok)

      // Test 2: Categories API
      console.log('🧪 Test 2: Categories API')
      const categoriesResponse = await fetch(API_URLS.CATEGORIES({ limit: '5' }))
      console.log('📡 Categories response status:', categoriesResponse.status)
      console.log('📡 Categories response ok:', categoriesResponse.ok)

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        console.log('📂 Categories data:', categoriesData)
        setTestResults(prev => ({ ...prev, categories: categoriesData }))
      }

      // Test 3: Products API
      console.log('🧪 Test 3: Products API')
      const productsResponse = await fetch(API_URLS.PRODUCTS({ limit: '5' }))
      console.log('📡 Products response status:', productsResponse.status)
      console.log('📡 Products response ok:', productsResponse.ok)

      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        console.log('📦 Products data:', productsData)
        setTestResults(prev => ({ ...prev, products: productsData }))
      }

      // Test 4: Featured Products
      console.log('🧪 Test 4: Featured Products')
      const featuredResponse = await fetch(API_URLS.PRODUCTS({ 
        limit: '5', 
        featured: 'true',
        active: 'true'
      }))
      console.log('📡 Featured response status:', featuredResponse.status)
      console.log('📡 Featured response ok:', featuredResponse.ok)

      if (featuredResponse.ok) {
        const featuredData = await featuredResponse.json()
        console.log('⭐ Featured data:', featuredData)
        setTestResults(prev => ({ ...prev, featured: featuredData }))
      }

    } catch (error) {
      console.error('❌ Test error:', error)
      setTestResults(prev => ({ ...prev, error: error instanceof Error ? error.message : 'Unknown error' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed top-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">API Test</h3>
        <button
          onClick={runTests}
          disabled={loading}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Run Tests'}
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Base URL:</span>
          <span className="text-gray-800 font-mono text-xs truncate max-w-32">
            {API_CONFIG.BASE_URL}
          </span>
        </div>
        
        {testResults.categories && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Categories:</span>
            <span className="text-gray-800 font-medium">
              {testResults.categories.categories?.length || 0}
            </span>
          </div>
        )}
        
        {testResults.products && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Products:</span>
            <span className="text-gray-800 font-medium">
              {testResults.products.products?.length || 0}
            </span>
          </div>
        )}
        
        {testResults.featured && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Featured:</span>
            <span className="text-gray-800 font-medium">
              {testResults.featured.products?.length || 0}
            </span>
          </div>
        )}
        
        {testResults.error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700">
            <span className="text-xs">Error: {testResults.error}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApiTest
