
import { createContext, useState, useContext, useEffect } from 'react';
import { en } from '../translations/en';
import { hi } from '../translations/hi';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Check local storage for saved preference, default to English
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    const translations = language === 'hi' ? hi : en;

    useEffect(() => {
        localStorage.setItem('language', language);
        // Update document dir or lang attribute if needed
        document.documentElement.lang = language;
    }, [language]);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
    };

    // Helper function for nested keys (e.g., t('nav.home'))
    const t = (key) => {
        const keys = key.split('.');
        let value = translations;
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key; // Fallback to key if not found
            }
        }
        return value;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
