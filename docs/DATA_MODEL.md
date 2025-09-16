# AI GOVERNOR FRAMEWORK ENHANCEMENT - DATA MODEL

## 1. ENTITY RELATIONSHIP DIAGRAM

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    PROJECTS     │    │     RULES       │    │   COMPONENTS    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ name            │    │ name            │    │ name            │
│ industry_type   │    │ industry_type   │    │ type            │
│ status          │    │ category        │    │ version         │
│ created_at      │    │ priority        │    │ industry_type   │
│ updated_at      │    │ is_active       │    │ dependencies    │
│ config          │    │ content         │    │ metadata        │
│ compliance_data │    │ triggers        │    │ usage_count     │
└─────────────────┘    │ scope           │    │ quality_score   │
         │              └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ PROJECT_RULES   │    │ RULE_DEPENDENCIES│   │ COMPONENT_USAGE │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ project_id (FK) │    │ rule_id (FK)    │    │ component_id(FK)│
│ rule_id (FK)    │    │ depends_on (FK) │    │ project_id (FK) │
│ applied_at      │    │ dependency_type │    │ used_at         │
│ effectiveness   │    │ is_required     │    │ usage_context   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│ COMPLIANCE_DATA │
├─────────────────┤
│ project_id (FK) │
│ compliance_type │
│ status          │
│ last_checked    │
│ violations      │
│ remediation     │
└─────────────────┘
```

## 2. DATABASE SCHEMA

### 2.1 Core Tables

#### Projects Table
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    industry_type VARCHAR(50) NOT NULL CHECK (industry_type IN ('healthcare', 'finance', 'ecommerce', 'enterprise', 'custom')),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'active', 'completed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    config JSONB NOT NULL DEFAULT '{}',
    compliance_data JSONB NOT NULL DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_by UUID NOT NULL,
    team_id UUID,
    
    CONSTRAINT projects_name_unique UNIQUE (name),
    CONSTRAINT projects_industry_valid CHECK (industry_type IN ('healthcare', 'finance', 'ecommerce', 'enterprise', 'custom')),
    CONSTRAINT projects_status_valid CHECK (status IN ('draft', 'generating', 'active', 'completed', 'archived'))
);

CREATE INDEX idx_projects_industry_type ON projects(industry_type);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_projects_team_id ON projects(team_id);
```

#### Rules Table
```sql
CREATE TABLE rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    industry_type VARCHAR(50) CHECK (industry_type IN ('healthcare', 'finance', 'ecommerce', 'enterprise', 'global')),
    category VARCHAR(100) NOT NULL,
    priority INTEGER NOT NULL DEFAULT 1 CHECK (priority BETWEEN 1 AND 10),
    is_active BOOLEAN NOT NULL DEFAULT true,
    content TEXT NOT NULL,
    triggers TEXT[] NOT NULL DEFAULT '{}',
    scope VARCHAR(50) NOT NULL DEFAULT 'project' CHECK (scope IN ('global', 'industry', 'project')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    metadata JSONB NOT NULL DEFAULT '{}',
    
    CONSTRAINT rules_name_unique UNIQUE (name, version),
    CONSTRAINT rules_industry_valid CHECK (industry_type IN ('healthcare', 'finance', 'ecommerce', 'enterprise', 'global')),
    CONSTRAINT rules_scope_valid CHECK (scope IN ('global', 'industry', 'project'))
);

CREATE INDEX idx_rules_industry_type ON rules(industry_type);
CREATE INDEX idx_rules_category ON rules(category);
CREATE INDEX idx_rules_priority ON rules(priority);
CREATE INDEX idx_rules_is_active ON rules(is_active);
CREATE INDEX idx_rules_scope ON rules(scope);
```

#### Components Table
```sql
CREATE TABLE components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('ui', 'api', 'auth', 'payment', 'data', 'security', 'compliance')),
    version VARCHAR(20) NOT NULL,
    industry_type VARCHAR(50) CHECK (industry_type IN ('healthcare', 'finance', 'ecommerce', 'enterprise', 'universal')),
    dependencies JSONB NOT NULL DEFAULT '[]',
    metadata JSONB NOT NULL DEFAULT '{}',
    content TEXT NOT NULL,
    usage_count INTEGER NOT NULL DEFAULT 0,
    quality_score DECIMAL(3,2) CHECK (quality_score BETWEEN 0.00 AND 1.00),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    
    CONSTRAINT components_name_version_unique UNIQUE (name, version),
    CONSTRAINT components_type_valid CHECK (type IN ('ui', 'api', 'auth', 'payment', 'data', 'security', 'compliance')),
    CONSTRAINT components_industry_valid CHECK (industry_type IN ('healthcare', 'finance', 'ecommerce', 'enterprise', 'universal'))
);

CREATE INDEX idx_components_type ON components(type);
CREATE INDEX idx_components_industry_type ON components(industry_type);
CREATE INDEX idx_components_usage_count ON components(usage_count);
CREATE INDEX idx_components_quality_score ON components(quality_score);
```

