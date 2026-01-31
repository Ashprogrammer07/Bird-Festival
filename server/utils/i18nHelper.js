/**
 * Internationalization Helper Utilities
 * Provides functions to work with bilingual content across the application
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
 * Create a bilingual object from English and Hindi strings
 * @param {String} en - English content
 * @param {String} hi - Hindi content
 * @returns {Object} - Bilingual object
 */
export const createBilingualObject = (en, hi) => {
    return { en, hi };
};

/**
 * Transform a document with bilingual fields to localized version
 * @param {Object} doc - MongoDB document
 * @param {String} lang - Language code ('en' or 'hi')
 * @param {Array} bilingualFields - Array of field names that are bilingual
 * @returns {Object} - Localized document
 */
export const localizeDocument = (doc, lang = 'en', bilingualFields = []) => {
    if (!doc) return null;

    const localized = { ...doc };

    bilingualFields.forEach(field => {
        if (localized[field]) {
            localized[field] = getLocalizedContent(localized[field], lang);
        }
    });

    return localized;
};

/**
 * Transform an array of documents with bilingual fields
 * @param {Array} docs - Array of MongoDB documents
 * @param {String} lang - Language code ('en' or 'hi')
 * @param {Array} bilingualFields - Array of field names that are bilingual
 * @returns {Array} - Array of localized documents
 */
export const localizeDocuments = (docs, lang = 'en', bilingualFields = []) => {
    if (!Array.isArray(docs)) return [];

    return docs.map(doc => localizeDocument(doc, lang, bilingualFields));
};

/**
 * Validate bilingual object has both languages
 * @param {Object} obj - Bilingual object
 * @returns {Boolean} - True if valid
 */
export const isValidBilingualObject = (obj) => {
    return obj && typeof obj === 'object' && obj.en && obj.hi;
};

/**
 * Get all bilingual fields from a schema definition
 * This is a helper for backend use
 */
export const BILINGUAL_FIELDS = {
    Schedule: ['title', 'events.activity', 'events.location', 'events.description'],
    FestivalInfo: ['title', 'description', 'location', 'mission', 'vision', 'about', 'features.title', 'features.description'],
    GalleryImage: ['title', 'category'],
    ResourcePerson: ['designation', 'organization', 'expertise', 'bio', 'topics'],
    Ebook: ['title', 'description', 'author'],
    Quiz: ['title', 'description', 'questions.questionText', 'questions.options'],
};

/**
 * Middleware helper to extract language from request
 * @param {Object} req - Express request object
 * @returns {String} - Language code ('en' or 'hi')
 */
export const getLanguageFromRequest = (req) => {
    // Check query parameter first
    if (req.query.lang && ['en', 'hi'].includes(req.query.lang)) {
        return req.query.lang;
    }

    // Check header
    const langHeader = req.headers['accept-language'];
    if (langHeader && langHeader.includes('hi')) {
        return 'hi';
    }

    // Default to English
    return 'en';
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
        // Return Date objects as-is
        if (obj instanceof Date) return obj;

        // Return ObjectId (BSON type) as-is
        if (obj._bsontype === 'ObjectID' || (obj.constructor && obj.constructor.name === 'ObjectId')) return obj;

        // Check if it's a bilingual object (has both 'en' and 'hi' keys)
        if (obj.en !== undefined && obj.hi !== undefined) {
            return getLocalizedContent(obj, lang);
        }

        // Recursively process nested objects
        const result = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result[key] = deepLocalize(obj[key], lang);
            }
        }
        return result;
    }

    // Return primitive values as-is
    return obj;
};

/**
 * Convert MongoDB document to plain object and localize
 * @param {Object} doc - Mongoose document
 * @param {String} lang - Language code
 * @returns {Object} - Localized plain object
 */
export const toLocalizedObject = (doc, lang = 'en') => {
    if (!doc) return null;

    // Convert to plain object if it's a Mongoose document
    const plainObj = doc.toObject ? doc.toObject() : doc;

    // Deep localize the entire object
    return deepLocalize(plainObj, lang);
};

/**
 * Convert array of MongoDB documents to localized plain objects
 * @param {Array} docs - Array of Mongoose documents
 * @param {String} lang - Language code
 * @returns {Array} - Array of localized plain objects
 */
export const toLocalizedObjects = (docs, lang = 'en') => {
    if (!Array.isArray(docs)) return [];

    return docs.map(doc => toLocalizedObject(doc, lang));
};
