import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { festivalAPI } from '../services/api';
import Loader from '../components/Loader';

const Home = () => {
  const [festivalInfo, setFestivalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);
  
  // Background slider images
  const images = [
    "/images/hero/1.jpg",
    "/images/hero/2.jpg",
    "/images/hero/3.jpg",
  ];

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [images.length]);

  useEffect(() => {
    const fetchFestivalInfo = async () => {
      try {
        const response = await festivalAPI.getFestivalInfo();
        setFestivalInfo(response.data);
      } catch (err) {
        setError(err.message);
        // Use default data if API fails
        setFestivalInfo({
          title: 'The Rajasthan Birding Festival',
          description:
            "Experience the diverse avian life of Rajasthan's wetlands, deserts, and sanctuaries. Join us for guided birding walks, conservation talks, and cultural celebrations honoring the rich biodiversity of this remarkable region.",
          startDate: '2026-02-10T00:00:00.000Z',
          endDate: '2026-02-15T00:00:00.000Z',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFestivalInfo();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] md:h-screen w-full overflow-hidden">
        {/* Background Slider */}
        {images.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex items-center">
          <div className="max-w-3xl text-white">
            {/* Main Heading - Large Serif */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold leading-tight mb-4 md:mb-6 opacity-0 animate-fade-in-up">
              {festivalInfo?.title || 'The Rajasthan Birding Festival'}
            </h1>

            {/* Description Paragraph */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-6 md:mb-8 text-gray-200 opacity-0 animate-fade-in-up animation-delay-200 max-w-2xl">
              {festivalInfo?.description ||
                "Experience the diverse avian life of Rajasthan's wetlands, deserts, and sanctuaries. Join us for guided birding walks, conservation talks, and cultural celebrations honoring the rich biodiversity of this remarkable region."}
            </p>

            {/* Festival Dates */}
            <div className="mb-6 md:mb-10 opacity-0 animate-fade-in-up animation-delay-400">
              <div className="inline-block bg-amber-500/20 backdrop-blur-sm border border-amber-400/50 rounded-lg px-4 py-3 md:px-6 md:py-4">
                <p className="text-amber-300 font-semibold text-xs md:text-sm uppercase tracking-wider mb-1">
                  Festival Dates
                </p>
                <p className="text-white text-base md:text-lg lg:text-xl font-serif">
                  {festivalInfo?.startDate && festivalInfo?.endDate
                    ? `${formatDate(festivalInfo.startDate)} – ${formatDate(
                        festivalInfo.endDate
                      )}`
                    : 'February 10 – February 15, 2026'}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 opacity-0 animate-fade-in-up animation-delay-600">
              <Link
                to="/schedule"
                className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2.5 md:px-8 md:py-3 rounded-lg transition-all duration-300 text-center shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                View Schedule
              </Link>
              <Link
                to="/about"
                className="inline-block bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-2.5 md:px-8 md:py-3 rounded-lg border border-white/30 transition-all duration-300 text-center text-sm md:text-base"
              >
                Learn More
              </Link>
              <Link
                to="/pledge"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 md:px-8 md:py-3 rounded-lg transition-all duration-300 text-center shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                🌿 Take Pledge
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
      

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">
                Guided Bird Watching
              </h3>
              <p className="text-gray-600">
                Expert-led birding walks through Rajasthan's most biodiverse habitats
              </p>
            </div>

            <div className="text-center">
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">
                Conservation Talks
              </h3>
              <p className="text-gray-600">
                Learn from leading ornithologists about bird conservation efforts
              </p>
            </div>

            <div className="text-center">
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
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">
                Cultural Experience
              </h3>
              <p className="text-gray-600">
                Immerse yourself in Rajasthan's rich heritage and local traditions
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
