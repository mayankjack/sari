# API Configuration Guide

## Overview
This project now uses centralized API configuration to make it easy to switch between different backend environments.

## Configuration File
The main configuration is in `src/lib/config.ts`

## Environment Variables
Create a `.env.local` file in your project root with:

```bash
# For local development
NEXT_PUBLIC_API_URL=http://localhost:5000

# For production (when deploying)
NEXT_PUBLIC_API_URL=https://your-backend-domain.com

# For staging
NEXT_PUBLIC_API_URL=https://staging.your-backend-domain.com
```

## How to Use

### 1. Import the configuration
```typescript
import { API_URLS, API_CONFIG } from '@/lib/config'
```

### 2. Use pre-built API URLs
```typescript
// Get categories
const response = await fetch(API_URLS.CATEGORIES({ active: 'true', limit: '100' }))

// Get products
const response = await fetch(API_URLS.PRODUCTS({ page: '1', limit: '20' }))

// Upload images
const response = await fetch(API_URLS.UPLOAD_IMAGES(), {
  method: 'POST',
  body: formData
})

// Create product
const response = await fetch(API_URLS.PRODUCTS(), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(productData)
})
```

### 3. Use the base URL for custom endpoints
```typescript
const customUrl = `${API_CONFIG.BASE_URL}/api/custom-endpoint`
```

## Benefits

1. **Single Point of Change**: Update API URL in one place
2. **Environment Support**: Easy switching between dev/staging/prod
3. **Type Safety**: TypeScript support for all API calls
4. **Consistency**: All API calls use the same base URL
5. **Maintainability**: Easy to update and maintain

## Deployment Steps

1. **Update Environment Variable**:
   ```bash
   NEXT_PUBLIC_API_URL=https://your-production-backend.com
   ```

2. **Rebuild and Deploy**:
   ```bash
   npm run build
   npm run start
   ```

3. **Verify**: Check that all API calls are working with the new URL

## Current API Endpoints

- **Categories**: `/api/categories`
- **Products**: `/api/products`
- **Upload**: `/api/upload`
- **Auth**: `/api/auth`
- **Orders**: `/api/orders`
- **Users**: `/api/users`
- **Shop**: `/api/shop`
- **Payments**: `/api/payments`

## Notes

- The `NEXT_PUBLIC_` prefix is required for client-side access
- Changes to environment variables require a restart of the development server
- For production, set the environment variable in your hosting platform
