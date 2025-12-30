import { useState } from 'react';

const PaintingCompetition = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
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
    }, 3000);
  };

  const ageCategories = [
    { value: 'junior', label: 'Junior (5-12 years)' },
    { value: 'senior', label: 'Senior (13-18 years)' },
    { value: 'adult', label: 'Adult (19+ years)' }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div
          className="relative h-80 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero/1.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
                Registration Successful!
              </h1>
            </div>
          </div>
        </div>

        <section className="py-16">
          <div className="container mx-auto px-6 max-w-md">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎨</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">
                Thank You!
              </h2>
              <p className="text-gray-600 mb-2">
                Thank you for registering for the On-Spot Painting Competition.
              </p>
              <p className="text-gray-600">
                We'll send you further details via email.
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
        className="relative h-80 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/hero/1.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
              On-Spot Painting Competition
            </h1>
            <p className="text-xl text-gray-200">
              Express your love for nature through art
            </p>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Competition Info */}
          <div className="bg-amber-500 rounded-lg shadow-lg p-6 mb-8 text-white">
            <h3 className="text-2xl font-serif font-bold mb-4 text-center">📋 Competition Details</h3>
            <ul className="space-y-2">
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
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            {/* Participant Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-200">
                Participant Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
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

                <div>
                  <label htmlFor="age" className="block text-gray-700 font-semibold mb-2">
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">
                  Age Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                >
                  <option value="">Select your category</option>
                  {ageCategories.map((cat, index) => (
                    <option key={index} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="school" className="block text-gray-700 font-semibold mb-2">
                  School/Institution
                </label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="Name of your school or institution"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="mb-4">
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
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-200">
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

            {/* Guardian Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2 pb-2 border-b-2 border-gray-200">
                Guardian Information
              </h2>
              <p className="text-gray-600 text-sm mb-4 italic">Required for participants under 18 years</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="guardianName" className="block text-gray-700 font-semibold mb-2">
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    id="guardianName"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    placeholder="Guardian's full name"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor="guardianPhone" className="block text-gray-700 font-semibold mb-2">
                    Guardian Phone
                  </label>
                  <input
                    type="tel"
                    id="guardianPhone"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    placeholder="Guardian's phone number"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Art Experience */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-200">
                Art Experience
              </h2>
              
              <div className="mb-4">
                <label htmlFor="previousExperience" className="block text-gray-700 font-semibold mb-2">
                  Previous Painting Experience
                </label>
                <textarea
                  id="previousExperience"
                  name="previousExperience"
                  value={formData.previousExperience}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Tell us about any previous painting competitions or art experience"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor="artStyle" className="block text-gray-700 font-semibold mb-2">
                  Preferred Art Style/Medium
                </label>
                <input
                  type="text"
                  id="artStyle"
                  name="artStyle"
                  value={formData.artStyle}
                  onChange={handleChange}
                  placeholder="e.g., Watercolor, Acrylic, Oil, Pencil Sketch"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 justify-center">
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                🎨 Register for Competition
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

export default PaintingCompetition;
