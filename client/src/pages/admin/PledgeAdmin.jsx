import { useEffect, useState } from "react";
import { adminPledgeAPI } from "../../services/adminApi";
import {
  HandHeart,
  Trash2,
  Search,
  Loader2,
  Mail,
  Phone,
  Calendar,
  FileDown,
  MapPin,
  Edit,
  Plus,
  X,
  Save,
} from "lucide-react";

const PledgeAdmin = () => {
  const [pledges, setPledges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPledge, setCurrentPledge] = useState(null); // null = create mode
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: {
      state: "",
      district: "",
      city: "",
      pincode: "",
    },
    message: "",
  });
  const [saving, setSaving] = useState(false);

  // Initial Fetch
  const fetchPledges = async () => {
    try {
      setLoading(true);
      const res = await adminPledgeAPI.getAll();
      setPledges(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load pledges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPledges();
  }, []);

  // Handlers
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this pledge?")) return;
    try {
      await adminPledgeAPI.delete(id);
      setPledges((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete pledge");
    }
  };

  const handleExport = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "State",
      "District",
      "City",
      "Pincode",
      "Date Joined",
    ];

    const csvContent = [
      headers.join(","),
      ...pledges.map((p) => {
        const loc = p.location || {};
        return [
          `"${p.name || ""}"`,
          `"${p.email || ""}"`,
          `"${p.phone || ""}"`,
          `"${loc.state || ""}"`,
          `"${loc.district || ""}"`,
          `"${loc.city || ""}"`,
          `"${loc.pincode || ""}"`,
          new Date(p.createdAt).toLocaleDateString(),
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pledges_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ================= MODAL HANDLERS ================= */
  const openAddModal = () => {
    setCurrentPledge(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: { state: "", district: "", city: "", pincode: "" },
      message: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pledge) => {
    setCurrentPledge(pledge);
    setFormData({
      name: pledge.name,
      email: pledge.email,
      phone: pledge.phone,
      location: {
        state: pledge.location?.state || "",
        district: pledge.location?.district || "",
        city: pledge.location?.city || "",
        pincode: pledge.location?.pincode || "",
      },
      message: pledge.message || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPledge(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentPledge) {
        // Update
        const res = await adminPledgeAPI.update(currentPledge._id, formData);
        setPledges((prev) =>
          prev.map((p) => (p._id === currentPledge._id ? res.data : p))
        );
      } else {
        // Create
        const res = await adminPledgeAPI.create(formData);
        setPledges((prev) => [res.data, ...prev]);
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= SEARCH FILTER ================= */
  const filteredPledges = (pledges || []).filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      (p.name || "").toLowerCase().includes(term) ||
      (p.email || "").toLowerCase().includes(term) ||
      (p.location?.state || "").toLowerCase().includes(term) ||
      (p.location?.district || "").toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <HandHeart className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Nature Pledges</h2>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-green-700">
                {pledges.length}
              </span>{" "}
              pledges collected
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg w-48 md:w-64 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* ADD BUTTON */}
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition shadow"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>

          {/* EXPORT BUTTON */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 border bg-white px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <FileDown className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Supporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Date Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPledges.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    No pledges found
                  </td>
                </tr>
              ) : (
                filteredPledges.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    {/* NAME */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700">
                          {p.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {p.name}
                        </div>
                      </div>
                    </td>

                    {/* CONTACT */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 space-y-1">
                        {p.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-gray-400" /> {p.email}
                          </div>
                        )}
                        {p.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-gray-400" />{" "}
                            {p.phone}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* LOCATION */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <div>
                          <div>
                            {p.location?.district}, {p.location?.state}
                          </div>
                          {p.location?.city && (
                            <div className="text-xs text-gray-400">
                              {p.location.city}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {new Date(p.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="text-amber-600 hover:bg-amber-50 p-2 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-800">
                {currentPledge ? "Edit Pledge" : "Add New Pledge"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              {/* Location Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 border-b pb-2">
                  Location Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="location.state"
                      required
                      value={formData.location.state}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Rajasthan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District *
                    </label>
                    <input
                      type="text"
                      name="location.district"
                      required
                      value={formData.location.district}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Jaipur"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City / Village
                    </label>
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Sitapura"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="location.pincode"
                      value={formData.location.pincode}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="302022"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleFormChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                  placeholder="Why do you support nature conservation?"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Pledge
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PledgeAdmin;
