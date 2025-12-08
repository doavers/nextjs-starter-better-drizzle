# Application User Flows

## Overview

This document outlines the complete user flows within the NextJS starter application with Better Auth v1.4+ and Drizzle ORM v0.45+, including dashboard navigation, user management, data operations, and feature interactions.

## Application Flow Summary

```mermaid
flowchart TD
    A[User Authentication] --> B{User Role}
    B -->|SUPERADMIN| C[System Administration]
    B -->|ADMIN| D[Organization Management]
    B -->|USER| E[Standard User Access]

    C --> F[User Management]
    C --> G[System Settings]
    C --> H[Audit Logs]

    D --> I[Organization Dashboard]
    D --> J[Team Management]
    D --> K[Member Invitations]

    E --> L[Personal Dashboard]
    E --> M[Profile Management]
    E --> N[Feature Access]

    F --> O[Data Operations]
    G --> O
    H --> O
    I --> O
    J --> O
    K --> O
    L --> O
    M --> O
    N --> O
```

## 1. Dashboard Navigation Flow

### Dashboard Navigation Structure

```mermaid
flowchart TD
    A[Dashboard Layout] --> B[Sidebar Navigation]
    A --> C[Top Navigation Bar]
    A --> D[Main Content Area]

    B --> E[Dashboard Home]
    B --> F[User Management]
    B --> G[Kanban Board]
    B --> H[Settings]
    B --> I[Analytics]

    C --> J[User Menu]
    C --> K[Theme Switcher]
    C --> L[Organization Switcher]
    C --> M[Notifications]

    D --> N[Page Content]
    D --> O[Data Tables]
    D --> P[Forms]
    D --> Q[Charts]
```

### Navigation Permission Flow

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant API
    participant Router

    User->>Dashboard: Access dashboard
    Dashboard->>API: Get user permissions
    API-->>Dashboard: Return role-based access
    Dashboard->>Dashboard: Filter navigation items

    User->>Dashboard: Click navigation item
    Dashboard->>Router: Navigate to route
    Router->>API: Check route permissions
    API-->>Router: Permission validation

    alt Authorized
        Router-->>Dashboard: Render page
    else Unauthorized
        Router-->>Dashboard: Show access denied
    end
```

### Role-Based Navigation

```typescript
interface NavigationItems {
  // All users
  common: [
    { label: "Dashboard"; href: "/dashboard"; icon: "LayoutDashboard" },
    { label: "Profile"; href: "/profile"; icon: "User" },
  ];

  // Admin and Superadmin
  admin: [
    { label: "User Management"; href: "/dashboard/users"; icon: "Users" },
    { label: "Analytics"; href: "/dashboard/analytics"; icon: "BarChart" },
    { label: "Settings"; href: "/dashboard/settings"; icon: "Settings" },
  ];

  // Superadmin only
  superadmin: [
    { label: "System Administration"; href: "/admin/system"; icon: "Shield" },
    { label: "Audit Logs"; href: "/admin/audit"; icon: "FileText" },
  ];
}
```

## 2. User Management Flow

### User Management Interface

```mermaid
flowchart TD
    A[User Management Page] --> B[User List Component]
    B --> C[Data Table]

    C --> D[Search & Filter]
    C --> E[Column Sorting]
    C --> F[Pagination]
    C --> G[Row Actions]

    G --> H[View User Details]
    G --> I[Edit User]
    G --> J[Delete User]
    G --> K[Change Role]
    G --> L[Ban/Unban User]

    H --> M[User Details Modal]
    I --> N[User Edit Form]
    J --> O[Delete Confirmation]
    K --> P[Role Selection]
    L --> Q[Ban Dialog]
```

### User List Data Flow

```mermaid
sequenceDiagram
    participant Admin
    participant UserTable
    participant API
    participant Database

    Admin->>UserTable: Access user management
    UserTable->>API: Fetch users list
    API->>Database: Query user data
    Database-->>API: Return user records
    API-->>UserTable: Display user table

    Admin->>UserTable: Apply search/filter
    UserTable->>API: Request filtered data
    API->>Database: Apply filters
    Database-->>API: Filtered results
    API-->>UserTable: Update table display
```

### User CRUD Operations

#### Create User Flow

```mermaid
sequenceDiagram
    participant Admin
    participant UserForm
    participant API
    participant Auth
    participant Database

    Admin->>UserForm: Click "Add User"
    UserForm-->>Admin: Show creation form
    Admin->>UserForm: Submit user details
    UserForm->>API: Create user request
    API->>Auth: Validate and create user
    Auth->>Database: Store user record
    Auth-->>API: User created
    API-->>UserForm: Success response
    UserForm-->>Admin: Show confirmation
