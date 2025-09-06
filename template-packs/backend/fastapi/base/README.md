# {{PROJECT_NAME}} Backend

FastAPI backend for {{PROJECT_NAME}}.

## Getting Started

### Prerequisites
- Python 3.11+
- PostgreSQL
- Redis (for caching and Celery)

### Installation

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations:
```bash
alembic upgrade head
```

### Development

Run the development server:
```bash
uvicorn main:app --reload
```

The API will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## Project Structure

```
app/
├── api/              # API endpoints
│   └── v1/           # API version 1
├── core/             # Core functionality
├── crud/             # CRUD operations
├── db/               # Database models
├── schemas/          # Pydantic schemas
├── services/         # Business logic
└── utils/            # Utility functions
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## Testing

Run tests:
```bash
pytest
```

Run with coverage:
```bash
pytest --cov=app tests/
```

## Database

### Migrations

Create a new migration:
```bash
alembic revision --autogenerate -m "Description"
```

Apply migrations:
```bash
alembic upgrade head
```

## Docker

Build and run with Docker:
```bash
docker build -t {{PROJECT_NAME}}-backend .
docker run -p 8000:8000 {{PROJECT_NAME}}-backend
```

## Code Quality

Format code:
```bash
black .
```

Lint code:
```bash
flake8
```

Type checking:
```bash
mypy app
```