#!/bin/bash
# GuardIQ Backend Startup Script

echo "🛡️  Starting GuardIQ Backend Setup..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Set environment variables
echo "⚙️  Setting up environment..."
export FLASK_APP=app.py
export FLASK_ENV=development
export DATABASE_URL="postgresql://username:password@localhost:5432/guardiq_db"

# Run database setup
echo "🗄️  Setting up database..."
python setup_database.py

# Start the server
echo "🚀 Starting Flask server..."
python run_server.py
