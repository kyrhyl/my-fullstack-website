# E-Commerce Full-Stack Website

A complete MERN stack e-commerce application with user authentication, product management, and admin dashboard.

## 🚀 Features

- **User Authentication**: Register, login, logout with JWT tokens
- **Product Management**: CRUD operations for products with image upload
- **Admin Dashboard**: Complete admin panel with user management
- **Shopping Cart**: Add/remove items with persistent storage
- **Responsive Design**: Mobile-friendly UI with styled-components
- **Image Upload**: Product image management with multer
- **Role-Based Access**: Admin and user roles with permissions

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **React Context API** - State management
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
my-fullstack-website/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React contexts
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── uploads/           # Uploaded files
│   └── server.js          # Main server file
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd my-fullstack-website
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # In server directory, create .env file
   cd ../server
   echo "MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your-secret-key
   PORT=5000" > .env
   ```

4. **Start the servers**
   ```bash
   # Start backend server (from server directory)
   cd server
   npm start

   # Start frontend server (from client directory)
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 👤 Admin Access

**Default Admin Credentials:**
- Email: `admin@estore.com`
- Password: `admin123`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get user data

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/admin/products` - Create product (admin)
- `PUT /api/admin/products/:id` - Update product (admin)
- `DELETE /api/admin/products/:id` - Delete product (admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders

## 🔧 Development Scripts

### Server Scripts
```bash
npm start          # Start development server
npm run dev        # Start with nodemon
```

### Client Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## 📝 Environment Variables

Create a `.env` file in the server directory:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

## 🎯 Features in Detail

### User Authentication
- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes
- Role-based access control

### Product Management
- Image upload with multer
- Product categories
- Search and filtering
- Stock management

### Admin Dashboard
- User management
- Product CRUD operations
- Order management
- Analytics dashboard

### Shopping Cart
- Add/remove items
- Quantity management
- Persistent cart storage
- Total calculation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Ensure MongoDB is running
3. Verify all dependencies are installed
4. Check environment variables are set correctly

## 🎉 Acknowledgments

- React.js team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database
- All contributors and maintainers 