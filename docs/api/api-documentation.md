# API Documentation

## Overview

This document provides comprehensive documentation for all REST API endpoints in the NextJS starter template, including authentication, user management, and data operations.

## API Architecture

### Base Configuration

- **Base URL**: `https://yourdomain.com/api/v1`
- **Protocol**: HTTPS
- **Content-Type**: `application/json`
- **Authentication**: Bearer Token (JWT) + Session Cookies

### Response Format

```typescript
interface APIResponse<T = any> {
  traceId: string; // Unique request identifier
  code: string; // Response code (00 = success, 01-99 = errors)
  message: string; // Human-readable message
  data?: T; // Response payload (if applicable)
  hostId?: string; // Server identifier
  responseAt?: string; // ISO timestamp of response
  timeConsume?: number; // Response time in milliseconds
}
```

### Error Codes

```typescript
interface ErrorCodes {
  "00": "Success";
  "01": "Validation Error";
  "02": "Authentication Failed";
  "03": "Authorization Failed";
  "04": "Resource Not Found";
  "05": "Server Error";
  "06": "Database Error";
  "07": "Rate Limited";
  "08": "Method Not Allowed";
  "09": "Invalid Input";
  "10": "External Service Error";
}
```

## Authentication Endpoints

### POST /auth/login

Authenticate user with email and password.

#### Request

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "rememberMe": false
}
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "USER",
      "emailVerified": true,
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    "session": {
      "token": "jwt_token_here",
      "expiresAt": "2025-01-04T00:00:00.000Z"
    },
    "organizations": [
      {
        "id": "org_123",
        "name": "Acme Corp",
        "role": "OWNER"
      }
    ]
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 150
}
```

#### Response (Error - 401)

```json
{
  "traceId": "req_123456789",
  "code": "02",
  "message": "Invalid email or password",
  "data": null,
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 100
}
```

#### Error Responses

- `400` - Invalid input format
- `401` - Invalid credentials
- `403` - Account banned or not verified
- `429` - Too many login attempts

### POST /auth/register

Register a new user account.

#### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123",
  "organizationName": "Optional organization name",
  "acceptTerms": true
}
```

#### Response (Success - 201)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "emailVerified": false,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 200
}
```

#### Error Responses

- `400` - Validation error, weak password, terms not accepted
- `409` - Email already exists
- `422` - Invalid input data

### POST /auth/reset

Initiate password reset process.

#### Request

```json
{
  "email": "user@example.com"
}
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "If an account exists with this email, a password reset link has been sent.",
  "data": null,
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 150
}
```

### POST /auth/new-password

Complete password reset with token.

#### Request

```json
{
  "token": "reset_token_here",
  "password": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "Password reset successful. You can now login with your new password.",
  "data": null,
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 100
}
```

#### Error Responses

- `400` - Invalid token, password mismatch
- `404` - Token not found or expired

### POST /auth/logout

Terminate user session.

#### Request

```json
{
  "allDevices": false
}
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "Logout successful",
  "data": null,
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 50
}
```

## User Management Endpoints

### GET /users

Retrieve paginated list of users (Admin/Superadmin only).

#### Query Parameters

```typescript
interface UsersQuery {
  page?: number; // Page number (default: 1)
  limit?: number; // Items per page (default: 10, max: 100)
  search?: string; // Search term (name, email)
  role?: "USER" | "ADMIN" | "SUPERADMIN";
  sortBy?: "name" | "email" | "createdAt" | "lastLogin";
  sortOrder?: "asc" | "desc";
  emailVerified?: boolean;
  banned?: boolean;
}
```

#### Request

```
GET /api/v1/users?page=1&limit=10&search=john&role=USER&sortBy=createdAt&sortOrder=desc
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "user_123",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "USER",
        "emailVerified": true,
        "banned": false,
        "createdAt": "2025-01-01T00:00:00.000Z",
        "lastLoginAt": "2025-01-01T12:00:00.000Z",
        "organizations": [
          {
            "id": "org_123",
            "name": "Acme Corp",
            "role": "OWNER"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 120
}
```

#### Error Responses

- `401` - Authentication required
- `403` - Insufficient permissions
- `400` - Invalid query parameters

### GET /users/[id]

Retrieve specific user details.

#### Request

```
GET /api/v1/users/user_123
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "emailVerified": true,
      "banned": false,
      "banReason": null,
      "banExpires": null,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T12:00:00.000Z",
      "lastLoginAt": "2025-01-01T12:00:00.000Z",
      "organizations": [
        {
          "id": "org_123",
          "name": "Acme Corp",
          "role": "OWNER",
          "createdAt": "2025-01-01T00:00:00.000Z"
        }
      ],
      "sessions": [
        {
          "id": "session_123",
          "createdAt": "2025-01-01T12:00:00.000Z",
          "expiresAt": "2025-01-04T12:00:00.000Z",
          "ipAddress": "192.168.1.1",
          "userAgent": "Mozilla/5.0..."
        }
      ]
    }
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 80
}
```

#### Error Responses

- `401` - Authentication required
- `403` - Cannot access other users (non-admin)
- `404` - User not found

### POST /users

Create a new user (Admin/Superadmin only).

#### Request

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword123",
  "role": "USER",
  "organizationId": "org_123",
  "organizationRole": "MEMBER",
  "emailVerified": true
}
```

