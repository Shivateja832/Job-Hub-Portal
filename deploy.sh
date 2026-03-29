#!/bin/bash

# Job Listing Portal - Deployment Script

echo "🚀 Job Listing Portal Deployment Script"
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating template..."
    cat > .env << EOL
MONGO_URI=mongodb://localhost:27017/joblisting
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=http://localhost:3000
PORT=5000
EOL
    echo "✅ Created .env template. Please edit it with your actual values."
else
    echo "✅ .env file exists"
fi

# Create uploads directory if it doesn't exist
if [ ! -d "uploads" ]; then
    mkdir uploads
    echo "✅ Created uploads directory"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit the .env file with your MongoDB connection and JWT secret"
echo "2. Start the server with: npm start"
echo "3. Open Frontend/premium.html in your browser"
echo ""
echo "Happy coding! 🚀"