'use client'

import React, { useState, useEffect } from 'react'
import { 
  Save, 
  Package, 
  Image as ImageIcon,
  X,
  Plus,
  Loader2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { API_URLS, API_CONFIG } from '@/lib/config'

const AddProductPage = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [] as string[],
    tags: [] as string[],
    isActive: true,
    isFeatured: false
  })
  const [newTag, setNewTag] = useState('')
  const [newImage, setNewImage] = useState('')
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_URLS.CATEGORIES({ active: 'true', limit: '100' }))
        if (response.ok) {
          const data = await response.json()
          // Extract category names for the dropdown
          const categoryNames = data.categories.map((cat: any) => cat.name)
          setCategories(categoryNames)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !productData.tags.includes(newTag.trim())) {
      setProductData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setProductData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addImage = () => {
    if (newImage.trim() && !productData.images.includes(newImage.trim())) {
      setProductData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }))
      setNewImage('')
    }
  }

  const removeImage = (imageToRemove: string) => {
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter(image => image !== imageToRemove)
    }))
  }

  // Handle file uploads
  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return

    setUploadingImages(true)
    const token = localStorage.getItem('token')
    
    if (!token) {
      alert('Authentication required')
      setUploadingImages(false)
      return
    }

    // Track uploading files
    const fileNames = Array.from(files).map(file => file.name)
    setUploadingFiles(fileNames)
    setUploadProgress({})

    try {
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('images', file)
      })

      const response = await fetch(API_URLS.UPLOAD_IMAGES(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to upload images')
      }

      const result = await response.json()
      
      // Add uploaded image paths to product data
      const newImagePaths = result.files.map((file: any) => `${API_CONFIG.BASE_URL}${file.path}`)
      setProductData(prev => ({
        ...prev,
        images: [...prev.images, ...newImagePaths]
      }))

      alert(`${result.files.length} image(s) uploaded successfully!`)
    } catch (error: any) {
      console.error('Upload error:', error)
      alert(`Failed to upload images: ${error.message}`)
    } finally {
      setUploadingImages(false)
      setUploadingFiles([])
      setUploadProgress({})
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files)
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-purple-400', 'bg-purple-50')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-purple-400', 'bg-purple-50')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-purple-400', 'bg-purple-50')
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!productData.name.trim()) newErrors.name = 'Product name is required'
    if (!productData.description.trim()) newErrors.description = 'Product description is required'
    if (!productData.price) newErrors.price = 'Price is required'
    if (!productData.category) newErrors.category = 'Category is required'
    if (!productData.stock) newErrors.stock = 'Stock quantity is required'
    if (productData.images.length === 0) newErrors.images = 'At least one product image is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setIsSubmitting(true)
      
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(API_URLS.PRODUCTS(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...productData,
          price: parseFloat(productData.price),
          stock: parseInt(productData.stock)
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.errors) {
          const apiErrors: {[key: string]: string} = {}
          errorData.errors.forEach((err: any) => {
            apiErrors[err.path] = err.msg
          })
          setErrors(apiErrors)
          return
        }
        throw new Error(errorData.message || 'Failed to create product')
      }

      const result = await response.json()
      alert('Product created successfully!')
      router.push('/admin/products')
      
    } catch (error: any) {
      console.error('Error creating product:', error)
      alert(error.message || 'Failed to create product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (Object.keys(productData).some(key => productData[key as keyof typeof productData] !== '')) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.push('/admin/products')
      }
    } else {
      router.push('/admin/products')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600">Create a new product for your store</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Product
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2 text-purple-600" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={productData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Silk Saree - Blue"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={productData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={productData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="299.99"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                min="0"
                value={productData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="50"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={productData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe your product in detail..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ImageIcon className="h-5 w-5 mr-2 text-blue-600" />
              Product Images *
            </h3>
            <div className="flex items-center space-x-2">
              {uploadingImages && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Uploading...</span>
                </div>
              )}
              <span className={`text-sm px-2 py-1 rounded-full ${
                productData.images.length > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {productData.images.length} / 1 required
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Current Images Summary */}
            {productData.images.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {productData.images.length} image(s) uploaded
                    </span>
                  </div>
                  <span className="text-xs text-green-600">
                    {productData.images.length === 1 ? 'Image' : 'Images'} ready for product
                  </span>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploadingFiles.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    <span className="text-sm font-medium text-blue-800">
                      Uploading {uploadingFiles.length} image(s)...
                    </span>
                  </div>
                  {uploadingFiles.map((fileName, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-200 rounded-full flex items-center justify-center">
                        <Loader2 className="h-3 w-3 text-blue-600 animate-spin" />
                      </div>
                      <span className="text-sm text-blue-700 truncate">{fileName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Upload Section */}
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                uploadingImages 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="imageUpload"
                disabled={uploadingImages}
              />
              <label
                htmlFor="imageUpload"
                className={`cursor-pointer flex flex-col items-center space-y-2 ${
                  uploadingImages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ImageIcon className={`h-12 w-12 ${
                  uploadingImages ? 'text-blue-400' : 'text-gray-400'
                }`} />
                <div className="text-sm text-gray-600">
                  {uploadingImages ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-blue-600 font-medium">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-purple-600">Click to upload</span> or drag and drop
                      <br />
                      <span className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</span>
                    </>
                  )}
                </div>
              </label>
            </div>

            {/* URL Input Section */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Or enter image URL"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addImage}
                disabled={!newImage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            {/* Image Preview Grid */}
            {productData.images.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">Current Images ({productData.images.length})</h4>
                  <span className="text-xs text-gray-500">Hover to remove</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {productData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(image)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Image {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {errors.images && (
              <p className="text-sm text-red-600">{errors.images}</p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Tags</h3>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter a tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            {productData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {productData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Status</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={productData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active (Product will be visible to customers)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                checked={productData.isFeatured}
                onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                Featured (Product will appear in featured section)
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddProductPage
