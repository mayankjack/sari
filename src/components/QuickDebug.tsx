'use client'

import React, { useState } from 'react'

const QuickDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>({})

  const runQuickTest = async () => {
    try {
      console.log('🔍 Quick debug test starting...')
      
      // Test 1: Check if we can access localStorage
      const token = localStorage.getItem('token')
      console.log('🔑 Token exists:', !!token)
      
      // Test 2: Check environment variables
      console.log('🌐 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
      console.log('🌐 NODE_ENV:', process.env.NODE_ENV)
      
      // Test 3: Try to fetch from localhost:5000 directly
      console.log('📡 Testing direct connection to localhost:5000...')
      const directResponse = await fetch('http://localhost:5000/api/categories?limit=1')
      console.log('📡 Direct response status:', directResponse.status)
      
      if (directResponse.ok) {
        const data = await directResponse.json()
        console.log('📂 Direct response data:', data)
        setDebugInfo({ direct: 'success', status: directResponse.status, data })
      } else {
        setDebugInfo({ direct: 'failed', status: directResponse.status })
      }
      
    } catch (error) {
      console.error('❌ Quick test error:', error)
      setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Quick Debug</h3>
        <button
          onClick={runQuickTest}
          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
        >
          Test Connection
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Environment:</span>
          <span className="text-gray-800 font-mono">
            {process.env.NODE_ENV || 'unknown'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">API URL:</span>
          <span className="text-gray-800 font-mono text-xs truncate max-w-32">
            {process.env.NEXT_PUBLIC_API_URL || 'not set'}
          </span>
        </div>
        
        {debugInfo.direct && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Direct Test:</span>
            <span className={`font-medium ${
              debugInfo.direct === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {debugInfo.direct === 'success' ? '✅ Success' : '❌ Failed'}
            </span>
          </div>
        )}
        
        {debugInfo.status && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="text-gray-800 font-medium">
              {debugInfo.status}
            </span>
          </div>
        )}
        
        {debugInfo.error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700">
            <span className="text-xs">Error: {debugInfo.error}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuickDebug
