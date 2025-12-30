import { useEffect, useState } from "react";
import {
  adminPhotoCompetitionAPI,
  adminReelCompetitionAPI,
  adminPaintingCompetitionAPI,
} from "../../services/adminApi";
import { 
  Camera, 
  Video, 
  Palette, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  Trophy, 
  AlertCircle,
  Eye,
  MapPin,
  X,
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  Baby,
  School,
  Brush
} from "lucide-react";

// ⚠️ UPDATE THIS TO MATCH YOUR BACKEND PORT
const API_BASE_URL = "https://bird-festival.onrender.com"; 

// --- CONFIGURATION BASED ON YOUR MONGOOSE SCHEMAS ---
const COMPETITION_TYPES = {
  photo: {
    label: "Photography",
    icon: Camera,
    api: adminPhotoCompetitionAPI,
    color: "text-blue-600 bg-blue-100",
    // Schema fields
    mediaField: "photoUrl",
    titleField: "photoTitle",
    descField: "photoDescription"
  },
  reel: {
    label: "Reels / Video",
    icon: Video,
    api: adminReelCompetitionAPI,
    color: "text-pink-600 bg-pink-100",
    // Schema fields
    mediaField: "reelUrl", 
    titleField: "reelTitle", 
    descField: "reelDescription"
  },
  painting: {
    label: "Painting & Art",
    icon: Palette,
    api: adminPaintingCompetitionAPI,
    color: "text-purple-600 bg-purple-100",
    // Schema fields (Assuming paintingUrl exists in upload logic, falling back to fileUrl)
    mediaField: "paintingUrl",
    // Painting schema doesn't have a title, we use 'artStyle' or 'category' for display
    titleField: "artStyle", 
    descField: "previousExperience" 
  }
};

