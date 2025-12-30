import { useEffect, useState } from "react";
import { adminContactAPI } from "../../services/adminApi";
import { 
  MessageSquare, 
  Mail, 
  Trash2, 
  CheckCircle, 
  Eye, 
  X, 
  Clock, 
  User,
  Loader2,
  Reply
} from "lucide-react";

const ContactAdmin = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null); // For Modal

  const fetchContacts = async () => {
    try {
      const res = await adminContactAPI.getAll();
      // Sort: Unread first, then by date (newest first)
      const sorted = res.data.sort((a, b) => {
        if (a.isRead === b.isRead) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.isRead ? 1 : -1;
      });
      setContacts(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const markAsRead = async (id, e) => {
    e?.stopPropagation(); // Prevent opening modal when clicking this button
    try {
      await adminContactAPI.markRead(id, true);
      // Optimistic Update
      setContacts(prev => prev.map(c => c._id === id ? { ...c, isRead: true } : c));
      
      // Also update modal if open
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(prev => ({ ...prev, isRead: true }));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const deleteContact = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await adminContactAPI.delete(id);
      setContacts(prev => prev.filter(c => c._id !== id));
      setSelectedMessage(null); // Close modal if open
    } catch (err) {
      alert("Failed to delete message");
    }
  };

  // Calculate stats
  const unreadCount = contacts.filter(c => !c.isRead).length;

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <MessageSquare className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Inbox</h2>
            <p className="text-sm text-gray-500">
              You have <span className="font-bold text-blue-600">{unreadCount} unread</span> messages.
            </p>
          </div>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sender</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject / Message</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No messages received yet.</p>
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr 
                    key={c._id} 
                    onClick={() => setSelectedMessage(c)}
                    className={`group transition-colors cursor-pointer ${
                      !c.isRead ? "bg-blue-50/60 hover:bg-blue-100/50" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          !c.isRead ? "bg-blue-200 text-blue-700" : "bg-gray-200 text-gray-600"
                        }`}>
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm ${!c.isRead ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                            {c.name}
                          </div>
                          <div className="text-xs text-gray-500">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate text-sm text-gray-600">
                        {c.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {c.isRead ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> New
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                         {!c.isRead && (
                           <button
                             onClick={(e) => markAsRead(c._id, e)}
                             className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                             title="Mark as Read"
                           >
                             <CheckCircle className="w-4 h-4" />
                           </button>
                         )}
                         <button
                           onClick={(e) => deleteContact(c._id, e)}
                           className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                           title="Delete"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                         <button
                           className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                           title="View Details"
                         >
                           <Eye className="w-4 h-4" />
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

      {/* --- MESSAGE DETAILS MODAL --- */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                Message Details
              </h3>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                 <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {selectedMessage.name.charAt(0).toUpperCase()}
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900 text-lg">{selectedMessage.name}</h4>
                    <p className="text-blue-600 text-sm flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {selectedMessage.email}
                    </p>
                    <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                 </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
              <button
                 onClick={() => deleteContact(selectedMessage._id)}
                 className="text-red-600 text-sm hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete Message
              </button>

              <div className="flex gap-2">
                {!selectedMessage.isRead && (
                  <button
                    onClick={(e) => markAsRead(selectedMessage._id, e)}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Mark as Read
                  </button>
                )}
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: Inquiry regarding Birds Festival`}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Reply className="w-4 h-4" /> Reply via Email
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ContactAdmin;