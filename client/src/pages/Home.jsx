
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { festivalAPI, galleryAPI } from '../services/api';
import Loader from '../components/Loader';
import { useLanguage } from '../context/LanguageContext'; // Saved context

const Home = () => {
  const [festivalInfo, setFestivalInfo] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const { t, language } = useLanguage();

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
    const fetchContent = async () => {
      try {
        const [festRes, galRes] = await Promise.all([
          festivalAPI.getFestivalInfo(),
          galleryAPI.getImages().catch(() => ({ data: { data: [] } }))
        ]);
        setFestivalInfo(festRes.data);
        setGalleryImages(galRes.data.data || []);
      } catch (err) {
        console.warn("Failed to fetch homepage content", err);
        // Fallback or empty state
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getIcon = (iconName) => {
    // ... (Icon logic remains the same, omitted for brevity in thought but will keep in code)
    switch (iconName) {
      case 'binoculars':
        return (
          <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      case 'lecture':
        return (
          <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'culture':
      default:
        return (
          <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (loading) return <Loader />;

  // NOTE: Ideally, festivalInfo should have multilingual fields. 
  // For now, we use static translations for fallback/demo or dynamic content if available.
  // If festivalInfo is just English, we can't magically translate it without an API or stored translations.
  // However, UI labels like "Festival Dates", "View Schedule" are translated.

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] md:h-screen w-full overflow-hidden">
        {/* Background Slider */}
        {images.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100" : "opacity-0"
              }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex items-center">
          <div className="max-w-3xl text-white">
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold leading-tight mb-4 md:mb-6 opacity-0 animate-fade-in-up">
              {/* Prioritize translation key if available, else DB content */}
              {/* 
                  STRATEGY: Use static translation for Title/Desc IF it matches the default English one. 
                  Otherwise use DB content (which might be user-edited). 
                  For now, let's use the Translation Key for the main title to show Hindi working.
               */}
              {t('home.heroTitle') !== 'home.heroTitle' ? t('home.heroTitle') : (festivalInfo?.title || 'The Rajasthan Birding Festival')}
            </h1>

            {/* Description Paragraph */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-6 md:mb-8 text-gray-200 opacity-0 animate-fade-in-up animation-delay-200 max-w-2xl">
              {t('home.heroDesc') !== 'home.heroDesc' ? t('home.heroDesc') : (festivalInfo?.description)}
            </p>

            {/* Festival Dates */}
            <div className="mb-6 md:mb-10 opacity-0 animate-fade-in-up animation-delay-400">
              <div className="inline-block bg-amber-500/20 backdrop-blur-sm border border-amber-400/50 rounded-lg px-4 py-3 md:px-6 md:py-4">
                <p className="text-amber-300 font-semibold text-xs md:text-sm uppercase tracking-wider mb-1">
                  {t('home.dates')}
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
                {t('home.viewSchedule')}
              </Link>
              <Link
                to="/about"
                className="inline-block bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-2.5 md:px-8 md:py-3 rounded-lg border border-white/30 transition-all duration-300 text-center text-sm md:text-base"
              >
                {t('home.learnMore')}
              </Link>
              <Link
                to="/pledge"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 md:px-8 md:py-3 rounded-lg transition-all duration-300 text-center shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                🌿 {t('home.takePledge')}
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>


      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {(festivalInfo?.features || []).map((feature, index) => {
              // Translation Logic for specific known features
              let displayTitle = feature.title;
              let displayDesc = feature.description;

              if (language === 'hi') {
                if (feature.title === "Guided Bird Watching") {
                  displayTitle = t('features.guidedWatch');
                  displayDesc = t('features.guidedWatchDesc');
                } else if (feature.title === "Conservation Talks") {
                  displayTitle = t('features.conservation');
                  displayDesc = t('features.conservationDesc');
                } else if (feature.title === "Cultural Experience") {
                  displayTitle = t('features.culture');
                  displayDesc = t('features.cultureDesc');
                }
              }

              return (
                <div key={index} className="text-center transition duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {getIcon(feature.icon)}
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3">{displayTitle}</h3>
                  <p className="text-gray-600">{displayDesc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="py-16 md:py-24 bg-stone-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">{t('home.capturedMoments')}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('home.galleryDesc')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((img, index) => (
                <div key={img._id} className="group relative overflow-hidden rounded-xl shadow-lg aspect-[4/3]">
                  <img
                    src={img.imageUrl}
                    alt={img.title || "Gallery Image"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.src = '/bg.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white font-medium text-sm md:text-base">{img.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;
