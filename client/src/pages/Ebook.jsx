import { useState, useEffect } from 'react';
import { ebookAPI, readingAPI } from '../services/api';
import Loader from '../components/Loader';
import { EBOOK_ID } from '../utils/ebookProgress';

const Ebook = () => {
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [readerName, setReaderName] = useState('');
  const [readerEmail, setReaderEmail] = useState('');
  const [startingReading, setStartingReading] = useState(false);
  const [completionStats, setCompletionStats] = useState(null);

  useEffect(() => {
    const fetchEbook = async () => {
      try {
        const response = await ebookAPI.getEbook();
        setEbook(response.data);
        
        // Fetch completion statistics
        if (response.data._id) {
          try {
            const statsResponse = await readingAPI.getCompletionStats(response.data._id);
            setCompletionStats(statsResponse.data);
          } catch (err) {
            console.log('Failed to fetch completion stats:', err);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEbook();
  }, []);

  useEffect(() => {
    // Check if there's a saved reader name and email, then load progress
    const savedName = localStorage.getItem('ebook_reader_name');
    const savedEmail = localStorage.getItem('ebook_reader_email');
    if (savedName && savedEmail && ebook) {
      setReaderName(savedName);
      setReaderEmail(savedEmail);
      loadProgress(savedName, savedEmail, ebook._id);
    }
  }, [ebook]);

  const loadProgress = async (name, email, ebookId) => {
    if (!name || !email || !ebookId) return;
    
    try {
      // Generate reader ID (same logic as backend - name + email combination)
      const readerIdString = `${name.trim().toLowerCase()}_${email.trim().toLowerCase()}`;
      const readerId = btoa(readerIdString).substring(0, 30);
      const response = await readingAPI.getProgress(ebookId, readerId);
      setProgress(response.data);
    } catch (err) {
      // Progress not found, that's okay
      console.log('No existing progress found');
    }
  };

  const handleRead = () => {
    if (!readerName.trim() || !readerEmail.trim()) {
      setShowNameInput(true);
      return;
    }
    startReadingSession();
  };

  const startReadingSession = async () => {
    if (!readerName.trim() || !readerEmail.trim() || !ebook) return;
    
    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(readerEmail.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    
    setStartingReading(true);
    setError(null);
    try {
      const response = await readingAPI.startReading({
        ebookId: ebook._id,
        readerName: readerName.trim(),
        readerEmail: readerEmail.trim(),
      });
      
      // Save reader name and email to localStorage
      localStorage.setItem('ebook_reader_name', readerName.trim());
      localStorage.setItem('ebook_reader_email', readerEmail.trim());
      
      // Load progress if it was restored
      if (response.data) {
        setProgress(response.data);
      }
      
      // Open reader in new tab
      window.open(
        `/reader/${EBOOK_ID}?name=${encodeURIComponent(readerName.trim())}&email=${encodeURIComponent(readerEmail.trim())}`, 
        '_blank'
      );
      setShowNameInput(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start reading session');
    } finally {
      setStartingReading(false);
    }
  };

  const handleNameSubmit = () => {
    if (readerName.trim() && readerEmail.trim()) {
      startReadingSession();
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('ebook_reader_name');
    localStorage.removeItem('ebook_reader_email');
    
    // Clear state
    setReaderName('');
    setReaderEmail('');
    setProgress(null);
    setShowNameInput(true);
  };

  if (loading) return <Loader />;

  if (!ebook) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">E-book not available at the moment.</p>
        </div>
      </div>
    );
  }

  const pdfUrl = ebook.fileUrl || '/book/Birds-of-Indian-Subcontinent.pdf';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-64 md:h-80 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/ebook/1.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-2 md:mb-4">
              Festival E-Book
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-200">
              Your digital companion for bird identification
            </p>
          </div>
        </div>
      </div>

      {/* E-book Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            {/* E-book Content */}
            <div className="mt-8 md:mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-4 md:p-8">
                {/* Book Cover */}
                <div>
                  <div className="rounded-lg overflow-hidden shadow-xl">
                    <img
                      src={ebook.coverImage || 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?q=80&w=800'}
                      alt={ebook.title}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="mt-4 md:mt-6 flex items-center justify-center gap-4 md:gap-6 text-center flex-wrap">
                    <div>
                      <p className="text-2xl md:text-3xl font-bold text-amber-600">{ebook.pages}</p>
                      <p className="text-gray-600 text-xs md:text-sm">Pages</p>
                    </div>
                    <div className="h-8 md:h-12 w-px bg-gray-300"></div>
                    <div>
                      <p className="text-2xl md:text-3xl font-bold text-amber-600">{ebook.fileSize}</p>
                      <p className="text-gray-600 text-xs md:text-sm">File Size</p>
                    </div>
                      {progress?.progressPercent > 0 && (
                        <>
                          <div className="h-8 md:h-12 w-px bg-gray-300"></div>
                          <div>
                            <p className="text-2xl md:text-3xl font-bold text-amber-600">
                              {progress.progressPercent}%
                            </p>
                            <p className="text-gray-600 text-xs md:text-sm">Progress</p>
                          </div>
                        </>
                      )}

                  </div>
                </div>

                {/* Book Details */}
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3 md:mb-4">
                    {ebook.title}
                  </h2>
                  <p className="text-gray-600 mb-2 text-sm md:text-base">
                    <span className="font-semibold">Author:</span> {ebook.author}
                  </p>
                  <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                    <span className="font-semibold">Format:</span> PDF
                  </p>

                  <div className="prose max-w-none mb-6 md:mb-8">
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">{ebook.description}</p>
                  </div>

                  {/* Name and Email Input Modal */}
                  {showNameInput && (
                    <div className="mb-6 p-4 md:p-6 bg-amber-50 border-2 border-amber-200 rounded-lg">
                      <h3 className="text-lg md:text-xl font-serif font-bold text-gray-800 mb-3 md:mb-4 text-center">
                        Enter Your Details to Start Reading
                      </h3>
                      <p className="text-gray-600 mb-4 text-center text-xs md:text-sm">
                        We'll track your reading progress and restore it if you return with the same name and email. You'll receive a certificate upon completion.
                      </p>
                      {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                          {error}
                        </div>
                      )}
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={readerName}
                          onChange={(e) => {
                            setReaderName(e.target.value);
                            setError(null);
                          }}
                          placeholder="Your Full Name *"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && readerName.trim() && readerEmail.trim() && !startingReading) {
                              handleNameSubmit();
                            }
                          }}
                          disabled={startingReading}
                        />
                        <input
                          type="email"
                          value={readerEmail}
                          onChange={(e) => {
                            setReaderEmail(e.target.value);
                            setError(null);
                          }}
                          placeholder="Your Email Address *"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && readerName.trim() && readerEmail.trim() && !startingReading) {
                              handleNameSubmit();
                            }
                          }}
                          disabled={startingReading}
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={handleNameSubmit}
                            disabled={!readerName.trim() || !readerEmail.trim() || startingReading}
                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {startingReading ? 'Starting...' : 'Start Reading'}
                          </button>
                          <button
                            onClick={() => {
                              setShowNameInput(false);
                              setError(null);
                            }}
                            disabled={startingReading}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Read/Continue Button */}
                  {!showNameInput && (
                    <>
                      <button
                        onClick={handleRead}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        {progress && progress.progressPercent > 0 
                          ? `Continue Reading – ${progress.progressPercent}%` 
                          : readerName 
                            ? 'Read E-Book' 
                            : 'Start Reading'}
                      </button>

                      {progress && progress.progressPercent > 0 && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress.progressPercent}%` }}
                            ></div>
                          </div>
                          {progress.isCompleted && (
                            <p className="text-sm text-green-600 font-semibold text-center mt-2">
                              ✓ Reading Completed!
                            </p>
                          )}
                        </div>
                      )}

                      {readerName && readerEmail && (
                        <div className="mt-4 text-center">
                          <p className="text-sm text-gray-500 mb-2">
                            Reading as: <span className="font-semibold">{readerName}</span> ({readerEmail})
                          </p>
                          <button
                            onClick={handleLogout}
                            className="text-sm text-red-600 hover:text-red-700 underline"
                          >
                            Logout / Switch User
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center p-6 bg-white rounded-lg shadow">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Comprehensive Guide</h3>
                <p className="text-gray-600 text-sm">
                  Detailed information on 300+ bird species
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Beautiful Photography</h3>
                <p className="text-gray-600 text-sm">
                  High-quality images for easy identification
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Habitat Maps</h3>
                <p className="text-gray-600 text-sm">
                  Location guides for the best birding spots
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Ebook;
