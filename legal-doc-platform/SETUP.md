# Legal Document Management Platform - Setup Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **Python 3.11+** and pip
- **PostgreSQL 14+**
- **Redis** (for background tasks)
- **Docker** and Docker Compose (optional)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd legal-doc-platform
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Set up database
createdb legal_docs

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

### 4. Database Setup
```bash
# Create database
createdb legal_docs

# Run the schema
psql legal_docs < database/schemas/legal_docs_schema.sql

# Or use Django migrations
cd backend
python manage.py migrate
```

## 🐳 Docker Setup (Alternative)

### Using Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Services
```bash
# Database only
docker-compose up db redis

# Backend only
docker-compose up backend celery

# Frontend only
docker-compose up frontend
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/legal_docs
REDIS_URL=redis://localhost:6379/0
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

## 📁 Project Structure

```
legal-doc-platform/
├── .cursor/
│   ├── rules/                    # Client-specific rules
│   └── dev-workflow/             # Workflow templates
├── frontend/                     # Next.js application
│   ├── app/                     # App Router pages
│   ├── components/              # React components
│   ├── lib/                     # Utilities and hooks
│   └── types/                   # TypeScript definitions
├── backend/                     # Django application
│   ├── apps/                    # Django apps
│   │   ├── accounts/            # User management
│   │   ├── documents/           # Document handling
│   │   ├── clients/             # Client management
│   │   ├── cases/               # Case management
│   │   ├── audit/               # Audit logging
│   │   └── search/              # Search functionality
│   └── config/                  # Django settings
├── database/                    # Database schemas
│   ├── schemas/                 # SQL schemas
│   ├── migrations/              # Django migrations
│   └── seeds/                   # Sample data
├── docs/                        # Documentation
├── deployment/                  # Deployment configs
│   ├── docker-compose.yml       # Docker setup
│   └── nginx/                   # Nginx configuration
└── README.md                    # Project overview
```

## 🔐 Security Features

### Authentication & Authorization
- Multi-factor authentication (MFA)
- Role-based access control (RBAC)
- Session management with secure tokens
- OAuth2 integration

### Data Protection
- AES-256 encryption for sensitive data
- Secure file storage with access controls
- Comprehensive audit logging
- Data anonymization for privacy

### Compliance
- GDPR compliance tools
- CCPA compliance for California clients
- ABA Model Rules adherence
- SOC 2 Type II security controls

## 🎯 Key Features

### Document Management
- Secure document upload and storage
- Version control with change tracking
- Advanced search and filtering
- Document sharing with expiration dates
- Legal hold functionality

### Client Management
- Client portal with secure access
- Case-based document organization
- Document permissions by role
- Communication tracking

### Audit & Compliance
- Comprehensive activity logging
- Audit reports for compliance
- Data retention policies
- Privacy controls and data anonymization

## 🚀 Deployment

### Production Checklist
- [ ] Set `DEBUG=False` in production
- [ ] Configure secure database credentials
- [ ] Set up AWS S3 for file storage
- [ ] Configure SSL certificates
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies
- [ ] Test audit logging functionality
- [ ] Verify compliance requirements

### Environment Setup
1. **Development**: Local development with Docker
2. **Staging**: Cloud deployment for testing
3. **Production**: Secure cloud deployment with monitoring

## 📊 Monitoring & Analytics

### Application Monitoring
- Real-time activity monitoring
- User access patterns
- Document usage statistics
- System performance metrics

### Security Monitoring
- Failed login attempts
- Unauthorized access attempts
- Document access patterns
- Security incident tracking

## 🤝 Development Workflow

### Code Standards
- Follow the rules in `.cursor/rules/`
- Ensure all security requirements are met
- Add comprehensive tests for new features
- Update documentation for any changes

### Testing
- Unit tests for all components
- Integration tests for APIs
- Security testing and validation
- User acceptance testing

## 📚 Documentation

- **README.md**: Project overview and quick start
- **docs/technical-architecture.md**: Detailed technical documentation
- **docs/deployment-guide.md**: Deployment instructions
- **.cursor/dev-workflow/**: Development workflow templates

## 🆘 Support

### Getting Help
- Review the documentation in `/docs`
- Check the troubleshooting guides
- Create an issue in the repository
- Contact the development team

### Common Issues
1. **Database Connection**: Check PostgreSQL is running and credentials are correct
2. **File Upload**: Verify file permissions and storage configuration
3. **Authentication**: Check session configuration and token validity
4. **Search**: Ensure search index is properly configured

## 🔒 Security Notice

This platform handles sensitive legal documents. All security measures must be properly configured before production use. Regular security audits are recommended.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
