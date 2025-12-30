import { useState, useEffect } from 'react';
import { festivalAPI } from '../services/api';
import Loader from '../components/Loader';

const About = () => {
  const [festivalInfo, setFestivalInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFestivalInfo = async () => {
      try {
        const response = await festivalAPI.getFestivalInfo();
        setFestivalInfo(response.data);
      } catch (err) {
        // Use default data if API fails
        setFestivalInfo({
          "about":
            "The Rajasthan Birding Festival celebrates the state's incredible diversity of bird species, from the migratory flamingos gracing our wetlands to the majestic raptors soaring above the Thar Desert. Our festival brings together bird enthusiasts, conservationists, photographers, and nature lovers from around the world to appreciate and protect the avian heritage of Rajasthan.",
          "mission":
            "To promote bird conservation and create awareness about Rajasthan's rich avian biodiversity through education, community engagement, and sustainable eco-tourism practices.",
          "vision":
            "A sustainable future where humans and birds coexist harmoniously, with thriving ecosystems that support both wildlife and local communities.",
          "location": "Rajasthan, India",
        });
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
              About Us
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-200">
              Celebrating Rajasthan's Avian Heritage
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
                {festivalInfo?.about ||
                  "The Rajasthan Birding Festival celebrates the state's incredible diversity of bird species, from the migratory flamingos gracing our wetlands to the majestic raptors soaring above the Thar Desert."}
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Rajasthan is home to over 500 species of birds, making it one of India's
                premier birdwatching destinations. From the wetlands of Bharatpur to the
                desert landscapes of Jaisalmer, our diverse ecosystems provide critical
                habitats for resident and migratory bird populations.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Through this festival, we aim to highlight the importance of bird
                conservation, promote sustainable tourism, and foster a deeper connection
                between people and nature. Join us in celebrating the beauty, diversity,
                and ecological significance of Rajasthan's birdlife.
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
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3 md:mb-4">
                Our Mission
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {festivalInfo?.mission ||
                  "To promote bird conservation and create awareness about Rajasthan's rich avian biodiversity through education, community engagement, and sustainable eco-tourism practices."}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4 md:mb-6">
                <svg
                  className="w-8 h-8 text-white"
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
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3 md:mb-4">
                Our Vision
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {festivalInfo?.vision ||
                  'A sustainable future where humans and birds coexist harmoniously, with thriving ecosystems that support both wildlife and local communities.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8 md:mb-12 text-center">
            Key Birding Locations
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
              <h3 className="text-xl md:text-2xl font-serif font-bold mb-2 md:mb-3">Wetlands</h3>
              <p className="text-gray-600">
                Home to migratory waterfowl and wading birds, our wetlands are biodiversity
                hotspots
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
                Desert Sanctuaries
              </h3>
              <p className="text-gray-600">
                Unique desert-adapted species thrive in the Thar's harsh yet beautiful
                landscapes
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
                Forest Reserves
              </h3>
              <p className="text-gray-600">
                Dense forests provide habitat for raptors, woodpeckers, and woodland species
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
