# Deep Internationalization Migration Guide

## 🌍 Overview

This guide explains the bilingual database schema implementation for the Bird Festival project. All dynamic content now supports both English (en) and Hindi (hi) languages.

## 📊 Updated Database Models

### 1. **Schedule Model**
**Bilingual Fields:**
- `title` - Schedule day title
- `events[].activity` - Event activity name
- `events[].location` - Event location
- `events[].description` - Event description

**Example Document:**
```json
{
  "day": 1,
  "date": "2024-02-15",
  "title": {
    "en": "Bird Watching",
    "hi": "पक्षी दर्शन"
  },
  "events": [
    {
      "time": "09:00 AM",
      "activity": {
        "en": "Morning Bird Walk",
        "hi": "सुबह पक्षी भ्रमण"
      },
      "location": {
        "en": "Keoladeo National Park",
        "hi": "केवलादेव राष्ट्रीय उद्यान"
      },
      "description": {
        "en": "Guided bird watching tour",
        "hi": "निर्देशित पक्षी दर्शन यात्रा"
      }
    }
  ]
}
```

### 2. **FestivalInfo Model**
**Bilingual Fields:**
- `title` - Festival title
- `description` - Festival description
- `location` - Festival location
- `mission` - Festival mission
- `vision` - Festival vision
- `about` - About the festival
- `features[].title` - Feature title
- `features[].description` - Feature description

### 3. **GalleryImage Model**
**Bilingual Fields:**
- `title` - Image title
- `category` - Image category

### 4. **ResourcePerson Model**
**Bilingual Fields:**
- `designation` - Person's designation
- `organization` - Organization name
- `expertise` - Area of expertise
- `bio` - Biography
- `topics` - Topics they can speak on

### 5. **Ebook Model**
**Bilingual Fields:**
- `title` - E-book title
- `description` - E-book description
- `author` - Author name

### 6. **Quiz Model**
**Bilingual Fields:**
- `title` - Quiz title
- `description` - Quiz description
- `questions[].questionText` - Question text
- `questions[].options[]` - Answer options (array of bilingual objects)

**Note:** `correctAnswer` is now a **Number** (0-based index) instead of a string.

## 🔧 API Usage

### Getting Localized Content

All GET endpoints now support an optional `lang` query parameter:

**Examples:**

```javascript
// Get schedules in English
GET /api/schedule?lang=en

// Get schedules in Hindi
GET /api/schedule?lang=hi

// Get full bilingual data (for admin)
GET /api/schedule

// Get festival info in Hindi
GET /api/festival?lang=hi

// Get gallery images in English
GET /api/gallery?lang=en

// Get quizzes in Hindi
GET /api/quiz/published?lang=hi
```

### Response Format

**With `lang` parameter:**
```json
{
  "title": "Bird Watching",
  "description": "A wonderful event"
}
```

**Without `lang` parameter (full bilingual):**
```json
{
  "title": {
    "en": "Bird Watching",
    "hi": "पक्षी दर्शन"
  },
  "description": {
    "en": "A wonderful event",
    "hi": "एक अद्भुत कार्यक्रम"
  }
}
```

## 🛠️ Frontend Integration

### Using the i18n Helper

```javascript
import { getLocalizedContent, deepLocalize } from '../utils/i18nHelper';
import { useLanguage } from '../context/LanguageContext';

function MyComponent() {
  const { language } = useLanguage();
  const [festivalData, setFestivalData] = useState(null);

  useEffect(() => {
    // Option 1: Request localized data from API
    fetch(`/api/festival?lang=${language}`)
      .then(res => res.json())
      .then(data => setFestivalData(data));

    // Option 2: Get full data and localize on frontend
    fetch('/api/festival')
      .then(res => res.json())
      .then(data => {
        const localized = deepLocalize(data, language);
        setFestivalData(localized);
      });
  }, [language]);

  return (
    <div>
      <h1>{festivalData?.title}</h1>
      <p>{festivalData?.description}</p>
    </div>
  );
}
```

### Manual Localization

```javascript
import { getLocalizedContent } from '../utils/i18nHelper';

const bilingualTitle = {
  en: "Bird Watching",
  hi: "पक्षी दर्शन"
};

// Get English version
const englishTitle = getLocalizedContent(bilingualTitle, 'en');

// Get Hindi version
const hindiTitle = getLocalizedContent(bilingualTitle, 'hi');
```

