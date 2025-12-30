import { useNavigate } from "react-router-dom";
import { Menu, LogOut, Bell, User, ChevronDown } from "lucide-react";

const Topbar = ({ setOpen }) => {
  const navigate = useNavigate();
  
  // Safely retrieve admin info for display
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");
  const adminName = admin.name || "Admin User";

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm lg:px-6">
      
      {/* --- LEFT SECTION --- */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-green-700 focus:outline-none md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Page Title / Breadcrumb Placeholder */}
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* --- RIGHT SECTION --- */}
      <div className="flex items-center gap-4">
        
        {/* Notification Icon (Visual Only) */}
        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-green-700 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-gray-300 mx-1 hidden sm:block"></div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3">
          
          {/* User Info (Hidden on very small screens) */}
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-gray-700 leading-none">
              {adminName}
            </p>
            <p className="text-xs text-gray-500 mt-1">Administrator</p>
          </div>

          {/* Avatar / Icon */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 border border-green-200 text-green-700">
            <User className="h-5 w-5" />
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="ml-2 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors border border-red-100"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;