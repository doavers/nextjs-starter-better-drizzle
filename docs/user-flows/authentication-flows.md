# Authentication User Flows

## Overview

This document outlines the complete authentication flows within the application, including user registration, login, logout, password reset, and social authentication processes.

## Authentication Flow Summary

```mermaid
flowchart TD
    A[User Access] --> B{Authentication Status}
    B -->|Not Authenticated| C[Login/Register Flow]
    B -->|Authenticated| D[Application Access]

    C --> E[Email/Password Login]
    C --> F[Social Login]
    C --> G[Registration]
    C --> H[Password Reset]

    E --> I[Credentials Validation]
    F --> J[OAuth Provider]
    G --> K[Account Creation]
    H --> L[Email Verification]

    I --> M{Validation Result}
    J --> M
    K --> M
    L --> M

    M -->|Success| D
    M -->|Failure| N[Error Handling]
    N --> C
```

## 1. User Registration Flow

### Registration Process

```mermaid
sequenceDiagram
    participant User
    participant RegisterForm
    participant API
    participant BetterAuth
    participant DB
    participant EmailService

    User->>RegisterForm: Access registration page
    RegisterForm-->>User: Display registration form

    User->>RegisterForm: Fill registration details
    Note right of User: Email, password, name,<br/>and other required fields

    User->>RegisterForm: Submit registration
    RegisterForm->>API: POST /api/v1/auth/register
    API->>API: Validate input data
    API->>BetterAuth: Create user account

    BetterAuth->>DB: Insert user record
    BetterAuth->>DB: Create user session
    BetterAuth->>EmailService: Send verification email

    BetterAuth-->>API: Registration successful
    API-->>RegisterForm: Success response
    RegisterForm-->>User: Redirect to dashboard
```

### Registration Validation Flow

```mermaid
flowchart TD
    A[Registration Form Submit] --> B[Client-Side Validation]
    B --> C{Validation Passed?}
    C -->|No| D[Show Field Errors]
    D --> A
    C -->|Yes| E[Send to API]

    E --> F[Server-Side Validation]
    F --> G{Server Validation Passed?}
    G -->|No| H[Return Error Response]
    H --> I[Display Server Errors]
    I --> A
    G -->|Yes| J[Create User Account]

    J --> K[Send Verification Email]
    K --> L[Create User Session]
    L --> M[Redirect to Dashboard]
```

### Registration Form Fields

```typescript
interface RegistrationForm {
  name: string; // Required, min 2 chars
  email: string; // Required, valid email
  password: string; // Required, 8-128 chars
  confirmPassword: string; // Must match password
  organizationName?: string; // Optional, creates org if provided
  acceptTerms: boolean; // Required, must be true
}
```

### Validation Rules

- **Name**: 2-100 characters, alphanumeric + spaces
- **Email**: Valid email format, unique in database
- **Password**: 8-128 characters, complexity requirements
- **Organization Name**: Optional, 2-100 characters if provided
- **Terms**: Must be accepted

### Error Handling

```typescript
interface RegistrationErrors {
  name?: string; // Invalid name format
  email?: string; // Email already exists or invalid
  password?: string; // Password too weak
  confirmPassword?: string; // Passwords don't match
  organizationName?: string; // Invalid organization name
  acceptTerms?: string; // Terms must be accepted
  server?: string; // Server-side errors
}
```

## 2. User Login Flow

### Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant UI
    participant API
    participant BetterAuth
    participant DB
    participant Middleware

    User->>Browser: Navigate to /auth/login
    Browser->>UI: Render Login Form
    User->>UI: Enter credentials
    UI->>UI: Client-side validation
    User->>UI: Click Login button
    UI->>API: POST /api/v1/auth/login
    API->>API: Server-side validation
    API->>BetterAuth: Authenticate user
    BetterAuth->>DB: Verify credentials
    DB-->>BetterAuth: User data (if valid)
    alt Valid Credentials
        BetterAuth->>DB: Create session
        BetterAuth->>DB: Generate JWT tokens
        BetterAuth-->>API: Authentication successful
        API-->>UI: Return user data + tokens
        UI->>UI: Update auth state
        UI->>UI: Store tokens (cookies/localStorage)
        UI-->>User: Redirect to dashboard
    else Invalid Credentials
        BetterAuth-->>API: Authentication failed
        API-->>UI: Error response
        UI-->>User: Show error message
    end

    Note over User,Middleware: Subsequent Request Authentication
    User->>Browser: Navigate to protected route
    Browser->>Middleware: Request with auth cookie
    Middleware->>DB: Validate session
    DB-->>Middleware: Session valid
    Middleware-->>Browser: Allow access to protected route