const CompetitionsAdmin = () => {
  const [activeTab, setActiveTab] = useState("photo");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);

  // --- HELPER: Handle File URLs ---
  const getFileUrl = (path) => {
    if (!path) return null;
    // 1. If absolute URL (Cloudinary/S3), return as is
    if (path.startsWith("http") || path.startsWith("https")) {
      return path;
    }
    // 2. If relative path, prepend API URL
    // Remove leading slash to prevent double slashes (http://localhost:5000//uploads...)
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const api = COMPETITION_TYPES[activeTab].api;
      const res = await api.getAll();
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load competition entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setSelectedEntry(null);
  }, [activeTab]);

  const deleteEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      const api = COMPETITION_TYPES[activeTab].api;
      await api.delete(id);
      setData(prev => prev.filter(item => item._id !== id));
      if (selectedEntry?._id === id) setSelectedEntry(null);
    } catch (err) {
      alert("Failed to delete entry");
    }
  };

  const config = COMPETITION_TYPES[activeTab];

  // --- HELPER: Render Media (Image vs Video) ---
  const renderMediaPreview = (entry) => {
    // Try specific field first, then generic fileUrl fallback
    const rawPath = entry[config.mediaField] || entry.fileUrl || entry.photoUrl || entry.reelUrl; 
    const fullUrl = getFileUrl(rawPath);

    if (!fullUrl) {
      return (
        <div className="bg-gray-100 h-48 flex flex-col items-center justify-center text-gray-400 text-sm">
          <FileText className="w-8 h-8 mb-2 opacity-50" />
          No Media Attached
        </div>
      );
    }

    if (activeTab === 'reel') {
      return (
        <video controls className="w-full h-auto rounded-lg shadow-sm bg-black max-h-[400px]">
          <source src={fullUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    
    return (
      <a href={fullUrl} target="_blank" rel="noopener noreferrer">
         <img 
            src={fullUrl} 
            alt="Submission" 
            className="w-full h-auto rounded-lg shadow-md object-contain max-h-[400px] bg-gray-50 hover:opacity-95 transition-opacity" 
            onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=Image+Load+Error"; }}
         />
      </a>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Competition Submissions
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-100 w-fit">
        {Object.entries(COMPETITION_TYPES).map(([key, conf]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === key
                ? "bg-gray-900 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <conf.icon className={`w-4 h-4 ${activeTab === key ? "text-white" : ""}`} />
            {conf.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading && (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        )}

        {!loading && data.length === 0 && (
           <div className="text-center py-20 text-gray-400">No submissions found for this category.</div>
        )}

        {!loading && data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Participant</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    {activeTab === 'painting' ? 'Category / Style' : 'Title / Location'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${config.color}`}>
                          {item.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {/* Dynamic Content based on Schema Differences */}
                      {activeTab === 'painting' ? (
                        <div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            {item.category?.toUpperCase() || "N/A"}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">{item.artStyle || "No style specified"}</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item[config.titleField] || "Untitled"}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                             <MapPin className="w-3 h-3" />
                             {item.city ? `${item.city}, ${item.state}` : 'Location hidden'}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedEntry(item)}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEntry(item._id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- DETAILS MODAL --- */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Submission Details</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wide">ID: {selectedEntry._id}</p>
              </div>
              <button 
                onClick={() => setSelectedEntry(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* LEFT COLUMN: MEDIA & DESCRIPTION */}
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center min-h-[200px]">
                   {renderMediaPreview(selectedEntry)}
                </div>
                
                {/* File Link */}
                {(selectedEntry[config.mediaField] || selectedEntry.fileUrl) && (
                  <div className="flex justify-center">
                    <a 
                      href={getFileUrl(selectedEntry[config.mediaField] || selectedEntry.fileUrl)} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" /> Open Original File
                    </a>
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                      {activeTab === 'painting' ? 'Art Style' : 'Title'}
                    </span>
                    <p className="font-semibold text-gray-800">
                      {selectedEntry[config.titleField] || selectedEntry.artStyle || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                       {activeTab === 'painting' ? 'Previous Experience' : 'Description'}
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {selectedEntry[config.descField] || selectedEntry.previousExperience || "No details provided."}
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: PARTICIPANT DETAILS */}
              <div className="space-y-6">
                
                {/* 1. Basic Info */}
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4 border-b pb-2">
                    <User className="w-4 h-4 text-gray-500" /> Participant Info
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white p-3 border rounded-lg shadow-sm">
                      <span className="text-xs text-gray-400">Full Name</span>
                      <p className="font-medium">{selectedEntry.name}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 bg-white p-3 border rounded-lg shadow-sm">
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Mail className="w-3 h-3"/> Email</span>
                        <p className="font-medium text-sm truncate" title={selectedEntry.email}>{selectedEntry.email}</p>
                      </div>
                      <div className="flex-1 bg-white p-3 border rounded-lg shadow-sm">
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3"/> Phone</span>
                        <p className="font-medium text-sm">{selectedEntry.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Painting Specific Info (Conditionally Rendered) */}
                {activeTab === 'painting' && (
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 space-y-4">
                     <h4 className="flex items-center gap-2 font-bold text-purple-800 text-sm border-b border-purple-200 pb-1">
                        <Brush className="w-4 h-4" /> Artist Details
                     </h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/60 p-2 rounded">
                          <span className="text-xs text-gray-500 flex items-center gap-1"><Baby className="w-3 h-3"/> Age</span>
                          <p className="font-medium text-sm">{selectedEntry.age} Years</p>
                        </div>
                        <div className="bg-white/60 p-2 rounded">
                           <span className="text-xs text-gray-500">Category</span>
                           <p className="font-medium text-sm capitalize">{selectedEntry.category}</p>
                        </div>
                        {selectedEntry.school && (
                           <div className="col-span-2 bg-white/60 p-2 rounded">
                              <span className="text-xs text-gray-500 flex items-center gap-1"><School className="w-3 h-3"/> School</span>
                              <p className="font-medium text-sm">{selectedEntry.school}</p>
                           </div>
                        )}
                        {selectedEntry.guardianName && (
                           <div className="col-span-2 bg-white/60 p-2 rounded">
                              <span className="text-xs text-gray-500">Guardian Name & Phone</span>
                              <p className="font-medium text-sm">
                                {selectedEntry.guardianName} ({selectedEntry.guardianPhone || 'No Phone'})
                              </p>
                           </div>
                        )}
                     </div>
                  </div>
                )}

                {/* 3. Address Info */}
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4 border-b pb-2">
                    <MapPin className="w-4 h-4 text-gray-500" /> Address Details
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                    <div>
                      <span className="text-xs text-gray-400">Address</span>
                      <p className="text-sm font-medium text-gray-800">{selectedEntry.address}</p>
                    </div>
                    {/* Only show City/State/Pincode if they exist (Painting schema groups them in address sometimes, others separate) */}
                    {(selectedEntry.city || selectedEntry.state) && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs text-gray-400">City</span>
                            <p className="text-sm font-medium text-gray-800">{selectedEntry.city || '-'}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400">Pincode</span>
                            <p className="text-sm font-medium text-gray-800">{selectedEntry.pincode || '-'}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">State</span>
                          <span className="inline-block mt-1 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded font-semibold">
                            {selectedEntry.state || '-'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* 4. Footer Actions */}
                <div className="pt-4 border-t flex justify-end gap-3">
                  <a
                    href={`mailto:${selectedEntry.email}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                  >
                    Contact Participant
                  </a>
                  <button
                    onClick={() => {
                      if(window.confirm("Delete this entry?")) {
                        deleteEntry(selectedEntry._id);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                  >
                    Delete Entry
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionsAdmin;