# Job Listing Portal

A full-stack job listing application with user authentication, job posting, and application management.

## 🚀 Features

- **User Authentication**: Register and login as job seekers or employers
- **Job Listings**: Browse and search for jobs with filtering
- **Job Applications**: Apply for jobs and track application status
- **Dashboard**: Separate dashboards for job seekers and employers
- **File Uploads**: Profile picture uploads for users
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **multer** for file uploads

### Frontend
- **HTML5**, **CSS3**, **JavaScript**
- **Font Awesome** for icons
- **Responsive design** with CSS Grid/Flexbox

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd job-listing-portal
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
MONGO_URI=mongodb://localhost:27017/joblisting
JWT_SECRET=your-super-secret-jwt-key-here
CLIENT_URL=http://localhost:3000
PORT=5000
```

### 3. Start the Backend
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 4. Frontend Setup
```bash
cd ../Frontend
# Open premium.html in your browser or serve it with a local server
```

## 📱 Usage

1. **Register** as a job seeker or employer
2. **Login** to access your dashboard
3. **Browse jobs** or post new jobs
4. **Apply for jobs** or manage applications
5. **Update profile** with additional information

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Jobs
- `GET /api/jobs` - Get all jobs (with pagination)
- `POST /api/jobs` - Create new job (employers only)
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job (employers only)
- `DELETE /api/jobs/:id` - Delete job (employers only)
- `POST /api/jobs/:id/apply` - Apply for job

### Dashboard
- `GET /api/dashboard/applications` - Get user applications
- `GET /api/dashboard/jobs` - Get employer jobs
- `PUT /api/dashboard/applications/:id/status` - Update application status

## 🗂️ Project Structure

```
job-listing-portal/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Authentication & upload middleware
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── uploads/        # File uploads directory
│   ├── server.js       # Main server file
│   └── package.json
├── Frontend/
│   └── premium.html    # Main frontend file
├── .gitignore
└── README.md
```

## 🔒 Environment Variables

Create a `.env` file in the backend directory:

```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
CLIENT_URL=http://localhost:3000
PORT=5000
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB database
2. Configure environment variables
3. Deploy to hosting service (Heroku, Railway, etc.)
4. Run `npm install --production`

### Frontend Deployment
1. Host the HTML file on any static hosting service
2. Update `CLIENT_URL` in backend to match frontend URL

## 🧪 Testing

Run the backend server and test the endpoints using:
- Postman
- Thunder Client (VS Code extension)
- Browser developer tools

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues, please create an issue in the repository.

---

**Happy coding! 🎉**