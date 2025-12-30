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
  LogOut
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin data
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    // Redirect to login
    navigate("/admin/login");
  };

  // Grouped menu items for better organization
  const menuGroups = [
    {
      label: "Overview",
      items: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
        { name: "Schedule", path: "/admin/schedule", icon: Calendar },
      ]
    },
    {
      label: "Content & Activities",
      items: [
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
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-green-900 text-white border-r border-green-800 shadow-xl">
      
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-green-800 bg-green-950/30">
        <div className="bg-green-500/20 p-2 rounded-lg">
          <Bird className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide">Birds Festival</h1>
          <p className="text-xs text-green-400 uppercase tracking-wider">Admin Panel</p>
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
                  end={link.end} // Ensures Dashboard isn't always active
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive
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
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;