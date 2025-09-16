# AI GOVERNOR FRAMEWORK ENHANCEMENT - API SPECIFICATION

## 1. API OVERVIEW

### Base URL
```
Production: https://api.ai-governor.com/v1
Staging: https://staging-api.ai-governor.com/v1
Development: http://localhost:8000/v1
```

### Authentication
All API endpoints require authentication using JWT tokens:
```http
Authorization: Bearer <jwt_token>
```

### Content Type
All requests and responses use JSON:
```http
Content-Type: application/json
Accept: application/json
```

### API Versioning
- Current Version: v1
- Version Header: `API-Version: v1`
- Backward Compatibility: Maintained for 12 months
- Deprecation Notice: 6 months advance notice

## 2. PROJECT MANAGEMENT API

### 2.1 Create Project
```http
POST /projects
```

**Request Body:**
```json
{
  "name": "healthcare-portal",
  "industry_type": "healthcare",
  "description": "Patient portal for healthcare management",
  "technology_stack": {
    "frontend": "nextjs",
    "backend": "fastapi",
    "database": "postgresql"
  },
  "compliance_requirements": ["hipaa"],
  "features": [
    "patient_registration",
    "appointment_scheduling",
    "medical_records"
  ],
  "team_id": "uuid-string"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-string",
  "name": "healthcare-portal",
  "industry_type": "healthcare",
  "status": "generating",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "config": {
    "technology_stack": {
      "frontend": "nextjs",
      "backend": "fastapi",
      "database": "postgresql"
    },
    "compliance_requirements": ["hipaa"]
  },
  "compliance_data": {
    "hipaa": {
      "status": "pending",
      "score": null
    }
  },
  "generation_progress": {
    "current_step": "template_selection",
    "total_steps": 8,
    "percentage": 12.5
  }
}
```

### 2.2 Get Project
```http
GET /projects/{project_id}
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "name": "healthcare-portal",
  "industry_type": "healthcare",
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T11:45:00Z",
  "config": {
    "technology_stack": {
      "frontend": "nextjs",
      "backend": "fastapi",
      "database": "postgresql"
    },
    "compliance_requirements": ["hipaa"]
  },
  "compliance_data": {
    "hipaa": {
      "status": "compliant",
      "score": 95.5,
      "last_checked": "2024-01-15T11:30:00Z"
    }
  },
  "generated_files": [
    {
      "path": "src/components/PatientPortal.tsx",
      "type": "component",
      "size": 2048
    },
    {
      "path": "src/api/patients.py",
      "type": "api",
      "size": 1024
    }
  ]
}
```

### 2.3 List Projects
```http
GET /projects?industry_type=healthcare&status=active&limit=20&offset=0
```

**Query Parameters:**
- `industry_type`: Filter by industry type
- `status`: Filter by project status
- `team_id`: Filter by team ID
- `limit`: Number of results (default: 20, max: 100)
- `offset`: Pagination offset (default: 0)

**Response (200 OK):**
```json
{
  "projects": [
    {
      "id": "uuid-string",
      "name": "healthcare-portal",
      "industry_type": "healthcare",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z",
      "compliance_score": 95.5
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 20,
    "offset": 0,
    "has_more": false
  }
}
```

### 2.4 Update Project
```http
PATCH /projects/{project_id}
```

**Request Body:**
```json
{
  "name": "updated-healthcare-portal",
  "config": {
    "features": [
      "patient_registration",
      "appointment_scheduling",
      "medical_records",
      "billing_integration"
    ]
  }
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "name": "updated-healthcare-portal",
  "industry_type": "healthcare",
  "status": "active",
  "updated_at": "2024-01-15T12:00:00Z",
  "config": {
    "features": [
      "patient_registration",
      "appointment_scheduling",
      "medical_records",
      "billing_integration"
    ]
  }
}
```

### 2.5 Delete Project
```http
DELETE /projects/{project_id}
```