### 2.2 Relationship Tables

#### Project Rules Table
```sql
CREATE TABLE project_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    rule_id UUID NOT NULL REFERENCES rules(id) ON DELETE CASCADE,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    effectiveness DECIMAL(3,2) CHECK (effectiveness BETWEEN 0.00 AND 1.00),
    is_active BOOLEAN NOT NULL DEFAULT true,
    applied_by UUID NOT NULL,
    
    CONSTRAINT project_rules_unique UNIQUE (project_id, rule_id),
    CONSTRAINT project_rules_effectiveness_valid CHECK (effectiveness BETWEEN 0.00 AND 1.00)
);

CREATE INDEX idx_project_rules_project_id ON project_rules(project_id);
CREATE INDEX idx_project_rules_rule_id ON project_rules(rule_id);
CREATE INDEX idx_project_rules_applied_at ON project_rules(applied_at);
```

#### Component Usage Table
```sql
CREATE TABLE component_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usage_context JSONB NOT NULL DEFAULT '{}',
    usage_count INTEGER NOT NULL DEFAULT 1,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT component_usage_unique UNIQUE (component_id, project_id)
);

CREATE INDEX idx_component_usage_component_id ON component_usage(component_id);
CREATE INDEX idx_component_usage_project_id ON component_usage(project_id);
CREATE INDEX idx_component_usage_used_at ON component_usage(used_at);
```

#### Compliance Data Table
```sql
CREATE TABLE compliance_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    compliance_type VARCHAR(50) NOT NULL CHECK (compliance_type IN ('hipaa', 'sox', 'pci_dss', 'gdpr', 'ccpa', 'soc2')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'compliant', 'non_compliant', 'in_review')),
    last_checked TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    violations JSONB NOT NULL DEFAULT '[]',
    remediation JSONB NOT NULL DEFAULT '{}',
    score DECIMAL(5,2) CHECK (score BETWEEN 0.00 AND 100.00),
    checked_by UUID,
    
    CONSTRAINT compliance_data_unique UNIQUE (project_id, compliance_type),
    CONSTRAINT compliance_data_type_valid CHECK (compliance_type IN ('hipaa', 'sox', 'pci_dss', 'gdpr', 'ccpa', 'soc2')),
    CONSTRAINT compliance_data_status_valid CHECK (status IN ('pending', 'compliant', 'non_compliant', 'in_review'))
);

CREATE INDEX idx_compliance_data_project_id ON compliance_data(project_id);
CREATE INDEX idx_compliance_data_type ON compliance_data(compliance_type);
CREATE INDEX idx_compliance_data_status ON compliance_data(status);
CREATE INDEX idx_compliance_data_last_checked ON compliance_data(last_checked);
```

### 2.3 Audit and Logging Tables

