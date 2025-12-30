import { useEffect, useState } from "react";
import { adminQuizAPI } from "../../services/adminApi";
import { 
  FileCheck, 
  Search, 
  Download, 
  Loader2, 
  Calendar, 
  Trophy,
  AlertCircle
} from "lucide-react";

const QuizSubmissionsAdmin = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubmissions = async () => {
    try {
      const res = await adminQuizAPI.submissions();
      // Sort by newest first
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setSubmissions(sorted);
    } catch (err) {
      console.error("Failed to fetch submissions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // --- Helpers ---
  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const downloadCSV = () => {
    const headers = ["Quiz Title", "Score", "Total Questions", "Percentage", "Date"];
    const csvContent = [
      headers.join(","),
      ...filteredSubmissions.map(s => {
        const title = `"${s.quizId?.title || 'Unknown Quiz'}"`;
        const date = new Date(s.createdAt).toLocaleDateString();
        return [title, s.score, s.totalQuestions, `${s.percentage}%`, date].join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `quiz_submissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Filter Logic ---
  const filteredSubmissions = submissions.filter((s) => 
    s.quizId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Calculated Stats ---
  const averageScore = submissions.length > 0 
    ? (submissions.reduce((acc, curr) => acc + curr.percentage, 0) / submissions.length).toFixed(1)
    : 0;

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
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <FileCheck className="w-6 h-6 text-purple-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quiz Results</h1>
            <p className="text-sm text-gray-500">
              Avg. Performance: <span className="font-bold text-gray-700">{averageScore}%</span> across {submissions.length} attempts
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by quiz title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Export */}
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quiz Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Taken</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No submissions found.</p>
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Quiz Title */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {s.quizId?.title || <span className="text-red-400 italic">Deleted Quiz</span>}
                      </div>
                      <div className="text-xs text-gray-500">ID: {s._id.slice(-6)}</div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {new Date(s.createdAt).toLocaleString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </td>

                    {/* Score (Fraction) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="font-bold text-gray-700 text-sm">
                         {s.score} <span className="text-gray-400 font-normal">/ {s.totalQuestions}</span>
                       </span>
                    </td>

                    {/* Performance Bar & Badge */}
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${getProgressBarColor(s.percentage)}`} 
                            style={{ width: `${s.percentage}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded border ${getScoreColor(s.percentage)}`}>
                          {s.percentage}%
                        </span>
                      </div>
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

export default QuizSubmissionsAdmin;