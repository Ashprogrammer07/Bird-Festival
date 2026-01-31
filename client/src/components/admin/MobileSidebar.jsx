
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Users,
  HandHeart,
  FileQuestion,
  ClipboardCheck,
  Trophy,
  Mic2,
  HeartHandshake,
  Bird,
  LogOut,
  X,
  Info,
  Image as ImageIcon // Added
} from "lucide-react";

const MobileSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    setOpen(false); // Close sidebar
    navigate("/admin/login");
  };

  // Consistent menu structure with Desktop Sidebar
  const menuGroups = [
    {
      label: "Overview",
      items: [
        { name: "Festival Content", path: "/admin/festival", icon: Info },
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
        { name: "Schedule", path: "/admin/schedule", icon: Calendar },
      ]
    },
    {
      label: "Content & Activities",
      items: [
        { name: "Photo Gallery", path: "/admin/gallery", icon: ImageIcon },
        { name: "Ebooks", path: "/admin/ebooks", icon: BookOpen },
        { name: "Competitions", path: "/admin/competitions", icon: Trophy },
        { name: "Pledges", path: "/admin/pledges", icon: HandHeart },
      ]
    },
    {
      label: "Quiz Module",
      items: [
        { name: "Quizzes", path: "/admin/quizzes", icon: FileQuestion },
        { name: "Submissions", path: "/admin/quiz-submissions", icon: ClipboardCheck },
      ]
    },
    {
      label: "People",
      items: [
        { name: "Contacts", path: "/admin/contacts", icon: Users },
        { name: "Resource Persons", path: "/admin/resource-persons", icon: Mic2 },
        { name: "Volunteers", path: "/admin/volunteers", icon: HeartHandshake },
      ]
    }
  ];

  return (
    <>
      {/* OVERLAY with Blur */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setOpen(false)}
      />

      {/* DRAWER */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-green-900 text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* HEADER */}
        <div className="p-5 flex items-center justify-between border-b border-green-800 bg-green-950/30">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <Bird className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide">Birds Festival</h1>
              <p className="text-xs text-green-400 uppercase">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-green-200" />
          </button>
        </div>

        {/* SCROLLABLE LINKS */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-thin scrollbar-thumb-green-700">
          {menuGroups.map((group, index) => (
            <div key={index}>
              <h3 className="px-2 text-xs font-semibold text-green-400/80 uppercase tracking-wider mb-2">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                        ? "bg-green-700 text-white shadow-md shadow-green-900/20 translate-x-1"
                        : "text-green-100 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    <link.icon className="w-5 h-5 opacity-80" />
                    <span className="font-medium text-sm">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* FOOTER / LOGOUT */}
        <div className="p-4 border-t border-green-800 bg-green-950/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;