import { useState } from 'react';
import NatureQuiz from '../components/NatureQuiz';
import PhotoCompetitionForm from '../components/PhotoCompetitionForm';
import ReelCompetitionForm from '../components/ReelCompetitionForm';
import PaintingCompetitionForm from '../components/PaintingCompetitionForm';

const Competitions = () => {
  const [activeTab, setActiveTab] = useState('quiz');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-64 md:h-80 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/hero/1.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-2 md:mb-4">
              Competitions & Quiz
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-200">
              Test your knowledge and showcase your creativity
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <section className="py-4 md:py-8 bg-white shadow-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${
                activeTab === 'quiz'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Nature Quiz
            </button>
            <button
              onClick={() => setActiveTab('photo')}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${
                activeTab === 'photo'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Photo Competition
            </button>
            <button
              onClick={() => setActiveTab('reel')}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${
                activeTab === 'reel'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Reel Competition
            </button>
            <button
              onClick={() => setActiveTab('painting')}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${
                activeTab === 'painting'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Painting Competition
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          {activeTab === 'quiz' && <NatureQuiz />}
          {activeTab === 'photo' && <PhotoCompetitionForm />}
          {activeTab === 'reel' && <ReelCompetitionForm />}
          {activeTab === 'painting' && <PaintingCompetitionForm />}
        </div>
      </section>
    </div>
  );
};

export default Competitions;