```

#### Edit User Flow

```mermaid
sequenceDiagram
    participant Admin
    participant EditForm
    participant API
    participant Database

    Admin->>EditForm: Click edit user
    EditForm->>API: Fetch user data
    API->>Database: Get user record
    Database-->>API: Return user data
    API-->>EditForm: Populate form
    Admin->>EditForm: Update user details
    EditForm->>API: Update user request
    API->>Database: Update user record
    Database-->>API: Updated data
    API-->>EditForm: Success response
    EditForm-->>Admin: Show confirmation
```

#### Delete User Flow

```mermaid
sequenceDiagram
    participant Admin
    participant UserTable
    participant ConfirmDialog
    participant API
    participant Database

    Admin->>UserTable: Click delete user
    UserTable->>ConfirmDialog: Show confirmation
    Admin->>ConfirmDialog: Confirm deletion
    ConfirmDialog->>API: Delete user request
    API->>Database: Remove user record
    Database-->>API: Deletion complete
    API-->>ConfirmDialog: Success response
    ConfirmDialog-->>UserTable: Refresh table
```

## 3. Data Table Interaction Flow

### Data Table Component Structure

```mermaid
flowchart TD
    A[Data Table] --> B[Table Header]
    A --> C[Table Body]
    A --> D[Table Toolbar]
    A --> E[Pagination]

    B --> F[Column Sorting]
    B --> G[Column Visibility]
    B --> H[Column Resizing]

    D --> I[Search Bar]
    D --> J[Filter Options]
    D --> K[Export Actions]

    C --> L[Row Selection]
    C --> M[Row Actions]
    C --> N[Inline Editing]

    E --> O[Page Navigation]
    E --> P[Page Size Control]
```

### Data Table Interaction Flow

```mermaid
sequenceDiagram
    participant User
    participant DataTable
    participant API
    participant Database

    User->>DataTable: Load data table
    DataTable->>API: Fetch table data
    API->>Database: Query with parameters
    Database-->>API: Return paginated data
    API-->>DataTable: Display table

    User->>DataTable: Apply sort/filter
    DataTable->>API: Request updated data
    API->>Database: Apply filters/sorting
    Database-->>API: Return filtered data
    API-->>DataTable: Refresh table display
```

### Data Export Flow

```mermaid
sequenceDiagram
    participant User
    participant DataTable
    participant API
    participant FileService

    User->>DataTable: Click export button
    DataTable->>User: Show format options
    User->>DataTable: Select export format
    DataTable->>API: Request data export
    API->>FileService: Generate export file
    FileService-->>API: Return file data
    API-->>DataTable: Provide download
    DataTable-->>User: Initiate file download
```

## 4. Kanban Board Flow

### Kanban Board Layout

```mermaid
flowchart TD
    A[Kanban Board] --> B[Task Columns]
    A --> C[Task Cards]
    A --> D[Board Controls]

    B --> E[To Do]
    B --> F[In Progress]
    B --> G[Review]
    B --> H[Done]

    C --> I[Task Title]
    C --> J[Task Description]
    C --> K[Task Actions]

    D --> L[Add Task]
    D --> M[Filter Tasks]
    D --> N[Board Settings]
```

### Task Drag and Drop Flow

```mermaid
sequenceDiagram
    participant User
    participant TaskCard
    participant Board
    participant StateStore

    User->>TaskCard: Start dragging task
    TaskCard->>Board: Show drag preview
    User->>Board: Drag to target column
    Board->>Board: Highlight drop zone
    User->>Board: Drop task
    Board->>StateStore: Update task position
    StateStore->>StateStore: Save board state
    Board-->>User: Show confirmation
```

### Task Management Operations

```mermaid
sequenceDiagram
    participant User
    participant KanbanBoard
    participant TaskDialog
    participant StateStore

    User->>KanbanBoard: Click "Add Task"
    KanbanBoard->>TaskDialog: Open task form
    User->>TaskDialog: Enter task details
    User->>TaskDialog: Save task
    TaskDialog->>StateStore: Create new task
    StateStore->>StateStore: Persist board state
    TaskDialog-->>User: Show confirmation

    User->>KanbanBoard: Click edit task
    KanbanBoard->>TaskDialog: Open edit form
    User->>TaskDialog: Update task details
    User->>TaskDialog: Save changes
    TaskDialog->>StateStore: Update task
    StateStore->>StateStore: Persist changes
    TaskDialog-->>User: Show updated task
