import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminEbookAPI,
  adminPledgeAPI,
  adminVolunteerAPI,
  adminReadingAPI,
  adminPhotoCompetitionAPI,
  adminReelCompetitionAPI,
  adminPaintingCompetitionAPI,
} from "../../services/adminApi";
import { 
  BookOpen, 
  HandHeart, 
  Users, 
  Trophy, 
  Eye, 
  CheckCircle, 
  Calendar, 
  MessageSquare, 
  Loader2,
  RefreshCw,
  ArrowRight
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      {loading ? (
        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
      ) : (
        <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
      )}
    </div>
    <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
  </div>
);

const ActionCard = ({ title, icon: Icon, path, description }) => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(path)}
      className="flex flex-col items-start p-5 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all duration-200 group text-left w-full"
    >
      <div className="bg-green-50 p-3 rounded-full mb-3 group-hover:bg-green-100 transition-colors">
        <Icon className="w-6 h-6 text-green-700" />
      </div>
      <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-green-700">{title}</h3>
      <p className="text-xs text-gray-500 mb-4">{description}</p>
      <div className="mt-auto flex items-center text-xs font-bold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
        OPEN <ArrowRight className="w-3 h-3 ml-1" />
      </div>
    </button>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ebooks: 0,
    pledges: 0,
    volunteers: 0,
    competitions: 0,
    readers: 0,
    completionRate: 0,
  });

  const loadStats = async () => {
    setLoading(true);
    try {
      const [
        ebooks,
        pledges,
        volunteers,
        photo,
        reel,
        painting,
        readingStats,
      ] = await Promise.all([
        adminEbookAPI.getAll(),
        adminPledgeAPI.getAll(),
        adminVolunteerAPI.getAll(),
        adminPhotoCompetitionAPI.getAll(),
        adminReelCompetitionAPI.getAll(),
        adminPaintingCompetitionAPI.getAll(),
        adminReadingAPI.getStats(),
      ]);

      setStats({
        ebooks: ebooks.data.length,
        pledges: pledges.data.length,
        volunteers: volunteers.data.length,
        competitions: photo.data.length + reel.data.length + painting.data.length,
        readers: readingStats.data.totalReaders,
        completionRate: readingStats.data.completionRate,
      });
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const statItems = [
    { title: "Total Ebooks", value: stats.ebooks, icon: BookOpen, color: "text-blue-600 bg-blue-600" },
    { title: "Pledges Signed", value: stats.pledges, icon: HandHeart, color: "text-red-500 bg-red-500" },
    { title: "Volunteers", value: stats.volunteers, icon: Users, color: "text-green-600 bg-green-600" },
    { title: "Contest Entries", value: stats.competitions, icon: Trophy, color: "text-yellow-600 bg-yellow-600" },
    { title: "Active Readers", value: stats.readers, icon: Eye, color: "text-purple-600 bg-purple-600" },
    { title: "Avg Completion", value: `${stats.completionRate}%`, icon: CheckCircle, color: "text-teal-600 bg-teal-600" },
  ];

  const quickActions = [
    { title: "Manage Ebooks", icon: BookOpen, path: "/admin/ebooks", description: "Add or edit digital library content." },
    { title: "Manage Schedule", icon: Calendar, path: "/admin/schedule", description: "Update festival event timings." },
    { title: "View Pledges", icon: HandHeart, path: "/admin/pledges", description: "See who has committed to the cause." },
    { title: "View Volunteers", icon: Users, path: "/admin/volunteers", description: "Manage team registrations." },
    { title: "Competitions", icon: Trophy, path: "/admin/competitions", description: "Review photos, reels, and paintings." },
    { title: "Messages", icon: MessageSquare, path: "/admin/contacts", description: "Read inquiries from the contact form." },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome to the Birds Festival Administration Panel.</p>
        </div>
        <button 
          onClick={loadStats} 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
        {statItems.map((item, index) => (
          <StatCard 
            key={index} 
            {...item} 
            loading={loading}
          />
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Loader2 className="w-5 h-5 text-green-600" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <ActionCard key={index} {...action} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;