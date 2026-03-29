@echo off
REM Job Listing Portal - Windows Deployment Script

echo 🚀 Job Listing Portal Deployment Script
echo =====================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Navigate to backend directory
cd backend

REM Install dependencies
echo 📦 Installing backend dependencies...
npm install

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found. Creating template...
    echo MONGO_URI=mongodb://localhost:27017/joblisting> .env
    echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production>> .env
    echo CLIENT_URL=http://localhost:3000>> .env
    echo PORT=5000>> .env
    echo ✅ Created .env template. Please edit it with your actual values.
) else (
    echo ✅ .env file exists
)

REM Create uploads directory if it doesn't exist
if not exist "uploads" (
    mkdir uploads
    echo ✅ Created uploads directory
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit the .env file with your MongoDB connection and JWT secret
echo 2. Start the server with: npm start
echo 3. Open Frontend\premium.html in your browser
echo.
echo Happy coding! 🚀
pause