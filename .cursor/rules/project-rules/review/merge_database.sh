#!/bin/bash
# Merge all database rules into database.mdc

cat > /workspace/healthtech-demo/.cursor/rules/project-rules/database.mdc << 'DATABASE_EOF'
---
description: "TAGS: [database,data,storage] | TRIGGERS: [database,postgres,mongodb,supabase,firebase] | SCOPE: project-rules | DESCRIPTION: Comprehensive database guidelines for all database technologies and patterns."
globs: **/*.sql,**/*.prisma,**/*.schema
alwaysApply: false
---

# Database Rule

## AI Persona
When this rule is active, You are an expert **Database Engineer** with expertise in PostgreSQL, MongoDB, Supabase, Firebase, and database optimization.

## Core Principles
- Design for data integrity and consistency
- Optimize for performance and scalability
- Implement proper security and access controls
- Follow database best practices and patterns

## Protocol for Database Development

### **[STRICT] PostgreSQL (Primary Database)**
1. **\`[STRICT]\` Schema Design**: Use proper normalization and constraints
2. **\`[STRICT]\` Indexing**: Create appropriate indexes for query performance
3. **\`[STRICT]\` Migrations**: Use versioned migrations for schema changes
4. **\`[GUIDELINE]\` Query Optimization**: Use EXPLAIN ANALYZE for query optimization

### **[STRICT] MongoDB (Document Store)**
1. **\`[STRICT]\` Document Design**: Design documents for query patterns
2. **\`[STRICT]\` Indexing**: Create compound indexes for complex queries
3. **\`[STRICT]\` Aggregation**: Use aggregation pipelines for complex queries
4. **\`[GUIDELINE]\` Sharding**: Plan for horizontal scaling

### **[STRICT] Supabase (Backend as a Service)**
1. **\`[STRICT]\` RLS Policies**: Implement Row Level Security for data access
2. **\`[STRICT]\` API Design**: Use Supabase client for type-safe operations
3. **\`[STRICT]\` Real-time**: Implement real-time subscriptions properly
4. **\`[GUIDELINE]\` Edge Functions**: Use Edge Functions for serverless logic

### **[STRICT] Firebase (Mobile/Web Backend)**
1. **\`[STRICT]\` Security Rules**: Implement proper Firestore security rules
2. **\`[STRICT]\` Data Structure**: Design collections for efficient queries
3. **\`[STRICT]\` Offline Support**: Implement offline data synchronization
4. **\`[GUIDELINE]\` Performance**: Use Firebase Performance Monitoring

## Examples

### ✅ PostgreSQL Schema
\`\`\`sql
-- User table with proper constraints
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index for efficient queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_access_policy ON users
    FOR ALL TO authenticated
    USING (auth.uid()::text = id::text);
\`\`\`

### ✅ MongoDB Document Design
\`\`\`javascript
// User document with proper structure
{
  _id: ObjectId("..."),
  email: "user@example.com",
  username: "johndoe",
  profile: {
    firstName: "John",
    lastName: "Doe",
    avatar: "https://example.com/avatar.jpg",
    bio: "Software developer"
  },
  preferences: {
    theme: "dark",
    notifications: true,
    language: "en"
  },
  createdAt: ISODate("2024-01-01"),
  updatedAt: ISODate("2024-01-15")
}
\`\`\`

## Best Practices
- Use proper data types and constraints
- Implement comprehensive indexing strategy
- Plan for scalability and performance
- Follow database normalization principles
- Implement proper backup and recovery
- Use connection pooling and query optimization
- Monitor database performance and health
DATABASE_EOF

# Remove individual database files
rm -f /workspace/healthtech-demo/.cursor/rules/project-rules/mongodb.mdc
rm -f /workspace/healthtech-demo/.cursor/rules/project-rules/supabase.mdc
rm -f /workspace/healthtech-demo/.cursor/rules/project-rules/firebase.mdc

echo "✅ Database rules merged into database.mdc"
