import { useState, useRef } from "react";
import { generatePledgeCertificate } from "../utils/certificateGenerator";
import { pledgeAPI } from "../services/api";

const NaturePledge = () => {
  const [hasTakenPledge, setHasTakenPledge] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const pledgeContent = `
I pledge to protect and preserve our natural heritage,
to respect all living creatures and their habitats,
to reduce my environmental footprint,
and to inspire others to join in conservation efforts.

I promise to be a guardian of nature,
to celebrate the beauty of birds and wildlife,
and to work towards a sustainable future for generations to come.
`;

  const handleSubmit = async () => {
    if (!form.name || !form.state || !form.district) {
      setError("Name, State and District are required");
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
        err.response?.data?.message ||
          "Failed to submit pledge. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = () => {
    generatePledgeCertificate(form.name || "Participant");
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
              Nature Pledge
            </h1>
            <p className="text-gray-200 text-lg">
              Commit to protecting our natural heritage
            </p>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container mx-auto max-w-4xl px-4">

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
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-serif font-bold text-center mb-4">
              The Pledge
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded p-4 text-center whitespace-pre-line">
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
                🌿 Take the Pledge
              </button>
            </div>
          )}

          {/* FORM */}
          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
              <h3 className="text-xl font-serif font-bold text-center mb-4">
                Enter Your Details
              </h3>

              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                  {error}
                </div>
              )}

              {[
                "name",
                "email",
                "phone",
                "state",
                "district",
                "city",
                "pincode",
              ].map((field) => (
                <input
                  key={field}
                  placeholder={field.toUpperCase()}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  className="w-full border p-3 rounded mb-3"
                />
              ))}

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-amber-500 text-white py-3 rounded"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 py-3 rounded"
                >
                  Cancel
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
                Thank You, {form.name}!
              </h3>
              <p className="text-gray-600 mt-2">
                You have successfully taken the Nature Pledge.
              </p>
              <button
                onClick={handleDownloadCertificate}
                className="mt-6 bg-amber-500 text-white px-6 py-3 rounded shadow"
              >
                📜 Download Certificate
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NaturePledge;
