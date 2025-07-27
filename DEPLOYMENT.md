# 🚀 Deployment Guide - MERN Stack E-commerce Website

This guide will help you deploy your e-commerce website online using modern, cost-effective platforms.

## 📋 Prerequisites

1. **GitHub Repository** ✅ (Already done)
2. **MongoDB Atlas Account** (Free tier available)
3. **Vercel Account** (Free tier)
4. **Railway Account** (Free tier)

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
- Go to [mongodb.com/atlas](https://mongodb.com/atlas)
- Sign up for free account
- Create a new cluster (M0 Free tier)

### 1.2 Configure Database
```bash
# Create database user
Username: ecommerce_user
Password: your_secure_password

# Whitelist IP addresses
Add: 0.0.0.0/0 (for all IPs) or specific IPs
```

### 1.3 Get Connection String
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string:
```
mongodb+srv://ecommerce_user:your_password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

## 🌐 Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub
- Create new project

### 2.2 Connect Repository
- Click "Deploy from GitHub repo"
- Select your repository: `kyrhyl/my-fullstack-website`
- Railway will auto-detect Node.js

### 2.3 Configure Environment Variables
In Railway dashboard, add these variables:

```env
MONGODB_URI=mongodb+srv://ecommerce_user:your_password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=production
```

### 2.4 Deploy Backend
- Railway will automatically deploy when you push to GitHub
- Get your backend URL: `https://your-app-name.railway.app`

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub
- Import your repository

### 3.2 Configure Frontend
Create `vercel.json` in the root directory:

```json
{
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/build",
  "installCommand": "cd client && npm install",
  "framework": "create-react-app"
}
```

### 3.3 Set Environment Variables
In Vercel dashboard, add:

```env
REACT_APP_API_URL=https://your-backend-url.railway.app
```

### 3.4 Update API Base URL
Update `client/src/context/AuthContext.js`:

```javascript
// Change this line:
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

### 3.5 Deploy Frontend
- Vercel will auto-deploy when you push to GitHub
- Get your frontend URL: `https://your-app-name.vercel.app`

## 🔧 Step 4: Update Configuration

### 4.1 Update CORS in Backend
In `server/server.js`, update the CORS origin:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app']
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
```

### 4.2 Update Image URLs
In `client/src/utils/imageUtils.js`:

```javascript
export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return `${baseUrl}/uploads/${imagePath}`;
};
```

## 🚀 Step 5: Deploy to Production

### 5.1 Push Changes to GitHub
```bash
git add .
git commit -m "Configure for production deployment"
git push
```

### 5.2 Monitor Deployment
- **Railway**: Check deployment logs in dashboard
- **Vercel**: Check deployment status in dashboard
- **MongoDB**: Verify database connection

### 5.3 Test Your Live Website
- Frontend: `https://your-app-name.vercel.app`
- Backend API: `https://your-app-name.railway.app`

## 🔍 Step 6: Verify Deployment

### 6.1 Test API Endpoints
```bash
# Health check
curl https://your-backend-url.railway.app/api/health

# Products
curl https://your-backend-url.railway.app/api/products
```

### 6.2 Test Frontend Features
- ✅ User registration/login
- ✅ Product browsing
- ✅ Shopping cart
- ✅ Admin dashboard
- ✅ Image uploads

## 🛠️ Alternative Deployment Options

### Option A: Render (Full Stack)
- Go to [render.com](https://render.com)
- Deploy both frontend and backend
- Free tier available

### Option B: Heroku
- Go to [heroku.com](https://heroku.com)
- Deploy backend to Heroku
- Deploy frontend to Vercel

### Option C: DigitalOcean App Platform
- Go to [digitalocean.com](https://digitalocean.com)
- Deploy both services
- More control but paid

## 📊 Monitoring & Maintenance

### 1. Set Up Monitoring
- **Railway**: Built-in logs and metrics
- **Vercel**: Analytics and performance monitoring
- **MongoDB Atlas**: Database monitoring

### 2. Environment Variables
Keep these secure and never commit to GitHub:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

### 3. Regular Updates
```bash
# Update dependencies
npm update

# Security audits
npm audit

# Push updates
git add .
git commit -m "Update dependencies"
git push
```

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Check CORS configuration in backend
   - Verify frontend URL in backend CORS settings

2. **Database Connection**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in Atlas

3. **Image Upload Issues**
   - Verify uploads directory exists
   - Check file permissions

4. **Environment Variables**
   - Ensure all variables are set in deployment platforms
   - Check variable names match code

## 💰 Cost Breakdown

### Free Tier Limits:
- **Vercel**: 100GB bandwidth/month
- **Railway**: $5 credit/month
- **MongoDB Atlas**: 512MB storage
- **Total Cost**: ~$0-5/month

### Paid Upgrades:
- **Vercel Pro**: $20/month
- **Railway**: Pay per usage
- **MongoDB Atlas**: $9/month for 2GB

## 🎉 Success!

Your e-commerce website is now live online! 

**Frontend**: `https://your-app-name.vercel.app`
**Backend**: `https://your-app-name.railway.app`
**Database**: MongoDB Atlas

Share your live website with the world! 🌍 