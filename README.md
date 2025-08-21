# Sari Shop eCommerce Platform

A complete eCommerce website with an admin dashboard built using Node.js/Express.js backend and React/Next.js frontend.

## Features

### 🛍️ Customer Features
- **Product Browsing**: Browse products by category, search, and filters
- **Shopping Cart**: Add/remove items, update quantities
- **User Authentication**: Register, login, and profile management
- **Order Management**: Place orders, track status, view history
- **Responsive Design**: Mobile-first design for all devices

### 🎛️ Admin Features
- **Product Management**: Add, edit, delete products with images
- **Order Management**: Process orders, update status, track shipments
- **Customer Management**: View customer details, order history
- **Shop Customization**: Change shop name, logo, theme colors
- **Analytics Dashboard**: Sales statistics, revenue tracking
- **File Upload**: Manage product images and shop assets

### 🏗️ Technical Features
- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication with role-based access
- **File Handling**: Multer for image uploads
- **Frontend**: React with Next.js 15 and TypeScript
- **Styling**: Tailwind CSS with responsive design
- **State Management**: React Context API and Zustand

## Project Structure

```
sari-shop-ecommerce/
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   ├── uploads/            # File uploads directory
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── config.env          # Environment variables
├── src/                    # React frontend
│   ├── app/                # Next.js app directory
│   ├── components/         # Reusable components
│   ├── contexts/           # React contexts
│   ├── lib/                # Utility functions
│   └── styles/             # CSS styles
├── public/                 # Static assets
└── package.json            # Frontend dependencies
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud)
- Git

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd sari-shop-ecommerce
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Install frontend dependencies
```bash
cd ..
npm install
```

### 4. Environment Setup

Create a `.env` file in the backend directory:
```bash
cd backend
cp config.env .env
```

Edit `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sari-shop
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 5. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

### 6. Run the application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Initial Setup

### 1. Create Admin User
Visit `http://localhost:5000/api/auth/admin-setup` and create your first admin user:

```json
{
  "username": "admin",
  "email": "admin@sarishop.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User"
}
```

### 2. Access Admin Dashboard
- Login with your admin credentials
- Navigate to `/admin` to access the dashboard

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-setup` - Create first admin user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get orders
- `PUT /api/orders/:id/status` - Update order status (admin)

### Shop Settings
- `GET /api/shop` - Get shop settings
- `PUT /api/shop` - Update shop settings (admin)
- `PUT /api/shop/logo` - Update shop logo (admin)

### File Upload
- `POST /api/upload/image` - Upload single image (admin)
- `POST /api/upload/images` - Upload multiple images (admin)

## Usage

### For Customers
1. Browse products on the homepage
2. Register/login to your account
3. Add items to cart
4. Complete checkout process
5. Track your orders

### For Admins
1. Access admin dashboard at `/admin`
2. Manage products, orders, and customers
3. Customize shop settings and branding
4. Monitor sales and analytics
5. Handle customer inquiries

## Customization

### Shop Branding
- Update shop name, logo, and description
- Customize theme colors
- Set currency and tax rates
- Configure shipping options

### Product Management
- Add product categories and subcategories
- Set pricing and inventory levels
- Upload product images
- Manage product reviews

## Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Set up reverse proxy (Nginx)
4. Configure SSL certificates

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Set environment variables for API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Advanced inventory management
- [ ] Customer loyalty program
- [ ] Social media integration

---

**Built with ❤️ for the Sari Shop community**
