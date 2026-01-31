
import { useState, useEffect } from 'react';
import { scheduleAPI } from '../services/api';
import Loader from '../components/Loader';
import { useLanguage } from '../context/LanguageContext';

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await scheduleAPI.getAllSchedules();
        // The backend now has Hindi data stored directly in fields if seeded that way.
        // Or it has mixed data.
        if (Array.isArray(response.data) && response.data.length > 0) {
          setSchedules(response.data);
        } else {
          setSchedules([]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load schedule');
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div
        className="relative h-64 md:h-80 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/schedule/1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">
              {t('schedule.title')}
            </h1>
            <p className="text-gray-200 text-lg">
              {t('schedule.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <section className="py-14">
        <div className="container mx-auto max-w-5xl px-4">
          {error && (
            <p className="text-center text-red-600 mb-6">{error}</p>
          )}

          {schedules.length === 0 ? (
            <p className="text-center text-gray-600">
              {t('schedule.soon')}
            </p>
          ) : (
            <div className="space-y-10">
              {schedules.map((schedule) => (
                <div key={schedule._id} className="bg-white rounded-xl shadow">
                  <div className="bg-amber-500 px-6 py-4 text-white">
                    <p className="text-sm opacity-90">{t('schedule.day')} {schedule.day}</p>
                    <h2 className="text-2xl font-serif font-bold">
                      {schedule.title}
                    </h2>
                    <p>{formatDate(schedule.date)}</p>
                  </div>

                  <div className="p-6 space-y-5">
                    {schedule.events.map((event, index) => (
                      <div key={index} className="border-b pb-4 last:border-0">
                        <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded text-sm font-semibold">
                          {event.time}
                        </span>

                        <h3 className="text-lg font-bold mt-2">
                          {event.activity}
                        </h3>

                        {event.location && (
                          <p className="text-amber-600">
                            📍 {event.location}
                          </p>
                        )}

                        {event.description && (
                          <p className="text-gray-600 mt-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Schedule;