**Response (204 No Content):**
```http
HTTP/1.1 204 No Content
```

## 3. RULE MANAGEMENT API

### 3.1 List Rules
```http
GET /rules?industry_type=healthcare&category=security&is_active=true
```

**Query Parameters:**
- `industry_type`: Filter by industry type
- `category`: Filter by rule category
- `is_active`: Filter by active status
- `scope`: Filter by rule scope (global, industry, project)
- `limit`: Number of results (default: 20, max: 100)
- `offset`: Pagination offset (default: 0)

**Response (200 OK):**
```json
{
  "rules": [
    {
      "id": "uuid-string",
      "name": "hipaa-encryption-requirement",
      "industry_type": "healthcare",
      "category": "security",
      "priority": 9,
      "is_active": true,
      "scope": "industry",
      "triggers": ["encryption", "hipaa", "phi"],
      "version": "1.2.0",
      "created_at": "2024-01-10T09:00:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 20,
    "offset": 0,
    "has_more": false
  }
}
```

### 3.2 Get Rule
```http
GET /rules/{rule_id}
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "name": "hipaa-encryption-requirement",
  "industry_type": "healthcare",
  "category": "security",
  "priority": 9,
  "is_active": true,
  "content": "All PHI data must be encrypted using AES-256 encryption...",
  "triggers": ["encryption", "hipaa", "phi"],
  "scope": "industry",
  "version": "1.2.0",
  "created_at": "2024-01-10T09:00:00Z",
  "updated_at": "2024-01-12T14:30:00Z",
  "metadata": {
    "author": "compliance-team",
    "review_date": "2024-04-10T09:00:00Z",
    "references": ["HIPAA-164.312(a)(2)(iv)"]
  }
}
```

### 3.3 Apply Rule to Project
```http
POST /projects/{project_id}/rules
```

**Request Body:**
```json
{
  "rule_id": "uuid-string",
  "applied_by": "uuid-string"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-string",
  "project_id": "uuid-string",
  "rule_id": "uuid-string",
  "applied_at": "2024-01-15T12:00:00Z",
  "effectiveness": null,
  "is_active": true,
  "applied_by": "uuid-string"
}
```

## 4. COMPONENT LIBRARY API

### 4.1 List Components
```http
GET /components?type=ui&industry_type=healthcare&limit=20&offset=0
```

**Query Parameters:**
- `type`: Filter by component type (ui, api, auth, payment, data, security, compliance)
- `industry_type`: Filter by industry type
- `search`: Search in component name and description
- `sort`: Sort by (name, usage_count, quality_score, created_at)
- `order`: Sort order (asc, desc)
- `limit`: Number of results (default: 20, max: 100)
- `offset`: Pagination offset (default: 0)

**Response (200 OK):**
```json
{
  "components": [
    {
      "id": "uuid-string",
      "name": "patient-form",
      "type": "ui",
      "version": "2.1.0",
      "industry_type": "healthcare",
      "usage_count": 45,
      "quality_score": 0.92,
      "created_at": "2024-01-05T10:00:00Z",
      "description": "HIPAA-compliant patient registration form",
      "tags": ["form", "patient", "hipaa", "validation"]
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 20,
    "offset": 0,
    "has_more": false
  }
}
```

