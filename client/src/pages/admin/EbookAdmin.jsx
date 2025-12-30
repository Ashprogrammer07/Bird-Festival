import { useEffect, useState } from "react";
import { adminEbookAPI } from "../../services/adminApi";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Loader2, 
  FileText, 
  Link as LinkIcon, 
  Hash, 
  ExternalLink,
  AlertCircle 
} from "lucide-react";

const EbookAdmin = () => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    fileUrl: "",
    pages: "",
  });

  // --- Data Fetching ---
  const fetchEbooks = async () => {
    try {
      const res = await adminEbookAPI.getAll();
      setEbooks(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch ebooks list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, []);

  // --- Form Handling ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error when user types
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.fileUrl.trim()) return "File URL is required.";
    // Simple URL regex check
    const urlPattern = /^(https?:\/\/[^\s]+)/g;
    if (!urlPattern.test(form.fileUrl)) return "Please enter a valid URL (starting with http/https).";
    if (!form.pages || form.pages <= 0) return "Please enter a valid number of pages.";
    return null;
  };

  const addEbook = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await adminEbookAPI.create({
        ...form,
        pages: Number(form.pages || 0),
        isActive: true,
      });

      setForm({ title: "", description: "", fileUrl: "", pages: "" });
      fetchEbooks();
    } catch (err) {
      setError("Failed to create ebook. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEbook = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate/delete this ebook?")) return;
    try {
      await adminEbookAPI.delete(id);
      // Optimistically update UI or re-fetch
      setEbooks(ebooks.filter(e => e._id !== id));
    } catch (err) {
      alert("Failed to delete ebook");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <BookOpen className="w-6 h-6 text-blue-700" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Digital Library</h2>
          <p className="text-sm text-gray-500">Manage Ebooks & PDFs</p>
        </div>
      </div>

      {/* --- ADD FORM CARD --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
          Add New Resource
        </h3>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={addEbook} className="grid grid-cols-1 md:grid-cols-6 gap-4">
          
          {/* Title */}
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Ebook Title</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                name="title"
                placeholder="e.g. Birds of India Vol. 1"
                value={form.title}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Pages */}
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Pages</label>
            <div className="relative">
              <Hash className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                name="pages"
                type="number"
                placeholder="0"
                value={form.pages}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* File URL */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">PDF URL</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                name="fileUrl"
                placeholder="https://..."
                value={form.fileUrl}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Description (Full Width) */}
          <div className="md:col-span-6">
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                name="description"
                rows="2"
                placeholder="Short summary of the ebook content..."
                value={form.description}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-6 flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Publish Ebook
            </button>
          </div>
        </form>
      </div>

      {/* --- TABLE LIST --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title / Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pages</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">File</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Downloads</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ebooks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No ebooks found in library.</p>
                  </td>
                </tr>
              ) : (
                ebooks.map((e) => (
                  <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{e.title}</span>
                        <span className="text-xs text-gray-500 truncate max-w-xs">{e.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {e.pages}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={e.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium border border-blue-200 px-2 py-1 rounded bg-blue-50"
                      >
                        <ExternalLink className="w-3 h-3" /> Preview
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                      {e.downloadCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {e.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => deleteEbook(e._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Deactivate / Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EbookAdmin;