## 📝 Data Migration

### For Existing Data

If you have existing monolingual data, you need to migrate it to the new bilingual format:

**Before:**
```json
{
  "title": "Bird Watching"
}
```

**After:**
```json
{
  "title": {
    "en": "Bird Watching",
    "hi": "पक्षी दर्शन"
  }
}
```

### Migration Script Example

```javascript
// Example migration for Schedule collection
const schedules = await Schedule.find({});

for (const schedule of schedules) {
  // Check if already migrated
  if (typeof schedule.title === 'string') {
    schedule.title = {
      en: schedule.title,
      hi: schedule.title // You'll need to add proper Hindi translations
    };
    
    // Migrate events
    schedule.events = schedule.events.map(event => ({
      ...event,
      activity: typeof event.activity === 'string' 
        ? { en: event.activity, hi: event.activity }
        : event.activity,
      location: typeof event.location === 'string'
        ? { en: event.location, hi: event.location }
        : event.location,
      description: typeof event.description === 'string'
        ? { en: event.description, hi: event.description }
        : event.description,
    }));
    
    await schedule.save();
  }
}
```

## 🎯 Admin Panel Updates

When creating/editing content through the admin panel, you now need to provide both English and Hindi versions:

**Form Structure Example:**
```jsx
<form>
  <div>
    <label>Title (English)</label>
    <input name="title.en" />
  </div>
  <div>
    <label>शीर्षक (हिंदी)</label>
    <input name="title.hi" />
  </div>
  
  <div>
    <label>Description (English)</label>
    <textarea name="description.en" />
  </div>
  <div>
    <label>विवरण (हिंदी)</label>
    <textarea name="description.hi" />
  </div>
</form>
```

## 🔍 Validation

All bilingual fields are **required** by default. Both English and Hindi versions must be provided when creating new content.

**Validation Error Example:**
```json
{
  "message": "Validation failed",
  "errors": {
    "title.en": "English title is required",
    "title.hi": "Hindi title is required"
  }
}
```

## 🚀 Benefits

1. **100% Bilingual Experience** - Users see content in their preferred language
2. **SEO Optimization** - Better search engine visibility in both languages
3. **Accessibility** - Reaches wider audience
4. **Maintainability** - All translations in one place
5. **Flexibility** - Easy to add more languages in the future

## 📚 Helper Functions Reference

### Backend (`server/utils/i18nHelper.js`)

- `getLocalizedContent(bilingualObj, lang)` - Get localized string
- `deepLocalize(obj, lang)` - Recursively localize nested objects
- `toLocalizedObject(doc, lang)` - Convert Mongoose doc to localized object
- `toLocalizedObjects(docs, lang)` - Convert array of docs to localized objects
- `getLanguageFromRequest(req)` - Extract language from request

### Frontend (`client/src/utils/i18nHelper.js`)

- `getLocalizedContent(bilingualObj, lang)` - Get localized string
- `deepLocalize(obj, lang)` - Recursively localize nested objects
- `localizeData(data, lang)` - Localize API response data
- `hasBilingualContent(obj)` - Check if object has bilingual content
- `getMissingTranslations(obj)` - Get missing language codes

## ⚠️ Important Notes

1. **Quiz Model Change**: The `correctAnswer` field is now a **Number** (index) instead of a String. Update your quiz submission logic accordingly.

2. **Backward Compatibility**: The helpers include backward compatibility - if a field is still a string, it will be returned as-is.

3. **Admin Endpoints**: Admin endpoints return full bilingual data by default (no `lang` parameter needed).

4. **Performance**: Requesting localized data (`?lang=en`) is more efficient than getting full bilingual data and localizing on the frontend.

## 🎨 Best Practices

1. **Always provide both translations** when creating content
2. **Use the `lang` query parameter** in frontend API calls for better performance
3. **Leverage the helper functions** instead of manual object traversal
4. **Test in both languages** before deploying
5. **Keep translations culturally appropriate** - don't just use Google Translate

## 📞 Support

For questions or issues with the internationalization system, please refer to:
- Backend helpers: `server/utils/i18nHelper.js`
- Frontend helpers: `client/src/utils/i18nHelper.js`
- Language context: `client/src/context/LanguageContext.jsx`
