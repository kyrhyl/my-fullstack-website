# 🚀 Render Deployment Guide - MERN Stack E-commerce

## 📋 Prerequisites ✅
- GitHub Repository ✅
- MongoDB Atlas ✅
- Render Account (Free)

## 🌐 Step 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### 1.2 Connect Your Repository
1. Select your GitHub repo: `kyrhyl/my-fullstack-website`
2. Render will auto-detect Node.js
3. Click "Connect"

### 1.3 Configure Web Service
```
Name: ecommerce-backend
Environment: Node
Region: Choose closest to you
Branch: master
Root Directory: server
Build Command: npm install
Start Command: npm start
Plan: Free
```

### 1.4 Add Environment Variables
In Render dashboard, add these variables:

```env
MONGODB_URI=mongodb+srv://ecommerce_user:ecommerce123@my-ecommerce-db.6gfovmu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=my-ecommerce-db
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_123456789
PORT=10000
NODE_ENV=production
```

### 1.5 Deploy Backend
1. Click "Create Web Service"
2. Wait 2-3 minutes for deployment
3. Get your backend URL: `https://your-app-name.onrender.com`

### 1.6 Test Backend
Test these endpoints:
```bash
# Health check
curl https://your-app-name.onrender.com/api/health

# Products
curl https://your-app-name.onrender.com/api/products
```

## 🎨 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository

### 2.2 Configure Environment Variable
In Vercel dashboard, add:
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

### 2.3 Deploy Frontend
1. Vercel will auto-deploy using `vercel.json`
2. Get your frontend URL: `https://your-app-name.vercel.app`

## 🔧 Step 3: Update CORS Configuration

### 3.1 Update Backend CORS
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

### 3.2 Push Changes to GitHub
```bash
git add .
git commit -m "Update CORS for production deployment"
git push
```

## 🧪 Step 4: Test Your Live Website

### 4.1 Test Frontend
- Visit: `https://your-frontend-url.vercel.app`
- Test user registration/login
- Browse products
- Test shopping cart

### 4.2 Test Backend API
- Health: `https://your-backend-url.onrender.com/api/health`
- Products: `https://your-backend-url.onrender.com/api/products`
- Auth: `https://your-backend-url.onrender.com/api/auth/login`

## 📊 Render Free Tier Limits

### ✅ What's Included:
- **750 hours/month** (enough for 24/7 usage)
- **Auto-deploy** from GitHub
- **Custom domains** with SSL
- **Logs and monitoring**
- **Environment variables**

### ⚠️ Limitations:
- **Sleep after 15 minutes** of inactivity
- **Cold start** takes 30-60 seconds
- **No persistent storage** (use MongoDB Atlas)

## 🆘 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check build logs in Render dashboard
   - Verify `package.json` in server directory
   - Ensure all dependencies are listed

2. **Environment Variables**
   - Double-check variable names
   - Verify MongoDB Atlas connection string
   - Test connection locally first

3. **CORS Errors**
   - Update CORS origin with exact frontend URL
   - Check if frontend URL is correct in backend

4. **Database Connection**
   - Verify MongoDB Atlas is accessible
   - Check IP whitelist in Atlas
   - Test connection string locally

## 💰 Cost Breakdown

### Free Tier (Recommended):
- **Render Backend**: Free (750 hours/month)
- **Vercel Frontend**: Free (100GB bandwidth)
- **MongoDB Atlas**: Free (512MB storage)
- **Total Cost**: $0/month

### Paid Upgrades:
- **Render**: $7/month for always-on
- **Vercel Pro**: $20/month
- **MongoDB Atlas**: $9/month for 2GB

## 🎉 Success!

Your e-commerce website will be live at:
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://your-app-name.onrender.com`
- **Database**: MongoDB Atlas ✅

Share your live website with the world! 🌍 