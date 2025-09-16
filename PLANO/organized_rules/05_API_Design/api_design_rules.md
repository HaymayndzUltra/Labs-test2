# API Design Rules

## 1. RESTful API Standards
```
"Create a rule that all API endpoints must follow REST conventions, use proper HTTP status codes, include versioning in URL, and have OpenAPI documentation"
```

## 2. Response Format Standards
```
"Create a rule that all API responses must have consistent format: {status: 'success/error', data: {}, message: '', timestamp: ''}, and error responses must include error codes"
```

## 3. Rate Limiting and Authentication
```
"Create a rule that all API endpoints must have rate limiting, authentication middleware, and request validation before processing"
```

## 4. API Gateway
```
"Create a rule that all external APIs must go through API Gateway, include rate limiting, have authentication/authorization, and support API versioning with backward compatibility"
```

## 5. API Security
```
"Create a rule that all APIs must follow RESTful principles, include proper versioning, have OpenAPI documentation, support rate limiting, and include proper error handling"
```

## 6. Database Integration
```
"Create a rule that all database operations must use proper ORM, include connection pooling, have transaction management, support both read and write operations, and include proper error handling"
```

## 7. Caching Strategy for APIs
```
"Create a rule that all expensive operations must be cached with Redis, include proper cache invalidation, have cache warming, support both local and distributed caching, and include cache monitoring"
```

## 8. Service Integration
```
"Create a rule that all service integrations must use gRPC for internal communication, include proper error handling, have retry logic with exponential backoff, and support both synchronous and asynchronous patterns"
```

## 9. Third-Party Integration
```
"Create a rule that all third-party integrations must be abstracted with adapter pattern, include proper error handling, have rate limiting, and support both REST and GraphQL APIs"
```

## 10. AI API Design
```
"Create a rule that all AI API endpoints must have async/await pattern, include request/response validation using Pydantic models, have proper error handling with custom exceptions, include rate limiting, and be documented with OpenAPI specs"
```

## 11. Microservices Communication
```
"Create a rule that all inter-service communication must use event-driven patterns, include event sourcing, have CQRS implementation, and support eventual consistency"
```
