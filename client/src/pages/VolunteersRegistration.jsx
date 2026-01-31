
import { useState } from 'react';
import { volunteerAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const VolunteersRegistration = () => {
  const { t } = useLanguage();
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
      if (file.size > 5 * 1024 * 1024) {
        setError(t('registration.fileHelp'));
        return;
      }
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError(t('registration.fileHelp'));
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
      setError(t('common.required'));
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
      const fileInput = document.getElementById('addressProof');
      if (fileInput) fileInput.value = '';
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError(t('contact.error'));
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
                {t('registration.successTitle')}
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
                {t('registration.thankYou')}
              </h2>
              <p className="text-gray-600 mb-2">
                {t('registration.thankYouVol')}
              </p>
              <p className="text-gray-600">
                {t('registration.thankYouRes')}
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
              {t('registration.volunteerTitle')}
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-200">
              {t('registration.volunteerDesc')}
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
                {t('registration.personalInfo')}
              </h2>

              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                  {t('registration.fullName')} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={t('registration.fullName')}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="idNumber" className="block text-gray-700 font-semibold mb-2">
                  {t('registration.idNumber')} *
                </label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                  placeholder=""
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="addressProof" className="block text-gray-700 font-semibold mb-2">
                  {t('registration.addressProof')} *
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
                      {formData.addressProofFileName || t('registration.chooseFile')}
                    </span>
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">{t('registration.fileHelp')}</p>
              </div>

              <div>
                <label htmlFor="address" className="block text-gray-700 font-semibold mb-2">
                  {t('registration.address')} *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder=""
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800 mb-4 md:mb-6 pb-2 border-b-2 border-gray-200">
                {t('registration.contactInfo')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                    {t('registration.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
                    {t('registration.phone')} *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Educational Qualification */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800 mb-4 md:mb-6 pb-2 border-b-2 border-gray-200">
                {t('registration.eduQual')}
              </h2>

              <div className="mb-4">
                <label htmlFor="educationalQualification" className="block text-gray-700 font-semibold mb-2">
                  {t('registration.highestQual')} *
                </label>
                <select
                  id="educationalQualification"
                  name="educationalQualification"
                  value={formData.educationalQualification}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                >
                  <option value="">{t('registration.select')}</option>
                  {educationalOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="experience" className="block text-gray-700 font-semibold mb-2">
                  {t('registration.relevantExp')}
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  rows="4"
                  placeholder=""
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor="interests" className="block text-gray-700 font-semibold mb-2">
                  {t('registration.areasInterest')}
                </label>
                <textarea
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  rows="3"
                  placeholder={t('registration.volInterest')}
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
                {loading ? t('common.loading') : `✉️ ${t('registration.submitVol')}`}
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
                {t('registration.reset')}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default VolunteersRegistration;
