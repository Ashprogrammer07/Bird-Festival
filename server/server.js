
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import rateLimit from 'express-rate-limit'; // Security: Rate Limiter

import connectDB from './config/database.js';

// 🔹 Public routes
import festivalRoutes from './routes/festivalRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import ebookRoutes from './routes/ebookRoutes.js';
import competitionRoutes from './routes/competitionRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import pledgeRoutes from './routes/pledgeRoutes.js';
import resourcePersonRoutes from './routes/resourcePersonRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import readingRoutes from './routes/readingRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';

// 🔐 Admin auth
import adminAuthRoutes from './routes/adminAuthRoutes.js';

// 🔐 Admin CRUD routes
import adminFestivalRoutes from './routes/admin/adminFestival.routes.js';
import adminScheduleRoutes from './routes/admin/adminSchedule.routes.js';
import adminEbookRoutes from './routes/admin/adminEbook.routes.js';
import adminContactRoutes from './routes/admin/adminContact.routes.js';
import adminPledgeRoutes from './routes/admin/adminPledge.routes.js';
import adminCompetitionRoutes from './routes/admin/adminCompetition.routes.js';
import adminVolunteerRoutes from './routes/admin/adminVolunteer.routes.js';
import adminReadingRoutes from './routes/admin/adminReading.routes.js';
import adminResourcePersonRoutes from './routes/admin/adminResourcePerson.routes.js';
import adminQuizRoutes from './routes/admin/adminQuiz.routes.js';
import adminGalleryRoutes from './routes/admin/adminGallery.routes.js';

dotenv.config();

// ================= PATH SETUP =================
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// 👉 CHANGE THIS PATH IF YOUR FRONTEND BUILD LOCATION IS DIFFERENT
const frontendDistPath = path.join(__dirname, 'dist');

const app = express();
const PORT = process.env.PORT || 5000;

// 🔌 Connect DB
connectDB();

// ================= SECURITY: RATE LIMITING =================
// 🔓 RATE LIMITING DISABLED FOR DEVELOPMENT
// Uncomment below for production use

// 1. General Limiter (Applies to all requests)
// const generalLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 300,
//     standardHeaders: true,
//     legacyHeaders: false,
//     message: { message: "Too many requests from this IP, please try again after 15 minutes" }
// });
// app.use(generalLimiter);

// 2. Strict Limiter (For Forms & Auth)
// const formLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 10,
//     message: { message: "Too many submissions from this IP, please try again later" }
// });

// ✅ NO RATE LIMITING - For development/testing
const formLimiter = (req, res, next) => next(); // Pass-through middleware

// ================= CORS =================
const allowedOrigins = [
    'https://talchhaparbirdfestival.com',
    'https://www.talchhaparbirdfestival.com',
    'https://indigo-swan-728707.hostingersite.com',  // Hostinger deployment
    'http://localhost:5000',
    'http://localhost:5173'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📂 Serve frontend build
app.use(express.static(frontendDistPath));

// ================= PUBLIC APIs =================
// Apply strict limiter to sensitive routes
app.use('/api/festival', festivalRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/contact', formLimiter, contactRoutes); // Secured
app.use('/api/ebook', ebookRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/quiz', quizRoutes); // Quiz can have separate logic if needed
app.use('/api/pledge', formLimiter, pledgeRoutes); // Secured
app.use('/api/resource-person', formLimiter, resourcePersonRoutes); // Secured
app.use('/api/volunteers', formLimiter, volunteerRoutes); // Secured
app.use('/api/reading', readingRoutes);
app.use('/api/gallery', galleryRoutes);

// ================= ADMIN AUTH =================
app.use('/api/admin', formLimiter, adminAuthRoutes); // Secured Login

// ================= ADMIN CRUD =================
app.use('/api/admin/festival', adminFestivalRoutes);
app.use('/api/admin/schedule', adminScheduleRoutes);
app.use('/api/admin/ebooks', adminEbookRoutes);
app.use('/api/admin/contacts', adminContactRoutes);
app.use('/api/admin/pledges', adminPledgeRoutes);
app.use('/api/admin/competitions', adminCompetitionRoutes);
app.use('/api/admin/volunteers', adminVolunteerRoutes);
app.use('/api/admin/reading', adminReadingRoutes);
app.use('/api/admin/resource-persons', adminResourcePersonRoutes);
app.use('/api/admin/quizzes', adminQuizRoutes);
app.use('/api/admin/gallery', adminGalleryRoutes);

// ================= SPA ROUTES =================
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// SPA fallback (React / Vite)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// 🚀 Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});