### 4.2 Get Component
```http
GET /components/{component_id}
```

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "name": "patient-form",
  "type": "ui",
  "version": "2.1.0",
  "industry_type": "healthcare",
  "dependencies": [
    {
      "name": "react",
      "version": "^18.0.0"
    },
    {
      "name": "formik",
      "version": "^2.4.0"
    }
  ],
  "content": "import React from 'react';\nimport { Formik, Form, Field } from 'formik';\n...",
  "usage_count": 45,
  "quality_score": 0.92,
  "created_at": "2024-01-05T10:00:00Z",
  "updated_at": "2024-01-12T15:30:00Z",
  "metadata": {
    "author": "ui-team",
    "description": "HIPAA-compliant patient registration form",
    "tags": ["form", "patient", "hipaa", "validation"],
    "examples": [
      {
        "title": "Basic Usage",
        "code": "import { PatientForm } from './PatientForm';\n\n<PatientForm onSubmit={handleSubmit} />"
      }
    ]
  }
}
```

### 4.3 Use Component in Project
```http
POST /projects/{project_id}/components
```

**Request Body:**
```json
{
  "component_id": "uuid-string",
  "usage_context": {
    "file_path": "src/components/PatientRegistration.tsx",
    "customization": {
      "theme": "healthcare",
      "validation_rules": ["required", "email", "phone"]
    }
  }
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-string",
  "component_id": "uuid-string",
  "project_id": "uuid-string",
  "used_at": "2024-01-15T12:30:00Z",
  "usage_context": {
    "file_path": "src/components/PatientRegistration.tsx",
    "customization": {
      "theme": "healthcare",
      "validation_rules": ["required", "email", "phone"]
    }
  },
  "usage_count": 1,
  "last_used_at": "2024-01-15T12:30:00Z"
}
```

## 5. COMPLIANCE API

### 5.1 Get Compliance Status
```http
GET /projects/{project_id}/compliance
```

**Response (200 OK):**
```json
{
  "project_id": "uuid-string",
  "compliance_summary": {
    "overall_score": 87.5,
    "total_checks": 12,
    "compliant_checks": 10,
    "non_compliant_checks": 2,
    "last_checked": "2024-01-15T11:30:00Z"
  },
  "compliance_details": [
    {
      "compliance_type": "hipaa",
      "status": "compliant",
      "score": 95.0,
      "last_checked": "2024-01-15T11:30:00Z",
      "violations": [],
      "remediation": {}
    },
    {
      "compliance_type": "sox",
      "status": "non_compliant",
      "score": 75.0,
      "last_checked": "2024-01-15T11:30:00Z",
      "violations": [
        {
          "rule": "audit-trail-requirement",
          "severity": "high",
          "description": "Missing audit trail for financial transactions",
          "remediation": "Implement comprehensive audit logging"
        }
      ],
      "remediation": {
        "priority": "high",
        "estimated_effort": "2 days",
        "steps": [
          "Add audit logging to all financial operations",
          "Implement log retention policies",
          "Create audit report generation"
        ]
      }
    }
  ]
}
```

### 5.2 Run Compliance Check
```http
POST /projects/{project_id}/compliance/check
```

**Request Body:**
```json
{
  "compliance_types": ["hipaa", "sox"],
  "force_refresh": true
}
```

**Response (202 Accepted):**
```json
{
  "check_id": "uuid-string",
  "status": "running",
  "compliance_types": ["hipaa", "sox"],
  "estimated_duration": "5 minutes",
  "started_at": "2024-01-15T12:00:00Z"
}
```

### 5.3 Get Compliance Check Status
```http
GET /projects/{project_id}/compliance/check/{check_id}
```

**Response (200 OK):**
```json
{
  "check_id": "uuid-string",
  "status": "completed",
  "compliance_types": ["hipaa", "sox"],
  "started_at": "2024-01-15T12:00:00Z",
  "completed_at": "2024-01-15T12:05:00Z",
  "results": {
    "hipaa": {
      "status": "compliant",
      "score": 95.0,
      "violations": []
    },
    "sox": {
      "status": "non_compliant",
      "score": 75.0,
      "violations": [
        {
          "rule": "audit-trail-requirement",
          "severity": "high",
          "description": "Missing audit trail for financial transactions"
        }
      ]
    }
  }
}
```

## 6. PORTFOLIO MANAGEMENT API

### 6.1 Get Portfolio Overview
```http
GET /portfolio/overview?team_id=uuid-string
```

**Response (200 OK):**
```json
{
  "team_id": "uuid-string",
  "summary": {
    "total_projects": 15,
    "active_projects": 8,
    "completed_projects": 5,
    "archived_projects": 2,
    "average_compliance_score": 89.2,
    "total_components_used": 156
  },
  "projects_by_industry": {
    "healthcare": 6,
    "finance": 4,
    "ecommerce": 3,
    "enterprise": 2
  },
  "compliance_by_type": {
    "hipaa": {
      "compliant": 5,
      "non_compliant": 1,
      "average_score": 92.5
    },
    "sox": {
      "compliant": 3,
      "non_compliant": 1,
      "average_score": 85.0
    }
  },
  "resource_utilization": {
    "total_developers": 12,
    "active_developers": 10,
    "average_workload": 75.5,
    "bottlenecks": [
      {
        "project_id": "uuid-string",
        "project_name": "healthcare-portal",
        "bottleneck_type": "compliance_review",
        "estimated_resolution": "3 days"
      }
    ]
  }
}
```

### 6.2 Get Resource Allocation
```http
GET /portfolio/resources?team_id=uuid-string&timeframe=month
```

**Query Parameters:**
- `team_id`: Team identifier
- `timeframe`: Time period (week, month, quarter)
- `start_date`: Start date (ISO 8601)
- `end_date`: End date (ISO 8601)

**Response (200 OK):**
```json
{
  "team_id": "uuid-string",
  "timeframe": "month",
  "resource_allocation": [
    {
      "developer_id": "uuid-string",
      "name": "John Doe",
      "role": "senior_developer",
      "allocated_hours": 160,
      "utilized_hours": 145,
      "utilization_rate": 90.6,
      "projects": [
        {
          "project_id": "uuid-string",
          "project_name": "healthcare-portal",
          "allocated_hours": 80,
          "utilized_hours": 75
        }
      ]
    }
  ],
  "optimization_suggestions": [
    {
      "type": "workload_balancing",
      "description": "Redistribute workload from over-allocated developers",
      "impact": "high",
      "effort": "low"
    }
  ]
}
```

## 7. ERROR HANDLING

### 7.1 Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "industry_type",
        "message": "Must be one of: healthcare, finance, ecommerce, enterprise"
      }
    ],
    "request_id": "uuid-string",
    "timestamp": "2024-01-15T12:00:00Z"
  }
}
```

