# Development Setup Guide

## Overview

This guide provides comprehensive instructions for setting up the development environment for the NextJS starter template with Better Auth v1.4+ and Drizzle ORM v0.45+ integration.

## Prerequisites

### System Requirements

- **Node.js**: 18.17.0 or higher (19+ recommended)
- **npm**: 9.0.0 or higher
- **PostgreSQL**: 14.0 or higher
- **Git**: 2.30.0 or higher
- **Operating System**: Windows 10+, macOS 12+, or Linux (Ubuntu 20.04+)

### Recommended Development Tools

- **IDE**: Visual Studio Code (with recommended extensions)
- **Database Tool**: TablePlus, DBeaver, or Drizzle Studio
- **API Testing**: Postman, Insomnia, or built-in DevTools
- **Git GUI**: GitKraken, SourceTree, or built-in VS Code Git

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/doavers/nextjs-starter-better-drizzle.git
cd nextjs-starter-better-drizzle
```

### 2. Install Dependencies

```bash
npm install
# This installs ~200+ packages including Next.js 16, React 19, Better Auth 1.4+, Drizzle ORM 0.45+
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit the environment file with your configuration
# Required: DATABASE_URL, AUTH_SECRET, AUTH_URL
# Optional: Google OAuth, Resend API, reCAPTCHA
```

### 4. Database Setup

```bash
# Create PostgreSQL database
createdb nextjs_starter

# Push schema to database (no migrations needed for initial setup)
npm run db:push

# Open Drizzle Studio to explore the database
npm run db:studio
```

### 5. Start Development Server

```bash
# Starts with Turbopack for faster development
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application running with hot reload.

## Detailed Setup Instructions

### Environment Configuration

#### Required Environment Variables

```bash
# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/nextjs_starter"

# Better Auth Configuration
AUTH_SECRET="your-super-secret-key-32-chars-minimum"
AUTH_URL="http://localhost:3000"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### Optional Environment Variables

```bash
# Google OAuth (Social Authentication)
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

# Email Configuration (Resend)
RESEND_API_KEY="re_your_resend_api_key"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# reCAPTCHA (Google reCAPTCHA v2)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6LeIxAcTAAAAAJcZVRqyHh71UMIEbQjYy6"
RECAPTCHA_SECRET_KEY="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"

# Development
NODE_ENV="development"

# Internationalization
NEXT_PUBLIC_DEFAULT_LOCALE="en"

# File Upload Configuration
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE="10485760"  # 10MB in bytes
```

### Database Setup

#### Local PostgreSQL Setup

```bash
# Using Homebrew (macOS)
brew install postgresql
brew services start postgresql

# Using APT (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database user
sudo -u postgres createuser --interactive
# Follow prompts to create user with CREATEDB privileges

# Create database
createdb -O your_username nextjs_starter
```

#### Docker PostgreSQL Setup

```bash
# Using Docker Compose
docker-compose up -d postgres

# Manual Docker
docker run --name postgres-dev \
  -e POSTGRES_DB=nextjs_starter \
  -e POSTGRES_USER=your_username \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:15
```

#### Database Management with Drizzle

```bash
# Generate migration files from schema changes
npx drizzle-kit generate

# Push schema changes directly to database (development)
npm run db:push

# Open Drizzle Studio for database management
npm run db:studio

# Drop and recreate all tables (development only)
npx drizzle-kit drop
```

### Development Scripts

#### Available npm Scripts

```json
{
  "dev": "next dev --turbopack -p 3000",
  "build": "next build",
  "start": "next start -p 3000",
  "lint": "next lint",
  "lint:fix": "next lint --fix",
  "lint:strict": "next lint '*/**/*.{js,jsx,ts,tsx}'",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "prettier": "prettier --write */**/*.{js,jsx,json,ts,tsx,scss,css,md}",
  "prepare": "husky",
  "postinstall": "drizzle-kit generate --config drizzle.config.ts"
}
```

#### Development Commands

```bash
# Start development server with Turbopack (faster builds)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Code quality and formatting
npm run lint          # Run ESLint
npm run lint:fix       # Fix ESLint issues automatically
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting

# Database operations
npm run db:studio      # Open Drizzle Studio
npm run db:push        # Push schema to database
npm run postinstall    # Generate database schema (auto-run after npm install)
```

## Development Workflow

### 1. Feature Development Workflow

```bash
# Create new feature branch
git checkout -b feature/new-feature

# Start development server
npm run dev

