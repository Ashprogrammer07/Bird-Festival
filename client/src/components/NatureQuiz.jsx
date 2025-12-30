import { useState, useEffect, useRef } from 'react';
import { quizAPI } from '../services/api';

const NatureQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  
  // New States for Certificate
  const [userName, setUserName] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getPublishedQuizzes();
      setQuizzes(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load quizzes');
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setUserName(''); // Reset name on new quiz
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSubmit = async () => {
    if (!selectedQuiz) return;

    let correctCount = 0;
    selectedQuiz.questions.forEach((question) => {
      if (answers[question._id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const result = {
      correct: correctCount,
      total: selectedQuiz.questions.length,
      percentage: Math.round(
        (correctCount / selectedQuiz.questions.length) * 100
      ),
    };

    setScore(result);
    setSubmitted(true);

    try {
      await quizAPI.submitQuiz({
        quizId: selectedQuiz._id,
        answers,
        score: result.correct,
        totalQuestions: result.total,
        percentage: result.percentage,
      });
    } catch (err) {
      console.warn("Quiz submission failed (UI not affected)", err);
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setUserName('');
  };

  // --- CERTIFICATE GENERATION LOGIC ---
  const downloadCertificate = () => {
    if (!userName.trim()) {
      alert("Please enter your name to generate the certificate.");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 1. Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. Draw Border
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#f59e0b'; // Amber-500
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#166534'; // Green-800
    ctx.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);

    // 4. Draw Header Text
    ctx.font = 'bold 40px Serif';
    ctx.fillStyle = '#166534'; // Green-800
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', canvas.width / 2, 120);

    // 5. Draw Subtext
    ctx.font = '20px Sans-Serif';
    ctx.fillStyle = '#555';
    ctx.fillText('This certifies that', canvas.width / 2, 180);

    // 6. Draw User Name
    ctx.font = 'bold italic 50px Serif';
    ctx.fillStyle = '#000';
    ctx.fillText(userName, canvas.width / 2, 250);
    
    // Draw line under name
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 200, 260);
    ctx.lineTo(canvas.width / 2 + 200, 260);
    ctx.strokeStyle = '#ccc';
    ctx.stroke();

    // 7. Draw Achievement Details
    ctx.font = '20px Sans-Serif';
    ctx.fillStyle = '#555';
    ctx.fillText('Has successfully completed the', canvas.width / 2, 320);
    
    ctx.font = 'bold 30px Serif';
    ctx.fillStyle = '#f59e0b'; // Amber
    ctx.fillText(selectedQuiz.title, canvas.width / 2, 360);

    ctx.font = '20px Sans-Serif';
    ctx.fillStyle = '#555';
    ctx.fillText(`With a score of ${score.percentage}%`, canvas.width / 2, 410);

    // 8. Date
    const date = new Date().toLocaleDateString();
    ctx.font = 'italic 16px Sans-Serif';
    ctx.fillStyle = '#999';
    ctx.fillText(`Date: ${date}`, canvas.width / 2, 500);

    // --- TRIGGER DOWNLOAD ---
    const link = document.createElement('a');
    link.download = `Certificate_${userName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (error && quizzes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchQuizzes} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-lg transition">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!selectedQuiz) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 md:mb-6 text-center">Nature Quiz</h2>
          <p className="text-gray-600 text-center mb-6 md:mb-8 text-sm md:text-base">
            Test your knowledge about birds and nature. Select a quiz to begin!
          </p>

          {quizzes.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <p className="text-gray-500 text-base md:text-lg">No quizzes available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="border-2 border-gray-200 rounded-lg p-6 hover:border-amber-500 transition cursor-pointer"
                  onClick={() => handleQuizSelect(quiz)}
                >
                  <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 mb-4">{quiz.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{quiz.questions?.length || 0} Questions</span>
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                      {quiz.difficulty || 'Medium'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0">
      {/* Hidden Canvas for Certificate Generation */}
      <canvas ref={canvasRef} width={800} height={600} className="hidden" />

      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-4">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-serif font-bold">{selectedQuiz.title}</h2>
            <p className="text-gray-600 mt-2 text-sm md:text-base">{selectedQuiz.description}</p>
          </div>
          <button onClick={resetQuiz} className="text-gray-600 hover:text-gray-800 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!submitted ? (
          <>
            <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
              {selectedQuiz.questions?.map((question, index) => (
                <div key={question._id} className="border-b border-gray-200 pb-4 md:pb-6">
                  <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
                    {index + 1}. {question.questionText}
                  </h3>
                  <div className="space-y-2 md:space-y-3">
                    {question.options?.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                          answers[question._id] === option
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question._id}`}
                          value={option}
                          checked={answers[question._id] === option}
                          onChange={() => handleAnswerChange(question._id, option)}
                          className="mr-3 w-4 h-4 text-amber-500"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== selectedQuiz.questions?.length}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              Submit Quiz
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="text-6xl font-bold text-amber-500 mb-2">{score.percentage}%</div>
              <p className="text-xl text-gray-700">
                You scored {score.correct} out of {score.total} questions
              </p>
            </div>
            
            {/* --- CERTIFICATE SECTION START --- */}
            {score.percentage >= 50 && ( // Only show if they passed (optional condition)
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-green-800 mb-2">🎉 Claim Your Certificate</h3>
                <p className="text-sm text-green-700 mb-4">Enter your name as you want it to appear on the certificate.</p>
                
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Enter Full Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-full"
                  />
                  <button
                    onClick={downloadCertificate}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Certificate
                  </button>
                </div>
              </div>
            )}
            {/* --- CERTIFICATE SECTION END --- */}

            <div className="mt-8 space-y-4 text-left">
              {selectedQuiz.questions?.map((question, index) => {
                const userAnswer = answers[question._id];
                const isCorrect = userAnswer === question.correctAnswer;
                return (
                  <div
                    key={question._id}
                    className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{index + 1}. {question.questionText}</h4>
                      {isCorrect ? (
                        <span className="text-green-600 font-bold">✓ Correct</span>
                      ) : (
                        <span className="text-red-600 font-bold">✗ Incorrect</span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-semibold">Your answer:</span>{' '}
                        <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>{userAnswer}</span>
                      </p>
                      {!isCorrect && (
                        <p>
                          <span className="font-semibold">Correct answer:</span>{' '}
                          <span className="text-green-700">{question.correctAnswer}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={resetQuiz}
              className="mt-8 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Try Another Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NatureQuiz;