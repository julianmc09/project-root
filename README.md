# E-Commerce Store

A complete e-commerce application built with Node.js, Express, PostgreSQL, and vanilla JavaScript.

## Features

- **User Authentication**: Registration and login system with JWT tokens
- **Product Management**: Complete CRUD operations for products
- **Shopping Cart**: Add/remove items, quantity management
- **Order Management**: Purchase history and order tracking
- **Responsive Design**: Modern UI with mobile-friendly layout
- **Database**: PostgreSQL with Supabase support
- **Security**: Password hashing, JWT authentication, route protection

## Project Structure

```
project-root/
├── backend/                 # Backend server
│   ├── config/             # Database configuration
│   ├── models/             # Data models (User, Product, Purchase)
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication middleware
│   ├── database/           # Database schema
│   └── server.js           # Main server file
├── frontend/               # Frontend application
│   ├── js/                 # JavaScript modules
│   ├── index.html          # Main HTML file
│   └── style.css           # Styling
├── package.json            # Dependencies and scripts
└── env.example             # Environment variables template
```

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Supabase account (optional, for cloud hosting)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your database credentials:
   ```
   DB_USER=your_postgres_username
   DB_HOST=your_postgres_host
   DB_NAME=your_database_name
   DB_PASSWORD=your_postgres_password
   DB_PORT=5432
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Set up database**
   - Create a PostgreSQL database
   - Run the schema from `backend/database/schema.sql`
   - Or use Supabase and run the schema in their SQL editor

5. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api

## Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email address
- `password`: Hashed password
- `full_name`: User's full name
- `address`: User's address
- `is_admin`: Admin privileges flag
- `created_at`, `updated_at`: Timestamps

### Products Table
- `id`: Primary key
- `name`: Product name
- `description`: Product description
- `price`: Product price
- `stock`: Available quantity
- `category`: Product category
- `image_url`: Product image URL
- `created_at`, `updated_at`: Timestamps

### Purchases Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `total_amount`: Total purchase amount
- `status`: Purchase status
- `created_at`, `updated_at`: Timestamps

### Purchase Items Table
- `id`: Primary key
- `purchase_id`: Foreign key to purchases
- `product_id`: Foreign key to products
- `quantity`: Item quantity
- `price`: Item price at time of purchase

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search/:term` - Search products
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Purchases
- `POST /api/purchases` - Create purchase
- `GET /api/purchases/:id` - Get purchase by ID
- `GET /api/purchases/user/me` - Get user purchases
- `GET /api/purchases` - Get all purchases (admin only)
- `PUT /api/purchases/:id/status` - Update purchase status (admin only)
- `DELETE /api/purchases/:id` - Delete purchase (admin only)

## Frontend Features

- **Authentication**: Login/register forms with tab switching
- **Product Display**: Grid layout with search and filtering
- **Shopping Cart**: Add/remove items, quantity management
- **User Profile**: View and edit profile information
- **Order History**: View purchase history and details
- **Responsive Design**: Mobile-friendly interface

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with middleware
- Input validation and sanitization
- SQL injection prevention with parameterized queries

## Development

- **Backend**: Node.js with Express framework
- **Database**: PostgreSQL with pg library
- **Frontend**: Vanilla JavaScript with modern ES6+ features
- **Styling**: CSS3 with responsive design
- **Authentication**: JWT tokens with bcrypt password hashing

## Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables
Make sure to set proper environment variables for production:
- Strong JWT secret
- Database connection details
- Proper CORS settings
- SSL configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the repository.