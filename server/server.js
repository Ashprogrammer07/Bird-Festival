import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
import adminQuizRoutes from "./routes/admin/adminQuiz.routes.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 🔌 Connect DB
connectDB();

const allowedOrigins = [
  'https://talchhaparbirdfestival.com',
  'https://www.talchhaparbirdfestival.com',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 Static uploads
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// ================= PUBLIC APIs =================
app.use('/api/festival', festivalRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/ebook', ebookRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/pledge', pledgeRoutes);
app.use('/api/resource-person', resourcePersonRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/reading', readingRoutes);

// ================= ADMIN AUTH =================
app.use('/api/admin', adminAuthRoutes);

// ================= ADMIN CRUD =================
app.use('/api/admin/festival', adminFestivalRoutes);
app.use('/api/admin/schedule', adminScheduleRoutes);
app.use('/api/admin/ebooks', adminEbookRoutes);
app.use('/api/admin/contacts', adminContactRoutes);
app.use('/api/admin/pledges', adminPledgeRoutes);
app.use('/api/admin/competitions', adminCompetitionRoutes);
app.use('/api/admin/volunteers', adminVolunteerRoutes);
app.use('/api/admin/reading', adminReadingRoutes);
app.use("/api/admin/resource-persons", adminResourcePersonRoutes);
app.use("/api/admin/quizzes", adminQuizRoutes);

// ❤️ Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bird Festival API is running' });
});

// ❌ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
