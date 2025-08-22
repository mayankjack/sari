'use client'

import React, { useState, useEffect } from 'react'
import { 
  Save, 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  CreditCard,
  Truck,
  Settings,
  Image as ImageIcon,
  Loader2
} from 'lucide-react'

interface ShopData {
  _id?: string
  name: string
  description: string
  contact: {
    email: string
    phone: string
    address: string
    website: string
  }
  settings: {
    currency: string
    taxRate: number
    shippingCost: number
    freeShippingThreshold: number
    maintenanceMode: boolean
  }
  logo?: string
  banner?: string
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
  }
}

const AdminShopPage = () => {
  const [shopData, setShopData] = useState<ShopData>({
    name: '',
    description: '',
    contact: {
      email: '',
      phone: '',
      address: '',
      website: ''
    },
    settings: {
      currency: 'INR',
      taxRate: 18,
      shippingCost: 99,
      freeShippingThreshold: 999,
      maintenanceMode: false
    },
    logo: '',
    banner: '',
    theme: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#EC4899',
      accentColor: '#F59E0B'
    }
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch shop data from API
  const fetchShopData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/shop')
      if (response.ok) {
        const data = await response.json()
        setShopData(data)
      }
    } catch (error) {
      console.error('Error fetching shop data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShopData()
  }, [])

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [section, key] = field.split('.')
      setShopData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof typeof prev] as any),
          [key]: value
        }
      }))
    } else {
      setShopData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch('/api/shop', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shopData)
      })

      if (!response.ok) {
        throw new Error('Failed to save shop settings')
      }

      const result = await response.json()
      alert('Shop settings saved successfully!')
      setIsEditing(false)
      
    } catch (error: any) {
      console.error('Error saving shop settings:', error)
      alert(error.message || 'Failed to save shop settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    fetchShopData() // Reset to original data
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop Settings</h1>
          <p className="text-gray-600">Manage your store configuration and preferences</p>
        </div>
        
        <div className="flex space-x-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Edit Settings
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Shop Information */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Store className="h-5 w-5 mr-2 text-purple-600" />
            Basic Information
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Name
              </label>
              <input
                type="text"
                value={shopData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={shopData.contact.website}
                onChange={(e) => handleInputChange('contact.website', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Description
            </label>
            <textarea
              value={shopData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-600" />
            Contact Information
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={shopData.contact.email}
                onChange={(e) => handleInputChange('contact.email', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={shopData.contact.phone}
                onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={shopData.contact.address}
              onChange={(e) => handleInputChange('contact.address', e.target.value)}
              disabled={!isEditing}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Business Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-green-600" />
            Business Settings
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={shopData.settings.currency}
                onChange={(e) => handleInputChange('settings.currency', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={shopData.settings.taxRate}
                onChange={(e) => handleInputChange('settings.taxRate', parseFloat(e.target.value))}
                disabled={!isEditing}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Cost (₹)
              </label>
              <input
                type="number"
                value={shopData.settings.shippingCost}
                onChange={(e) => handleInputChange('settings.shippingCost', parseFloat(e.target.value))}
                disabled={!isEditing}
                min="0"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Free Shipping Threshold (₹)
            </label>
            <input
              type="number"
              value={shopData.settings.freeShippingThreshold}
              onChange={(e) => handleInputChange('settings.freeShippingThreshold', parseFloat(e.target.value))}
              disabled={!isEditing}
              min="0"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
            />
            <p className="mt-1 text-sm text-gray-500">
              Orders above this amount qualify for free shipping
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
              <p className="text-sm text-gray-500">Put the shop in maintenance mode</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={shopData.settings.maintenanceMode}
                onChange={(e) => handleInputChange('settings.maintenanceMode', e.target.checked)}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-orange-600" />
            Theme Colors
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={shopData.theme.primaryColor}
                  onChange={(e) => handleInputChange('theme.primaryColor', e.target.value)}
                  disabled={!isEditing}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
                />
                <input
                  type="text"
                  value={shopData.theme.primaryColor}
                  onChange={(e) => handleInputChange('theme.primaryColor', e.target.value)}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={shopData.theme.secondaryColor}
                  onChange={(e) => handleInputChange('theme.secondaryColor', e.target.value)}
                  disabled={!isEditing}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
                />
                <input
                  type="text"
                  value={shopData.theme.secondaryColor}
                  onChange={(e) => handleInputChange('theme.secondaryColor', e.target.value)}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accent Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={shopData.theme.accentColor}
                  onChange={(e) => handleInputChange('theme.accentColor', e.target.value)}
                  disabled={!isEditing}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
                />
                <input
                  type="text"
                  value={shopData.theme.accentColor}
                  onChange={(e) => handleInputChange('theme.accentColor', e.target.value)}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <ImageIcon className="h-5 w-5 mr-2 text-orange-600" />
            Media & Branding
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                value={shopData.logo || ''}
                onChange={(e) => handleInputChange('logo', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
              />
              {shopData.logo && (
                <div className="mt-2">
                  <img 
                    src={shopData.logo} 
                    alt="Shop Logo" 
                    className="h-16 w-16 object-contain border border-gray-200 rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner URL
              </label>
              <input
                type="url"
                value={shopData.banner || ''}
                onChange={(e) => handleInputChange('banner', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
              />
              {shopData.banner && (
                <div className="mt-2">
                  <img 
                    src={shopData.banner} 
                    alt="Shop Banner" 
                    className="h-16 w-32 object-cover border border-gray-200 rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Status */}
      {isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Settings className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                You have unsaved changes. Click "Save Changes" to apply your modifications.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminShopPage
