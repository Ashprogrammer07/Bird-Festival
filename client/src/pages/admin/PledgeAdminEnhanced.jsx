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
    CheckSquare,
    Square,
} from "lucide-react";

const PledgeAdminEnhanced = () => {
    const [pledges, setPledges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [exporting, setExporting] = useState(false);

    const fetchPledges = async () => {
        try {
            const res = await adminPledgeAPI.getAll();
            // Handle both {data: {data: []}} and {data: []} response formats
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

    const deletePledge = async (id) => {
        if (!window.confirm("Are you sure you want to remove this pledge?")) return;
        try {
            await adminPledgeAPI.delete(id);
            setPledges((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            alert("Failed to delete pledge");
        }
    };

    /* ================= SERVER-SIDE CSV EXPORT ================= */
    const downloadCSV = async () => {
        setExporting(true);
        try {
            const response = await adminPledgeAPI.exportCSV();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `pledges_${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export failed:', err);
            alert('Failed to export CSV');
        } finally {
            setExporting(false);
        }
    };

    /* ================= BULK SELECTION ================= */
    const toggleSelectAll = () => {
        if (selectedIds.length === filteredPledges.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredPledges.map(p => p._id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    /* ================= BULK DELETE ================= */
    const bulkDelete = async () => {
        if (selectedIds.length === 0) {
            alert('Please select pledges to delete');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} pledge(s)?`)) {
            return;
        }

        setBulkDeleting(true);
        try {
            await adminPledgeAPI.bulkDelete(selectedIds);
            setPledges(pledges.filter(p => !selectedIds.includes(p._id)));
            setSelectedIds([]);
            alert(`Successfully deleted ${selectedIds.length} pledge(s)`);
        } catch (err) {
            console.error('Bulk delete failed:', err);
            alert('Failed to delete pledges');
        } finally {
            setBulkDeleting(false);
        }
    };

    /* ================= SEARCH ================= */
    const filteredPledges = (pledges || []).filter((p) => {
        const term = searchTerm.toLowerCase();
        return (
            (p.name || '').toLowerCase().includes(term) ||
            (p.email || '').toLowerCase().includes(term) ||
            (p.location?.state || '').toLowerCase().includes(term) ||
            (p.location?.district || '').toLowerCase().includes(term)
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
                            {selectedIds.length > 0 && (
                                <span className="ml-2 text-blue-600">
                                    ({selectedIds.length} selected)
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    {/* SEARCH */}
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search name, email, state..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>

                    {/* EXPORT */}
                    <button
                        onClick={downloadCSV}
                        disabled={exporting}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        {exporting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <FileDown className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">Export</span>
                    </button>

                    {/* BULK DELETE */}
                    {selectedIds.length > 0 && (
                        <button
                            onClick={bulkDelete}
                            disabled={bulkDeleting}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {bulkDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">Delete ({selectedIds.length})</span>
                        </button>
                    )}
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        {selectedIds.length === filteredPledges.length && filteredPledges.length > 0 ? (
                                            <CheckSquare className="w-5 h-5" />
                                        ) : (
                                            <Square className="w-5 h-5" />
                                        )}
                                    </button>
                                </th>
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
                                        colSpan="6"
                                        className="text-center py-12 text-gray-500"
                                    >
                                        <HandHeart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p>No pledges found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredPledges.map((p) => (
                                    <tr
                                        key={p._id}
                                        className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(p._id) ? 'bg-blue-50' : ''}`}
                                    >
                                        {/* CHECKBOX */}
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleSelect(p._id)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                {selectedIds.includes(p._id) ? (
                                                    <CheckSquare className="w-5 h-5 text-blue-600" />
                                                ) : (
                                                    <Square className="w-5 h-5" />
                                                )}
                                            </button>
                                        </td>

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
                                                className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
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

export default PledgeAdminEnhanced;
