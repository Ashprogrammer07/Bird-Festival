
import { useState, useRef } from "react";
import { generatePledgeCertificate } from "../utils/certificateGenerator";
import { pledgeAPI } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import { Leaf, GraduationCap } from "lucide-react";

const NaturePledge = () => {
  const [hasTakenPledge, setHasTakenPledge] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pledgeType, setPledgeType] = useState('general'); // 'general' | 'student'
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
  });

  const audioRef = useRef(null);
  const audioPath = "/audio/pledge-audio.mp3";

  // Dynamic Pledge Content
  const pledgeTitle = pledgeType === 'student' ? t('pledge.studentTitle') : t('pledge.title');
  const pledgeContent = pledgeType === 'student' ? t('pledge.studentText') : t('pledge.text');

  const handleSubmit = async () => {
    if (!form.name || !form.state || !form.district) {
      setError(t('common.required'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await pledgeAPI.takePledge({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        location: {
          state: form.state.trim(),
          district: form.district.trim(),
          city: form.city.trim(),
          pincode: form.pincode.trim(),
        },
      });

      setHasTakenPledge(true);
      setShowForm(false);
    } catch (err) {
      setError(
        err.response?.data?.message || t('contact.error')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = () => {
    generatePledgeCertificate(form.name || "Participant", pledgeType);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div
        className="relative h-64 md:h-80 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero/1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">
              {t('pledge.title')}
            </h1>
            <p className="text-gray-200 text-lg">
              {t('pledge.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container mx-auto max-w-4xl px-4">

          {/* PLEDGE TYPE SELECTOR */}
          <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4 justify-center items-center">
            <span className="font-semibold text-gray-700">{t('pledge.pledgeType')}:</span>
            <div className="flex gap-3">
              <button
                onClick={() => setPledgeType('general')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${pledgeType === 'general'
                  ? 'bg-green-100 border-green-500 text-green-800'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Leaf className="w-4 h-4" />
                {t('pledge.general')}
              </button>
              <button
                onClick={() => setPledgeType('student')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${pledgeType === 'student'
                  ? 'bg-amber-100 border-amber-500 text-amber-800'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <GraduationCap className="w-4 h-4" />
                {t('pledge.student')}
              </button>
            </div>
          </div>

          {/* AUDIO */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-serif font-bold text-center mb-4">
              Listen to the Pledge
            </h2>
            <audio ref={audioRef} controls className="w-full max-w-md mx-auto">
              <source src={audioPath} type="audio/mpeg" />
            </audio>
          </div>

          {/* PLEDGE TEXT */}
          <div className="bg-white p-6 rounded-lg shadow mb-8 transition-all duration-500">
            <h2 className="text-2xl font-serif font-bold text-center mb-4 transition-all">
              {pledgeTitle}
            </h2>
            <div className={`border rounded p-6 text-center whitespace-pre-line text-lg leading-relaxed transition-colors duration-300 ${pledgeType === 'student' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-green-50 border-green-200 text-green-900'
              }`}>
              {pledgeContent}
            </div>
          </div>

          {/* BUTTON */}
          {!hasTakenPledge && !showForm && (
            <div className="text-center">
              <button
                onClick={() => setShowForm(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold shadow"
              >
                🌿 {t('pledge.takePledge')}
              </button>
            </div>
          )}

          {/* FORM */}
          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
              <h3 className="text-xl font-serif font-bold text-center mb-4">
                {t('contact.subtitle')}
              </h3>

              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                  {error}
                </div>
              )}

              {/* Simplified loop replacement for translation support on placeholders */}
              <input
                placeholder={t('pledge.name')}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-3 rounded mb-3"
              />
              <input
                placeholder={t('pledge.email')}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border p-3 rounded mb-3"
              />
              <input
                placeholder={t('contact.phone')}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border p-3 rounded mb-3"
              />
              <input
                placeholder="State"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full border p-3 rounded mb-3"
              />
              <input
                placeholder="District"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full border p-3 rounded mb-3"
              />
              <input
                placeholder={t('pledge.location')}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border p-3 rounded mb-3"
              />
              <input
                placeholder="Pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full border p-3 rounded mb-3"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-amber-500 text-white py-3 rounded"
                >
                  {loading ? t('common.loading') : t('common.submit')}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 py-3 rounded"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {hasTakenPledge && (
            <div className="bg-white p-6 rounded-lg shadow text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">✓</span>
              </div>
              <h3 className="text-2xl font-serif font-bold">
                {t('pledge.thanks')}
              </h3>
              <p className="text-gray-600 mt-2">
                {/* Success message */}
              </p>
              <button
                onClick={handleDownloadCertificate}
                className="mt-6 bg-amber-500 text-white px-6 py-3 rounded shadow"
              >
                📜 {t('pledge.certificate')}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NaturePledge;
