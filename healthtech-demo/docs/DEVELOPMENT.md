# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+

- Docker and Docker Compose
- Git

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourorg/healthtech-demo.git
   cd healthtech-demo
   ```

2. **Install dependencies**
   ```bash
   make setup
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Start development environment**
   ```bash
   make dev
   ```

## Development Workflow

### Daily Development

1. **Start your day**
   ```bash
   git pull origin develop
   make dev
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/TICKET-description
   ```

3. **Make changes**
   - Write code
   - Add tests
   - Update documentation

4. **Run tests**
   ```bash
   make test
   make lint
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/TICKET-description
   # Create PR on GitHub
   ```

## Project Structure

```
healthtech-demo/
├── frontend/          # nextjs application
├── backend/           # fastapi API
├── database/          # Database schemas and migrations
├── docs/              # Documentation
├── scripts/           # Utility scripts
├── tests/             # Integration tests
├── .cursor/           # AI rules and workflows
├── .github/           # GitHub Actions workflows
└── docker-compose.yml # Local development environment
```

## Coding Standards

### General Guidelines
- Follow the style guide for your language
- Write meaningful commit messages
- Add tests for new features
- Document complex logic

### Frontend Standards (nextjs)
- Use TypeScript for type safety
- Follow component-based architecture
- Implement responsive design
- Ensure accessibility (WCAG 2.1 AA)

Example component:
```typescript
interface Props {
  title: string;
  onClick: () => void;
}

export const MyComponent: React.FC<Props> = ({ title, onClick }) => {
  return (
    <button onClick={onClick} className="btn btn-primary">
      {title}
    </button>
  );
};
```

### Backend Standards (fastapi)
- Use type hints
- Implement proper error handling
- Add OpenAPI documentation  
- Write unit tests for all endpoints

Example endpoint:
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ItemCreate(BaseModel):
    name: str
    description: str
    price: float

class ItemResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float

@router.post("/items", response_model=ItemResponse)
async def create_item(item: ItemCreate) -> ItemResponse:
    """Create a new item"""
    # Add business logic here
    return ItemResponse(id=1, **item.dict())
```

## Testing

### Test Structure
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/            # End-to-end tests
└── fixtures/       # Test data
```

### Running Tests
```bash
# All tests
make test

# Unit tests only
cd frontend && npm run test:unit
cd backend && pytest tests/unit

# Integration tests
make test-integration

# E2E tests
make test-e2e
```

### Writing Tests
- Aim for 80% code coverage
- Test edge cases
- Use meaningful test names
- Keep tests independent

## Debugging

### Local Debugging

#### Frontend Debugging
1. Open Chrome DevTools
2. Set breakpoints in Sources tab
3. Use React DevTools extension
4. Check Network tab for API calls

#### Backend Debugging
1. Use debugpy for VS Code
2. Set breakpoints in code
3. Attach debugger to running process

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port
   lsof -i :3000
   # Kill process
   kill -9 PID
   ```

2. **Docker issues**
   ```bash
   # Reset Docker
   docker-compose down -v
   docker system prune -a
   ```

3. **Dependency issues**
   ```bash
   # Clear caches and reinstall
   rm -rf node_modules package-lock.json && npm install
   rm -rf venv && python -m venv venv && pip install -r requirements.txt
   ```

## Performance

### Optimization Tips
- Use React.memo for expensive components
- Implement code splitting
- Optimize images with next/image
- Use CSS modules for styling

- Use connection pooling
- Implement caching (Redis)
- Optimize database queries
- Use async operations

### Monitoring
- Use browser DevTools Performance tab
- Monitor API response times
- Track error rates
- Set up alerts for anomalies

## Security

### Best Practices
- Never commit secrets
- Validate all inputs
- Use parameterized queries
- Implement rate limiting
- Keep dependencies updated

### Security Checklist
- [ ] No hardcoded credentials
- [ ] Input validation implemented
- [ ] Authentication required for sensitive endpoints
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Dependencies scanned for vulnerabilities

## Resources

### Documentation
- [nextjs Docs](https://docs.nextjs.com)
- [fastapi Docs](https://docs.fastapi.com)
- [Project Wiki](https://github.com/yourorg/healthtech-demo/wiki)

### Tools
- [VS Code]( https://code.visualstudio.com/)
- [Postman](https://www.postman.com/) for API testing
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Support
- Team Slack: #healthtech-demo-dev
- Documentation: /docs
- Issue Tracker: GitHub Issues
