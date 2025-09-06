-- Legal Document Management Platform Database Schema
-- PostgreSQL Database Schema for Legal Document Management

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE user_role AS ENUM ('attorney', 'paralegal', 'client', 'admin');
CREATE TYPE document_status AS ENUM ('draft', 'active', 'archived', 'deleted');
CREATE TYPE case_status AS ENUM ('open', 'closed', 'on_hold');
CREATE TYPE audit_action AS ENUM ('create', 'read', 'update', 'delete', 'share', 'download');

-- Users table (extends Django's built-in user model)
CREATE TABLE accounts_user (
    id SERIAL PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(150) UNIQUE NOT NULL,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    role user_role NOT NULL DEFAULT 'client',
    bar_number VARCHAR(50),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients_client (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(254),
    phone VARCHAR(20),
    address TEXT,
    created_by_id INTEGER NOT NULL REFERENCES accounts_user(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Cases table
CREATE TABLE cases_case (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    case_number VARCHAR(100) UNIQUE,
    status case_status NOT NULL DEFAULT 'open',
    client_id INTEGER NOT NULL REFERENCES clients_client(id),
    assigned_attorney_id INTEGER NOT NULL REFERENCES accounts_user(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE
);

-- Documents table
CREATE TABLE documents_document (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64) NOT NULL, -- SHA-256 hash for integrity
    status document_status NOT NULL DEFAULT 'active',
    case_id INTEGER REFERENCES cases_case(id),
    uploaded_by_id INTEGER NOT NULL REFERENCES accounts_user(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    version INTEGER NOT NULL DEFAULT 1,
    is_confidential BOOLEAN NOT NULL DEFAULT TRUE,
    retention_date DATE,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE
);

-- Document versions table (for version control)
CREATE TABLE documents_documentversion (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents_document(id),
    version_number INTEGER NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_hash VARCHAR(64) NOT NULL,
    created_by_id INTEGER NOT NULL REFERENCES accounts_user(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    change_summary TEXT
);

-- Document access permissions
CREATE TABLE documents_documentpermission (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents_document(id),
    user_id INTEGER NOT NULL REFERENCES accounts_user(id),
    can_read BOOLEAN NOT NULL DEFAULT FALSE,
    can_write BOOLEAN NOT NULL DEFAULT FALSE,
    can_share BOOLEAN NOT NULL DEFAULT FALSE,
    granted_by_id INTEGER NOT NULL REFERENCES accounts_user(id),
    granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(document_id, user_id)
);

-- Document sharing table
CREATE TABLE documents_documentshare (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents_document(id),
    shared_with_email VARCHAR(254) NOT NULL,
    shared_by_id INTEGER NOT NULL REFERENCES accounts_user(id),
    share_token UUID NOT NULL DEFAULT uuid_generate_v4(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    access_count INTEGER NOT NULL DEFAULT 0
);

-- Audit log table
CREATE TABLE audit_auditlog (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id INTEGER REFERENCES accounts_user(id),
    action audit_action NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id INTEGER,
    resource_uuid UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Search index table (for full-text search)
CREATE TABLE search_searchindex (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents_document(id),
    content TEXT NOT NULL,
    search_vector tsvector,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_documents_case_id ON documents_document(case_id);
CREATE INDEX idx_documents_uploaded_by ON documents_document(uploaded_by_id);
CREATE INDEX idx_documents_status ON documents_document(status);
CREATE INDEX idx_documents_created_at ON documents_document(created_at);
CREATE INDEX idx_documents_file_hash ON documents_document(file_hash);

CREATE INDEX idx_cases_client_id ON cases_case(client_id);
CREATE INDEX idx_cases_assigned_attorney ON cases_case(assigned_attorney_id);
CREATE INDEX idx_cases_status ON cases_case(status);

CREATE INDEX idx_audit_user_id ON audit_auditlog(user_id);
CREATE INDEX idx_audit_action ON audit_auditlog(action);
CREATE INDEX idx_audit_resource ON audit_auditlog(resource_type, resource_id);
CREATE INDEX idx_audit_created_at ON audit_auditlog(created_at);

-- Full-text search index
CREATE INDEX idx_search_vector ON search_searchindex USING GIN(search_vector);

-- Trigram index for partial matching
CREATE INDEX idx_search_content_trgm ON search_searchindex USING GIN(content gin_trgm_ops);

-- Create function to update search vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', NEW.content);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search vector
CREATE TRIGGER update_search_vector_trigger
    BEFORE INSERT OR UPDATE ON search_searchindex
    FOR EACH ROW
    EXECUTE FUNCTION update_search_vector();

-- Create function to log document access
CREATE OR REPLACE FUNCTION log_document_access()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_auditlog (user_id, action, resource_type, resource_id, resource_uuid, details)
    VALUES (
        NEW.user_id,
        'read',
        'document',
        NEW.document_id,
        (SELECT uuid FROM documents_document WHERE id = NEW.document_id),
        jsonb_build_object('document_title', (SELECT title FROM documents_document WHERE id = NEW.document_id))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update document version
CREATE OR REPLACE FUNCTION update_document_version()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO documents_documentversion (document_id, version_number, file_path, file_hash, created_by_id, change_summary)
        VALUES (OLD.id, OLD.version, OLD.file_path, OLD.file_hash, OLD.uploaded_by_id, 'Document updated');
        
        NEW.version := OLD.version + 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for document versioning
CREATE TRIGGER update_document_version_trigger
    BEFORE UPDATE ON documents_document
    FOR EACH ROW
    EXECUTE FUNCTION update_document_version();

-- Create views for common queries
CREATE VIEW document_summary AS
SELECT 
    d.id,
    d.uuid,
    d.title,
    d.file_name,
    d.file_size,
    d.mime_type,
    d.status,
    d.created_at,
    d.updated_at,
    c.title as case_title,
    c.case_number,
    cl.name as client_name,
    u.first_name || ' ' || u.last_name as uploaded_by_name
FROM documents_document d
LEFT JOIN cases_case c ON d.case_id = c.id
LEFT JOIN clients_client cl ON c.client_id = cl.id
LEFT JOIN accounts_user u ON d.uploaded_by_id = u.id;

-- Create view for audit summary
CREATE VIEW audit_summary AS
SELECT 
    a.id,
    a.action,
    a.resource_type,
    a.resource_id,
    a.created_at,
    u.first_name || ' ' || u.last_name as user_name,
    u.email as user_email,
    a.ip_address
FROM audit_auditlog a
LEFT JOIN accounts_user u ON a.user_id = u.id
ORDER BY a.created_at DESC;
