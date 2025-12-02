# CivicWorks

A modern civic issue tracking platform for reporting and managing public infrastructure complaints.

## Features

- 📱 **Camera-based reporting** - Capture evidence on the spot
- 🗺️ **Interactive map** - View all complaints geographically
- 💬 **Community engagement** - Like, comment, and discuss issues
- 🌓 **Dark mode** - Professional light and dark themes
- 📊 **Analytics dashboard** - Track metrics and statistics
- 👤 **User profiles** - Manage your submitted reports

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Leaflet for maps
- Axios for API calls
- Modern CSS with CSS variables

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads
- bcrypt for password hashing

## Local Development

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/civicworks.git
cd civicworks
```

2. **Backend Setup**
```bash
cd civicworks-backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

3. **Frontend Setup**
```bash
cd civicworks-frontend
npm install
npm start
```

4. **Open the app**
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## Deployment to Vercel

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### Quick Deploy

1. **Deploy Backend**
```bash
cd civicworks-backend
vercel
```

2. **Update Frontend ENV**
```bash
cd civicworks-frontend
echo "REACT_APP_API_URL=https://your-backend.vercel.app/api" > .env.production
```

3. **Deploy Frontend**
```bash
vercel
```

## Environment Variables

### Backend (`.env`)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `CORS_ORIGIN` - Allowed frontend URLs (comma-separated)
- `NODE_ENV` - development/production

### Frontend (`.env.production`)
- `REACT_APP_API_URL` - Backend API URL

## Project Structure

```
civicworks/
├── civicworks-backend/
│   ├── src/
│   │   ├── config/      # Database connection
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth middleware
│   │   └── index.ts     # Entry point
│   ├── uploads/         # User-uploaded images
│   ├── vercel.json      # Vercel config
│   └── package.json
│
└── civicworks-frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── context/     # Auth context
    │   ├── lib/         # API utilities
    │   └── styles.css   # Global styles
    ├── public/
    └── package.json
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create report (multipart/form-data)
- `POST /api/reports/:id/like` - Toggle like
- `POST /api/reports/:id/dislike` - Toggle dislike
- `POST /api/reports/:id/comments` - Add comment
- `GET /api/reports/:id/comments` - Get comments

### Profile
- `GET /api/profile/my-reports` - Get user's reports
- `DELETE /api/profile/reports/:id` - Delete report

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
