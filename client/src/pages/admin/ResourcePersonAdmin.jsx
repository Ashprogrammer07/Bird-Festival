import { useEffect, useState } from "react";
import { adminResourcePersonAPI } from "../../services/adminApi";
import { 
  Mic2, 
  Trash2, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Briefcase, 
  X, 
  User, 
  Loader2,
  Award
} from "lucide-react";

const ResourcePersonAdmin = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    expertise: "",
    designation: "" // Added designation for better profile completeness
  });

  const fetchResourcePersons = async () => {
    try {
      const res = await adminResourcePersonAPI.getAll();
      setPersons(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load resource persons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResourcePersons();
  }, []);

  const deletePerson = async (id) => {
    if (!window.confirm("Are you sure you want to remove this resource person?")) return;
    try {
      await adminResourcePersonAPI.delete(id);
      setPersons(persons.filter(p => p._id !== id));
    } catch (err) {
      alert("Failed to delete person");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming api.create exists, if not, you'll need to add it to your service
      await adminResourcePersonAPI.create(form); 
      setShowAddModal(false);
      setForm({ name: "", email: "", phone: "", expertise: "", designation: "" });
      fetchResourcePersons();
    } catch (err) {
      alert("Failed to add resource person");
    }
  };

  // Filter Logic
  const filteredPersons = persons.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.expertise?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Mic2 className="w-6 h-6 text-indigo-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Resource Persons</h2>
            <p className="text-sm text-gray-500">Manage speakers and experts.</p>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search experts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Add Button */}
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Person</span>
          </button>
        </div>
      </div>

      {/* --- CARD GRID / TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Profile</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expertise</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPersons.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <Mic2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No resource persons found.</p>
                  </td>
                </tr>
              ) : (
                filteredPersons.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Profile */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.designation || "Guest Speaker"}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-3 h-3 text-gray-400" /> {p.email}
                        </div>
                        {p.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3 h-3 text-gray-400" /> {p.phone}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Expertise */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {p.expertise ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                          <Award className="w-3 h-3" />
                          {p.expertise}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => deletePerson(p._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete"
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

      {/* --- ADD MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
              <h3 className="font-bold text-indigo-900">Add Resource Person</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    required
                    className="w-full pl-9 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Dr. John Doe"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    required
                    type="email"
                    className="w-full pl-9 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Phone Number</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    className="w-full pl-9 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Expertise / Topic</label>
                <div className="relative mt-1">
                  <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input 
                    className="w-full pl-9 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Ornithology, Wetland Conservation"
                    value={form.expertise}
                    onChange={(e) => setForm({...form, expertise: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors mt-2">
                Save Resource Person
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcePersonAdmin;