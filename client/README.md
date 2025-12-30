# Bird Festival Frontend

Frontend for the Rajasthan Birds Festival website built with React, Vite, and Tailwind CSS.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional):
```bash
cp .env.example .env
```

The default API URL is `http://localhost:5000/api`. Update if needed.

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable components (Navbar, Footer, Loader)
├── pages/          # Page components (Home, About, Schedule, Contact, Ebook)
├── services/       # API service layer
├── App.jsx         # Main app component with routing
├── main.jsx        # Entry point
└── index.css       # Global styles and Tailwind imports
```

## Features

- **Responsive Design**: Works seamlessly on all devices
- **Modern UI**: Clean, professional design with Tailwind CSS
- **Hero Section**: Full-screen hero with background image and animations
- **API Integration**: Connected to backend REST API
- **Form Validation**: Client-side validation with error handling
- **Loading States**: Smooth loading indicators
- **SEO Ready**: Meta tags and semantic HTML

## Pages

1. **Home** - Hero section with festival information and features
2. **About Us** - Mission, vision, and birding locations
3. **Schedule** - Day-wise festival itinerary
4. **Contact** - Contact form and information
5. **E-Book** - Festival bird guide download

## Technologies

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios
