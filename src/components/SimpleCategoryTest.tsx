'use client'

import React, { useState } from 'react'
import { API_URLS, API_CONFIG } from '@/lib/config'

const SimpleCategoryTest = () => {
  const [testResult, setTestResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testCreateCategory = async () => {
    setLoading(true)
    setTestResult('')
    
    try {
      console.log('🧪 Testing category creation...')
      console.log('🌐 Base URL:', API_CONFIG.BASE_URL)
      console.log('🔗 Categories base:', API_URLS.CATEGORIES_BASE())
      console.log('🔗 Categories with params:', API_URLS.CATEGORIES({ limit: '5' }))
      
      // Test 1: Simple GET request
      const getResponse = await fetch(API_URLS.CATEGORIES({ limit: '1' }))
      console.log('📡 GET response status:', getResponse.status)
      
      if (getResponse.ok) {
        const data = await getResponse.json()
        console.log('📂 GET data:', data)
        setTestResult(`✅ GET successful: ${data.categories?.length || 0} categories found`)
      } else {
        setTestResult(`❌ GET failed: ${getResponse.status}`)
      }
      
    } catch (error) {
      console.error('❌ Test error:', error)
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Simple API Test</h3>
        <button
          onClick={testCreateCategory}
          disabled={loading}
          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API'}
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Base URL:</span>
          <span className="text-gray-800 font-mono text-xs truncate max-w-32">
            {API_CONFIG.BASE_URL}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Categories Base:</span>
          <span className="text-gray-800 font-mono text-xs truncate max-w-32">
            {API_URLS.CATEGORIES_BASE()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Categories with Params:</span>
          <span className="text-gray-800 font-mono text-xs truncate max-w-32">
            {API_URLS.CATEGORIES({ limit: '5' })}
          </span>
        </div>
        
        {testResult && (
          <div className={`mt-2 p-2 rounded text-xs ${
            testResult.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {testResult}
          </div>
        )}
      </div>
    </div>
  )
}

export default SimpleCategoryTest
