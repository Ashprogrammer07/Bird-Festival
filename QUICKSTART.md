# Quick Start Guide - Rajasthan Birds Festival

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies

Open **two terminals** in the project root directory.

**Terminal 1 (Backend):**
```bash
cd server
npm install
```

**Terminal 2 (Frontend):**
```bash
cd client
npm install
```

### Step 2: Setup MongoDB

You have two options:

#### Option A: Local MongoDB
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. The `.env` file is already configured for local MongoDB

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `server\.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bird-festival
   ```

### Step 3: Run the Application

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
✅ Backend running on http://localhost:5000

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
✅ Frontend running on http://localhost:3000

## 🌐 Open Your Browser

Navigate to: **http://localhost:3000**

## 🎨 What You'll See

### Home Page Features:
- ✨ **Automatic image slider** - Background changes every 5 seconds
- 🎯 **Animated hero section** - Smooth fade-in effects
- 📅 **Festival dates** - Highlighted in an elegant card
- 🔘 **CTA buttons** - View Schedule and Learn More
- 🌟 **Features section** - Three key offerings

### Navigation:
- **Home** - Hero landing page
- **About Us** - Mission, vision, and locations
- **Schedule** - Day-wise festival itinerary
- **Contact** - Contact form with validation
- **E-Book** - Downloadable bird guide

## 📊 Optional: Seed Database

If you want sample data, connect to MongoDB and insert:

```javascript
// Festival Info
db.festivalinfos.insertOne({
  title: "The Rajasthan Birding Festival",
  description: "Experience the diverse avian life of Rajasthan's wetlands, deserts, and sanctuaries.",
  startDate: new Date("2026-02-10"),
  endDate: new Date("2026-02-15"),
  location: "Rajasthan, India",
  mission: "To promote bird conservation and awareness.",
  vision: "A sustainable future for birds and humans.",
  about: "Celebrating Rajasthan's avian diversity...",
  isActive: true
});

// Schedule
db.schedules.insertOne({
  day: 1,
  date: new Date("2026-02-10"),
  title: "Opening Day",
  events: [
    {
      time: "07:00 AM",
      activity: "Early Morning Bird Walk",
      location: "Keoladeo National Park",
      description: "Explore wetlands at sunrise"
    }
  ],
  isActive: true
});

// E-book
db.ebooks.insertOne({
  title: "Birds of Rajasthan: Complete Field Guide",
  description: "Comprehensive guide featuring 300+ species",
  fileName: "birds-guide.pdf",
  fileUrl: "/downloads/birds-guide.pdf",
  author: "Rajasthan Birding Festival",
  pages: 250,
  fileSize: "15 MB",
  downloadCount: 0,
  isActive: true
});
```

## ⚠️ Troubleshooting

### Backend won't start?
- Ensure MongoDB is running
- Check `.env` file exists in `server/` folder
- Verify port 5000 is not in use

### Frontend won't start?
- Check port 3000 is available
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

### API connection issues?
- Ensure backend is running on port 5000
- Check `client/.env` has correct API URL
- Verify CORS is enabled (already configured)

## 🎯 Default Behavior

The app works **without database seeding**! 

If no data exists in MongoDB:
- ✅ Home page shows default festival info
- ✅ Schedule displays sample 3-day itinerary
- ✅ About page shows default content
- ✅ Contact form saves to database
- ✅ E-book page shows placeholder guide

## 📱 Test Responsive Design

- Desktop: Full experience with animations
- Tablet: Optimized grid layouts
- Mobile: Hamburger menu, stacked content

## 🎨 Key Features to Test

1. **Image Slider** - Wait 5 seconds on home page
2. **Smooth Animations** - Text fades in on scroll
3. **Contact Form** - Submit a message
4. **Navigation** - Click through all pages
5. **Responsive** - Resize browser window

## 🚀 Ready to Deploy?

Check the main `README.md` for deployment instructions to:
- **Vercel** (Frontend)
- **Render/Railway** (Backend)  
- **MongoDB Atlas** (Database)

---

**Enjoy building with the MERN stack! 🎉**
