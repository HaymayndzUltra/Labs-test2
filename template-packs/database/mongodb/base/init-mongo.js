// MongoDB initialization script
// This runs when the container is first created

// Switch to the application database
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || '{{PROJECT_NAME}}');

// Create application user with read/write permissions
db.createUser({
  user: process.env.MONGO_APP_USER || '{{PROJECT_NAME}}_app',
  pwd: process.env.MONGO_APP_PASSWORD || 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: process.env.MONGO_INITDB_DATABASE || '{{PROJECT_NAME}}'
    }
  ]
});

// Create collections with validators
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'username', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'Must be a valid email address'
        },
        username: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 30,
          description: 'Username must be between 3 and 30 characters'
        },
        password: {
          bsonType: 'string',
          description: 'Hashed password'
        },
        role: {
          enum: ['user', 'admin', 'moderator'],
          description: 'User role'
        },
        isActive: {
          bsonType: 'bool',
          description: 'Account active status'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Account creation timestamp'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'Last update timestamp'
        }
      }
    }
  }
});

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

// Sessions collection for JWT refresh tokens
db.createCollection('sessions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'refreshToken', 'expiresAt'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'Reference to user'
        },
        refreshToken: {
          bsonType: 'string',
          description: 'JWT refresh token'
        },
        userAgent: {
          bsonType: 'string',
          description: 'User agent string'
        },
        ipAddress: {
          bsonType: 'string',
          description: 'IP address'
        },
        expiresAt: {
          bsonType: 'date',
          description: 'Token expiration timestamp'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Session creation timestamp'
        }
      }
    }
  }
});

db.sessions.createIndex({ refreshToken: 1 }, { unique: true });
db.sessions.createIndex({ userId: 1 });
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Audit logs collection (if compliance is required)
db.createCollection('auditLogs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['action', 'timestamp', 'userId'],
      properties: {
        action: {
          bsonType: 'string',
          description: 'Action performed'
        },
        userId: {
          bsonType: 'objectId',
          description: 'User who performed the action'
        },
        resource: {
          bsonType: 'string',
          description: 'Resource affected'
        },
        resourceId: {
          bsonType: 'string',
          description: 'ID of affected resource'
        },
        changes: {
          bsonType: 'object',
          description: 'Before and after values'
        },
        ipAddress: {
          bsonType: 'string',
          description: 'Client IP address'
        },
        userAgent: {
          bsonType: 'string',
          description: 'Client user agent'
        },
        timestamp: {
          bsonType: 'date',
          description: 'When the action occurred'
        }
      }
    }
  }
});

db.auditLogs.createIndex({ timestamp: -1 });
db.auditLogs.createIndex({ userId: 1, timestamp: -1 });
db.auditLogs.createIndex({ action: 1, timestamp: -1 });

// Create a sample admin user (remove in production)
if (process.env.CREATE_SAMPLE_DATA === 'true') {
  db.users.insertOne({
    email: 'admin@{{PROJECT_NAME}}.com',
    username: 'admin',
    password: '$2b$10$YourHashedPasswordHere', // Replace with actual hashed password
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  print('Sample admin user created');
}

print('MongoDB initialization completed successfully');
print('Database: ' + db.getName());
print('Collections created: users, sessions, auditLogs');