# Make changes and test
# ... development work ...

# Run tests and linting
npm run test
npm run lint
npm run type-check

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
# ... through GitHub/GitLab UI ...
```

### 2. Database Schema Changes

```bash
# Modify schema files in src/db/schema/
# ... edit schema files ...

# Generate migration
npm run db:generate

# Review generated migration
# ... check generated SQL in drizzle/ ...

# Apply migration to local database
npm run db:migrate

# Test changes with development server
npm run dev

# Include migration in commit
git add drizzle/
git commit -m "feat: add new table to schema"
```

### 3. Component Development

```bash
# Create new component
mkdir -p src/components/new-feature
touch src/components/new-feature/component.tsx
touch src/components/new-feature/component.stories.tsx

# Develop component
# ... implement component logic ...

# Add tests
touch src/components/new-feature/component.test.tsx

# Run tests
npm run test

# Add stories (if using Storybook)
npm run storybook
```

## IDE Setup

### Visual Studio Code Setup

#### Recommended Extensions

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-jest",
    "ms-vscode-remote.remote-containers",
    "ms-vscode.vscode-docker"
  ]
}
```

#### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### Git Hooks Setup

The project includes Husky for Git hooks:

#### Pre-commit Hook

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm run test
```

#### Pre-push Hook

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run all tests with coverage
npm run test:coverage

# Check build
npm run build
```

## Debugging Setup

### VS Code Debugging Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev",
      "serverReadyAction": {
        "pattern": "started server on .+, url: (https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      }
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev",
      "serverReadyAction": {
        "pattern": "started server on .+, url: (https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      },
      "presentation": {
        "hidden": false,
        "group": "full-stack",
        "order": 1
      }
    }
  ]
}
```

### Database Debugging

#### Drizzle Studio

```bash
# Open Drizzle Studio for database management
npm run db:studio
# Opens at http://localhost:4983
```

#### Database Connection Debugging

```typescript
// Add to src/db/index.ts for debugging
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, {
  debug: process.env.NODE_ENV === "development",
  max: 10,
  ssl: process.env.DB_SSL === "true" ? "require" : false,
});

export const db = drizzle(client);
```

## Testing Setup

### Jest Configuration

The project uses Jest for testing with React Testing Library.

#### Test File Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── login-form.test.tsx
│   └── common/
│       ├── button.tsx
│       └── button.test.tsx
├── lib/
│   ├── auth.ts
│   └── auth.test.ts
└── __tests__/
    └── setup.ts
```

#### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test login-form.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="authentication"
```

#### Writing Tests Example

```typescript
// src/components/auth/login-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './login-form';

describe('LoginForm', () => {
  it('renders login form fields', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });
});
```

## Performance Optimization

### Development Performance

#### Next.js Development Optimizations

```bash
# Use Next.js built-in analyzer
npm install @next/bundle-analyzer
npm run analyze
```

#### Memory Optimization

```bash
# Increase Node.js memory limit for development
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

### Code Splitting Optimization

#### Dynamic Imports

```typescript
// Example of dynamic import for large components
const heavyComponent = dynamic(() => import('./heavy-component'), {
  loading: () => <div>Loading...</div>,
  ssr: false
});
```

#### Route-based Code Splitting

The application automatically splits code by routes using Next.js App Router.

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check PostgreSQL is running
pg_ctl status

# Check connection string
psql "postgresql://username:password@localhost:5432/nextjs_starter"

# Reset database permissions
ALTER USER your_username CREATEDB;
```

#### 2. Module Resolution Issues

```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear TypeScript cache
npx tsc --build --clean
```

#### 3. Port Conflicts

```bash
# Kill processes on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

#### 4. Environment Variable Issues

```bash
# Verify environment variables are loaded
npm run env | grep DATABASE_URL

# Check .env file exists
ls -la .env*

# Restart development server after .env changes
npm run dev
```

### Getting Help

#### Debug Information Collection

```bash
# Collect system information
npm run doctor

# Check Node.js version
node --version

# Check npm version
npm --version

# Check PostgreSQL version
postgres --version

# List all packages
npm list --depth=0
```

#### Community Resources

- **GitHub Issues**: [Repository Issues](https://github.com/your-repo/issues)
- **Discord Community**: [NextJS Discord](https://discord.gg/nextjs)
- **Stack Overflow**: Tag with `nextjs` and `drizzle-orm`

---

**Document Version**: 1.1
**Last Updated**: December 8, 2024
**Next Review**: January 31, 2025
