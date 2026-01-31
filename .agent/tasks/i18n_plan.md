
# Internationalization (i18n) Implementation Plan

## 1. Core Infrastructure (✅ Completed)
- [x] Create `LanguageContext` to manage global language state (English/Hindi).
- [x] Create translation files structure (`en.js`, `hi.js`).
- [x] Integrate `LanguageProvider` into the main application root (`App.jsx`).
- [x] Implement Language Switcher in `Navbar`.

## 2. Component Integration (🚧 In Progress)
### Public Pages
- [x] **Home Structure**: Navbar URLs, Hero CTA buttons, Section Headers.
- [ ] **About Page**: History, Mission, Vision sections.
- [ ] **Schedule Page**: Table headers, Day labels, Event descriptions (static parts).
- [ ] **Contact Page**: Form labels (Name, Email, Message), Success/Error messages.
- [ ] **Competitions Page**: Guidelines, Rules, Registration button labels.
- [ ] **Ebook/Pledge/Reader Pages**: All static explanatory text.
- [ ] **Registration Forms**: Form input labels, placeholders, validation messages.

### Admin Panel
- [x] **Sidebar**: Navigation links.
- [ ] **Dashboard**: Stats labels, Welcome messages.
- [ ] **Management Pages**: Table headers (Name, Date, Status), Action buttons (Edit, Delete), Modal titles.

## 3. Dynamic Content Strategy
**Current Status**: Static UI text is translated. Dynamic content (database data like "Features list", "Specific Event Titles") currently displays as entered in the database (mostly English/mixed).

**Future Enhancement (Optional)**:
- To fully translate database content, we would need to:
    1.  Update Database Schemas (e.g., `title_en`, `title_hi`).
    2.  Update Admin Forms to accept both languages.
    3.  Update API to return localized data based on request.
*Recommendation*: Stick to UI translation first (Labels, Menus, Buttons) as it covers 80% of the user experience.

## 4. Next Steps
1.  Verify the Hindi toggle on Home and Admin Sidebar.
2.  Systematically update the remaining Public Pages (About, Schedule, Contact, etc.).
3.  Update Admin Dashboard and CRUD list pages.
