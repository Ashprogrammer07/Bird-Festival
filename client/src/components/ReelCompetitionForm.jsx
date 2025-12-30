import { useState } from 'react';
import { competitionAPI } from '../services/api';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const ReelCompetitionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    reelTitle: '',
    reelDescription: '',
    reelUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await competitionAPI.registerReel(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        reelTitle: '',
        reelDescription: '',
        reelUrl: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0">
      <div className="bg-gray-700 rounded-xl shadow-lg p-4 md:p-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2 text-white">Reel Competition</h2>
        <p className="text-gray-300 mb-6 md:mb-8 text-sm md:text-base">
          Create engaging reels about birds and nature! Register to participate in our reel competition.
        </p>

        {success && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            Registration successful! We will contact you soon with further details.
          </div>
        )}

        {error && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                minLength={2}
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                placeholder="your.email@example.com"
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
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                placeholder="+91 1234567890"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-semibold text-white mb-2">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                placeholder="Your city"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-semibold text-white mb-2">
                State *
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              >
                <option value="" className="bg-gray-600">Select your state</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state} className="bg-gray-600">
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm font-semibold text-white mb-2">
                Pincode *
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                placeholder="123456"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-white mb-2">
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none"
              placeholder="Your complete address"
            ></textarea>
          </div>

          <div>
            <label htmlFor="reelTitle" className="block text-sm font-semibold text-white mb-2">
              Reel Title *
            </label>
            <input
              type="text"
              id="reelTitle"
              name="reelTitle"
              value={formData.reelTitle}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              placeholder="Title of your reel"
            />
          </div>

          <div>
            <label htmlFor="reelUrl" className="block text-sm font-semibold text-white mb-2">
              Reel URL (Instagram/YouTube/TikTok)
            </label>
            <input
              type="url"
              id="reelUrl"
              name="reelUrl"
              value={formData.reelUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              placeholder="https://www.instagram.com/reel/..."
            />
            <p className="mt-2 text-sm text-gray-300">
              Share the link to your reel (if already published)
            </p>
          </div>

          <div>
            <label htmlFor="reelDescription" className="block text-sm font-semibold text-white mb-2">
              Reel Description
            </label>
            <textarea
              id="reelDescription"
              name="reelDescription"
              value={formData.reelDescription}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none"
              placeholder="Describe your reel, the theme, bird species featured, etc."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm md:text-base"
          >
            {loading ? 'Submitting...' : 'Register for Reel Competition'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReelCompetitionForm;