```

## 5. Profile Management Flow

### User Profile Settings

```mermaid
graph TD
    A[Profile Page] --> B[Profile Information]
    A --> C[Account Settings]
    A --> D[Security Settings]
    A --> E[Preferences]

    B --> F[Name & Email]
    B --> G[Profile Picture]
    B --> H[Bio/Description]

    C --> I[Email Notifications]
    C --> J[Privacy Settings]
    C --> K[Data Export]

    D --> L[Password Change]
    D --> M[Two-Factor Auth]
    D --> N[Active Sessions]

    E --> O[Theme Preferences]
    E --> P[Language Settings]
    E --> Q[Dashboard Layout]
```

### Profile Update Flow

```mermaid
sequenceDiagram
    participant User
    participant ProfilePage
    participant ProfileForm
    participant API
    participant DB
    participant FileService

    User->>ProfilePage: Navigate to profile
    ProfilePage->>API: GET /api/v1/users/me
    API->>DB: Fetch user profile
    DB-->>API: User profile data
    API-->>ProfilePage: Profile information
    ProfilePage-->>User: Display profile form

    Note over User,FileService: Profile Picture Update
    User->>ProfileForm: Upload new profile picture
    ProfileForm->>FileService: Upload image file
    FileService--->ProfileForm: Return image URL
    ProfileForm->>ProfileForm: Update form with new image

    Note over User,DB: Profile Information Update
    User->>ProfileForm: Update profile information
    User->>ProfileForm: Save changes
    ProfileForm->>API: PUT /api/v1/users/me
    API->>DB: Update user profile
    DB-->>API: Updated profile data
    API-->>ProfileForm: Success response
    ProfileForm--->User: Show success message
    ProfileForm->>ProfilePage: Update displayed profile
```

### Password Change Flow

```mermaid
sequenceDiagram
    participant User
    participant ProfilePage
    participant PasswordForm
    participant API
    participant BetterAuth
    participant DB

    User->>ProfilePage: Navigate to security settings
    ProfilePage--->User: Display password change form
    User->>PasswordForm: Enter current password
    User->>PasswordForm: Enter new password
    User->>PasswordForm: Confirm new password
    User->>PasswordForm: Submit form
    PasswordForm->>API: POST /api/v1/auth/change-password
    API->>BetterAuth: Validate current password
    BetterAuth->>DB: Verify credentials
    DB-->>BetterAuth: Password validation result
    alt Current Password Valid
        BetterAuth->>DB: Update password
        BetterAuth->>DB: Invalidate all sessions
        BetterAuth-->>API: Password updated successfully
        API-->>PasswordForm: Success response
        PasswordForm--->User: Success message + redirect to login
    else Current Password Invalid
        BetterAuth-->>API: Invalid current password
        API-->>PasswordForm: Error response
        PasswordForm--->User: Error message
    end
```

## 6. Organization Management Flow

### Organization Dashboard

```mermaid
graph TD
    A[Organization Dashboard] --> B[Organization Info]
    A --> C[Team Members]
    A --> D[Invitations]
    A --> E[Organization Settings]

    B --> F[Organization Details]
    B --> G[Organization Stats]

    C --> H[Member List]
    C --> I[Role Management]
    C --> J[Member Actions]

    D --> K[Pending Invitations]
    D --> L[Send Invitation]
    D --> M[Invitation History]

    E --> N[General Settings]
    E --> O[Billing/Plans]
    E --> P[Security Settings]
```

### Team Invitation Flow

```mermaid
sequenceDiagram
    participant Owner
    participant OrgDashboard
    participant InviteForm
    participant API
    participant DB
    participant EmailService
    participant Invitee

    Owner->>OrgDashboard: Navigate to team management
    OrgDashboard->>InviteForm: Open invitation form
    Owner->>InviteForm: Enter member email
    Owner->>InviteForm: Select role (Member/Owner)
    Owner->>InviteForm: Add personal message
    Owner->>InviteForm: Send invitation
    InviteForm->>API: POST /api/organizations/invite
    API->>DB: Check if user exists
    alt User Exists
        API->>DB: Create invitation record
        API->>DB: Link to existing user
    else User Doesn't Exist
        API->>DB: Create invitation record
        API->>EmailService: Send invitation email
        EmailService-->>Invitee: Invitation email with signup link
    end
    API-->>InviteForm: Success response
    InviteForm--->Owner: Show confirmation message
    InviteForm->>OrgDashboard: Refresh invitations list
