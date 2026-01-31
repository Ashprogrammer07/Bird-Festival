
import { useState, useEffect } from 'react';
import { quizAPI } from '../services/api';
import { generateQuizCertificate } from '../utils/certificateGenerator';
import { useLanguage } from '../context/LanguageContext';

const NatureQuiz = () => {
  const { t, language } = useLanguage();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quiz Flow States
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showStartForm, setShowStartForm] = useState(false);
  // unused state: quizStarted, can be derived from showStartForm=false and selectedQuiz!=null

  // User Data
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Answers & Results
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, [language]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getPublishedQuizzes(language);
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
    setShowStartForm(true); // Show form after selecting quiz
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setUserName('');
    setUserEmail('');
  };

  const handleStartQuiz = () => {
    if (userName.trim() && userEmail.trim()) {
      setShowStartForm(false);
    }
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
      // Find index of selected answer string in options array
      const selectedIndex = question.options.indexOf(answers[question._id]);
      if (selectedIndex === question.correctAnswer) {
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
    setSubmitting(true);

    try {
      await quizAPI.submitQuiz({
        quizId: selectedQuiz._id,
        userName,
        userEmail,
        answers,
        score: result.correct,
        totalQuestions: result.total,
        percentage: result.percentage,
      });
    } catch (err) {
      console.warn("Quiz submission failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setShowStartForm(false);
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setUserName('');
    setUserEmail('');
  };

  const handleDownloadCertificate = () => {
    if (score && selectedQuiz) {
      generateQuizCertificate(userName, score.correct, score.total);
    }
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

  // 1. SELECT QUIZ SCREEN
  if (!selectedQuiz) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 md:mb-6 text-center">{t('quizSection.title')}</h2>
          <p className="text-gray-600 text-center mb-6 md:mb-8 text-sm md:text-base">
            {t('quizSection.subtitle')}
          </p>

          {quizzes.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <p className="text-gray-500 text-base md:text-lg">{t('quizSection.noQuizzes')}</p>
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

  // 2. ENTER DETAILS SCREEN
  if (showStartForm) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <button onClick={() => setSelectedQuiz(null)} className="text-gray-500 hover:text-gray-700 mb-4">
            ← Back to Quizzes
          </button>
          <h2 className="text-2xl font-serif font-bold mb-2 text-center">{selectedQuiz.title}</h2>
          <p className="text-gray-600 mb-6 text-center">Enter your details to start the quiz</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="john@example.com"
              />
            </div>
            <button
              onClick={handleStartQuiz}
              disabled={!userName.trim() || !userEmail.trim()}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. QUIZ & RESULTS SCREEN
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0">
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-4">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-serif font-bold">{selectedQuiz.title}</h2>
            <p className="text-gray-600 mt-2 text-sm md:text-base">{selectedQuiz.description}</p>
          </div>
          {!submitted && (
            <button onClick={resetQuiz} className="text-gray-600 hover:text-gray-800 transition">
              Cancel
            </button>
          )}
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
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${answers[question._id] === option
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
              disabled={Object.keys(answers).length !== selectedQuiz.questions?.length || submitting}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
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

            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={handleDownloadCertificate}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow flex items-center gap-2"
              >
                <span>📜</span> Download Certificate
              </button>
            </div>

            <div className="mt-8 space-y-4 text-left">
              {selectedQuiz.questions?.map((question, index) => {
                const userAnswer = answers[question._id];
                const selectedIndex = question.options.indexOf(userAnswer);
                const isCorrect = selectedIndex === question.correctAnswer;
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
                          <span className="text-green-700">{question.options[question.correctAnswer]}</span>
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