import { useEffect, useState } from "react";
import { adminScheduleAPI } from "../../services/adminApi";
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Loader2, 
  CalendarDays, 
  AlertCircle,
  Hash,
  Type
} from "lucide-react";

const ScheduleAdmin = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    day: "",
    date: "",
    title: "",
  });

  // --- Fetch Data ---
  const fetchSchedules = async () => {
    try {
      const res = await adminScheduleAPI.getAll();
      // Sort schedules by Day number
      const sorted = res.data.sort((a, b) => a.day - b.day);
      setSchedules(sorted);
    } catch (err) {
      console.error(err);
      setError("Failed to load schedules from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // --- Form Handling ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error on typing
  };

  const validateForm = () => {
    if (!form.day) return "Day number is required.";
    if (isNaN(form.day)) return "Day must be a number.";
    if (!form.date) return "Date is required.";
    if (!form.title.trim()) return "Title is required.";
    return null;
  };

  const addSchedule = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await adminScheduleAPI.create({
        ...form,
        day: Number(form.day),
        isActive: true,
        events: [],
      });
      setForm({ day: "", date: "", title: "" });
      fetchSchedules();
    } catch (err) {
      setError("Failed to create schedule. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSchedule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule day? This cannot be undone.")) return;
    try {
      await adminScheduleAPI.delete(id);
      setSchedules(schedules.filter((s) => s._id !== id));
    } catch (err) {
      alert("Failed to delete schedule");
    }
  };

  // --- Render Helpers ---
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
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
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-100 p-2 rounded-lg">
          <CalendarDays className="w-6 h-6 text-green-700" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Schedule Management</h2>
      </div>

      {/* --- ADD SCHEDULE FORM --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Add New Festival Day
        </h3>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={addSchedule} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          {/* Day Input */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Day #</label>
            <div className="relative">
              <Hash className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                name="day"
                type="number"
                placeholder="1"
                value={form.day}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Date Input */}
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Title Input */}
          <div className="md:col-span-5">
            <label className="block text-xs font-medium text-gray-700 mb-1">Theme / Title</label>
            <div className="relative">
              <Type className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                name="title"
                type="text"
                placeholder="e.g. Opening Ceremony"
                value={form.title}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add Day
            </button>
          </div>
        </form>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Day</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No schedules found. Add one above!</p>
                  </td>
                </tr>
              ) : (
                schedules.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-bold text-gray-700 text-sm">
                        {s.day}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {formatDate(s.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {s.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        s.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => deleteSchedule(s._id)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                        title="Delete Schedule"
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

export default ScheduleAdmin;