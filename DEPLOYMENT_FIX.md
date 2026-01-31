# 🚀 Deployment Fix Guide - Hostinger

## 🔴 Current Issue

**Error**: 500 Internal Server Error on `indigo-swan-728707.hostingersite.com`

**Cause**: 
1. Frontend build files not found in `server/dist`
2. CORS not configured for Hostinger domain
3. Missing production build

---

## ✅ Quick Fix (5 minutes)

### Step 1: Add Hostinger Domain to CORS

**File**: `server/server.js`

Update the `allowedOrigins` array (around line 77):

```javascript
const allowedOrigins = [
    'https://talchhaparbirdfestival.com',
    'https://www.talchhaparbirdfestival.com',
    'https://indigo-swan-728707.hostingersite.com',  // ✅ ADD THIS
    'http://localhost:5000',
    'http://localhost:5173'
];
```

---

### Step 2: Build Frontend for Production

```bash
# Navigate to client folder
cd client

# Install dependencies (if not already done)
npm install

# Build for production
npm run build
```

This creates a `client/dist` folder with optimized production files.

---

### Step 3: Copy Build to Server

**Option A: Manual Copy (Windows)**
```powershell
# From project root
xcopy /E /I /Y client\dist server\dist
```

**Option B: Manual Copy (PowerShell)**
```powershell
# From project root
Copy-Item -Path "client\dist\*" -Destination "server\dist" -Recurse -Force
```

**Option C: Create Build Script**

Create `build-and-copy.ps1` in project root:
```powershell
# Build frontend
cd client
npm run build
cd ..

# Copy to server
if (Test-Path "server\dist") {
    Remove-Item -Path "server\dist" -Recurse -Force
}
New-Item -ItemType Directory -Path "server\dist" -Force
Copy-Item -Path "client\dist\*" -Destination "server\dist" -Recurse -Force

Write-Host "✅ Build complete! Files copied to server/dist"
```

Run it:
```powershell
.\build-and-copy.ps1
```

---

### Step 4: Deploy to Hostinger

**Upload these files to Hostinger**:
1. Entire `server` folder (including `server/dist`)
2. `package.json` from server
3. `.env` file with production settings

**Via FTP/File Manager**:
- Upload to your public_html or app directory
- Make sure `server/dist` folder is included

---

### Step 5: Update Environment Variables

**On Hostinger**, ensure your `.env` has:

```env
# MongoDB
MONGODB_URI=your_production_mongodb_uri

# JWT
JWT_SECRET=your_production_jwt_secret

# Port (Hostinger usually uses specific ports)
PORT=5000

# Node Environment
NODE_ENV=production
```

---

### Step 6: Start/Restart Server on Hostinger

**If using Node.js hosting**:
```bash
npm install
npm start
```

**If using PM2**:
```bash
pm2 restart all
# or
pm2 start server.js --name bird-festival
```

---

## 🔧 Alternative: Automated Build Script

Create `package.json` in project root:

```json
{
  "name": "bird-festival-deployment",
  "version": "1.0.0",
  "scripts": {
    "build": "cd client && npm run build",
    "copy": "xcopy /E /I /Y client\\dist server\\dist",
    "deploy": "npm run build && npm run copy",
    "start": "cd server && npm start"
  }
}
```

Then just run:
```bash
npm run deploy
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module"

**Solution**: Install dependencies on server
```bash
cd server
npm install
```

### Issue: "CORS error"

**Solution**: Add your Hostinger domain to `allowedOrigins` in `server.js`

### Issue: "MongoDB connection failed"

**Solution**: Check `MONGODB_URI` in `.env` on server

### Issue: "Port already in use"

**Solution**: 
```bash
# Kill process on port
npx kill-port 5000

# Or use different port in .env
PORT=3000
```

### Issue: "Static files not loading"

**Solution**: Verify `server/dist` folder exists and has these files:
- `index.html`
- `assets/` folder with JS and CSS files

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] `server/dist` folder exists
- [ ] `server/dist/index.html` exists
- [ ] `server/dist/assets/` folder has JS/CSS files
- [ ] CORS includes Hostinger domain
- [ ] `.env` has production MongoDB URI
- [ ] Server is running on Hostinger
- [ ] Website loads without 500 error
- [ ] API endpoints work
- [ ] Admin login works

---

## 📁 Expected File Structure on Hostinger

```
server/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── uploads/
├── dist/                    ← Frontend build
│   ├── index.html
│   ├── assets/
│   │   ├── index-BZC8xm6X.js
│   │   ├── index-lLQdhe14.css
│   │   └── ...
│   └── favicon.svg
├── .env                     ← Production environment
├── server.js
└── package.json
```

---

## 🚀 Quick Deploy Commands

```bash
# 1. Build frontend
cd client
npm run build

# 2. Copy to server (Windows)
cd ..
xcopy /E /I /Y client\dist server\dist

# 3. Upload server folder to Hostinger via FTP

# 4. On Hostinger terminal
cd /path/to/your/app
npm install
npm start
```

---

## 🎯 Production Checklist

### Before Deployment
- [ ] Frontend built (`npm run build`)
- [ ] Build copied to `server/dist`
- [ ] CORS updated with production domain
- [ ] Environment variables set for production
- [ ] MongoDB URI points to production database
- [ ] All dependencies installed

### After Deployment
- [ ] Server running on Hostinger
- [ ] Website accessible
- [ ] No 500 errors
- [ ] API endpoints working
- [ ] Admin panel accessible
- [ ] File uploads working
- [ ] Database connected

---

## 🔒 Security Notes

### Production .env
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=use_a_very_strong_random_secret_here
PORT=5000
```

### CORS Configuration
Only allow your actual domains:
```javascript
const allowedOrigins = [
    'https://talchhaparbirdfestival.com',
    'https://www.talchhaparbirdfestival.com',
    'https://indigo-swan-728707.hostingersite.com'
    // Remove localhost in production
];
```

---

## 📞 Need Help?

### Common Hostinger Issues

1. **Node.js Version**: Ensure Hostinger uses Node.js 16+
2. **Port Configuration**: Use the port Hostinger assigns
3. **File Permissions**: Ensure uploaded files have correct permissions
4. **Environment Variables**: Set in Hostinger control panel

### Hostinger-Specific Setup

1. Go to Hostinger control panel
2. Navigate to Node.js settings
3. Set entry point: `server.js`
4. Set Node.js version: 18.x or higher
5. Add environment variables
6. Click "Restart Application"

---

## ✅ Final Steps

1. **Update CORS** in `server.js`
2. **Build frontend**: `cd client && npm run build`
3. **Copy build**: `xcopy /E /I /Y client\dist server\dist`
4. **Upload to Hostinger**: Upload entire `server` folder
5. **Set environment variables** on Hostinger
6. **Restart application** on Hostinger
7. **Test**: Visit `indigo-swan-728707.hostingersite.com`

---

**Your site should now work! 🎉**

*Last Updated: January 31, 2026*
*For: Hostinger Deployment*
