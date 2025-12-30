import { useState } from 'react';
import { resourcePersonAPI } from '../services/api';

const ResourcePersonRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    organization: '',
    email: '',
    phone: '',
    expertise: '',
    experience: '',
    qualifications: '',
    bio: '',
    topics: '',
    availability: ''
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
      await resourcePersonAPI.register(formData);
    setSubmitted(true);
      setFormData({
        name: '',
        designation: '',
        organization: '',
        email: '',
        phone: '',
        expertise: '',
        experience: '',
        qualifications: '',
        bio: '',
        topics: '',
        availability: ''
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
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
                Registration Successful!
              </h1>
            </div>
          </div>
        </div>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6 max-w-md">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-3xl md:text-4xl text-white">✓</span>
              </div>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800 mb-3 md:mb-4">
                Thank You!
              </h2>
              <p className="text-gray-600 mb-2">
                Thank you for your interest in being a Resource Person.
              </p>
              <p className="text-gray-600">
                We'll review your application and get back to you soon.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              Resource Person Registration
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-200">
              Share your expertise and inspire others
            </p>
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {error && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-4 md:p-8">
            {/* Personal & Professional Information */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800 mb-4 md:mb-6 pb-2 border-b-2 border-gray-200">
                Personal & Professional Information
              </h2>
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="designation" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                    Designation/Title *
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Professor, Researcher, Conservationist"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor="organization" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                    Organization/Institution *
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                    placeholder="Your current organization"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="expertise" className="block text-gray-700 font-semibold mb-2">
                  Area of Expertise *
                </label>
                <input
                  type="text"
                  id="expertise"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Ornithology, Wildlife Conservation, Environmental Science"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800 mb-4 md:mb-6 pb-2 border-b-2 border-gray-200">
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Qualifications & Experience */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800 mb-4 md:mb-6 pb-2 border-b-2 border-gray-200">
                Qualifications & Experience
              </h2>
              
              <div className="mb-4">
                <label htmlFor="qualifications" className="block text-gray-700 font-semibold mb-2">
                  Educational Qualifications *
                </label>
                <textarea
                  id="qualifications"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="List your degrees, certifications, and relevant qualifications"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="experience" className="block text-gray-700 font-semibold mb-2">
                  Professional Experience *
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe your professional experience, years of experience, notable achievements"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-gray-700 font-semibold mb-2">
                  Brief Biography
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="A brief biography about yourself (optional)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Session Details */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800 mb-4 md:mb-6 pb-2 border-b-2 border-gray-200">
                Session Details
              </h2>
              
              <div className="mb-4">
                <label htmlFor="topics" className="block text-gray-700 font-semibold mb-2">
                  Topics You Can Present On *
                </label>
                <textarea
                  id="topics"
                  name="topics"
                  value={formData.topics}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="List the topics or themes you can present on or conduct sessions about"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor="availability" className="block text-gray-700 font-semibold mb-2">
                  Availability *
                </label>
                <textarea
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Please mention your availability dates and preferred time slots"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : '📚 Submit Registration'}
              </button>
              <button
                type="button"
                onClick={() => setFormData({
                  name: '',
                  designation: '',
                  organization: '',
                  email: '',
                  phone: '',
                  expertise: '',
                  experience: '',
                  qualifications: '',
                  bio: '',
                  topics: '',
                  availability: ''
                })}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ResourcePersonRegistration;
