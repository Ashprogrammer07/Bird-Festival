/**
 * Example: Updated Schedule Component with Bilingual Support
 * 
 * This demonstrates how to integrate bilingual content in a React component.
 * You can use this as a reference for updating other components.
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedContent } from '../utils/i18nHelper';

const ScheduleExample = () => {
    const { language, t } = useLanguage();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSchedules();
    }, [language]); // Refetch when language changes

    const fetchSchedules = async () => {
        try {
            setLoading(true);

            // Option 1: Request localized data from API (RECOMMENDED)
            // This is more efficient as the server does the localization
            const response = await fetch(`/api/schedule?lang=${language}`);
            const data = await response.json();
            setSchedules(data);

            /* Option 2: Get full bilingual data and localize on frontend
            const response = await fetch('/api/schedule');
            const data = await response.json();
            
            // Localize each schedule
            const localizedSchedules = data.map(schedule => ({
              ...schedule,
              title: getLocalizedContent(schedule.title, language),
              events: schedule.events.map(event => ({
                ...event,
                activity: getLocalizedContent(event.activity, language),
                location: getLocalizedContent(event.location, language),
                description: getLocalizedContent(event.description, language),
              }))
            }));
            
            setSchedules(localizedSchedules);
            */

        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">
                {t('schedule.title')}
            </h1>

            <div className="space-y-8">
                {schedules.map((schedule) => (
                    <div
                        key={schedule._id}
                        className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                    >
                        {/* Day Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-green-700">
                                    {t('schedule.day')} {schedule.day}
                                </h2>
                                <p className="text-gray-600">{formatDate(schedule.date)}</p>
                            </div>
                            <div className="text-3xl font-bold text-green-600">
                                {schedule.title}
                            </div>
                        </div>

                        {/* Events */}
                        <div className="space-y-4">
                            {schedule.events.map((event, index) => (
                                <div
                                    key={index}
                                    className="border-l-4 border-green-500 pl-4 py-2 hover:bg-green-50 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="min-w-[100px]">
                                            <span className="text-sm font-semibold text-green-700">
                                                {event.time}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-gray-800">
                                                {event.activity}
                                            </h3>
                                            {event.location && (
                                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                    </svg>
                                                    {event.location}
                                                </p>
                                            )}
                                            {event.description && (
                                                <p className="text-sm text-gray-700 mt-2">
                                                    {event.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {schedules.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        {t('schedule.noSchedules')}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ScheduleExample;

/**
 * USAGE NOTES:
 * 
 * 1. The component automatically refetches data when language changes
 * 2. Using Option 1 (API localization) is recommended for better performance
 * 3. All text content is now properly localized
 * 4. Date formatting respects the current language
 * 5. Static UI text uses the translation function t()
 * 
 * MIGRATION CHECKLIST:
 * ✅ Import useLanguage hook
 * ✅ Import i18n helpers if needed
 * ✅ Add language to useEffect dependencies
 * ✅ Update API calls to include ?lang parameter
 * ✅ Remove manual bilingual object access (e.g., title.en)
 * ✅ Use localized data directly
 * ✅ Update date/time formatting to respect language
 */
