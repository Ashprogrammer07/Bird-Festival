# Rajasthan Birds Festival - MERN Stack Website

A complete, production-ready website for the Rajasthan Birds Festival built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🎯 Project Overview

This website celebrates the incredible avian diversity of Rajasthan, India. It features:
- Beautiful hero landing page with full-screen background
- **🌍 Full bilingual support (English & Hindi)** - Dynamic content in both languages
- Festival information and schedule management
- Contact form with backend integration
- Downloadable e-book for bird identification
- Responsive design for all devices
- RESTful API architecture

## 🚀 Tech Stack

### Frontend
- **React.js 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
bird-festival/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                 # Express backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── server.js          # Entry point
│   └── package.json
│
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
cd bird-festival
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bird-festival
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bird-festival
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create `.env` file in the `client` directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend runs on `http://localhost:3000`

### Production Build

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

## 📊 Database Seeding (Optional)

To populate the database with sample data, you can manually insert documents via MongoDB Compass or the shell.

### Example Festival Info:
```javascript
db.festivalinfos.insertOne({
  title: "The Rajasthan Birding Festival",
  description: "Experience the diverse avian life of Rajasthan's wetlands, deserts, and sanctuaries. Join us for guided birding walks, conservation talks, and cultural celebrations.",
  startDate: new Date("2026-02-10"),
  endDate: new Date("2026-02-15"),
  location: "Rajasthan, India",
  mission: "To promote bird conservation and create awareness about Rajasthan's rich avian biodiversity.",
  vision: "A sustainable future where humans and birds coexist harmoniously.",
  about: "The Rajasthan Birding Festival celebrates the state's incredible diversity of bird species...",
  isActive: true
});
```

### Example Schedule:
```javascript
db.schedules.insertOne({
  day: 1,
  date: new Date("2026-02-10"),
  title: "Opening Day & Orientation",
  events: [
    {
      time: "07:00 AM",
      activity: "Early Morning Bird Walk",
      location: "Keoladeo National Park",
      description: "Explore the wetlands at sunrise"
    }
  ],
  isActive: true
});
```

### Example E-book:
```javascript
db.ebooks.insertOne({
  title: "Birds of Rajasthan: A Complete Field Guide",
  description: "Comprehensive field guide featuring over 300 bird species",
  fileName: "birds-of-rajasthan-guide.pdf",
  fileUrl: "/downloads/birds-guide.pdf",
  author: "Rajasthan Birding Festival",
  pages: 250,
  fileSize: "15 MB",
  downloadCount: 0,
  isActive: true
});
```

## 🌐 API Endpoints

### Festival Information
- `GET /api/festival` - Get active festival info
- `POST /api/festival` - Create festival info
- `PUT /api/festival/:id` - Update festival info

### Schedule
- `GET /api/schedule` - Get all schedules
- `GET /api/schedule/:day` - Get schedule by day
- `POST /api/schedule` - Create schedule
- `PUT /api/schedule/:id` - Update schedule
- `DELETE /api/schedule/:id` - Delete schedule

### Contact
- `POST /api/contact` - Submit contact message
- `GET /api/contact` - Get all messages (admin)
- `PATCH /api/contact/:id/read` - Mark as read

### E-book
- `GET /api/ebook` - Get active e-book
- `POST /api/ebook` - Create e-book
- `PUT /api/ebook/:id` - Update e-book
- `PATCH /api/ebook/:id/download` - Increment downloads

### Health Check
- `GET /api/health` - Check API status

## 🌍 Internationalization (i18n)

### Supported Languages
- **English (en)** - Default language
- **हिंदी (hi)** - Hindi language support

### Bilingual Content
All dynamic content is stored in bilingual format in the database:
- Festival information (title, description, location, mission, vision, about)
- Schedules (day titles, activities, locations, descriptions)
- Gallery images (titles, categories)
- E-books (titles, descriptions, authors)
- Quizzes (questions, options)
- Resource persons (designations, organizations, expertise, bios, topics)

### API Usage with Language Parameter

All GET endpoints support an optional `lang` query parameter:

```bash
# Get content in English
GET /api/schedule?lang=en

# Get content in Hindi
GET /api/festival?lang=hi

# Get full bilingual data (for admin)
GET /api/schedule
```

### Response Format

**With language parameter:**
```json
{
  "title": "Bird Watching",
  "description": "A wonderful event"
}
```

**Without language parameter (full bilingual):**
```json
{
  "title": {
    "en": "Bird Watching",
    "hi": "पक्षी दर्शन"
  },
  "description": {
    "en": "A wonderful event",
    "hi": "एक अद्भुत कार्यक्रम"
  }
}
```

### Frontend Integration

The frontend uses `LanguageContext` to manage the current language:

```javascript
import { useLanguage } from './context/LanguageContext';

function MyComponent() {
  const { language, t } = useLanguage();
  
  // Fetch localized data
  fetch(`/api/schedule?lang=${language}`)
    .then(res => res.json())
    .then(data => console.log(data));
}
```

### Data Migration

To migrate existing monolingual data to bilingual format:

```bash
cd server
node migrate-to-bilingual.js
```

⚠️ **Important**: Backup your database before running the migration script!

### Documentation

For detailed information about the internationalization implementation:
- **Full Guide**: `INTERNATIONALIZATION.md`
- **Quick Start**: `QUICK_START.md`
- **Architecture**: `ARCHITECTURE.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Checklist**: `CHECKLIST.md`


## 🎨 Features

### Home Page
- Full-screen hero section with background image
- Dark gradient overlay for text readability
- Large serif heading with festival title
- Animated content with fade-in effects
- Festival dates display
- Call-to-action buttons
- Features section

### About Page
- Festival story and mission
- Conservation focus
- Key birding locations
- Image galleries

### Schedule Page
- Day-wise itinerary
- Time-based event listing
- Location information
- Important notes section

### Contact Page
- Contact form with validation
- Success/error handling
- Contact information display
- Office hours

### E-book Page
- E-book cover display
- Download functionality
- Statistics (pages, size, downloads)
- Feature highlights

## 📱 Responsive Design

The website is fully responsive and works seamlessly on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend Deployment (Railway, Render, Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel, Netlify)
1. Build the production bundle: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables
4. Set up custom domain (optional)

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Set up database user
3. Whitelist IP addresses
4. Get connection string
5. Update MONGODB_URI in backend .env

## 📝 License

This project is open source and available for educational and commercial use.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please contact:
- Email: info@rajasthanbirdingfestival.com
- Website: [Rajasthan Birding Festival](#)

---

**Built with ❤️ using the MERN Stack**