#### Audit Logs Table
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    user_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_audit_logs_project_id ON audit_logs(project_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
```

#### System Logs Table
```sql
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(10) NOT NULL CHECK (level IN ('DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL')),
    component VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    stack_trace TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_component ON system_logs(component);
CREATE INDEX idx_system_logs_timestamp ON system_logs(timestamp);
```

## 3. DATA MIGRATION STRATEGY

### 3.1 Migration Phases

#### Phase 1: Schema Creation
```sql
-- Create initial schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create tables in dependency order
-- (tables, indexes, constraints, triggers)
```

#### Phase 2: Data Migration
```sql
-- Migrate existing rule data
INSERT INTO rules (name, industry_type, category, content, triggers, scope)
SELECT 
    rule_name,
    COALESCE(industry_type, 'global'),
    category,
    content,
    ARRAY[trigger_keywords],
    'project'
FROM existing_rules;

-- Migrate existing component data
INSERT INTO components (name, type, version, content, metadata)
SELECT 
    component_name,
    component_type,
    '1.0.0',
    content,
    metadata
FROM existing_components;
```

#### Phase 3: Data Validation
```sql
-- Validate data integrity
SELECT 
    COUNT(*) as total_projects,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_projects,
    COUNT(CASE WHEN industry_type = 'healthcare' THEN 1 END) as healthcare_projects
FROM projects;

-- Validate rule coverage
SELECT 
    industry_type,
    COUNT(*) as rule_count,
    COUNT(CASE WHEN is_active THEN 1 END) as active_rules
FROM rules
GROUP BY industry_type;
```

### 3.2 Rollback Strategy
```sql
-- Create backup tables before migration
CREATE TABLE projects_backup AS SELECT * FROM projects;
CREATE TABLE rules_backup AS SELECT * FROM rules;
CREATE TABLE components_backup AS SELECT * FROM components;

-- Rollback procedure
BEGIN;
DROP TABLE IF EXISTS projects, rules, components CASCADE;
ALTER TABLE projects_backup RENAME TO projects;
ALTER TABLE rules_backup RENAME TO rules;
ALTER TABLE components_backup RENAME TO components;
COMMIT;
```

## 4. DATA RETENTION POLICIES

### 4.1 Retention Rules
```sql
-- Archive old projects (older than 2 years)
CREATE OR REPLACE FUNCTION archive_old_projects()
RETURNS void AS $$
BEGIN
    UPDATE projects 
    SET status = 'archived' 
    WHERE created_at < NOW() - INTERVAL '2 years' 
    AND status = 'completed';
END;
$$ LANGUAGE plpgsql;

-- Clean up old audit logs (older than 1 year)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM audit_logs 
    WHERE timestamp < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Clean up old system logs (older than 6 months)
CREATE OR REPLACE FUNCTION cleanup_old_system_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM system_logs 
    WHERE timestamp < NOW() - INTERVAL '6 months';
END;
$$ LANGUAGE plpgsql;
```

### 4.2 Automated Cleanup
```sql
-- Schedule cleanup jobs
SELECT cron.schedule('archive-projects', '0 2 * * 0', 'SELECT archive_old_projects();');
SELECT cron.schedule('cleanup-audit-logs', '0 3 * * 0', 'SELECT cleanup_old_audit_logs();');
SELECT cron.schedule('cleanup-system-logs', '0 4 * * 0', 'SELECT cleanup_old_system_logs();');
```

## 5. DATA SECURITY AND ENCRYPTION

### 5.1 Sensitive Data Encryption
```sql
-- Encrypt sensitive project data
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_encrypt(data, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql;

-- Decrypt sensitive project data
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_decrypt(encrypted_data, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql;

-- Add encrypted columns for sensitive data
ALTER TABLE projects ADD COLUMN encrypted_config BYTEA;
ALTER TABLE compliance_data ADD COLUMN encrypted_violations BYTEA;
```

### 5.2 Row-Level Security
```sql
-- Enable row-level security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_data ENABLE ROW LEVEL SECURITY;

-- Create policies for team-based access
CREATE POLICY project_team_access ON projects
    FOR ALL TO authenticated
    USING (team_id = current_setting('app.current_team_id')::UUID);

CREATE POLICY compliance_team_access ON compliance_data
    FOR ALL TO authenticated
    USING (project_id IN (
        SELECT id FROM projects 
        WHERE team_id = current_setting('app.current_team_id')::UUID
    ));
```

## 6. PERFORMANCE OPTIMIZATION

### 6.1 Indexing Strategy
```sql
-- Composite indexes for common queries
CREATE INDEX idx_projects_industry_status ON projects(industry_type, status);
CREATE INDEX idx_rules_industry_active ON rules(industry_type, is_active);
CREATE INDEX idx_components_type_industry ON components(type, industry_type);

-- Partial indexes for specific conditions
CREATE INDEX idx_active_projects ON projects(id) WHERE status = 'active';
CREATE INDEX idx_high_priority_rules ON rules(id) WHERE priority >= 8;
CREATE INDEX idx_popular_components ON components(id) WHERE usage_count > 100;
```

### 6.2 Query Optimization
```sql
-- Materialized views for complex aggregations
CREATE MATERIALIZED VIEW project_compliance_summary AS
SELECT 
    p.id,
    p.name,
    p.industry_type,
    COUNT(cd.id) as compliance_checks,
    AVG(cd.score) as avg_compliance_score,
    COUNT(CASE WHEN cd.status = 'compliant' THEN 1 END) as compliant_checks
FROM projects p
LEFT JOIN compliance_data cd ON p.id = cd.project_id
GROUP BY p.id, p.name, p.industry_type;

-- Refresh materialized view
CREATE OR REPLACE FUNCTION refresh_compliance_summary()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW project_compliance_summary;
END;
$$ LANGUAGE plpgsql;
```

---

*This data model provides a comprehensive foundation for the AI Governor Framework Enhancement, ensuring data integrity, security, and performance across all system components.*
