# {{PROJECT_NAME}} Django Backend

A {{INDUSTRY}} {{PROJECT_TYPE}} backend built with Django REST Framework.

## Features

- JWT Authentication with refresh tokens
- User management and profiles
- Activity tracking and audit logs
- Health check endpoint
- API documentation (Swagger/ReDoc)
- Celery for async tasks
- Redis for caching
- PostgreSQL database
- Docker support

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

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration
```

### 2. Database Setup

```bash
# Create database
createdb {{PROJECT_NAME}}_db

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 3. Run Development Server

```bash
# Start Redis (required for cache/Celery)
redis-server

# Start Celery worker (in another terminal)
celery -A {{PROJECT_NAME}} worker --loglevel=info

# Start Django server
python manage.py runserver
```

The API will be available at:
- API: http://localhost:8000
- Admin: http://localhost:8000/admin
- API Docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc
- Health: http://localhost:8000/health/

## Project Structure

```
{{PROJECT_NAME}}/
├── settings/          # Django settings
│   ├── base.py       # Base settings
│   ├── development.py # Dev settings
│   ├── production.py  # Prod settings
│   └── testing.py     # Test settings
├── urls.py           # URL configuration
├── wsgi.py          # WSGI config
├── asgi.py          # ASGI config
└── celery.py        # Celery config

apps/
├── authentication/   # Auth app
│   ├── models.py    # User model
│   ├── views.py     # Auth endpoints
│   ├── serializers.py
│   └── tests.py
├── users/           # User management
│   ├── models.py    # Profile, Activity
│   ├── views.py     # User endpoints
│   ├── serializers.py
│   └── tests.py
└── core/            # Core functionality
    ├── models.py    # Base models
    ├── views.py     # Health, info
    └── tests.py

scripts/             # Utility scripts
├── setup.sh        # Initial setup
└── migrate.sh      # Migration helper
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register/` - User registration
- `POST /api/v1/auth/login/` - User login
- `POST /api/v1/auth/logout/` - User logout
- `POST /api/v1/auth/token/refresh/` - Refresh JWT token
- `GET /api/v1/auth/profile/` - Get current user profile
- `PATCH /api/v1/auth/profile/` - Update profile
- `POST /api/v1/auth/change-password/` - Change password

### Users
- `GET /api/v1/users/` - List users
- `GET /api/v1/users/{id}/` - Get user details
- `PATCH /api/v1/users/{id}/` - Update user
- `POST /api/v1/users/{id}/activate/` - Activate user (admin)
- `POST /api/v1/users/{id}/deactivate/` - Deactivate user (admin)
- `GET /api/v1/users/{id}/activities/` - Get user activities
- `GET /api/v1/users/search/` - Search users

### Core
- `GET /health/` - Health check
- `GET /api/v1/` - API info
- `GET /api/v1/stats/` - Statistics (admin)

## Development

### Running Tests

```bash
# Run all tests
python manage.py test

# Run with coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Generate HTML report

# Run specific app tests
python manage.py test apps.authentication
python manage.py test apps.users
```

### Code Quality

```bash
# Format code
black .
isort .

# Lint code
flake8

# Type checking
mypy apps/
```

### Database Migrations

```bash
# Create new migration
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Show migrations
python manage.py showmigrations
```

### Using Docker

```bash
# Build image
docker build -t {{PROJECT_NAME}}-backend .

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f backend

# Run management commands
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

## Environment Variables

See `.env.example` for all available environment variables.

Key variables:
- `SECRET_KEY` - Django secret key (generate new one for production!)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `ALLOWED_HOSTS` - Comma-separated list of allowed hosts
- `CORS_ALLOWED_ORIGINS` - Comma-separated list of allowed origins

## Deployment

### Production Checklist

- [ ] Set `DEBUG=False`
- [ ] Generate new `SECRET_KEY`
- [ ] Configure proper `ALLOWED_HOSTS`
- [ ] Set up SSL/TLS
- [ ] Configure production database
- [ ] Set up Redis for production
- [ ] Configure email backend
- [ ] Set up monitoring (Sentry)
- [ ] Configure static/media file serving
- [ ] Set up backup strategy

### Using Gunicorn

```bash
gunicorn {{PROJECT_NAME}}.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 4 \
    --threads 2 \
    --timeout 60
```

### Using uWSGI

```bash
uwsgi --http :8000 \
    --module {{PROJECT_NAME}}.wsgi \
    --processes 4 \
    --threads 2
```

## Troubleshooting

### Common Issues

1. **Database connection error**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Check database exists

2. **Redis connection error**
   - Check Redis is running
   - Verify REDIS_URL in .env

3. **Migration errors**
   - Try `python manage.py migrate --run-syncdb`
   - Check for circular dependencies

4. **Static files not loading**
   - Run `python manage.py collectstatic`
   - Check STATIC_ROOT setting

5. **CORS errors**
   - Add frontend URL to CORS_ALLOWED_ORIGINS
   - Check middleware order

## License

Copyright © {{YEAR}} {{PROJECT_NAME}}. All rights reserved.