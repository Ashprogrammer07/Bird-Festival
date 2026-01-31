
import { useState, useEffect } from "react";
import { generateQuizCertificate } from "../utils/certificateGenerator";
import { quizAPI } from "../services/api";

const BirdQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [participantName, setParticipantName] = useState("");
  const [participantEmail, setParticipantEmail] = useState("");
  const [showNameInput, setShowNameInput] = useState(true);
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const output = await quizAPI.getPublishedQuizzes();
      // Assuming output.data.data is the array of quizzes based on standard API response wrapper
      const quizzes = output.data.data;

      if (quizzes && quizzes.length > 0) {
        setQuizData(quizzes[0]);
      }
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex,
    });
  };

  const handleNext = () => {
    if (quizData && currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getScore = () => {
    if (!quizData) return 0;
    let score = 0;
    quizData.questions.forEach((q, index) => {
      const selectedIndex = selectedAnswers[index];
      if (selectedIndex !== undefined) {
        const selectedOption = q.options[selectedIndex];
        if (selectedOption === q.correctAnswer) {
          score++;
        }
      }
    });
    return score;
  };

  const finishQuiz = async () => {
    const score = getScore();
    setShowResults(true);

    if (quizData) {
      setSubmitting(true);
      try {
        await quizAPI.submitQuiz({
          quizId: quizData._id,
          userName: participantName,
          userEmail: participantEmail,
          score: score,
          totalQuestions: quizData.questions.length,
          percentage: Math.round((score / quizData.questions.length) * 100),
          answers: selectedAnswers,
        });
      } catch (error) {
        console.error("Failed to submit quiz results:", error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleStartQuiz = () => {
    if (participantName.trim() && participantEmail.trim()) {
      setShowNameInput(false);
    }
  };

  const handleDownloadCertificate = () => {
    if (!quizData) return;
    const score = getScore();
    generateQuizCertificate(participantName, score, quizData.questions.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl font-serif text-amber-600">Loading Quiz...</div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-serif text-gray-600">
          No quizzes available at the moment.
        </div>
      </div>
    );
  }

  const questions = quizData.questions;

  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div
          className="relative h-80 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero/1.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
                {quizData.title}
              </h1>
              <p className="text-xl text-gray-200">{quizData.description}</p>
            </div>
          </div>
        </div>

        <section className="py-16">
          <div className="container mx-auto px-6 max-w-md">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4 text-center">
                Enter Your Details
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Please enter your name and email to start the quiz
              </p>
              <input
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 mb-4"
              />
              <input
                type="email"
                value={participantEmail}
                onChange={(e) => setParticipantEmail(e.target.value)}
                placeholder="Your Email"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 mb-6"
              />
              <button
                onClick={handleStartQuiz}
                disabled={!participantName.trim() || !participantEmail.trim()}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (showResults) {
    const score = getScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gray-50">
        <div
          className="relative h-80 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero/1.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
                Quiz Results
              </h1>
            </div>
          </div>
        </div>

        <section className="py-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-32 h-32 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white">{score}</div>
                  <div className="text-xl text-white">/{questions.length}</div>
                </div>
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">
                Congratulations, {participantName}!
              </h2>
              <p className="text-2xl text-amber-600 font-semibold mb-6">
                You scored {percentage}%
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-1">Correct Answers</p>
                  <p className="text-3xl font-bold text-green-600">{score}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-1">Incorrect Answers</p>
                  <p className="text-3xl font-bold text-red-600">
                    {questions.length - score}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleDownloadCertificate}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  📜 Download Certificate
                </button>
                <button
                  onClick={() => {
                    setShowResults(false);
                    setCurrentQuestion(0);
                    setSelectedAnswers({});
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative h-80 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/hero/1.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
              {quizData.title}
            </h1>
            <p className="text-xl text-gray-200">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">
              {currentQ.questionText}
            </h2>

            <div className="space-y-4 mb-8">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all duration-300 ${selectedAnswers[currentQuestion] === index
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-white text-gray-800 border-gray-300 hover:border-amber-300"
                    }`}
                >
                  <span className="font-semibold mr-2">
                    {String.fromCharCode(65 + index)})
                  </span>
                  {option}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <span className="text-gray-600 font-semibold">
                {currentQuestion + 1} / {questions.length}
              </span>
              <button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] === undefined}
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestion === questions.length - 1 ? "Submit" : "Next →"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BirdQuiz;
