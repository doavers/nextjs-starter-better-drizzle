# NextJS Starter - Better Auth + Drizzle ORM

## Documentation Overview

This directory contains comprehensive documentation for the NextJS starter project with Better Auth and Drizzle ORM integration.

## Documentation Structure

### 📋 [Product Requirements Document (PRD)](./docs/architecture/PRD)
- Product vision and objectives
- Target audience and use cases
- Feature specifications
- Success metrics and KPIs

### 🏗️ [System Architecture](./docs/architecture/system-architecture)
- High-level system design
- Technology stack overview
- Component architecture
- Data flow diagrams

### 🔄 [User Flows](./docs/user-flows/application-flows)
- Authentication flows
- User journey mappings
- Interaction patterns
- UX guidelines

### 🔌 [API Documentation](./docs/api/api-documentation)
- RESTful API endpoints
- Authentication patterns
- Request/response schemas
- Error handling

### 🗄️ [Database Documentation](./docs/database/schema-documentation)
- Schema documentation
- Entity relationships
- Migration guides
- Performance considerations

### 🚀 [Development & Deployment](./docs/development/development-setup)
- Development setup
- Environment configuration
- Deployment guides
- CI/CD pipelines

## Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd nextjs-starter-better-drizzle
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Update .env with your configuration
```

4. **Run database migrations**
```bash
npm run db:migrate
```

5. **Start development server**
```bash
npm run dev
```

## Technology Stack

- **Frontend**: Next.js 16, React 18, TypeScript 5
- **Styling**: Tailwind CSS 4, Radix UI
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with JWT
- **State Management**: Zustand, TanStack Query
- **Deployment**: Docker, GitHub Actions

## Key Features

- ✅ Complete authentication system with social login
- ✅ Multi-tenant organization support
- ✅ Advanced data tables with sorting/filtering
- ✅ Kanban board with drag-and-drop
- ✅ Dark/light theme system
- ✅ Internationalization (i18n)
- ✅ Email verification and password reset
- ✅ Role-based access control (RBAC)
- ✅ Audit logging system
- ✅ Responsive design
- ✅ Production-ready deployment

## Support

For questions or issues, please refer to the specific documentation sections or create an issue in the repository.

---

*Last updated: October 31, 2025*