# {{PROJECT_NAME}} FastAPI Backend

A {{INDUSTRY}} {{PROJECT_TYPE}} backend built with FastAPI.

## Features

- ⚡ **FastAPI** - Modern, fast web framework for building APIs
- 🔐 **JWT Authentication** - Secure authentication with access/refresh tokens
- 👥 **User Management** - User registration, profiles, and management
- 📚 **Auto Documentation** - Interactive API docs with Swagger/ReDoc
- 🗄️ **PostgreSQL** - Robust relational database
- 🔄 **Alembic Migrations** - Database version control
- 🚦 **Redis** - Caching and session management
- 📨 **Celery** - Asynchronous task processing
- 🧪 **Testing** - Comprehensive test suite with pytest
- 🐳 **Docker** - Containerized development and deployment
- 📊 **Monitoring** - Health checks and optional Sentry integration

## Prerequisites

- Python 3.11+
- PostgreSQL 12+
- Redis 6+
- Docker (optional)

## Quick Start

### 1. Clone and Setup

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Run setup script
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Manual Setup (Alternative)

```bash
# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Initialize database with superuser
python scripts/init_db.py
```

### 3. Run Development Server

```bash
# Start Redis (required for cache/Celery)
redis-server

# Start Celery worker (in another terminal)
celery -A app.worker worker --loglevel=info

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc
- Health Check: http://localhost:8000/health

## Project Structure

```
app/
├── api/                # API endpoints
│   ├── deps.py        # Common dependencies
│   └── v1/            # API version 1
│       ├── endpoints/ # Route handlers
│       └── router.py  # Main router
├── core/              # Core functionality
│   └── security.py    # Security utilities
├── crud/              # CRUD operations
│   ├── base.py       # Base CRUD class
│   └── crud_user.py  # User CRUD
├── models/            # SQLAlchemy models
│   └── user.py       # User model
├── schemas/           # Pydantic schemas
│   ├── token.py      # Auth schemas
│   └── user.py       # User schemas
├── services/          # Business logic
├── utils/             # Utility functions
├── config.py          # App configuration
├── database.py        # Database setup
└── main.py           # App entry point

alembic/               # Database migrations
├── versions/         # Migration files
└── env.py           # Alembic config

scripts/              # Utility scripts
├── init_db.py       # Initialize database
└── setup.sh         # Setup script

tests/               # Test suite
├── conftest.py     # Test configuration
└── test_*.py       # Test files
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login/access-token` - Login with email/password
- `POST /api/v1/auth/login/test-token` - Test access token
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/password-recovery/{email}` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password with token

### Users
- `GET /api/v1/users/` - List all users (admin only)
- `POST /api/v1/users/` - Create new user (admin only)
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update current user
- `GET /api/v1/users/{user_id}` - Get user by ID
- `PUT /api/v1/users/{user_id}` - Update user (admin only)

### Health
- `GET /health` - Health check endpoint

## Development

### Environment Variables

Key environment variables (see `.env.example` for full list):

```env
# Application
PROJECT_NAME=MyProject
DEBUG=True

# Database
DATABASE_URL=postgresql://user:password@localhost/dbname

# Security
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# First Superuser
FIRST_SUPERUSER=admin@example.com
FIRST_SUPERUSER_PASSWORD=changethis
```

### Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Downgrade one revision
alembic downgrade -1

# Show migration history
alembic history
```

### Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_main.py

# Run with verbose output
pytest -v
```

### Code Quality

```bash
# Format code
black .
isort .

# Lint code
flake8

# Type checking
mypy app
```

### Using Docker

```bash
# Build image
docker build -t {{PROJECT_NAME}}-backend .

# Run container
docker run -d \
  --name {{PROJECT_NAME}}-api \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:pass@db/dbname \
  {{PROJECT_NAME}}-backend

# Using docker-compose
docker-compose up -d
```

## API Documentation

FastAPI automatically generates interactive API documentation:

1. **Swagger UI**: http://localhost:8000/api/docs
   - Interactive interface to test API endpoints
   - Shows request/response schemas
   - Allows testing with authentication

2. **ReDoc**: http://localhost:8000/api/redoc
   - Alternative documentation interface
   - Better for reading and sharing

3. **OpenAPI Schema**: http://localhost:8000/api/openapi.json
   - Machine-readable API specification
   - Can be used for client generation

## Production Deployment

### Checklist

- [ ] Set `DEBUG=False` in environment
- [ ] Use strong `SECRET_KEY`
- [ ] Configure proper `DATABASE_URL`
- [ ] Set up Redis for production
- [ ] Configure email settings
- [ ] Set up monitoring (Sentry)
- [ ] Enable HTTPS
- [ ] Set up backup strategy
- [ ] Configure log aggregation

### Using Gunicorn

```bash
gunicorn app.main:app \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

### Using Docker

See `Dockerfile` for production-ready container configuration.

## Troubleshooting

### Common Issues

1. **Database connection error**
   ```
   sqlalchemy.exc.OperationalError: could not connect to server
   ```
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Ensure database exists

2. **Redis connection error**
   ```
   redis.exceptions.ConnectionError: Error 111 connecting to localhost:6379
   ```
   - Start Redis: `redis-server`
   - Check Redis URL in .env

3. **Import errors**
   ```
   ModuleNotFoundError: No module named 'app'
   ```
   - Ensure you're in the project root
   - Activate virtual environment
   - Reinstall dependencies

4. **Migration errors**
   ```
   alembic.util.exc.CommandError: Can't locate revision
   ```
   - Check alembic versions folder
   - Run `alembic stamp head` to sync

5. **CORS errors**
   - Add frontend URL to BACKEND_CORS_ORIGINS in .env
   - Ensure it includes protocol (http://)

## Contributing

1. Create feature branch
2. Make changes
3. Add tests
4. Run test suite
5. Submit pull request

## License

Copyright © {{YEAR}} {{PROJECT_NAME}}. All rights reserved.