import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import Loader from "../components/Loader";
import { readingAPI } from "../services/api";
import { ebookAPI } from "../services/api";
import { generateEbookCertificate } from "../utils/certificateGenerator";
import { EBOOK_ID } from "../utils/ebookProgress";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const Reader = () => {
  const { ebookId } = useParams();
  
  // Get reader name and email from URL params or localStorage
  const getReaderInfo = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      name: urlParams.get('name') || localStorage.getItem('ebook_reader_name') || '',
      email: urlParams.get('email') || localStorage.getItem('ebook_reader_email') || '',
    };
  };
  
  const [readerInfo] = useState(getReaderInfo());
  const readerName = readerInfo.name;
  const readerEmail = readerInfo.email;

  const [pdf, setPdf] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(3);
  const [mode, setMode] = useState(() => {
    // Default to single on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return "single";
    }
    return "double";
  }); // single | double
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ebook, setEbook] = useState(null);
  const [progress, setProgress] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // Track reading time
  const startTimeRef = useRef(Date.now());
  const lastUpdateTimeRef = useRef(Date.now());
  const updateIntervalRef = useRef(null);

  const singleCanvasRef = useRef(null);
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);

  useEffect(() => {
    if (ebookId !== EBOOK_ID) {
      setError("Invalid ebook");
      setLoading(false);
      return;
    }

    if (!readerName || !readerEmail) {
      setError("Reader name and email are required. Please go back and enter your details.");
      setLoading(false);
      return;
    }

    const loadPdf = async () => {
      try {
        // Fetch ebook info
        const ebookResponse = await ebookAPI.getEbook();
        setEbook(ebookResponse.data);

        // Load PDF
        const pdfUrl = ebookResponse.data.fileUrl || "/book/Birds-of-Indian-Subcontinent.pdf";
        const pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;

        setPdf(pdfDoc);
        setTotalPages(pdfDoc.numPages);

        // Load existing progress (restore progress for same name+email)
        try {
          // Generate reader ID (same logic as backend - name + email combination)
          const readerIdString = `${readerName.trim().toLowerCase()}_${readerEmail.trim().toLowerCase()}`;
          const readerId = btoa(readerIdString).substring(0, 30);
          const progressResponse = await readingAPI.getProgress(ebookResponse.data._id, readerId);
          const savedProgress = progressResponse.data;
          setProgress(savedProgress);
          setCurrentPage(savedProgress.lastPage || 1);
          setIsCompleted(savedProgress.isCompleted || false);
          
          if (savedProgress.isCompleted) {
            setShowCompletionModal(true);
          }
        } catch (err) {
          // No progress found, start from page 1
          setCurrentPage(1);
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load PDF");
        setLoading(false);
      }
    };

    loadPdf();
  }, [ebookId, readerName]);

  // Update progress to database periodically
  useEffect(() => {
    if (!pdf || !ebook || !readerName || !readerEmail) return;

    const updateProgress = async () => {
      try {
        // Generate reader ID (same logic as backend - name + email combination)
        const readerIdString = `${readerName.trim().toLowerCase()}_${readerEmail.trim().toLowerCase()}`;
        const readerId = btoa(readerIdString).substring(0, 30);
        const timeSpent = Math.floor((Date.now() - lastUpdateTimeRef.current) / 1000);
        
        const response = await readingAPI.updateReading({
          ebookId: ebook._id,
          readerId,
          currentPage,
          timeSpent,
        });

        const updatedProgress = response.data;
        setProgress(updatedProgress);
        lastUpdateTimeRef.current = Date.now();

        // Check if completed
        if (updatedProgress.isCompleted && !isCompleted) {
          setIsCompleted(true);
          setShowCompletionModal(true);
        }
      } catch (err) {
        console.error('Failed to update progress:', err);
      }
    };

    // Update every 30 seconds
    updateIntervalRef.current = setInterval(updateProgress, 30000);

    // Also update immediately when page changes
    updateProgress();

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [currentPage, pdf, ebook, readerName, readerEmail, isCompleted]);

  useEffect(() => {
    if (!pdf) return;

    if (mode === "single") {
      renderSingle(currentPage);
    } else {
      renderSpread(currentPage);
    }
  }, [currentPage, zoom, mode, pdf, totalPages]);

  // Force single mode on mobile screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && mode === "double") {
        setMode("single");
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Check on mount
    return () => window.removeEventListener('resize', handleResize);
  }, [mode]);

  const renderPage = async (pageNum, canvasRef) => {
    if (!canvasRef.current || pageNum < 1 || pageNum > totalPages) return;

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: zoom });
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;
  };

  const renderSingle = async (pageNum) => {
    await renderPage(pageNum, singleCanvasRef);
  };

  const renderSpread = async (pageNum) => {
    if (pageNum === 1) {
      await renderPage(1, leftCanvasRef);
      rightCanvasRef.current.width = 0;
      return;
    }

    const left = pageNum % 2 === 0 ? pageNum - 1 : pageNum;
    const right = left + 1;

    await renderPage(left, leftCanvasRef);
    await renderPage(right, rightCanvasRef);
  };

  const nextPage = () => {
    setCurrentPage((p) => {
      const next = mode === "single" ? Math.min(p + 1, totalPages) : Math.min(p + 2, totalPages);
      return next;
    });
  };

  const prevPage = () => {
    setCurrentPage((p) => {
      const prev = mode === "single" ? Math.max(p - 1, 1) : Math.max(p - 2, 1);
      return prev;
    });
  };

  const handleDownloadCertificate = () => {
    if (progress) {
      generateEbookCertificate(
        readerName,
        totalPages,
        progress.timeSpent || 0
      );
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('ebook_reader_name');
    localStorage.removeItem('ebook_reader_email');
    
    // Close the reader window/tab and redirect to ebook page
    window.location.href = '/ebook';
  };

  if (loading)
    return <Loader />;

  if (error)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={() => window.close()}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-white">✓</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">
              Congratulations!
            </h2>
            <p className="text-gray-600 mb-2">
              You have successfully completed reading the e-book!
            </p>
            <p className="text-gray-600 mb-6">
              Download your certificate of completion below.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDownloadCertificate}
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                📜 Download Certificate
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
              >
                Continue Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-gray-800 border-b border-gray-700">
        <div className="px-3 md:px-6 py-2 md:py-3">
          {/* Mobile: Stack vertically */}
          <div className="md:hidden space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-300">Page {currentPage} / {totalPages}</span>
              {progress && (
                <span className="text-xs text-gray-300">
                  {Math.round((currentPage / totalPages) * 100)}%
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={prevPage} className="bg-gray-700 px-3 py-1.5 rounded text-xs hover:bg-gray-600 flex-1">Prev</button>
              <button onClick={nextPage} className="bg-gray-700 px-3 py-1.5 rounded text-xs hover:bg-gray-600 flex-1">Next</button>
              <button onClick={() => setZoom(z => Math.max(0.8, z - 0.1))} className="bg-gray-700 px-3 py-1.5 rounded text-xs">−</button>
              <button onClick={() => setZoom(z => Math.min(5, z + 0.1))} className="bg-gray-700 px-3 py-1.5 rounded text-xs">+</button>
              {isCompleted && (
                <button
                  onClick={handleDownloadCertificate}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-xs"
                >
                  📜 Cert
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-xs"
              >
                Logout
              </button>
            </div>
          </div>
          
          {/* Desktop: Horizontal layout */}
          <div className="hidden md:flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <span className="text-sm">Page {currentPage} / {totalPages}</span>
              {progress && (
                <span className="text-sm text-gray-300">
                  Progress: {Math.round((currentPage / totalPages) * 100)}%
                </span>
              )}
              {readerName && readerEmail && (
                <span className="text-sm text-gray-300 hidden lg:inline">
                  Reader: {readerName}
                </span>
              )}
            </div>

            <div className="hidden lg:flex gap-2">
              <button onClick={() => setMode("single")} className={`px-3 py-1 rounded text-sm ${mode === "single" ? "bg-blue-600" : "bg-gray-700"}`}>
                Single
              </button>
              <button onClick={() => setMode("double")} className={`px-3 py-1 rounded text-sm ${mode === "double" ? "bg-blue-600" : "bg-gray-700"}`}>
                Double
              </button>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setZoom(z => Math.max(0.8, z - 0.1))} className="bg-gray-700 px-3 py-1 rounded text-sm">−</button>
              <button onClick={() => setZoom(z => Math.min(5, z + 0.1))} className="bg-gray-700 px-3 py-1 rounded text-sm">+</button>
            </div>

            <div className="flex gap-2">
              <button onClick={prevPage} className="bg-gray-700 px-4 py-1 rounded text-sm hover:bg-gray-600">Prev</button>
              <button onClick={nextPage} className="bg-gray-700 px-4 py-1 rounded text-sm hover:bg-gray-600">Next</button>
              {isCompleted && (
                <button
                  onClick={handleDownloadCertificate}
                  className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-sm"
                >
                  📜 Certificate
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm"
                title="Logout and login as different user"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reader */}
      {mode === "single" ? (
        <div className="flex justify-center py-4 md:py-10 px-2 md:px-0">
          <canvas ref={singleCanvasRef} className="bg-white shadow-xl rounded max-w-full h-auto" />
        </div>
      ) : (
        <div className="flex justify-center gap-4 md:gap-6 py-4 md:py-10 px-2 md:px-0 overflow-x-auto">
          <canvas ref={leftCanvasRef} className="bg-white shadow-xl rounded max-w-full h-auto" />
          <canvas ref={rightCanvasRef} className="bg-white shadow-xl rounded max-w-full h-auto" />
        </div>
      )}
    </div>
  );
};

export default Reader;