```

### Login Form Fields

```typescript
interface LoginForm {
  email: string; // Required, valid email
  password: string; // Required
  rememberMe?: boolean; // Optional, extends session
}
```

### Session Management

- **Session Duration**: 3 days (configurable)
- **Session Refresh**: Automatic refresh if used within 1 day
- **Token Storage**: Secure HTTP-only cookies + localStorage for API calls
- **Session Invalidation**: Manual logout or automatic expiration

### Login States

```typescript
interface LoginState {
  isLoading: boolean; // Form submission in progress
  error?: string; // Login error message
  success: boolean; // Login successful
  requiresEmailVerification: boolean; // Email not verified
  isBanned: boolean; // Account banned
  banReason?: string; // Reason for ban
  banExpires?: Date; // Ban expiration date
}
```

## 3. Social Authentication Flow (Google OAuth)

### Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant UI
    participant API
    participant BetterAuth
    participant Google
    participant DB

    User->>Browser: Navigate to /auth/login
    Browser->>UI: Render Login Form
    User->>UI: Click "Continue with Google"
    UI->>API: GET /api/auth/signin/google
    API->>BetterAuth: Initiate OAuth flow
    BetterAuth->>Google: Redirect to Google OAuth
    Google-->>User: Show Google consent screen
    User->>Google: Authorize application
    Google-->>BetterAuth: Redirect with authorization code
    BetterAuth->>Google: Exchange code for tokens
    Google-->>BetterAuth: Access tokens + user profile
    BetterAuth->>DB: Check if user exists
    alt User Exists
        BetterAuth->>DB: Update last login
    else New User
        BetterAuth->>DB: Create new user record
        BetterAuth->>DB: Create verification record (auto-verified)
    end
    BetterAuth->>DB: Create session
    BetterAuth-->>API: Authentication successful
    API-->>Browser: Redirect to dashboard
```

### Google OAuth Configuration

```typescript
interface GoogleOAuthConfig {
  clientId: string; // Google OAuth client ID
  clientSecret: string; // Google OAuth client secret
  redirectUri: string; // Authorized redirect URI
  scope: string[]; // Requested permissions
}
```

### Profile Mapping

```typescript
interface ProfileMapping {
  email: string; // From Google profile
  name: string; // From Google profile
  image?: string; // From Google profile
  emailVerified: true; // Auto-verified for OAuth
  role: "USER"; // Default role for OAuth users
}
```

## 4. Email Verification Flow

### Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant UI
    participant API
    participant BetterAuth
    participant DB
    participant EmailService

    Note over User,DB: After Registration
    BetterAuth->>EmailService: Send verification email
    EmailService-->>User: Email with verification link

    User->>EmailService: Open verification email
    User->>Browser: Click verification link
    Browser->>API: GET /api/auth/verify-email?token=xxx
    API->>BetterAuth: Process verification
    BetterAuth->>DB: Find verification token
    alt Valid Token
        BetterAuth->>DB: Mark email as verified
        BetterAuth->>DB: Delete verification token
        BetterAuth-->>API: Verification successful
        API-->>Browser: Redirect to login with success
    else Invalid/Expired Token
        BetterAuth-->>API: Verification failed
        API-->>Browser: Show error page
        Browser-->>User: Offer to resend verification
    end
```

### Verification Email Template

```typescript
interface VerificationEmail {
  to: string; // User's email address
  subject: string; // "Verify your email address"
  verificationUrl: string; // Unique verification link
  expirationHours: number; // Token expiration (24 hours)
  userName: string; // User's name for personalization
}
```

### Resend Verification Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant API
    participant BetterAuth
    participant DB
    participant EmailService

    User->>UI: Click "Resend verification"
    UI->>API: POST /api/auth/resend-verification
    API->>API: Validate email address
    API->>DB: Check user exists and not verified
    API->>BetterAuth: Generate new verification token
    BetterAuth->>DB: Store verification token
    BetterAuth->>EmailService: Send verification email
    EmailService-->>User: New verification email
    API-->>UI: Success response
    UI-->>User: Show confirmation message
```

## 5. Password Reset Flow

### Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant UI
    participant API
    participant BetterAuth
    participant DB
    participant EmailService

    User->>Browser: Navigate to /auth/forgot-password
    Browser->>UI: Render forgot password form
    User->>UI: Enter email address
    UI->>API: POST /api/v1/auth/reset
    API->>DB: Check if user exists
    alt User Exists
        API->>BetterAuth: Generate reset token
        BetterAuth->>DB: Store reset token
        BetterAuth->>EmailService: Send reset email
        EmailService-->>User: Password reset email
    end
    API-->>UI: Success response (always success for security)
    UI-->>User: "Check your email" message

    Note over User,EmailService: Password Reset Process
    User->>EmailService: Open reset email
    User->>Browser: Click reset link
    Browser->>UI: Navigate to /auth/new-password?token=xxx
    UI->>UI: Validate token with API
    UI->>UI: Render new password form
    User->>UI: Enter new password
    UI->>API: POST /api/v1/auth/new-password
    API->>BetterAuth: Validate token and update password
    BetterAuth->>DB: Update user password
    BetterAuth->>DB: Invalidate all sessions
    BetterAuth->>DB: Delete reset token
    BetterAuth-->>API: Password reset successful
    API-->>UI: Success response
    UI-->>User: Redirect to login with success message
