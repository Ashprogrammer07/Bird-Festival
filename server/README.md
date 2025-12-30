# Bird Festival Backend API

Backend API for the Rajasthan Birds Festival website built with Node.js, Express, and MongoDB.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bird-festival
NODE_ENV=development
```

### Running the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Festival Information
- `GET /api/festival` - Get active festival information
- `POST /api/festival` - Create festival information
- `PUT /api/festival/:id` - Update festival information

### Schedule
- `GET /api/schedule` - Get all schedules
- `GET /api/schedule/:day` - Get schedule by day
- `POST /api/schedule` - Create new schedule
- `PUT /api/schedule/:id` - Update schedule
- `DELETE /api/schedule/:id` - Delete schedule (soft delete)

### Contact
- `POST /api/contact` - Submit contact message
- `GET /api/contact` - Get all contact messages (admin)
- `PATCH /api/contact/:id/read` - Mark message as read

### E-book
- `GET /api/ebook` - Get active e-book information
- `POST /api/ebook` - Create e-book entry
- `PUT /api/ebook/:id` - Update e-book
- `PATCH /api/ebook/:id/download` - Increment download count

### Health Check
- `GET /api/health` - Check API status

## Database Seeding

To populate the database with sample data, you can use the seed script or manually insert documents using MongoDB Compass or the MongoDB shell.

Example seed data for festival info:
```javascript
{
  "title": "The Rajasthan Birding Festival",
  "description": "Experience the diverse avian life of Rajasthan's wetlands, deserts, and sanctuaries. Join us for guided birding walks, conservation talks, and cultural celebrations.",
  "startDate": "2026-02-10T00:00:00.000Z",
  "endDate": "2026-02-15T00:00:00.000Z",
  "location": "Rajasthan, India",
  "mission": "To promote bird conservation and create awareness about Rajasthan's rich avian biodiversity.",
  "vision": "A sustainable future where humans and birds coexist harmoniously.",
  "about": "The Rajasthan Birding Festival celebrates the state's incredible diversity of bird species...",
  "isActive": true
}
```
