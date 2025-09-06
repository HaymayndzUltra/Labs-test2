# Legal Document Management Platform

A secure, compliance-focused document management platform designed specifically for legal professionals. Built with Next.js frontend, Django backend, and PostgreSQL database.

## 🏛️ Overview

This platform provides a comprehensive solution for legal document management with emphasis on:
- **Attorney-Client Privilege Protection**
- **Regulatory Compliance** (GDPR, CCPA, ABA Model Rules)
- **Audit Trail & Security**
- **Advanced Search & Organization**
- **Client Portal Integration**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL 14+
- Redis (for background tasks)

### Installation

1. **Clone and setup**
```bash
git clone <repository-url>
cd legal-doc-platform
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your database credentials
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Database Setup**
```bash
# Create database
createdb legal_docs

# Run migrations
cd backend
python manage.py migrate
```

## 🏗️ Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS with custom legal theme
- **State Management**: React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Authentication**: NextAuth.js integration
- **File Handling**: React Dropzone for uploads

### Backend (Django 4.2)
- **Framework**: Django REST Framework
- **Authentication**: OAuth2 + JWT tokens
- **Database**: PostgreSQL with full-text search
- **File Storage**: AWS S3 (production) / Local (development)
- **Background Tasks**: Celery with Redis
- **Security**: Rate limiting, CORS, audit logging

### Database (PostgreSQL)
- **ACID Compliance** for data integrity
- **Full-text Search** with GIN indexes
- **Audit Trails** with immutable logging
- **Encryption** at rest and in transit
- **Version Control** for document history

## 🔐 Security Features

### Data Protection
- **AES-256 Encryption** for sensitive data
- **Secure File Storage** with access controls
- **Audit Logging** for all operations
- **Role-based Access Control** (RBAC)

### Compliance
- **GDPR Compliance** with data subject rights
- **CCPA Compliance** for California clients
- **ABA Model Rules** adherence
- **SOC 2 Type II** security controls

### Authentication & Authorization
- **Multi-factor Authentication** (MFA)
- **Single Sign-On** (SSO) integration
- **Session Management** with secure tokens
- **Rate Limiting** to prevent abuse

## 📁 Project Structure

```
legal-doc-platform/
├── .cursor/
│   ├── rules/
│   │   ├── client-specific-rules.mdc
│   │   └── industry-compliance.mdc
│   └── dev-workflow/
├── frontend/                 # Next.js application
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable components
│   ├── lib/                 # Utilities and hooks
│   └── types/               # TypeScript definitions
├── backend/                 # Django application
│   ├── apps/                # Django apps
│   │   ├── accounts/        # User management
│   │   ├── documents/       # Document handling
│   │   ├── clients/         # Client management
│   │   ├── cases/           # Case management
│   │   ├── audit/           # Audit logging
│   │   └── search/          # Search functionality
│   └── config/              # Django settings
├── database/                # Database schemas and migrations
│   ├── schemas/             # SQL schemas
│   ├── migrations/          # Django migrations
│   └── seeds/               # Sample data
├── docs/                    # Documentation
└── deployment/              # Deployment configurations
```

## 🎯 Key Features

### Document Management
- **Secure Upload** with virus scanning
- **Version Control** with change tracking
- **Advanced Search** with full-text indexing
- **Document Sharing** with expiration dates
- **Legal Hold** functionality

### Client Management
- **Client Portal** with secure access
- **Case Organization** by matter
- **Document Permissions** by role
- **Communication Tracking**

### Audit & Compliance
- **Comprehensive Logging** of all actions
- **Audit Reports** for compliance
- **Data Retention** policies
- **Privacy Controls** for sensitive data

### Search & Discovery
- **Full-text Search** across all documents
- **Advanced Filters** by date, client, case type
- **Search Analytics** for usage tracking
- **Saved Searches** for common queries

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```bash
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/legal_docs
REDIS_URL=redis://localhost:6379/0
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_STORAGE_BUCKET_NAME=your-bucket
```

**Frontend (.env.local)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

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

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📊 Monitoring & Analytics

### Audit Dashboard
- Real-time activity monitoring
- User access patterns
- Document usage statistics
- Compliance reporting

### Performance Metrics
- API response times
- Database query performance
- File upload/download speeds
- Search query analytics

## 🤝 Contributing

1. Follow the coding standards in `.cursor/rules/`
2. Ensure all security requirements are met
3. Add comprehensive tests for new features
4. Update documentation for any changes
5. Follow the audit logging requirements

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For technical support or compliance questions:
- Create an issue in the repository
- Contact the development team
- Review the documentation in `/docs`

## 🔒 Security Notice

This platform handles sensitive legal documents. All security measures must be properly configured before production use. Regular security audits are recommended.
