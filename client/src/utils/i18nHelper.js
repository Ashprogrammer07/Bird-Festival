/**
 * Frontend Internationalization Helper Utilities
 * Provides functions to work with bilingual content in React components
 */

/**
 * Get localized content from a bilingual object
 * @param {Object} bilingualObj - Object with 'en' and 'hi' properties
 * @param {String} lang - Language code ('en' or 'hi')
 * @returns {String} - Localized content or fallback
 */
export const getLocalizedContent = (bilingualObj, lang = 'en') => {
    if (!bilingualObj) return '';

    // If it's already a string (backward compatibility), return it
    if (typeof bilingualObj === 'string') return bilingualObj;

    // Return the requested language, fallback to English, then to any available value
    return bilingualObj[lang] || bilingualObj.en || bilingualObj.hi || '';
};

/**
 * Deep localize nested objects and arrays
 * @param {*} obj - Object to localize
 * @param {String} lang - Language code
 * @returns {*} - Localized object
 */
export const deepLocalize = (obj, lang = 'en') => {
    if (!obj) return obj;

    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map(item => deepLocalize(item, lang));
    }

    // Handle objects
    if (typeof obj === 'object') {
        // Check if it's a bilingual object (has both 'en' and 'hi' keys)
        if (obj.en !== undefined && obj.hi !== undefined) {
            return getLocalizedContent(obj, lang);
        }

        // Recursively process nested objects
        const result = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                result[key] = deepLocalize(obj[key], lang);
            }
        }
        return result;
    }

    // Return primitive values as-is
    return obj;
};

/**
 * Custom React hook to get localized content
 * @param {Object} bilingualObj - Bilingual object
 * @returns {String} - Localized content based on current language context
 */
export const useLocalizedContent = (bilingualObj) => {
    // This would typically use the LanguageContext
    // For now, we'll import it dynamically when used
    return getLocalizedContent(bilingualObj);
};

/**
 * Helper to localize an entire data object
 * Useful for API responses
 * @param {Object|Array} data - Data to localize
 * @param {String} lang - Language code
 * @returns {Object|Array} - Localized data
 */
export const localizeData = (data, lang = 'en') => {
    return deepLocalize(data, lang);
};

/**
 * Format bilingual text for display
 * Shows both languages if needed for admin/debug
 * @param {Object} bilingualObj - Bilingual object
 * @param {Boolean} showBoth - Whether to show both languages
 * @returns {String} - Formatted text
 */
export const formatBilingualText = (bilingualObj, showBoth = false) => {
    if (!bilingualObj) return '';

    if (typeof bilingualObj === 'string') return bilingualObj;

    if (showBoth) {
        return `${bilingualObj.en || ''} / ${bilingualObj.hi || ''}`;
    }

    return bilingualObj.en || bilingualObj.hi || '';
};

/**
 * Validate if an object has bilingual content
 * @param {Object} obj - Object to check
 * @returns {Boolean} - True if has both en and hi
 */
export const hasBilingualContent = (obj) => {
    return obj && typeof obj === 'object' && obj.en && obj.hi;
};

/**
 * Get missing translations from a bilingual object
 * @param {Object} obj - Bilingual object
 * @returns {Array} - Array of missing language codes
 */
export const getMissingTranslations = (obj) => {
    if (!obj || typeof obj !== 'object') return ['en', 'hi'];

    const missing = [];
    if (!obj.en) missing.push('en');
    if (!obj.hi) missing.push('hi');

    return missing;
};
