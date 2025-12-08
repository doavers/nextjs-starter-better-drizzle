# NextJS Starter - Better Auth + Drizzle ORM

A production-ready Next.js 16 starter template with Better Auth v1.4+ and Drizzle ORM v0.45+ integration for building secure, scalable web applications with enterprise-grade features.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/doavers/nextjs-starter-better-drizzle
cd nextjs-starter-better-drizzle

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Update .env with your configuration

# Set up the database
npm run db:push

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your application running.

## 📋 Features

### ✅ Authentication & Security
- **Better Auth v1.4+** with JWT tokens and session management
- Social authentication (Google OAuth)
- Email verification & password reset
- Role-based access control (SUPERADMIN, ADMIN, USER)
- Multi-tenant organization support
- Session management with active organization tracking

### ✅ Data Management
- **Drizzle ORM v0.45+** with PostgreSQL
- Advanced data tables with sorting, filtering, pagination
- Export to CSV, JSON, Excel formats
- Real-time search with debounced input
- Column visibility controls
- Faceted and date filtering

### ✅ User Interface
- **Next.js 16** with App Router and React 19
- **Tailwind CSS 4** with multiple theme presets
- **Radix UI** component primitives
- Dark/light theme with system detection
- Responsive design (mobile-first)
- Internationalization support (English, Indonesian)

### ✅ Advanced Features
- Kanban board with drag-and-drop functionality
- Multi-language support with URL-based routing
- Email template system with React components
- Audit logging system
- File upload handling with dropzone
- CAPTCHA integration (Google reCAPTCHA)
- Loading states and skeletons

### ✅ Development Tools
- TypeScript 5 with strict type checking
- ESLint 9 with Next.js configuration
- Prettier with Tailwind plugin
- Husky pre-commit hooks
- Commitlint with conventional commits
- Hot reload with Turbopack

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Components**: Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand + TanStack Query

### Backend Stack
- **Runtime**: Node.js 18+
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM v0.45+
- **Authentication**: Better Auth v1.4+
- **Email**: Resend with React Email
- **File Upload**: React Dropzone
- **Validation**: Zod schemas
- **Logging**: Winston

### Database Schema
- **Users**: Authentication, roles, ban system
- **Organizations**: Multi-tenant support
- **Members**: Organization-user relationships
- **Sessions**: JWT session management
- **Invitations**: Team invitation system
- **Accounts**: OAuth provider linking
- **Verifications**: Email/password reset tokens

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/            # Public pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard
│   ├── (protected)/       # User profile area
│   └── (external)/        # External pages (invitation, etc.)
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard-specific components
│   ├── data-table/        # Table components
│   └── common/            # Shared components
├── features/              # Feature-based modules
│   └── kanban/            # Kanban board functionality
├── lib/                   # Utility libraries
├── actions/               # Server actions
├── hooks/                 # Custom React hooks
├── config/                # Configuration files
├── db/                    # Database schema and connection
└── i18n/                  # Internationalization
```

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
AUTH_SECRET="your-secret-key"
AUTH_URL="http://localhost:3000"

# OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Email
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# reCAPTCHA (optional)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"
RECAPTCHA_SECRET_KEY="your-recaptcha-secret-key"
```

## 📚 Documentation

- **[📋 Product Requirements](./docs/architecture/PRD.md)** - Complete feature specifications and requirements
- **[🏗️ System Architecture](./docs/architecture/system-architecture.md)** - Technical architecture and design patterns
- **[🚀 Development Setup](./docs/development/development-setup.md)** - Detailed development environment setup
- **[🔌 API Documentation](./docs/api/api-documentation.md)** - RESTful API endpoints and schemas
- **[🗄️ Database Schema](./docs/database/schema-documentation.md)** - Database design and relationships
- **[🔄 User Flows](./docs/user-flows/application-flows.md)** - Application flow and user journey documentation

## 🛠️ Available Scripts

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

### Database
```bash
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
npm run db:generate  # Generate migrations
```

## 🚀 Deployment

This template is optimized for deployment on:

- **Vercel** (Recommended) - Zero-configuration deployment
- **Docker** - Multi-stage Dockerfile included
- **Self-hosted** - Compatible with Node.js 18+

See the [Deployment Guide](./docs/deployment/deployment-guide.md) for detailed instructions.

## 🎯 Use Cases

This starter template is perfect for:

- **SaaS Applications** - Multi-tenant, subscription-based software
- **Enterprise Tools** - Internal dashboards and admin panels
- **Marketplaces** - Multi-vendor platforms
- **Educational Platforms** - Learning management systems
- **Collaboration Tools** - Project management and team apps
- **Content Management** - Blogging and CMS platforms

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to the `main` branch.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/doavers/nextjs-starter-better-drizzle)
- [Documentation](./docs/README.md)
- [Issues](https://github.com/doavers/nextjs-starter-better-drizzle/issues)
- [Discussions](https://github.com/doavers/nextjs-starter-better-drizzle/discussions)

---

**Version**: 0.1.0
**Last Updated**: December 8, 2024
**Next.js**: 16.0.7 | **React**: 19.2.1 | **TypeScript**: 5.x