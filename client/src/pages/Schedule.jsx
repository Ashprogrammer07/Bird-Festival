import { useState, useEffect } from 'react';
import { scheduleAPI } from '../services/api';
import Loader from '../components/Loader';

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await scheduleAPI.getAllSchedules();

        // ✅ SAFELY HANDLE BACKEND RESPONSE
        if (Array.isArray(response.data) && response.data.length > 0) {
          setSchedules(response.data);
        } else {
          setSchedules([]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load schedule');

        // ✅ FALLBACK DATA (ONLY IF API FAILS)
        setSchedules([
          {
            _id: '1',
            day: 1,
            date: '2026-02-10T00:00:00.000Z',
            title: 'Opening Day & Orientation',
            events: [
              {
                time: '07:00 AM',
                activity: 'Early Morning Bird Walk',
                location: 'Keoladeo National Park',
                description: 'Explore the wetlands at sunrise',
              },
              {
                time: '10:00 AM',
                activity: 'Festival Inauguration',
                location: 'Convention Center',
                description: 'Welcome ceremony and keynote address',
              },
              {
                time: '02:00 PM',
                activity: 'Bird Photography Workshop',
                location: 'Workshop Hall',
                description: 'Learn techniques from expert photographers',
              },
              {
                time: '06:00 PM',
                activity: 'Cultural Evening',
                location: 'Open Air Theatre',
                description: 'Traditional Rajasthani music and dance',
              },
            ],
          },
          {
            _id: '2',
            day: 2,
            date: '2026-02-11T00:00:00.000Z',
            title: 'Wetland Exploration',
            events: [
              {
                time: '06:00 AM',
                activity: 'Guided Wetland Tour',
                location: 'Bharatpur Wetlands',
                description: 'Full-day birding expedition',
              },
              {
                time: '01:00 PM',
                activity: 'Lunch & Bird Identification Session',
                location: 'Field Base',
                description: 'Review sightings with expert guides',
              },
              {
                time: '04:00 PM',
                activity: 'Conservation Talk',
                location: 'Conference Room',
                description: 'Wetland conservation challenges',
              },
            ],
          },
          {
            _id: '3',
            day: 3,
            date: '2026-02-12T00:00:00.000Z',
            title: 'Desert Birding',
            events: [
              {
                time: '05:30 AM',
                activity: 'Desert Bird Walk',
                location: 'Thar Desert Sanctuary',
                description: 'Discover desert-adapted species',
              },
              {
                time: '11:00 AM',
                activity: 'Bird Call Recognition Workshop',
                location: 'Learning Center',
                description: 'Identify birds by their calls',
              },
              {
                time: '05:00 PM',
                activity: 'Raptor Watching',
                location: 'Rocky Outcrops',
                description: 'Evening raptor survey',
              },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
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
              Festival Schedule
            </h1>
            <p className="text-gray-200 text-lg">
              Your complete itinerary for an unforgettable birding experience
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
              Schedule will be announced soon. Stay tuned!
            </p>
          ) : (
            <div className="space-y-10">
              {schedules.map((schedule) => (
                <div key={schedule._id} className="bg-white rounded-xl shadow">
                  <div className="bg-amber-500 px-6 py-4 text-white">
                    <p className="text-sm opacity-90">Day {schedule.day}</p>
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
