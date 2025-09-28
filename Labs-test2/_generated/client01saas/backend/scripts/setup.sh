#!/bin/bash
# Initial setup script for client01saas FastAPI backend

set -e

echo "🚀 Setting up client01saas FastAPI backend..."

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
required_version="3.11"

if ! python3 -c "import sys; exit(0 if sys.version_info >= (3, 11) else 1)"; then
    echo "❌ Python 3.11+ is required. Current version: $python_version"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "📦 Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Copy .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration"
fi

# Check PostgreSQL
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL is installed"
else
    echo "⚠️  PostgreSQL is not installed. Please install it to continue."
fi

# Check Redis
if command -v redis-cli &> /dev/null; then
    echo "✅ Redis is installed"
else
    echo "⚠️  Redis is not installed. Please install it for caching and Celery."
fi

# Initialize database
echo "🗄️  Initializing database..."
alembic upgrade head

# Create initial data
echo "📊 Creating initial data..."
python scripts/init_db.py

echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  1. Start Redis: redis-server"
echo "  2. Start Celery: celery -A app.worker worker --loglevel=info"
echo "  3. Start FastAPI: uvicorn app.main:app --reload"
echo ""
echo "Visit http://localhost:8000 to see your API"
echo "API docs available at http://localhost:8000/api/docs"