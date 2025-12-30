import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import ReaderLayout from "./layouts/ReaderLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Schedule from "./pages/Schedule";
import Contact from "./pages/Contact";
import Ebook from "./pages/Ebook";
import Competitions from "./pages/Competitions";
import NaturePledge from "./pages/NaturePledge";
import Reader from "./pages/Reader";
import ResourcePersonRegistration from "./pages/ResourcePersonRegistration";
import VolunteersRegistration from "./pages/VolunteersRegistration";

// Admin Auth
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

// Admin Pages (EXISTING)
import Dashboard from "./pages/admin/Dashboard";
import ScheduleAdmin from "./pages/admin/ScheduleAdmin";
import EbookAdmin from "./pages/admin/EbookAdmin";
import ContactAdmin from "./pages/admin/ContactAdmin";
import PledgeAdmin from "./pages/admin/PledgeAdmin";
import VolunteerAdmin from "./pages/admin/VolunteerAdmin";
import CompetitionsAdmin from "./pages/admin/CompetitionsAdmin";
import ResourcePersonAdmin from "./pages/admin/ResourcePersonAdmin";
import QuizAdmin from "./pages/admin/QuizAdmin";
import QuizSubmissionsAdmin from "./pages/admin/QuizSubmissionsAdmin";
function App() {
  return (
    <Router>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ebook" element={<Ebook />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/pledge" element={<NaturePledge />} />
          <Route
            path="/register/resource-person"
            element={<ResourcePersonRegistration />}
          />
          <Route
            path="/register/volunteers"
            element={<VolunteersRegistration />}
          />
        </Route>

        {/* ================= READER ROUTES ================= */}
        <Route element={<ReaderLayout />}>
          <Route path="/reader/:ebookId" element={<Reader />} />
        </Route>

        {/* ================= ADMIN AUTH ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ================= ADMIN PANEL ================= */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="schedule" element={<ScheduleAdmin />} />
          <Route path="ebooks" element={<EbookAdmin />} />
          <Route path="contacts" element={<ContactAdmin />} />
          <Route path="pledges" element={<PledgeAdmin />} />
          <Route path="volunteers" element={<VolunteerAdmin />} />
          <Route path="competitions" element={<CompetitionsAdmin />} />
          <Route path="resource-persons" element={<ResourcePersonAdmin />} />
          <Route path="quizzes" element={<QuizAdmin />} />
          <Route path="quiz-submissions" element={<QuizSubmissionsAdmin />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
