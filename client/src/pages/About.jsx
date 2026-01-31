
import { useState, useEffect } from 'react';
import { festivalAPI } from '../services/api';
import Loader from '../components/Loader';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const [festivalInfo, setFestivalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchFestivalInfo = async () => {
      try {
        const response = await festivalAPI.getFestivalInfo();
        setFestivalInfo(response.data);
      } catch (err) {
        // Fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchFestivalInfo();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-64 md:h-96 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/about/1.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-2 md:mb-4">
              {t('about.title')}
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-200">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6 md:mb-8 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                {/* 
                 For DB content, if we assume "about" is only in English in DB, we use it directly.
                 However, ideally we would use t('about.description1') if we want full translation.
                 If the user edits the description in Admin Panel, they will only see English.
                 To satisfy "Hybrid" requirement, we will use static translation if available, else DB.
                 But user specifically asked to "Implement Hindi also for all pages". 
                 So I will prioritize using the translated keys for static structure.
                */}
                {t('about.description1')}
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                {t('about.description2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* Mission */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4 md:mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3 md:mb-4">
                {t('about.mission')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('about.missionDesc')}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4 md:mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3 md:mb-4">
                {t('about.vision')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('about.visionDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations - Static Content - For now keep in English or omit as it's less critical than core content, or translate if keys exist. I'll translate inline or add to keys if time permits. Let's assume keys don't exist yet for these specific cards intentionally to save space, or I can add them. I'll stick to English for these specific location cards for now as they weren't in my initial key set, but will ensure the rest is translated. */}
      {/* Actually I'll use the english text which is acceptable for "Locations" or remove section if it feels out of place. I'll keep it. */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8 md:mb-12 text-center">
            {t('locations.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="mb-4 rounded-lg overflow-hidden h-48">
                <img
                  src="https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800"
                  alt="Wetlands"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-serif font-bold mb-2 md:mb-3">{t('locations.wetlands')}</h3>
              <p className="text-gray-600">
                {t('locations.wetlandsDesc')}
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 rounded-lg overflow-hidden h-48">
                <img
                  src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=800"
                  alt="Desert"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">
                {t('locations.desert')}
              </h3>
              <p className="text-gray-600">
                {t('locations.desertDesc')}
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 rounded-lg overflow-hidden h-48">
                <img
                  src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=800"
                  alt="Forests"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">
                {t('locations.forests')}
              </h3>
              <p className="text-gray-600">
                {t('locations.forestsDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
