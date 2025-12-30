import { useState } from 'react';
import { volunteerAPI } from '../services/api';

const VolunteersRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    addressProof: null,
    addressProofFileName: '',
    educationalQualification: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    interests: ''
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF, JPG, and PNG files are allowed');
        return;
      }
      setFormData(prev => ({
        ...prev,
        addressProof: file,
        addressProofFileName: file.name
      }));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmitted(false);

    if (!formData.addressProof) {
      setError('Please upload an address proof document');
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'addressProof' && key !== 'addressProofFileName') {
          submitData.append(key, formData[key]);
        }
      });
      submitData.append('addressProof', formData.addressProof);

      await volunteerAPI.register(submitData);
    setSubmitted(true);
      setFormData({
        name: '',
        idNumber: '',
        addressProof: null,
        addressProofFileName: '',
        educationalQualification: '',
        email: '',
        phone: '',
        address: '',
        experience: '',
        interests: ''
      });
      // Reset file input
      const fileInput = document.getElementById('addressProof');
      if (fileInput) fileInput.value = '';
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const educationalOptions = [
    'High School',
    'Diploma',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD',
    'Other'
  ];

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
                Thank you for your interest in volunteering.
              </p>
              <p className="text-gray-600">
                We'll get back to you soon.
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
              Volunteers Registration
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-200">
              Join us in making a difference for nature
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
            {/* Personal Information */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800 mb-4 md:mb-6 pb-2 border-b-2 border-gray-200">
                Personal Information
              </h2>
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
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

              <div className="mb-4">
                <label htmlFor="idNumber" className="block text-gray-700 font-semibold mb-2">
                  ID Number *
                </label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter your ID number"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="addressProof" className="block text-gray-700 font-semibold mb-2">
                  Address Proof Document *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 transition-colors">
                  <input
                    type="file"
                    id="addressProof"
                    name="addressProof"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                    className="hidden"
                  />
                  <label htmlFor="addressProof" className="cursor-pointer">
                    <span className="text-4xl mb-2 block">📄</span>
                    <span className="text-gray-600">
                      {formData.addressProofFileName || 'Choose file (PDF, JPG, PNG)'}
                    </span>
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
              </div>

              <div>
                <label htmlFor="address" className="block text-gray-700 font-semibold mb-2">
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
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
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

            {/* Educational Qualification */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800 mb-4 md:mb-6 pb-2 border-b-2 border-gray-200">
                Educational Qualification
              </h2>
              
              <div className="mb-4">
                <label htmlFor="educationalQualification" className="block text-gray-700 font-semibold mb-2">
                  Highest Qualification *
                </label>
                <select
                  id="educationalQualification"
                  name="educationalQualification"
                  value={formData.educationalQualification}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                >
                  <option value="">Select your qualification</option>
                  {educationalOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="experience" className="block text-gray-700 font-semibold mb-2">
                  Relevant Experience
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us about any relevant volunteer or work experience"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor="interests" className="block text-gray-700 font-semibold mb-2">
                  Areas of Interest
                </label>
                <textarea
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  rows="3"
                  placeholder="What areas would you like to volunteer in? (e.g., event management, wildlife conservation, education)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 md:px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {loading ? 'Submitting...' : '✉️ Submit Registration'}
              </button>
              <button
                type="button"
                onClick={() => setFormData({
                  name: '',
                  idNumber: '',
                  addressProof: null,
                  addressProofFileName: '',
                  educationalQualification: '',
                  email: '',
                  phone: '',
                  address: '',
                  experience: '',
                  interests: ''
                })}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-all duration-300 text-sm md:text-base"
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

export default VolunteersRegistration;
