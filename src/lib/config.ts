// API Configuration
export const API_CONFIG = {
  // Backend API base URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  
  // API endpoints
  ENDPOINTS: {
    CATEGORIES: '/api/categories',
    PRODUCTS: '/api/products',
    UPLOAD: '/api/upload',
    AUTH: '/api/auth',
    ORDERS: '/api/orders',
    USERS: '/api/users',
    SHOP: '/api/shop',
    PAYMENTS: '/api/payments'
  }
}

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`
  
  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }
  
  return url
}

// Pre-built API URLs for common endpoints
export const API_URLS = {
  CATEGORIES: (params?: Record<string, string>) => buildApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES, params),
  CATEGORIES_BASE: () => buildApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES),
  PRODUCTS: (params?: Record<string, string>) => buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS, params),
  PRODUCTS_BASE: () => buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS),
  UPLOAD_IMAGES: () => buildApiUrl(`${API_CONFIG.ENDPOINTS.UPLOAD}/images`),
  UPLOAD_IMAGE: () => buildApiUrl(`${API_CONFIG.ENDPOINTS.UPLOAD}/image`),
  AUTH_LOGIN: () => buildApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/login`),
  AUTH_REGISTER: () => buildApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/register`),
  AUTH_VERIFY: () => buildApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/verify`),
  ORDERS: (params?: Record<string, string>) => buildApiUrl(API_CONFIG.ENDPOINTS.ORDERS, params),
  USERS: (params?: Record<string, string>) => buildApiUrl(API_CONFIG.ENDPOINTS.USERS, params),
  SHOP: (params?: Record<string, string>) => buildApiUrl(API_CONFIG.ENDPOINTS.SHOP, params),
  PAYMENTS: (params?: Record<string, string>) => buildApiUrl(API_CONFIG.ENDPOINTS.PAYMENTS, params)
}
