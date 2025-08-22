'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  FolderOpen,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { API_URLS } from '@/lib/config'

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentCategory?: {
    _id: string
    name: string
  }
  isActive: boolean
  sortOrder: number
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
}

interface CategoriesResponse {
  categories: Category[]
  totalPages: number
  currentPage: number
  total: number
}

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [parentFilter, setParentFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCategories, setTotalCategories] = useState(0)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [parentCategories, setParentCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentCategory: '',
    sortOrder: 0,
    isActive: true
  })
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      if (statusFilter !== 'all') {
        params.append('active', statusFilter === 'active' ? 'true' : 'false')
      }

      if (parentFilter !== 'all') {
        params.append('parent', parentFilter)
      }

      const response = await fetch(API_URLS.CATEGORIES() + '?' + params.toString())
      if (!response.ok) throw new Error('Failed to fetch categories')
      
      const data: CategoriesResponse = await response.json()
      setCategories(data.categories)
      setTotalPages(data.totalPages)
      setTotalCategories(data.total)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch parent categories for dropdown
  const fetchParentCategories = async () => {
    try {
      const response = await fetch(API_URLS.CATEGORIES({ limit: '100', active: 'true' }))
      if (response.ok) {
        const data: CategoriesResponse = await response.json()
        setParentCategories(data.categories)
      }
    } catch (error) {
      console.error('Error fetching parent categories:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
    refreshParentCategories()
  }, [currentPage, searchTerm, statusFilter, parentFilter])

  // Initial load
  useEffect(() => {
    refreshParentCategories()
    
    // Test backend connectivity
    const testBackend = async () => {
      try {
        console.log('Testing backend connectivity...')
        const response = await fetch(API_URLS.CATEGORIES({ limit: '1' }))
        console.log('Backend test response status:', response.status)
        if (response.ok) {
          console.log('✅ Backend is accessible')
        } else {
          console.log('❌ Backend returned error status:', response.status)
        }
      } catch (error) {
        console.error('❌ Backend connectivity test failed:', error)
        alert('Warning: Cannot connect to backend server. Make sure it\'s running on port 5000.')
      }
    }
    
    testBackend()
  }, [])

  // Refresh parent categories when needed
  const refreshParentCategories = () => {
    fetchParentCategories()
  }

  // Reset form when editing category changes
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        description: editingCategory.description || '',
        parentCategory: editingCategory.parentCategory?._id || '',
        sortOrder: editingCategory.sortOrder,
        isActive: editingCategory.isActive
      })
      setFormErrors({})
    } else {
      setFormData({
        name: '',
        description: '',
        parentCategory: '',
        sortOrder: 0,
        isActive: true
      })
      setFormErrors({})
    }
  }, [editingCategory])

  // Handle form input changes
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Validate form
  const validateForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Category name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Category name must be at least 2 characters'
    }
    
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters'
    }
    
    if (formData.sortOrder < 0) {
      errors.sortOrder = 'Sort order must be 0 or greater'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Create new category
  const createCategory = async () => {
    if (!validateForm()) return
    
    try {
      setIsSubmitting(true)
      
      const token = localStorage.getItem('token')
      console.log('Token found:', !!token)
      
      if (!token) {
        throw new Error('Authentication required')
      }

      console.log('Creating category with data:', formData)
      console.log('Backend URL:', API_URLS.CATEGORIES_BASE())

      const requestBody = {
        ...formData,
        parentCategory: formData.parentCategory || null
      }
      console.log('Request body:', requestBody)

      const response = await fetch(API_URLS.CATEGORIES_BASE(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Response status:', response.status)
      console.log('Response status text:', response.statusText)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response text:', errorText)
        console.error('Response URL:', response.url)
        
        let errorData
        try {
          errorData = JSON.parse(errorText)
          console.error('Parsed error data:', errorData)
        } catch (e) {
          console.error('Failed to parse error response as JSON:', e)
          errorData = { message: errorText || 'Failed to create category' }
        }
        
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const newCategory = await response.json()
      console.log('Created category successfully:', newCategory)
      
      // Add to local state
      setCategories(prev => [newCategory, ...prev])
      setTotalCategories(prev => prev + 1)
      
      // Refresh parent categories list
      fetchParentCategories()
      
      // Close modal and reset form
      setShowCreateModal(false)
      setFormData({
        name: '',
        description: '',
        parentCategory: '',
        sortOrder: 0,
        isActive: true
      })
      
      alert('Category created successfully!')
      
    } catch (error: any) {
      console.error('Error creating category:', error)
      console.error('Error stack:', error.stack)
      alert(`Failed to create category: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update existing category
  const updateCategory = async () => {
    if (!editingCategory || !validateForm()) return
    
    try {
      setIsSubmitting(true)
      
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${API_URLS.CATEGORIES_BASE()}/${editingCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          parentCategory: formData.parentCategory || null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update category')
      }

      const updatedCategory = await response.json()
      
      // Update local state
      setCategories(prev => prev.map(cat => 
        cat._id === editingCategory._id ? updatedCategory : cat
      ))
      
      // Refresh parent categories list
      fetchParentCategories()
      
      // Close modal and reset
      setEditingCategory(null)
      setFormData({
        name: '',
        description: '',
        parentCategory: '',
        sortOrder: 0,
        isActive: true
      })
      
      alert('Category updated successfully!')
      
    } catch (error: any) {
      console.error('Error updating category:', error)
      alert(error.message || 'Failed to update category')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCategory) {
      updateCategory()
    } else {
      createCategory()
    }
  }

  // Toggle category active status
  const toggleCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      setUpdatingStatus(categoryId)
      
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${API_URLS.CATEGORIES_BASE()}/${categoryId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to update category status')
      
      // Update local state
      setCategories(prev => prev.map(cat => 
        cat._id === categoryId 
          ? { ...cat, isActive: !currentStatus }
          : cat
      ))
      
      // Refresh parent categories list
      refreshParentCategories()
      
    } catch (error: any) {
      console.error('Error updating category status:', error)
      alert(error.message || 'Failed to update category status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  // Delete category
  const deleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return
    }

    try {
      setDeletingCategory(categoryId)
      
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${API_URLS.CATEGORIES_BASE()}/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete category')
      }
      
      // Remove from local state
      setCategories(prev => prev.filter(cat => cat._id !== categoryId))
      setTotalCategories(prev => prev - 1)
      
      // Refresh parent categories list
      refreshParentCategories()
      
    } catch (error: any) {
      console.error('Error deleting category:', error)
      alert(error.message || 'Failed to delete category')
    } finally {
      setDeletingCategory(null)
    }
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchCategories()
    refreshParentCategories()
  }

  // Handle filters
  const handleFilterChange = () => {
    setCurrentPage(1)
    fetchCategories()
    refreshParentCategories()
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
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600">Manage your product categories and subcategories</p>
        </div>
        
        <button
          onClick={() => {
            setShowCreateModal(true)
            refreshParentCategories()
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{totalCategories}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter(cat => cat.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FolderOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Parent Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter(cat => !cat.parentCategory).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FolderOpen className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Subcategories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter(cat => cat.parentCategory).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              handleFilterChange()
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
          
          <select
            value={parentFilter}
            onChange={(e) => {
              setParentFilter(e.target.value)
              handleFilterChange()
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="">Parent Categories Only</option>
            {parentCategories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </form>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Categories ({totalCategories})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sort Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-semibold text-sm">
                          {category.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.slug}</div>
                        {category.description && (
                          <div className="text-xs text-gray-400 truncate max-w-xs">
                            {category.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.parentCategory ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {category.parentCategory.name}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">—</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.sortOrder}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => toggleCategoryStatus(category._id, category.isActive)}
                        disabled={updatingStatus === category._id}
                        className={`p-2 rounded-md transition-colors ${
                          category.isActive
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={category.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {updatingStatus === category._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : category.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          setEditingCategory(category)
                          refreshParentCategories()
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => deleteCategory(category._id)}
                        disabled={deletingCategory === category._id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        {deletingCategory === category._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Category Modal */}
      {(showCreateModal || editingCategory) && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
              aria-hidden="true"
              onClick={() => {
                setShowCreateModal(false)
                setEditingCategory(null)
                refreshParentCategories()
              }}
            ></div>
            
            {/* Modal */}
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-[10000]">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      {editingCategory ? 'Edit Category' : 'Create New Category'}
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4" id="categoryForm">
                      <div>
                        <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                          Category Name *
                        </label>
                        <input
                          id="categoryName"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter category name"
                          autoFocus
                        />
                        {formErrors.name && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id="categoryDescription"
                          name="description"
                          value={formData.description}
                          onChange={(e) => handleFormChange('description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter category description"
                        />
                        {formErrors.description && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="parentCategory" className="block text-sm font-medium text-gray-700 mb-1">
                          Parent Category
                        </label>
                        <select
                          id="parentCategory"
                          name="parentCategory"
                          value={formData.parentCategory}
                          onChange={(e) => handleFormChange('parentCategory', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">No Parent (Main Category)</option>
                          {parentCategories
                            .filter(cat => !editingCategory || cat._id !== editingCategory._id)
                            .map(cat => (
                              <option 
                                key={cat._id} 
                                value={cat._id}
                              >
                                {cat.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                          Sort Order
                        </label>
                        <input
                          id="sortOrder"
                          type="number"
                          name="sortOrder"
                          value={formData.sortOrder}
                          onChange={(e) => handleFormChange('sortOrder', parseInt(e.target.value, 10))}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        {formErrors.sortOrder && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.sortOrder}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="isActive"
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={(e) => handleFormChange('isActive', e.target.checked)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                          Active Category
                        </label>
                      </div>
                      
                      {/* Form Submit Button */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              {editingCategory ? 'Updating...' : 'Creating...'}
                            </>
                          ) : (
                            editingCategory ? 'Update Category' : 'Create Category'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingCategory(null)
                    refreshParentCategories()
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategoriesPage
