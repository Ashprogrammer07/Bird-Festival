import { useState } from 'react';
import { competitionAPI } from '../services/api';

const PaintingCompetitionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    category: '',
    email: '',
    phone: '',
    guardianName: '',
    guardianPhone: '',
    school: '',
    address: '',
    previousExperience: '',
    artStyle: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmitted(false);

    try {
      await competitionAPI.registerPainting(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        age: '',
        category: '',
        email: '',
        phone: '',
        guardianName: '',
        guardianPhone: '',
        school: '',
        address: '',
        previousExperience: '',
        artStyle: ''
      });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ageCategories = [
    { value: 'junior', label: 'Junior (5-12 years)' },
    { value: 'senior', label: 'Senior (13-18 years)' },
    { value: 'adult', label: 'Adult (19+ years)' }
  ];

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-700 rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🎨</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-4">
            Thank You!
          </h2>
          <p className="text-gray-300 mb-2">
            Thank you for registering for the On-Spot Painting Competition.
          </p>
          <p className="text-gray-300">
            We'll send you further details via email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0">
      <div className="bg-gray-700 rounded-xl shadow-lg p-4 md:p-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2 text-white">On-Spot Painting Competition</h2>
        <p className="text-gray-300 mb-6 md:mb-8 text-sm md:text-base">
          Express your love for nature through art. Register to participate in our painting competition.
        </p>

        {error && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Competition Info */}
        <div className="mb-6 md:mb-8 p-4 md:p-6 bg-amber-500/20 border border-amber-400/30 rounded-lg">
          <h3 className="text-lg md:text-xl font-serif font-bold mb-3 md:mb-4 text-amber-300 text-center">📋 Competition Details</h3>
          <ul className="space-y-2 text-gray-200">
            <li className="flex items-center">
              <span className="mr-2">•</span>
              <span>Theme: Nature & Birds</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              <span>Duration: 2 hours</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              <span>Materials: Participants need to bring their own art supplies</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              <span>Judging: Based on creativity, technique, and theme relevance</span>
            </li>
          </ul>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Participant Information */}
          <div>
            <h3 className="text-lg md:text-xl font-serif font-bold text-white mb-3 md:mb-4 pb-2 border-b border-gray-600">
              Participant Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-white mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="5"
                  placeholder="Enter your age"
                  className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="category" className="block text-sm font-semibold text-white mb-2">
                Age Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              >
                <option value="" className="bg-gray-600">Select your category</option>
                {ageCategories.map((cat, index) => (
                  <option key={index} value={cat.value} className="bg-gray-600">{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <label htmlFor="school" className="block text-sm font-semibold text-white mb-2">
                School/Institution
              </label>
              <input
                type="text"
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder="Name of your school or institution"
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              />
            </div>

            <div className="mt-6">
              <label htmlFor="address" className="block text-sm font-semibold text-white mb-2">
                Address *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Enter your complete address"
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-serif font-bold text-white mb-4 pb-2 border-b border-gray-600">
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1234567890"
                  className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div>
            <h3 className="text-xl font-serif font-bold text-white mb-2 pb-2 border-b border-gray-600">
              Guardian Information
            </h3>
            <p className="text-gray-400 text-sm mb-4 italic">Required for participants under 18 years</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label htmlFor="guardianName" className="block text-sm font-semibold text-white mb-2">
                  Guardian Name
                </label>
                <input
                  type="text"
                  id="guardianName"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  placeholder="Guardian's full name"
                  className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="guardianPhone" className="block text-sm font-semibold text-white mb-2">
                  Guardian Phone
                </label>
                <input
                  type="tel"
                  id="guardianPhone"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  placeholder="Guardian's phone number"
                  className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Art Experience */}
          <div>
            <h3 className="text-xl font-serif font-bold text-white mb-4 pb-2 border-b border-gray-600">
              Art Experience
            </h3>
            
            <div className="mt-4">
              <label htmlFor="previousExperience" className="block text-sm font-semibold text-white mb-2">
                Previous Painting Experience
              </label>
              <textarea
                id="previousExperience"
                name="previousExperience"
                value={formData.previousExperience}
                onChange={handleChange}
                rows="3"
                placeholder="Tell us about any previous painting competitions or art experience"
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none"
              />
            </div>

            <div className="mt-6">
              <label htmlFor="artStyle" className="block text-sm font-semibold text-white mb-2">
                Preferred Art Style/Medium
              </label>
              <input
                type="text"
                id="artStyle"
                name="artStyle"
                value={formData.artStyle}
                onChange={handleChange}
                placeholder="e.g., Watercolor, Acrylic, Oil, Pencil Sketch"
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {loading ? 'Submitting...' : '🎨 Register for Competition'}
            </button>
            <button
              type="button"
              onClick={() => setFormData({
                name: '',
                age: '',
                category: '',
                email: '',
                phone: '',
                guardianName: '',
                guardianPhone: '',
                school: '',
                address: '',
                previousExperience: '',
                artStyle: ''
              })}
              className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 border border-gray-500"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaintingCompetitionForm;
