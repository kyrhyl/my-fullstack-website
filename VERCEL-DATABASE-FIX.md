# 🔧 Fix Vercel Database Connection Issue

## 🚨 **Problem:** Vercel cannot connect to MongoDB Atlas

### **Step 1: Check Environment Variables in Vercel**

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your project: `my-fullstack-website`

2. **Navigate to Environment Variables:**
   - Go to **Settings** tab
   - Click **Environment Variables**

3. **Verify Required Variables:**
   ```
   MONGODB_URI = mongodb+srv://your-username:your-password@ac-elac2s9-shard-00-02.6gfovmu.mongodb.net/your-database-name?retryWrites=true&w=majority
   JWT_SECRET = your-secret-key
   NODE_ENV = production
   ```

### **Step 2: MongoDB Atlas Network Access**

1. **Go to MongoDB Atlas:**
   - Visit: https://cloud.mongodb.com
   - Select your cluster

2. **Update Network Access:**
   - Go to **Network Access** tab
   - Click **ADD IP ADDRESS**
   - Click **ALLOW ACCESS FROM ANYWHERE** (0.0.0.0/0)
   - Click **Confirm**

### **Step 3: Test Database Connection**

Run this command locally to test your MongoDB URI:
```bash
cd server
node checkVercelEnv.js
```

### **Step 4: Redeploy Vercel**

1. **Trigger Redeploy:**
   - Go to Vercel dashboard
   - Click **Deployments**
   - Click **Redeploy** on the latest deployment

2. **Or Push New Code:**
   ```bash
   git add .
   git commit -m "Fix database connection"
   git push origin master
   ```

### **Step 5: Verify Connection**

1. **Check Health Endpoint:**
   - Visit: `https://your-vercel-url.vercel.app/api/health`
   - Should show database connection status

2. **Check Database Status Component:**
   - Visit your Vercel website
   - Look for database status notification in top-right corner

### **Common Issues & Solutions:**

#### **Issue 1: "MONGODB_URI not set"**
- **Solution:** Add the environment variable in Vercel dashboard

#### **Issue 2: "Network access denied"**
- **Solution:** Allow access from anywhere in MongoDB Atlas

#### **Issue 3: "Authentication failed"**
- **Solution:** Check username/password in connection string

#### **Issue 4: "Invalid connection string"**
- **Solution:** Verify the MongoDB URI format

### **Your Current MongoDB URI:**
```
mongodb+srv://your-username:your-password@ac-elac2s9-shard-00-02.6gfovmu.mongodb.net/your-database-name?retryWrites=true&w=majority
```

### **Quick Test:**
1. Copy your MongoDB URI from your local `.env` file
2. Add it to Vercel environment variables
3. Redeploy your project
4. Check the database status component

Let me know what you see when you check your Vercel environment variables! 