# 🔴 URGENT: Deployment Fix for Hostinger

## Problem
Your site `indigo-swan-728707.hostingersite.com` is showing **500 Internal Server Error** because:
1. ❌ Frontend build files are missing on the server
2. ❌ CORS not configured for Hostinger domain

## ✅ Solution (3 Steps - 5 Minutes)

### Step 1: Build Frontend (2 minutes)

Open PowerShell in project root and run:

```powershell
.\build-deploy.ps1
```

**OR manually**:
```powershell
cd client
npm run build
cd ..
xcopy /E /I /Y client\dist server\dist
```

This creates `server/dist` folder with your production files.

---

### Step 2: Upload to Hostinger (2 minutes)

**Upload these files via FTP or File Manager**:
- Entire `server` folder (including the new `server/dist` folder)
- Make sure `server/dist/index.html` exists
- Make sure `server/dist/assets/` folder exists

**Important**: The `server/dist` folder MUST be uploaded!

---

### Step 3: Restart on Hostinger (1 minute)

In Hostinger control panel:
1. Go to your Node.js application
2. Click "Restart Application"
3. Wait 30 seconds
4. Visit your site

---

## ✅ Already Fixed

I've already updated your `server.js` to allow the Hostinger domain:

```javascript
const allowedOrigins = [
    'https://talchhaparbirdfestival.com',
    'https://www.talchhaparbirdfestival.com',
    'https://indigo-swan-728707.hostingersite.com',  // ✅ Added
    'http://localhost:5000',
    'http://localhost:5173'
];
```

---

## 🎯 Quick Commands

### Build and Copy (Automated)
```powershell
# Run the build script
.\build-deploy.ps1
```

### Build and Copy (Manual)
```powershell
# Build
cd client
npm run build
cd ..

# Copy
xcopy /E /I /Y client\dist server\dist
```

---

## 📁 What You Should See

After running the build script, you should have:

```
server/
├── dist/                    ← NEW! Frontend build
│   ├── index.html          ← Must exist
│   ├── assets/             ← Must exist
│   │   ├── index-BZC8xm6X.js
│   │   ├── index-lLQdhe14.css
│   │   └── ...
│   └── favicon.svg
├── controllers/
├── models/
├── routes/
├── server.js               ← CORS updated
└── ...
```

---

## 🔍 Verify Before Upload

Check that these files exist:
- [ ] `server/dist/index.html`
- [ ] `server/dist/assets/` folder
- [ ] `server/dist/assets/index-*.js` files
- [ ] `server/dist/assets/index-*.css` files

---

## 🚀 After Upload

1. **On Hostinger**, ensure environment variables are set:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   NODE_ENV=production
   ```

2. **Restart the application**

3. **Visit**: `https://indigo-swan-728707.hostingersite.com`

4. **Should see**: Your Bird Festival website (no 500 error)

---

## 🐛 Still Not Working?

### Check 1: Files Uploaded?
- Verify `server/dist` folder exists on Hostinger
- Verify `server/dist/index.html` exists

### Check 2: Server Running?
- Check Hostinger control panel
- Ensure Node.js application is "Running"

### Check 3: Environment Variables?
- Check MongoDB connection string
- Check JWT secret is set

### Check 4: Logs?
- Check Hostinger error logs
- Look for specific error messages

---

## 📞 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| 500 Error | Build frontend, upload `server/dist` |
| CORS Error | Already fixed in `server.js` |
| Files not found | Ensure `server/dist` uploaded |
| MongoDB error | Check `MONGODB_URI` in env vars |
| Port error | Use port assigned by Hostinger |

---

## ✅ Success Checklist

- [ ] Ran `.\build-deploy.ps1` successfully
- [ ] `server/dist` folder created locally
- [ ] `server/dist/index.html` exists
- [ ] Uploaded entire `server` folder to Hostinger
- [ ] Set environment variables on Hostinger
- [ ] Restarted application on Hostinger
- [ ] Website loads without 500 error

---

## 🎉 Expected Result

After following these steps:
- ✅ Website loads at `indigo-swan-728707.hostingersite.com`
- ✅ No 500 errors
- ✅ All pages work
- ✅ API endpoints work
- ✅ Admin panel accessible

---

## 📚 More Help

- **Full Guide**: See `DEPLOYMENT_FIX.md`
- **Build Script**: Run `.\build-deploy.ps1`
- **Hostinger Docs**: Check Node.js hosting guide

---

**Run the build script now and upload to fix the issue!** 🚀

```powershell
.\build-deploy.ps1
```

---

*Last Updated: January 31, 2026*
*Issue: 500 Internal Server Error*
*Solution: Build frontend and upload*