#### Response (Success - 201)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "user_456",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "USER",
      "emailVerified": true,
      "createdAt": "2025-01-01T12:00:00.000Z"
    }
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 200
}
```

### PUT /users/[id]

Update user information.

#### Request

```
PUT /api/v1/users/user_123
```

```json
{
  "name": "John Updated",
  "role": "ADMIN",
  "emailVerified": true,
  "banned": false
}
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Updated",
      "email": "john@example.com",
      "role": "ADMIN",
      "emailVerified": true,
      "updatedAt": "2025-01-01T12:00:00.000Z"
    }
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 150
}
```

#### Error Responses

- `400` - Invalid data, role assignment not allowed
- `401` - Authentication required
- `403` - Cannot modify higher role user
- `404` - User not found

### DELETE /users/[id]

Delete a user (Admin/Superadmin only).

#### Request

```
DELETE /api/v1/users/user_123
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "User deleted successfully",
  "data": null,
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 100
}
```

#### Error Responses

- `401` - Authentication required
- `403` - Cannot delete self or higher role user
- `404` - User not found

### GET /users/email/[email]

Get user by email address.

#### Request

```
GET /api/v1/users/email/john@example.com
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "emailVerified": true,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 80
}
```

## Organization Management Endpoints

### GET /users/organizations

Retrieve user's organizations (for authenticated user's context).

#### Request

```
GET /api/v1/users/organizations
```

#### Response (Success - 200)

```json
{
  "success": true,
  "data": {
    "organizations": [
      {
        "id": "org_123",
        "name": "Acme Corp",
        "slug": "acme-corp",
        "logo": "https://example.com/logo.png",
        "role": "owner",
        "memberCount": 5,
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "currentOrganization": {
      "id": "org_123",
      "name": "Acme Corp",
      "slug": "acme-corp",
      "logo": "https://example.com/logo.png",
      "role": "owner",
      "memberCount": 5,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

### GET /organizations

Retrieve all organizations (Superadmin/Admin only). Returns paginated list with search and sorting capabilities.

#### Query Parameters

```typescript
interface OrganizationsQuery {
  page?: number; // Page number (default: 1)
  limit?: number; // Items per page (default: 10, max: 100)
  search?: string; // Search term (organization name)
  sort?: string; // Sort by field (name, createdAt)
}
```

#### Request

```
GET /api/v1/organizations?page=1&limit=10&search=acme&sort=createdAt
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "Success",
  "data": [
    {
      "id": "org_123",
      "name": "Acme Corp",
      "slug": "acme-corp",
      "logo": "https://example.com/logo.png",
      "metadata": null,
      "memberCount": 5,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "paging": {
    "size": 10,
    "total_page": 3,
    "current_page": 1,
    "total": 25
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 120
}
```

#### Error Responses

- `401` - Authentication required
- `403` - Only SUPERADMIN and ADMIN can access
- `400` - Invalid query parameters

### POST /organizations

Create new organization (Superadmin/Admin only).

#### Request

```json
{
  "name": "New Company",
  "slug": "new-company",
  "logo": "https://example.com/logo.png",
  "metadata": {
    "industry": "Technology",
    "size": "enterprise"
  }
}
```

#### Response (Success - 201)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "Organization created successfully",
  "data": {
    "id": "org_456",
    "name": "New Company",
    "slug": "new-company",
    "logo": "https://example.com/logo.png",
    "metadata": {
      "industry": "Technology",
      "size": "enterprise"
    },
    "createdAt": "2025-01-01T12:00:00.000Z",
    "role": "owner"
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 150
}
```

#### Error Responses

- `401` - Authentication required
- `403` - Only SUPERADMIN and ADMIN can create organizations
- `400` - Validation error (name and slug required)
- `409` - Organization with this slug already exists

### GET /organizations/[organizationId]

Get specific organization details (Superadmin/Admin only).

#### Request

```
GET /api/v1/organizations/org_123
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "Success",
  "data": {
    "id": "org_123",
    "name": "Acme Corp",
    "slug": "acme-corp",
    "logo": "https://example.com/logo.png",
    "metadata": {
      "industry": "Technology",
      "size": "enterprise"
    },
    "memberCount": 5,
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 80
}
```

#### Error Responses

- `401` - Authentication required
- `403` - Only SUPERADMIN and ADMIN can access
- `404` - Organization not found

### PUT /organizations/[organizationId]

Update organization information (Superadmin/Admin only).

#### Request

```json
{
  "name": "Updated Company Name",
  "slug": "updated-company-slug",
  "logo": "https://example.com/new-logo.png",
  "metadata": {
    "industry": "Finance",
    "size": "mid-size"
  }
}
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "Organization updated successfully",
  "data": {
    "id": "org_123",
    "name": "Updated Company Name",
    "slug": "updated-company-slug",
    "logo": "https://example.com/new-logo.png",
    "metadata": {
      "industry": "Finance",
      "size": "mid-size"
    },
    "memberCount": 5,
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 150
}
```

#### Error Responses

- `401` - Authentication required
- `403` - Only SUPERADMIN and ADMIN can update organizations
- `400` - Validation error
- `404` - Organization not found
- `409` - Organization with this slug already exists

### DELETE /organizations/[organizationId]

Delete an organization (Superadmin/Admin only).

#### Request

```
DELETE /api/v1/organizations/org_123
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "Organization deleted successfully",
  "data": null,
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 100
}
```

#### Error Responses

- `401` - Authentication required
- `403` - Only SUPERADMIN and ADMIN can delete organizations
- `404` - Organization not found

### GET /organizations/[organizationId]/members

Get all members of a specific organization.

#### Request

```
GET /api/v1/organizations/org_123/members
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "Success",
  "data": [
    {
      "id": "member_123",
      "userId": "user_123",
      "organizationId": "org_123",
      "role": "owner",
      "user": {
        "id": "user_123",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "https://example.com/avatar.jpg"
      },
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 100
}
```

### POST /organizations/[organizationId]/invite

Invite user to join an organization.

#### Request

```json
{
  "email": "invitee@example.com",
  "role": "member",
  "message": "Join our team at Acme Corp!"
}
```

#### Response (Success - 201)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "Invitation sent successfully",
  "data": {
    "id": "inv_123",
    "email": "invitee@example.com",
    "organizationId": "org_123",
    "role": "member",
    "message": "Join our team at Acme Corp!",
    "status": "pending",
    "expiresAt": "2025-01-08T12:00:00.000Z"
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 200
}
```

### GET /organizations/[organizationId]/invitations

Get all pending invitations for an organization.

#### Request

```
GET /api/v1/organizations/org_123/invitations
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "Success",
  "data": [
    {
      "id": "inv_123",
      "email": "invitee@example.com",
      "organizationId": "org_123",
      "role": "member",
      "status": "pending",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "expiresAt": "2025-01-08T12:00:00.000Z"
    }
  ],
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 120
}
```

### POST /accept-invitation/[invitationId]

Accept organization invitation.

#### Request

```
POST /api/accept-invitation/inv_123
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "Invitation accepted successfully",
  "data": {
    "membership": {
      "id": "mem_123",
      "organizationId": "org_123",
      "userId": "user_456",
      "role": "MEMBER",
      "createdAt": "2025-01-01T12:00:00.000Z"
    }
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 150
}
```

## Health Check Endpoint

### GET /health

Application health status.

#### Request

```
GET /api/health
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "Application is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2025-01-01T12:00:00.000Z",
    "version": "1.0.0",
    "environment": "production",
    "uptime": 86400,
    "database": {
      "status": "connected",
      "responseTime": 5
    },
    "memory": {
      "used": "256MB",
      "total": "512MB"
    }
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 10
}
```

## File Upload Endpoints

### POST /upload

Upload file to server.

#### Request (multipart/form-data)

```
POST /api/v1/upload
Content-Type: multipart/form-data

file: [binary file data]
folder: "avatars"
maxSize: 5242880
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "File uploaded successfully",
  "data": {
    "file": {
      "id": "file_123",
      "name": "avatar.jpg",
      "url": "https://example.com/uploads/avatars/avatar_123.jpg",
      "size": 1024000,
      "type": "image/jpeg",
      "folder": "avatars",
      "uploadedAt": "2025-01-01T12:00:00.000Z"
    }
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 500
}
```

## Export Endpoints

### POST /export/users

Export user data in various formats.

#### Request

```json
{
  "format": "csv",
  "filters": {
    "role": "USER",
    "emailVerified": true,
    "dateRange": {
      "from": "2025-01-01",
      "to": "2025-01-31"
    }
  },
  "fields": ["id", "name", "email", "role", "createdAt"]
}
```

#### Response (Success - 200)

```json
{
  "traceId": "req_123456789",
  "code": "00",
  "message": "Export generated successfully",
  "data": {
    "downloadUrl": "https://example.com/exports/users_20250101.csv",
    "filename": "users_20250101.csv",
    "size": 1024000,
    "expiresAt": "2025-01-02T12:00:00.000Z"
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 2000
}
```

## Rate Limiting

### Rate Limit Configuration

```typescript
interface RateLimitConfig {
  "/api/v1/auth/login": {
    requests: 5;
    window: "15m";
    blockDuration: "15m";
  };
  "/api/v1/auth/register": {
    requests: 3;
    window: "1h";
    blockDuration: "1h";
  };
  "/api/v1/auth/reset": {
    requests: 3;
    window: "1h";
    blockDuration: "1h";
  };
  "/api/v1/users": {
    requests: 100;
    window: "1h";
    blockDuration: "1h";
  };
}
```

### Rate Limit Response

```json
{
  "traceId": "req_123456789",
  "code": "07",
  "message": "Too many requests. Please try again later.",
  "data": {
    "retryAfter": 900,
    "limit": 5,
    "remaining": 0,
    "reset": "2025-01-01T12:15:00.000Z"
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 10
}
```

## Authentication Headers

### Bearer Token Authentication

```http
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Cookie Authentication

```http
Cookie: auth-token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...; auth-jwt=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Required Headers for All Requests

```http
Content-Type: application/json
Accept: application/json
User-Agent: YourApp/1.0
X-Request-ID: optional-request-id
```

## Error Handling

### Standard Error Response Structure

```json
{
  "traceId": "req_123456789",
  "code": "error_code",
  "message": "Human-readable error message",
  "data": {
    "field": "Additional error details",
    "validationErrors": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "responseAt": "2025-01-01T12:00:00.000Z",
  "timeConsume": 50
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created successfully
- `400` - Bad request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `409` - Conflict (resource already exists)
- `422` - Unprocessable entity
- `429` - Too many requests (rate limited)
- `500` - Internal server error
- `502` - Bad gateway (external service error)
- `503` - Service unavailable

## API Versioning

### Version Strategy

- URL Path Versioning: `/api/v1/`, `/api/v2/`
- Backward Compatibility: Maintain v1 while introducing v2
- Deprecation Notice: Communicate breaking changes in advance

### Version Response Headers

```http
API-Version: 1.0
Supported-Versions: 1.0, 1.1
Deprecated-Versions:
Sunset-Date: 2025-12-31
```

## Testing the API

### Using curl Examples

#### Login

```bash
curl -X POST https://yourdomain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Get Users (Authenticated)

```bash
curl -X GET https://yourdomain.com/api/v1/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

#### Create User (Admin)

```bash
curl -X POST https://yourdomain.com/api/v1/users \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New User",
    "email": "newuser@example.com",
    "password": "securePassword123",
    "role": "USER"
  }'
```

---

**Document Version**: 1.0
**Last Updated**: October 31, 2025
**API Version**: v1.0
**Next Review**: January 31, 2026
