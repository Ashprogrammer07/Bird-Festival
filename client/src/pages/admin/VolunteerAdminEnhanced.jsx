import { useEffect, useState } from "react";
import { adminVolunteerAPI } from "../../services/adminApi";
import {
    Users,
    Search,
    Trash2,
    ExternalLink,
    Loader2,
    Mail,
    Phone,
    FileText,
    Download,
    GraduationCap,
    CheckSquare,
    Square
} from "lucide-react";

const VolunteerAdmin = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [exporting, setExporting] = useState(false);

    const fetchVolunteers = async () => {
        try {
            const res = await adminVolunteerAPI.getAll();
            // Handle both {data: []} and [] response formats
            setVolunteers(res.data.data || res.data || []);
        } catch (err) {
            console.error(err);
            alert("Failed to load volunteers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const deleteVolunteer = async (id) => {
        if (!window.confirm("Are you sure you want to remove this volunteer application?")) return;
        try {
            await adminVolunteerAPI.delete(id);
            setVolunteers(volunteers.filter(v => v._id !== id));
        } catch (err) {
            alert("Failed to delete volunteer");
        }
    };

    // --- Server-side CSV Export ---
    const downloadCSV = async () => {
        setExporting(true);
        try {
            const response = await adminVolunteerAPI.exportCSV();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `volunteers_${Date.now()}.csv`);
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

    // --- Bulk Selection ---
    const toggleSelectAll = () => {
        if (selectedIds.length === filteredVolunteers.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredVolunteers.map(v => v._id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // --- Bulk Delete ---
    const bulkDelete = async () => {
        if (selectedIds.length === 0) {
            alert('Please select volunteers to delete');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} volunteer(s)?`)) {
            return;
        }

        setBulkDeleting(true);
        try {
            await adminVolunteerAPI.bulkDelete(selectedIds);
            setVolunteers(volunteers.filter(v => !selectedIds.includes(v._id)));
            setSelectedIds([]);
            alert(`Successfully deleted ${selectedIds.length} volunteer(s)`);
        } catch (err) {
            console.error('Bulk delete failed:', err);
            alert('Failed to delete volunteers');
        } finally {
            setBulkDeleting(false);
        }
    };

    // --- Filter Logic ---
    const filteredVolunteers = (volunteers || []).filter((v) =>
        (v.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                        <Users className="w-6 h-6 text-orange-700" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Volunteer Applications</h2>
                        <p className="text-sm text-gray-500">
                            <span className="font-bold text-orange-600">{volunteers.length}</span> active applications.
                            {selectedIds.length > 0 && (
                                <span className="ml-2 text-blue-600">
                                    ({selectedIds.length} selected)
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search volunteers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>

                    {/* Export */}
                    <button
                        onClick={downloadCSV}
                        disabled={exporting}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        title="Download CSV"
                    >
                        {exporting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">Export</span>
                    </button>

                    {/* Bulk Delete */}
                    {selectedIds.length > 0 && (
                        <button
                            onClick={bulkDelete}
                            disabled={bulkDeleting}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            title="Delete Selected"
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

            {/* --- TABLE --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        {selectedIds.length === filteredVolunteers.length && filteredVolunteers.length > 0 ? (
                                            <CheckSquare className="w-5 h-5" />
                                        ) : (
                                            <Square className="w-5 h-5" />
                                        )}
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Info</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Qualification</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Documents</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredVolunteers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p>No volunteers found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredVolunteers.map((v) => (
                                    <tr
                                        key={v._id}
                                        className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(v._id) ? 'bg-blue-50' : ''}`}
                                    >
                                        {/* Checkbox */}
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleSelect(v._id)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                {selectedIds.includes(v._id) ? (
                                                    <CheckSquare className="w-5 h-5 text-blue-600" />
                                                ) : (
                                                    <Square className="w-5 h-5" />
                                                )}
                                            </button>
                                        </td>

                                        {/* Applicant Name */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-sm">
                                                    {v.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{v.name}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact Info */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail className="w-3 h-3 text-gray-400" /> {v.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="w-3 h-3 text-gray-400" /> {v.phone}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Qualification */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4 text-gray-400" />
                                                {v.educationalQualification || "Not specified"}
                                            </div>
                                        </td>

                                        {/* Documents */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {v.addressProofUrl ? (
                                                <a
                                                    href={v.addressProofUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
                                                >
                                                    <FileText className="w-3 h-3" />
                                                    Address Proof
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-sm italic">Pending</span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => deleteVolunteer(v._id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                title="Delete Application"
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

export default VolunteerAdmin;