```

### Invitation Acceptance Flow

```mermaid
sequenceDiagram
    participant Invitee
    participant EmailClient
    participant InvitationLink
    participant API
    participant BetterAuth
    participant DB

    Invitee->>EmailClient: Open invitation email
    Invitee->>InvitationLink: Click invitation link
    InvitationLink->>API: GET /api/accept-invitation/[token]
    API->>DB: Validate invitation token
    alt Valid Invitation
        API->>DB: Check if user has account
        alt User Has Account
            API->>DB: Add user to organization
            API->>DB: Update invitation status
            API-->>InvitationLink: Redirect to organization dashboard
        else User Needs Account
            API-->>InvitationLink: Redirect to registration with pre-filled data
            Invitee->>API: Complete registration
            API->>BetterAuth: Create user account
            BetterAuth->>DB: Create user record
            API->>DB: Add user to organization
            API->>DB: Update invitation status
            API-->>Invitee: Success + organization access
        end
    else Invalid Invitation
        API-->>InvitationLink: Show invalid invitation page
    end
```

## 7. Theme and Preferences Flow

### Theme Switching Flow

```mermaid
sequenceDiagram
    participant User
    participant ThemeSwitcher
    participant PreferenceStore
    participant LocalStorage
    participant CSSVariables

    User->>ThemeSwitcher: Click theme toggle
    ThemeSwitcher->>PreferenceStore: Toggle theme (light/dark)
    PreferenceStore->>LocalStorage: Save theme preference
    PreferenceStore->>CSSVariables: Update CSS variables
    CSSVariables--->User: Immediate visual theme change
    PreferenceStore->>PreferenceStore: Sync with server (debounced)

    Note over User,PreferenceStore: Theme Preset Selection
    User->>ThemeSwitcher: Open theme preset menu
    ThemeSwitcher--->User: Show available presets (default, brutalist, soft-pop, tangerine)
    User->>ThemeSwitcher: Select theme preset
    ThemeSwitcher->>PreferenceStore: Apply preset
    PreferenceStore->>LocalStorage: Save preset preference
    PreferenceStore->>CSSVariables: Apply preset styles
    CSSVariables--->User: Visual preset applied
```

### Language Switching Flow

```mermaid
sequenceDiagram
    participant User
    participant LocaleSwitcher
    participant Router
    participant API
    participant TranslationService

    User->>LocaleSwitcher: Click language switcher
    LocaleSwitcher--->User: Show available languages
    User->>LocaleSwitcher: Select language (en/id)
    LocaleSwitcher->>Router: Navigate to /{locale}/current-path
    Router->>API: Request page with new locale
    API->>TranslationService: Load translations for locale
    TranslationService--->API: Translation data
    API--->Router: Rendered page with translations
    Router--->User: Page content in selected language
    LocaleSwitcher->>LocalStorage: Save language preference
```

## 8. Error Handling and User Feedback

### Application Error States

```mermaid
graph TD
    A[User Action] --> B{Success?}
    B -->|Yes| C[Show Success Feedback]
    B -->|No| D[Show Error Message]

    C --> E[Update UI State]
    C --> F[Log Analytics Event]

    D --> G{Error Type}
    G -->|Validation Error| H[Show Field Errors]
    G -->|Network Error| I[Show Retry Option]
    G -->|Permission Error| J[Redirect or Show Access Denied]
    G -->|Server Error| K[Show Generic Error Message]

    H --> L[Highlight Invalid Fields]
    I --> M[Retry Action on Request]
    J --> N[Contact Admin Option]
    K --> O[Try Again Later Message]
```

### Loading States and Feedback

```typescript
interface LoadingStates {
  initial: "Initial loading state";
  loading: "Action in progress";
  success: "Action completed successfully";
  error: "Action failed";
  validating: "Form validation in progress";
  uploading: "File upload in progress";
  saving: "Saving changes";
  deleting: "Deleting item";
  refreshing: "Refreshing data";
}
```

### User Feedback Patterns

```typescript
interface FeedbackPatterns {
  success: {
    toast: "Brief success notification";
    banner: "Persistent success message";
    inline: "Success state within form";
    modal: "Success confirmation dialog";
  };
  error: {
    field: "Field-specific error message";
    form: "Form-level error summary";
    toast: "Brief error notification";
    page: "Full-page error state";
  };
  progress: {
    spinner: "Loading spinner";
    skeleton: "Content skeleton loader";
    progress: "Progress bar";
    steps: "Multi-step progress indicator";
  };
}
```

---

**Document Version**: 1.1
**Last Updated**: December 8, 2024
**Next Review**: January 31, 2025
