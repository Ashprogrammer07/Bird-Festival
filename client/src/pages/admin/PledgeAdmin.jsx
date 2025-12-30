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
} from "lucide-react";

const PledgeAdmin = () => {
  const [pledges, setPledges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPledges = async () => {
    try {
      const res = await adminPledgeAPI.getAll();
      // Supports both {data: []} and []
      setPledges(res.data.data || res.data);
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

  const deletePledge = async (id) => {
    if (!window.confirm("Are you sure you want to remove this pledge?")) return;
    try {
      await adminPledgeAPI.delete(id);
      setPledges((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete pledge");
    }
  };

  /* ================= CSV EXPORT ================= */
  const downloadCSV = () => {
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

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pledges_${new Date()
      .toISOString()
      .split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ================= SEARCH ================= */
  const filteredPledges = pledges.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.location?.state?.toLowerCase().includes(term) ||
      p.location?.district?.toLowerCase().includes(term)
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
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <HandHeart className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Nature Pledges
            </h2>
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
              placeholder="Search name, email, state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* EXPORT */}
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            <FileDown className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold">
                  Supporter
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredPledges.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-12 text-gray-500"
                  >
                    No pledges found
                  </td>
                </tr>
              ) : (
                filteredPledges.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    {/* NAME */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700">
                          {p.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-medium">{p.name}</div>
                      </div>
                    </td>

                    {/* CONTACT */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {p.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" /> {p.email}
                        </div>
                      )}
                      {p.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" /> {p.phone}
                        </div>
                      )}
                    </td>

                    {/* LOCATION */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <div>
                          <div className="font-medium">
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
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(p.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deletePledge(p._id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded"
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

export default PledgeAdmin;