```

### Password Reset Form Fields

```typescript
interface PasswordResetForm {
  password: string; // Required, 8-128 chars
  confirmPassword: string; // Must match password
}
```

### Reset Token Properties

- **Expiration**: 24 hours
- **Single Use**: Token becomes invalid after use
- **Security**: Cryptographically secure random tokens
- **Invalidation**: All sessions invalidated after password change

## 6. User Logout Flow

### Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant UI
    participant API
    participant BetterAuth
    participant DB

    User->>UI: Click logout button
    UI->>API: POST /api/v1/auth/logout
    API->>BetterAuth: Logout request
    BetterAuth->>DB: Delete session
    BetterAuth->>DB: Revoke JWT tokens
    BetterAuth-->>API: Logout successful
    API-->>UI: Success response
    UI->>UI: Clear local auth state
    UI->>UI: Clear tokens from storage
    UI--->User: Redirect to login page
```

### Logout Options

```typescript
interface LogoutOptions {
  allDevices?: boolean; // Logout from all devices
  redirectUrl?: string; // Custom redirect after logout
}
```

## 7. Session Management Flow

### Session Validation

```mermaid
sequenceDiagram
    participant Browser
    participant Middleware
    participant DB
    participant BetterAuth

    Browser->>Middleware: Request with session cookie
    Middleware->>DB: Check session exists
    alt Session Exists
        Middleware->>DB: Check session not expired
        alt Session Valid
            Middleware->>BetterAuth: Get user data
            BetterAuth-->>Middleware: User information
            Middleware-->>Browser: Continue to protected route
        else Session Expired
            Middleware->>DB: Delete expired session
            Middleware-->>Browser: Redirect to login
        end
    else No Session
        Middleware-->>Browser: Redirect to login
    end
```

### Session Refresh Flow

```mermaid
sequenceDiagram
    participant Browser
    participant Middleware
    participant DB
    participant BetterAuth

    Browser->>Middleware: Request with aging session
    Middleware->>DB: Check session age
    alt Session age > 1 day and < 3 days
        Middleware->>BetterAuth: Refresh session
        BetterAuth->>DB: Update session expiration
        BetterAuth->>DB: Generate new tokens
        BetterAuth-->>Middleware: Refreshed session data
        Middleware-->>Browser: Set new session cookies
    else Session age >= 3 days
        Middleware->>DB: Delete expired session
        Middleware-->>Browser: Redirect to login
    end
```

## 8. Multi-Factor Authentication (Future Enhancement)

### Planned MFA Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant API
    participant MFAService
    participant DB

    Note over User,DB: After Primary Authentication
    API->>MFAService: Generate MFA challenge
    MFAService-->>User: Send MFA code (SMS/Email/App)
    UI->>User: Show MFA input form
    User->>UI: Enter MFA code
    UI->>API: Verify MFA code
    API->>MFAService: Validate code
    MFAService-->>API: Validation result
    alt Valid Code
        API->>DB: Complete authentication
        API-->>UI: Success response
        UI-->>User: Grant access
    else Invalid Code
        API-->>UI: Error response
        UI-->>User: Show error + retry option
    end
```

## 9. Error Handling and User Feedback

### Common Error Scenarios

```typescript
interface AuthErrorCodes {
  INVALID_CREDENTIALS: "Email or password is incorrect";
  USER_NOT_FOUND: "No account found with this email";
  EMAIL_NOT_VERIFIED: "Please verify your email before logging in";
  ACCOUNT_BANNED: "Your account has been banned";
  WEAK_PASSWORD: "Password does not meet security requirements";
  EMAIL_EXISTS: "An account with this email already exists";
  INVALID_TOKEN: "Invalid or expired verification link";
  RATE_LIMITED: "Too many attempts. Please try again later";
  OAUTH_ERROR: "Failed to authenticate with Google";
  NETWORK_ERROR: "Connection error. Please try again";
}
```

### User Feedback Patterns

```typescript
interface UserFeedback {
  success: {
    type: "success";
    message: string;
    action?: string; // Optional action button text
    actionUrl?: string; // Optional action URL
  };
  error: {
    type: "error";
    message: string;
    code?: string; // Error code for logging
    retryable?: boolean; // Can user retry the action
  };
  warning: {
    type: "warning";
    message: string;
    dismissible?: boolean; // Can user dismiss the warning
  };
  info: {
    type: "info";
    message: string;
    persistent?: boolean; // Stays visible until dismissed
  };
}
```

## 10. Security Considerations

### Authentication Security Measures

- **Password Requirements**: Minimum 8 characters, complexity rules
- **Rate Limiting**: Prevent brute force attacks
- **Session Security**: HTTP-only, secure cookies
- **CSRF Protection**: SameSite cookie attributes
- **Token Security**: JWT with RS256 signing
- **Account Lockout**: Temporary bans after failed attempts

### Data Protection

- **Email Privacy**: Email addresses only used for authentication
- **Password Security**: Never stored in plain text
- **Session Data**: Minimal data stored in sessions
- **Audit Logging**: All authentication events logged
- **Data Encryption**: All sensitive data encrypted at rest

---

**Document Version**: 1.0
**Last Updated**: October 31, 2025
**Next Review**: January 31, 2026
