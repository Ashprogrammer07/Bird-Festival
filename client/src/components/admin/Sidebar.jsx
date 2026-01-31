
import { NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
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
  Info,
  Image as ImageIcon
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const menuGroups = [
    {
      label: "Overview",
      items: [
        { name: t('admin.festivalInfo'), path: "/admin/festival", icon: Info },
        { name: t('admin.dashboard'), path: "/admin", icon: LayoutDashboard, end: true },
        { name: t('admin.schedule'), path: "/admin/schedule", icon: Calendar },
      ]
    },
    {
      label: "Content & Activities",
      items: [
        { name: t('admin.gallery'), path: "/admin/gallery", icon: ImageIcon },
        { name: t('admin.ebooks'), path: "/admin/ebooks", icon: BookOpen },
        { name: t('admin.competitions'), path: "/admin/competitions", icon: Trophy },
        { name: t('admin.pledges'), path: "/admin/pledges", icon: HandHeart },
      ]
    },
    {
      label: "Quiz Module",
      items: [
        { name: t('admin.quizzes'), path: "/admin/quizzes", icon: FileQuestion },
        { name: t('admin.submissions'), path: "/admin/quiz-submissions", icon: ClipboardCheck },
      ]
    },
    {
      label: "People",
      items: [
        { name: t('admin.contacts'), path: "/admin/contacts", icon: Users },
        { name: t('admin.resourcePersons'), path: "/admin/resource-persons", icon: Mic2 },
        { name: t('admin.volunteers'), path: "/admin/volunteers", icon: HeartHandshake },
      ]
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-green-900 text-white border-r border-green-800 shadow-xl">

      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-green-800 bg-green-950/30">
        <div className="bg-green-500/20 p-2 rounded-lg">
          <Bird className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide">Birds Festival</h1>
          <p className="text-xs text-green-400 uppercase tracking-wider">{t('nav.adminPanel')}</p>
        </div>
      </div>

      {/* Navigation Scroll Area */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6 scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-transparent">
        {menuGroups.map((group, index) => (
          <div key={index}>
            <h3 className="px-4 text-xs font-semibold text-green-400/80 uppercase tracking-wider mb-2">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                      ? "bg-green-700 text-white shadow-md shadow-green-900/20 translate-x-1"
                      : "text-green-100 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <link.icon className="w-5 h-5 opacity-80 group-hover:opacity-100" />
                  <span className="font-medium text-sm">{link.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-green-800 bg-green-950/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">{t('nav.logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;