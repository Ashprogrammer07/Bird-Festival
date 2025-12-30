import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/admin/Sidebar.jsx";
import Topbar from "../components/admin/Topbar";
import MobileSidebar from "../components/admin/MobileSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔒 Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* 1. Desktop Sidebar (Hidden on Mobile via CSS in Sidebar component) */}
      <Sidebar />

      {/* 2. Mobile Sidebar (Drawer Overlay) */}
      <MobileSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* 3. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky Header */}
        <Topbar setOpen={setSidebarOpen} />

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 relative">
          {/* The max-w-7xl ensures content doesn't stretch too wide on huge monitors */}
          <div className="mx-auto max-w-7xl w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;