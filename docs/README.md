# NextJS Starter Documentation

Welcome to the comprehensive documentation for the **NextJS Starter Template** with Better Auth and Drizzle ORM integration. This documentation will help you understand, set up, and extend this production-ready Next.js application.

## 📚 Documentation Structure

### 🏗️ Architecture & Design
- **[📋 Product Requirements Document (PRD)](./docs/architecture/PRD)** - Complete product vision, feature specifications, and success metrics
- **[🏛️ System Architecture](./docs/architecture/system-architecture)** - Technical architecture, component design, and system integration
- **[🔌 API Documentation](./docs/api/api-documentation)** - RESTful API endpoints, schemas, and integration patterns
- **[🗄️ Database Schema Documentation](./docs/database/schema-documentation)** - Database design, relationships, and migration guides

### 🚀 Development & Setup
- **[🛠️ Development Setup](./docs/development/development-setup)** - Complete development environment setup and configuration
- **[🔐 CAPTCHA Setup](./docs/development/captcha-setup)** - Google reCAPTCHA integration and configuration
- **[🚀 Deployment Guide](./docs/deployment/deployment-guide)** - Production deployment strategies and best practices

### 🔄 User Experience & Flows
- **[🌐 Application Flows](./docs/user-flows/application-flows)** - Complete application user journeys and interaction patterns
- **[🔐 Authentication Flows](./docs/user-flows/authentication-flows)** - Detailed authentication and authorization workflows

## 🎯 Quick Navigation

### For New Developers
1. **[Start Here](./docs/development/development-setup)** - Set up your development environment
2. **[Understand the Architecture](./docs/architecture/system-architecture)** - Learn the system design
3. **[Explore the Database](./docs/database/schema-documentation)** - Understand data models
4. **[Check API Endpoints](./docs/api/api-documentation)** - Explore available APIs

### For Product Managers
1. **[Product Requirements](./docs/architecture/PRD)** - Understand product vision and features
2. **[User Flows](./docs/user-flows/application-flows)** - Review user experience design
3. **[Success Metrics](./docs/architecture/PRD#6-success-metrics)** - Review success criteria

### For DevOps Engineers
1. **[Deployment Guide](./docs/deployment/deployment-guide)** - Production deployment instructions
2. **[Environment Configuration](./docs/development/development-setup#environment-variables)** - System configuration
3. **[System Architecture](./docs/architecture/system-architecture#deployment-architecture)** - Infrastructure requirements

## 🛠️ Technology Stack Overview

### Frontend Technologies
- **Framework**: Next.js 16.2.7 (App Router)
- **UI Library**: React 19.2.7
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.3.0
- **Components**: Radix UI primitives
- **State Management**: Zustand 5.0.14 + TanStack Query 5.101.0
- **Forms**: React Hook Form 7.77.0 + Zod 4.4.3
- **Animations**: Framer Motion 12.40.0
- **Icons**: Lucide React 1.17.0
- **Internationalization**: next-intl 4.13.0

### Backend Technologies
- **Runtime**: Node.js 24+
- **Database**: PostgreSQL with pg 8.21.0
- **ORM**: Drizzle ORM 0.45.2 + Drizzle Kit 0.31.10
- **Authentication**: Better Auth 1.6.14
- **Email**: Resend 6.12.4 + React Email
- **Validation**: Zod 4.4.3 schemas
- **Logging**: Winston 3.19.0
- **Monitoring**: OpenTelemetry SDK 0.218.0

### Development Tools
- **Package Manager**: npm with package-lock.json
- **Code Quality**: ESLint 9, Prettier 3.4.2, Husky 9.1.7
- **Code Style**: Prettier plugin Tailwind CSS 0.8.0
- **Git Hooks**: Husky with lint-staged
- **Build Tools**: Turbopack (Next.js 16), SWC
- **Analytics**: Vercel Analytics 2.0.1, Speed Insights 2.0.0

## 🎯 Key Features Documentation

### ✅ Authentication System
- **Implementation**: [Better Auth](https://better-auth.com) integration
- **Features**: Email/password, OAuth, session management, RBAC
- **Documentation**: [Authentication Flows](./docs/user-flows/authentication-flows)

### ✅ Multi-Tenant Architecture
- **Implementation**: Organization-based data isolation
- **Features**: Team management, invitations, role-based access
- **Documentation**: [Database Schema](./docs/database/schema-documentation)

### ✅ Advanced Data Management
- **Implementation**: Drizzle ORM with PostgreSQL
- **Features**: Advanced tables, sorting, filtering, pagination, export
- **Documentation**: [API Documentation](./docs/api/api-documentation)

### ✅ Modern UI/UX
- **Implementation**: Tailwind CSS + Radix UI
- **Features**: Dark/light themes, responsive design, accessibility
- **Documentation**: [System Architecture](./docs/architecture/system-architecture#component-architecture)

### ✅ Developer Experience
- **Implementation**: TypeScript, hot reload, pre-commit hooks
- **Features**: Type safety, code formatting, linting
- **Documentation**: [Development Setup](./docs/development/development-setup)

## 🚀 Getting Started Checklist

```bash
# ✅ Prerequisites
- Node.js 24+ installed
- PostgreSQL database running
- Git for version control

# ✅ Setup Steps
1. Clone repository
2. Install dependencies (npm install)
3. Configure environment variables
4. Set up database
5. Run development server

# ✅ Development Ready
- Visit http://localhost:3000
- Check all features working
- Review documentation for customization
```

## 📖 Documentation Conventions

### Code Examples
```typescript
// TypeScript examples with proper typing
const user: User = await getUserById(id);
```

### File References
- `src/lib/auth.ts` - Core authentication logic
- `src/db/schema.ts` - Database schema definitions

### Version Information
- Current Version: 0.1.0
- Next.js: 16.2.7
- React: 19.2.7
- Better Auth: 1.6.14
- Drizzle ORM: 0.45.2
- TypeScript: 5.9.3
- Node.js: 24+

## 🤝 Contributing to Documentation

We welcome contributions to improve the documentation:

1. **Accuracy**: Ensure all code examples work
2. **Clarity**: Use clear, concise language
3. **Completeness**: Cover all aspects of features
4. **Consistency**: Follow established patterns

## 📞 Support & Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/doavers/nextjs-starter-better-drizzle/issues)
- **GitHub Discussions**: [Community questions and discussions](https://github.com/doavers/nextjs-starter-better-drizzle/discussions)
- **Documentation**: [Always up-to-date](./docs/)

---

**Version**: 0.1.0
**Last Updated**: June 4, 2026
**Next.js**: 16.2.7 | **React**: 19.2.7 | **Node.js**: 24+

For the most recent updates, check the [GitHub repository](https://github.com/doavers/nextjs-starter-better-drizzle).