### 7.2 HTTP Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `202 Accepted`: Request accepted for processing
- `204 No Content`: Successful request with no response body
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: Service temporarily unavailable

### 7.3 Error Codes
- `VALIDATION_ERROR`: Request validation failed
- `AUTHENTICATION_ERROR`: Authentication failed
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `RESOURCE_CONFLICT`: Resource already exists
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `COMPLIANCE_ERROR`: Compliance validation failed
- `GENERATION_ERROR`: Project generation failed
- `INTERNAL_ERROR`: Internal server error

## 8. RATE LIMITING

### 8.1 Rate Limits
- **Authentication**: 10 requests per minute
- **Project Creation**: 5 requests per hour
- **Compliance Checks**: 20 requests per hour
- **Component Downloads**: 100 requests per hour
- **General API**: 1000 requests per hour

### 8.2 Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
```

## 9. WEBHOOKS

### 9.1 Webhook Events
- `project.created`: Project created
- `project.updated`: Project updated
- `project.generation.completed`: Project generation completed
- `compliance.check.completed`: Compliance check completed
- `component.used`: Component used in project

### 9.2 Webhook Payload
```json
{
  "event": "project.generation.completed",
  "timestamp": "2024-01-15T12:00:00Z",
  "data": {
    "project_id": "uuid-string",
    "project_name": "healthcare-portal",
    "status": "active",
    "generation_time": "4 minutes 32 seconds",
    "compliance_score": 95.5
  }
}
```

---

*This API specification provides comprehensive documentation for all endpoints, ensuring consistent integration and usage across all client applications.*
