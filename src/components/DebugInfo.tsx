'use client'

import React, { useState, useEffect } from 'react'
import { API_URLS, API_CONFIG } from '@/lib/config'
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

const DebugInfo = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [categoriesCount, setCategoriesCount] = useState<number | null>(null)
  const [productsCount, setProductsCount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const checkBackend = async () => {
    try {
      setBackendStatus('checking')
      setError(null)
      
      // Test backend connectivity
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/categories?limit=1`)
      
      if (response.ok) {
        setBackendStatus('online')
        
        // Get categories count
        const categoriesResponse = await fetch(API_URLS.CATEGORIES({ limit: '1000' }))
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategoriesCount(categoriesData.categories?.length || 0)
        }
        
        // Get products count
        const productsResponse = await fetch(API_URLS.PRODUCTS({ limit: '1000' }))
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          setProductsCount(productsData.products?.length || 0)
        }
      } else {
        setBackendStatus('offline')
        setError(`Backend responded with status: ${response.status}`)
      }
    } catch (error) {
      setBackendStatus('offline')
      setError(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  useEffect(() => {
    checkBackend()
  }, [])

  if (process.env.NODE_ENV === 'production') {
    return null // Don't show debug info in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Debug Info</h3>
        <button
          onClick={checkBackend}
          className="p-1 hover:bg-gray-100 rounded"
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Backend:</span>
          <div className="flex items-center">
            {backendStatus === 'checking' && <RefreshCw className="h-3 w-3 text-yellow-500 animate-spin mr-1" />}
            {backendStatus === 'online' && <CheckCircle className="h-3 w-3 text-green-500 mr-1" />}
            {backendStatus === 'offline' && <XCircle className="h-3 w-3 text-red-500 mr-1" />}
            <span className={`
              ${backendStatus === 'online' ? 'text-green-600' : ''}
              ${backendStatus === 'offline' ? 'text-red-600' : ''}
              ${backendStatus === 'checking' ? 'text-yellow-600' : ''}
              font-medium
            `}>
              {backendStatus === 'checking' ? 'Checking...' : backendStatus === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">API URL:</span>
          <span className="text-gray-800 font-mono text-xs truncate max-w-32">
            {API_CONFIG.BASE_URL}
          </span>
        </div>
        
        {categoriesCount !== null && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Categories:</span>
            <span className="text-gray-800 font-medium">{categoriesCount}</span>
          </div>
        )}
        
        {productsCount !== null && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Products:</span>
            <span className="text-gray-800 font-medium">{productsCount}</span>
          </div>
        )}
        
        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700">
            <div className="flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span className="text-xs">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DebugInfo
