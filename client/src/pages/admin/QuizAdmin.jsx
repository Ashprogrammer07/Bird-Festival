import { useEffect, useState } from "react";
import { adminQuizAPI } from "../../services/adminApi";
import { 
  FileQuestion, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle, 
  Save, 
  LayoutList, 
  ArrowLeft,
  Loader2,
  MoreVertical,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";

const emptyQuiz = {
  title: "",
  description: "",
  difficulty: "Medium",
};

const emptyQuestion = {
  questionText: "",
  options: ["", "", "", ""],
  correctAnswer: "",
};

const QuizAdmin = () => {
  // Tabs: 'quizzes' (List view) | 'questions' (Detail view)
  const [activeTab, setActiveTab] = useState("quizzes");
  
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Forms
  const [quizForm, setQuizForm] = useState(emptyQuiz);
  const [questionForm, setQuestionForm] = useState(emptyQuestion);

  // Edit States
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

  /* ================= FETCH ================= */
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await adminQuizAPI.getAll();
      setQuizzes(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  /* ================= QUIZ CRUD ================= */
  const handleEditQuizObj = (quiz) => {
    setEditingQuiz(quiz);
    setQuizForm({
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveQuiz = async () => {
    if (!quizForm.title) {
      setError("Quiz title is required");
      return;
    }
    setError("");

    try {
      if (editingQuiz) {
        await adminQuizAPI.update(editingQuiz._id, quizForm);
        setEditingQuiz(null);
      } else {
        await adminQuizAPI.create(quizForm);
      }
      setQuizForm(emptyQuiz);
      fetchQuizzes();
    } catch (err) {
      setError("Failed to save quiz");
    }
  };

  const deleteQuiz = async (id) => {
    if (!window.confirm("Are you sure? This will delete the quiz and all its questions.")) return;
    try {
      await adminQuizAPI.delete(id);
      if (selectedQuiz?._id === id) {
        setSelectedQuiz(null);
        setActiveTab("quizzes");
      }
      fetchQuizzes();
    } catch (err) {
      alert("Failed to delete quiz");
    }
  };

  const togglePublish = async (id) => {
    try {
      await adminQuizAPI.togglePublish(id);
      fetchQuizzes();
      // Update selected quiz locally if it's currently open
      if (selectedQuiz && selectedQuiz._id === id) {
        setSelectedQuiz(prev => ({ ...prev, isPublished: !prev.isPublished }));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  /* ================= QUESTION CRUD ================= */
  const openQuestionManager = (quiz) => {
    setSelectedQuiz(quiz);
    setActiveTab("questions");
    setQuestionForm(emptyQuestion);
    setEditingQuestionIndex(null);
    setError("");
  };

  const saveQuestion = async () => {
    // Validation
    if (!questionForm.questionText.trim()) {
      setError("Question text is required");
      return;
    }
    if (questionForm.options.some((o) => !o.trim())) {
      setError("All 4 options must be filled");
      return;
    }
    if (!questionForm.correctAnswer) {
      setError("Please select the correct answer (click the checkmark next to an option)");
      return;
    }
    setError("");

    // Prepare payload
    let updatedQuestions = [...(selectedQuiz.questions || [])];

    if (editingQuestionIndex !== null) {
      updatedQuestions[editingQuestionIndex] = questionForm;
    } else {
      updatedQuestions.push(questionForm);
    }

    try {
      const res = await adminQuizAPI.update(selectedQuiz._id, {
        questions: updatedQuestions,
      });

      setSelectedQuiz(res.data); // Update local state with server response
      setQuestionForm(emptyQuestion);
      setEditingQuestionIndex(null);
      
      // Update the list in background so "Q count" is correct if we go back
      fetchQuizzes(); 
    } catch (err) {
      setError("Failed to save question");
    }
  };

  const editQuestion = (q, index) => {
    setQuestionForm(q);
    setEditingQuestionIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteQuestion = async (index) => {
    if (!window.confirm("Remove this question?")) return;

    const updatedQuestions = selectedQuiz.questions.filter((_, i) => i !== index);

    try {
      const res = await adminQuizAPI.update(selectedQuiz._id, {
        questions: updatedQuestions,
      });
      setSelectedQuiz(res.data);
      fetchQuizzes();
    } catch (err) {
      alert("Failed to delete question");
    }
  };

  // Helper to set correct answer by clicking an option
  const setCorrectOption = (optValue) => {
    setQuestionForm({ ...questionForm, correctAnswer: optValue });
  };

  if (loading && quizzes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-2">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <FileQuestion className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quiz Management</h1>
            <p className="text-sm text-gray-500">Create quizzes and manage questions</p>
          </div>
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* ================= VIEW: QUIZ LIST & CREATE ================= */}
      {activeTab === "quizzes" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Quiz Form (4 cols) */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                {editingQuiz ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingQuiz ? "Edit Quiz Details" : "Create New Quiz"}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Title</label>
                  <input
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="e.g. Bird Species of India"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                  <textarea
                    rows="3"
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                    placeholder="Short description..."
                    value={quizForm.description}
                    onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Difficulty</label>
                  <select
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                    value={quizForm.difficulty}
                    onChange={(e) => setQuizForm({ ...quizForm, difficulty: e.target.value })}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  {editingQuiz && (
                    <button
                      onClick={() => { setEditingQuiz(null); setQuizForm(emptyQuiz); }}
                      className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={saveQuiz}
                    className="flex-1 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition shadow-lg shadow-green-900/20"
                  >
                    {editingQuiz ? "Update Details" : "Create Quiz"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Quiz List (8 cols) */}
          <div className="lg:col-span-8 order-1 lg:order-2 space-y-4">
            {quizzes.length === 0 ? (
               <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                 <p className="text-gray-500">No quizzes found. Create one to get started.</p>
               </div>
            ) : (
              quizzes.map((quiz) => (
                <div key={quiz._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-4">
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                        quiz.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {quiz.isPublished ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase">
                        {quiz.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{quiz.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{quiz.description || "No description provided."}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <LayoutList className="w-4 h-4" />
                        {quiz.questions?.length || 0} Questions
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col items-center justify-center gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4">
                    <button
                      onClick={() => openQuestionManager(quiz)}
                      className="w-full md:w-auto px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <LayoutList className="w-4 h-4" /> Manage Questions
                    </button>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                      <button
                        onClick={() => togglePublish(quiz._id)}
                        className="flex-1 p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                        title={quiz.isPublished ? "Unpublish" : "Publish"}
                      >
                        {quiz.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEditQuizObj(quiz)}
                        className="flex-1 p-2 rounded-lg hover:bg-gray-100 text-blue-600 transition-colors"
                        title="Edit Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteQuiz(quiz._id)}
                        className="flex-1 p-2 rounded-lg hover:bg-gray-100 text-red-600 transition-colors"
                        title="Delete Quiz"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= VIEW: QUESTIONS MANAGER ================= */}
      {activeTab === "questions" && selectedQuiz && (
        <div>
          {/* Back Button & Header */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <button 
              onClick={() => setActiveTab("quizzes")}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Editing: {selectedQuiz.title}</h2>
              <p className="text-sm text-gray-500">
                {selectedQuiz.questions?.length || 0} Questions Total
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT: Questions List (7 cols) */}
            <div className="lg:col-span-7 order-2 lg:order-1 space-y-3">
               {(!selectedQuiz.questions || selectedQuiz.questions.length === 0) && (
                 <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed text-gray-400">
                   No questions added yet.
                 </div>
               )}
               
               {selectedQuiz.questions?.map((q, index) => (
                 <div 
                    key={index} 
                    className={`bg-white p-4 rounded-lg border transition-all ${
                      editingQuestionIndex === index 
                        ? "border-blue-500 ring-1 ring-blue-500 shadow-md" 
                        : "border-gray-200 shadow-sm hover:border-blue-300"
                    }`}
                 >
                   <div className="flex justify-between items-start gap-4">
                     <div>
                       <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded mb-2">
                         Q{index + 1}
                       </span>
                       <p className="font-medium text-gray-800 mb-2">{q.questionText}</p>
                       <div className="text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded inline-flex items-center gap-2 border border-green-100">
                         <CheckCircle className="w-3 h-3" />
                         Answer: <span className="font-semibold">{q.correctAnswer}</span>
                       </div>
                     </div>
                     
                     <div className="flex flex-col gap-1">
                       <button 
                         onClick={() => editQuestion(q, index)}
                         className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                         title="Edit"
                       >
                         <Edit2 className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => deleteQuestion(index)}
                         className="p-2 text-red-600 hover:bg-red-50 rounded"
                         title="Delete"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                 </div>
               ))}
            </div>

            {/* RIGHT: Editor Form (5 cols) */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
                  <span>
                    {editingQuestionIndex !== null ? `Edit Question ${editingQuestionIndex + 1}` : "Add New Question"}
                  </span>
                  {editingQuestionIndex !== null && (
                    <button 
                      onClick={() => {
                        setEditingQuestionIndex(null); 
                        setQuestionForm(emptyQuestion);
                      }}
                      className="text-xs text-red-500 hover:underline font-normal"
                    >
                      Cancel Edit
                    </button>
                  )}
                </h3>

                <div className="space-y-4">
                  {/* Question Text */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Question Text</label>
                    <textarea
                      rows="2"
                      className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      placeholder="Enter the question here..."
                      value={questionForm.questionText}
                      onChange={(e) => setQuestionForm({...questionForm, questionText: e.target.value})}
                    />
                  </div>

                  {/* Options */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2 mb-2">
                      Options <span className="normal-case font-normal text-gray-400">(Click circle to mark correct)</span>
                    </label>
                    <div className="space-y-2">
                      {questionForm.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <button
                            onClick={() => setCorrectOption(opt)}
                            disabled={!opt}
                            className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                              questionForm.correctAnswer === opt && opt !== ""
                                ? "bg-green-600 border-green-600 text-white"
                                : "bg-white border-gray-300 text-transparent hover:border-green-400"
                            }`}
                            title="Mark as correct answer"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <input
                            className={`flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                               questionForm.correctAnswer === opt && opt !== "" ? "border-green-500 bg-green-50/30" : ""
                            }`}
                            placeholder={`Option ${i + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...questionForm.options];
                              newOpts[i] = e.target.value;
                              
                              // If editing the option that was the correct answer, update correct answer text too
                              let newCorrect = questionForm.correctAnswer;
                              if (questionForm.correctAnswer === opt) {
                                newCorrect = e.target.value;
                              }

                              setQuestionForm({
                                ...questionForm,
                                options: newOpts,
                                correctAnswer: newCorrect
                              });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={saveQuestion}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingQuestionIndex !== null ? "Update Question" : "Add Question"}
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

export default QuizAdmin;